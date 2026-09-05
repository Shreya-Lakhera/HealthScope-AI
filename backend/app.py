from pathlib import Path
from typing import Any
import os
import pickle

import pandas as pd
from fastapi import Body, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware


PROJECT_ROOT = Path(__file__).resolve().parents[1]
ARTIFACTS_DIR = PROJECT_ROOT / "ml" / "artifacts"
MODEL_NAMES = ("heart", "liver", "kidney", "stroke")


def load_models() -> dict[str, dict[str, Any]]:
    models: dict[str, dict[str, Any]] = {}
    missing: list[str] = []
    for name in MODEL_NAMES:
        path = ARTIFACTS_DIR / f"{name}_pipeline.pkl"
        if not path.exists():
            missing.append(name)
            continue
        with path.open("rb") as model_file:
            bundle = pickle.load(model_file)
        if "pipeline" not in bundle or "features" not in bundle:
            raise RuntimeError(f"Invalid model bundle: {path}")
        models[name] = bundle

    if missing:
        scripts = ", ".join(
            f"python ml/training/train_{name}.py" for name in missing
        )
        raise RuntimeError(f"Missing model artifacts. Run: {scripts}")
    return models


models = load_models()
app = FastAPI(title="HealthScope AI Prediction API", version="2.0.0")
allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, Any]:
    return {"status": "healthy", "models": sorted(models)}


@app.post("/predict/{model_name}")
def predict(
    model_name: str,
    payload: dict[str, Any] = Body(...),
) -> dict[str, Any]:
    if model_name not in models:
        raise HTTPException(status_code=404, detail="Unknown screening model.")

    bundle = models[model_name]
    features = bundle["features"]
    missing = [feature for feature in features if feature not in payload]
    extra = [feature for feature in payload if feature not in features]
    if missing or extra:
        raise HTTPException(
            status_code=422,
            detail={"missing_fields": missing, "unknown_fields": extra},
        )

    try:
        input_frame = pd.DataFrame(
            [{feature: payload[feature] for feature in features}],
            columns=features,
        )
        pipeline = bundle["pipeline"]
        prediction = int(pipeline.predict(input_frame)[0])
        probabilities = pipeline.predict_proba(input_frame)[0]
        classes = list(pipeline.classes_)
        positive_class = bundle.get("positive_class", 1)
        probability = float(probabilities[classes.index(positive_class)])
    except (TypeError, ValueError, KeyError) as error:
        raise HTTPException(
            status_code=422,
            detail="The model could not process these input values.",
        ) from error
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="The prediction service encountered an error.",
        ) from error

    return {
        "model": model_name,
        "prediction": prediction,
        "classification": (
            "higher_model_likelihood"
            if prediction == positive_class
            else "lower_model_likelihood"
        ),
        "risk_probability": round(probability, 4),
        "risk_percentage": round(probability * 100, 1),
        "disclaimer": (
            "Educational model estimate only. This is not a medical diagnosis."
        ),
    }
