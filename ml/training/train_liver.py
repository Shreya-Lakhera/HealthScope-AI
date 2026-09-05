from pathlib import Path
import pickle

import pandas as pd
from sklearn.ensemble import ExtraTreesClassifier
from sklearn.impute import SimpleImputer
from sklearn.metrics import (
    accuracy_score,
    balanced_accuracy_score,
    classification_report,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline


# Project folders
PROJECT_ROOT = Path(__file__).resolve().parents[2]

DATA_PATH = (
    PROJECT_ROOT
    / "ml"
    / "data"
    / "indian_liver_patient.csv"
)

MODEL_PATH = (
    PROJECT_ROOT
    / "ml"
    / "artifacts"
    / "liver_pipeline.pkl"
)


# Feature order must match the CSV, backend, and frontend.
FEATURES = [
    "Age",
    "Total_Bilirubin",
    "Direct_Bilirubin",
    "Alkaline_Phosphotase",
    "Alamine_Aminotransferase",
    "Aspartate_Aminotransferase",
    "Total_Protiens",
    "Albumin",
    "Albumin_and_Globulin_Ratio",
]


def train_model():
    # Confirm that the CSV exists.
    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"Dataset not found at: {DATA_PATH}\n"
            "Place indian_liver_patient.csv inside ml/data/."
        )

    # Load the original dataset.
    data = pd.read_csv(DATA_PATH)

    # Confirm that every required column exists.
    required_columns = FEATURES + ["Dataset"]
    missing_columns = [
        column
        for column in required_columns
        if column not in data.columns
    ]

    if missing_columns:
        raise ValueError(
            f"Missing CSV columns: {missing_columns}"
        )

    # Use the same nine features as the website.
    # Gender is intentionally excluded.
    X = data[FEATURES].copy()

    # Original dataset:
    # 1 = liver disease
    # 2 = no liver disease
    #
    # Convert to:
    # 1 = liver disease
    # 0 = no liver disease
    y = (data["Dataset"] == 1).astype(int)

    # Create a stratified train/test split.
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
        stratify=y,
    )

    # Keep preprocessing and prediction inside one pipeline.
    pipeline = Pipeline(
        steps=[
            (
                "imputer",
                SimpleImputer(strategy="median"),
            ),
            (
                "model",
                ExtraTreesClassifier(
                    n_estimators=400,
                    min_samples_leaf=2,
                    class_weight="balanced",
                    random_state=42,
                    n_jobs=-1,
                ),
            ),
        ]
    )

    # Train the pipeline.
    pipeline.fit(X_train, y_train)

    # Evaluate on the test data.
    predictions = pipeline.predict(X_test)
    probabilities = pipeline.predict_proba(X_test)[:, 1]

    metrics = {
        "accuracy": float(
            accuracy_score(y_test, predictions)
        ),
        "balanced_accuracy": float(
            balanced_accuracy_score(
                y_test,
                predictions,
            )
        ),
        "roc_auc": float(
            roc_auc_score(y_test, probabilities)
        ),
    }

    print("\nModel metrics")
    print("-------------")
    print(f"Accuracy: {metrics['accuracy']:.4f}")
    print(
        "Balanced accuracy: "
        f"{metrics['balanced_accuracy']:.4f}"
    )
    print(f"ROC-AUC: {metrics['roc_auc']:.4f}")

    print("\nClassification report")
    print("---------------------")
    print(
        classification_report(
            y_test,
            predictions,
            target_names=[
                "No liver disease",
                "Liver disease",
            ],
        )
    )

    # Store everything required by the prediction API.
    model_bundle = {
        "pipeline": pipeline,
        "features": FEATURES,
        "metrics": metrics,
        "positive_class": 1,
    }

    # Create the artifacts directory if necessary.
    MODEL_PATH.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    # Save the model using pickle protocol 5.
    with open(MODEL_PATH, "wb") as model_file:
        pickle.dump(
            model_bundle,
            model_file,
            protocol=5,
        )

    # Immediately reopen the model to verify the file.
    with open(MODEL_PATH, "rb") as model_file:
        verified_bundle = pickle.load(model_file)

    verified_pipeline = verified_bundle["pipeline"]

    # Make one prediction using the reloaded model.
    sample = X_test.iloc[[0]]
    sample_prediction = int(
        verified_pipeline.predict(sample)[0]
    )
    sample_probability = float(
        verified_pipeline.predict_proba(sample)[0, 1]
    )

    print("\nModel verification")
    print("------------------")
    print(
        f"Verification prediction: "
        f"{sample_prediction}"
    )
    print(
        f"Verification probability: "
        f"{sample_probability:.4f}"
    )
    print(
        f"Model saved and verified: "
        f"{MODEL_PATH}"
    )


if __name__ == "__main__":
    train_model()