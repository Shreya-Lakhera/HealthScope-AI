from pathlib import Path
import pickle

import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    average_precision_score,
    balanced_accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.model_selection import (
    StratifiedKFold,
    cross_validate,
    train_test_split,
)
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler


# ---------------------------------------------------------
# File locations
# ---------------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parents[2]

DATA_PATH = (
    PROJECT_ROOT
    / "ml"
    / "data"
    / "heart_disease_data.csv"
)

MODEL_PATH = (
    PROJECT_ROOT
    / "ml"
    / "artifacts"
    / "heart_pipeline.pkl"
)


# ---------------------------------------------------------
# Model features
# ---------------------------------------------------------

NUMERIC_FEATURES = [
    "age",
    "trestbps",
    "chol",
    "thalach",
    "oldpeak",
]

CATEGORICAL_FEATURES = [
    "sex",
    "cp",
    "fbs",
    "restecg",
    "exang",
    "slope",
    "ca",
    "thal",
]

FEATURES = [
    "age",
    "sex",
    "cp",
    "trestbps",
    "chol",
    "fbs",
    "restecg",
    "thalach",
    "exang",
    "oldpeak",
    "slope",
    "ca",
    "thal",
]

TARGET = "target"


# ---------------------------------------------------------
# Load and clean the dataset
# ---------------------------------------------------------

def load_and_clean_data() -> pd.DataFrame:
    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"Dataset not found at: {DATA_PATH}\n"
            "Place heart_disease_data.csv inside ml/data/."
        )

    data = pd.read_csv(DATA_PATH)

    # Remove accidental spaces from column names.
    data.columns = data.columns.str.strip()

    required_columns = FEATURES + [TARGET]

    missing_columns = [
        column
        for column in required_columns
        if column not in data.columns
    ]

    if missing_columns:
        raise ValueError(
            f"Missing CSV columns: {missing_columns}"
        )

    # Convert invalid values such as "?" into missing values.
    for column in required_columns:
        data[column] = pd.to_numeric(
            data[column],
            errors="coerce",
        )

    # The target cannot be missing.
    data = data.dropna(subset=[TARGET])

    # Keep only valid binary target values.
    data = data[data[TARGET].isin([0, 1])]

    data[TARGET] = data[TARGET].astype(int)

    # Avoid identical records appearing in both train and test data.
    data = data.drop_duplicates().reset_index(drop=True)

    return data


# ---------------------------------------------------------
# Create preprocessing and model pipeline
# ---------------------------------------------------------

def build_pipeline() -> Pipeline:
    numeric_pipeline = Pipeline(
        steps=[
            (
                "imputer",
                SimpleImputer(strategy="median"),
            ),
            (
                "scaler",
                StandardScaler(),
            ),
        ]
    )

    categorical_pipeline = Pipeline(
        steps=[
            (
                "imputer",
                SimpleImputer(strategy="most_frequent"),
            ),
            (
                "encoder",
                OneHotEncoder(
                    handle_unknown="ignore",
                ),
            ),
        ]
    )

    preprocessor = ColumnTransformer(
        transformers=[
            (
                "numeric",
                numeric_pipeline,
                NUMERIC_FEATURES,
            ),
            (
                "categorical",
                categorical_pipeline,
                CATEGORICAL_FEATURES,
            ),
        ],
        remainder="drop",
    )

    classifier = LogisticRegression(
        solver="liblinear",
        class_weight="balanced",
        max_iter=2000,
        random_state=42,
    )

    pipeline = Pipeline(
        steps=[
            (
                "preprocessor",
                preprocessor,
            ),
            (
                "classifier",
                classifier,
            ),
        ]
    )

    return pipeline


# ---------------------------------------------------------
# Train and evaluate the model
# ---------------------------------------------------------

def train_model() -> None:
    data = load_and_clean_data()

    print(f"Dataset shape after cleaning: {data.shape}")

    print("\nTarget distribution:")
    print(data[TARGET].value_counts().sort_index())

    X = data[FEATURES].copy()
    y = data[TARGET].copy()

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
        stratify=y,
    )

    pipeline = build_pipeline()

    # Evaluate across five stratified folds.
    cross_validation = StratifiedKFold(
        n_splits=5,
        shuffle=True,
        random_state=42,
    )

    scoring = {
        "accuracy": "accuracy",
        "balanced_accuracy": "balanced_accuracy",
        "precision": "precision",
        "recall": "recall",
        "f1": "f1",
        "roc_auc": "roc_auc",
        "average_precision": "average_precision",
    }

    cv_results = cross_validate(
        pipeline,
        X,
        y,
        cv=cross_validation,
        scoring=scoring,
        n_jobs=-1,
    )

    print("\nCross-validation results")
    print("------------------------")

    for metric_name in scoring:
        scores = cv_results[f"test_{metric_name}"]

        print(
            f"{metric_name}: "
            f"{scores.mean():.4f} "
            f"(+/- {scores.std():.4f})"
        )

    # Train the final pipeline.
    pipeline.fit(X_train, y_train)

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
        "precision": float(
            precision_score(
                y_test,
                predictions,
                zero_division=0,
            )
        ),
        "recall": float(
            recall_score(
                y_test,
                predictions,
                zero_division=0,
            )
        ),
        "f1": float(
            f1_score(
                y_test,
                predictions,
                zero_division=0,
            )
        ),
        "roc_auc": float(
            roc_auc_score(
                y_test,
                probabilities,
            )
        ),
        "average_precision": float(
            average_precision_score(
                y_test,
                probabilities,
            )
        ),
    }

    print("\nTest-set metrics")
    print("----------------")

    for metric_name, metric_value in metrics.items():
        print(f"{metric_name}: {metric_value:.4f}")

    print("\nConfusion matrix")
    print("----------------")
    print(confusion_matrix(y_test, predictions))

    print("\nClassification report")
    print("---------------------")

    print(
        classification_report(
            y_test,
            predictions,
            target_names=[
                "No heart disease",
                "Heart disease",
            ],
            zero_division=0,
        )
    )

    # -----------------------------------------------------
    # Save the complete pipeline
    # -----------------------------------------------------

    model_bundle = {
        "pipeline": pipeline,
        "features": FEATURES,
        "numeric_features": NUMERIC_FEATURES,
        "categorical_features": CATEGORICAL_FEATURES,
        "metrics": metrics,
        "positive_class": 1,
        "decision_threshold": 0.5,
    }

    MODEL_PATH.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    with open(MODEL_PATH, "wb") as model_file:
        pickle.dump(
            model_bundle,
            model_file,
            protocol=5,
        )

    # -----------------------------------------------------
    # Verify that the saved model works
    # -----------------------------------------------------

    with open(MODEL_PATH, "rb") as model_file:
        verified_bundle = pickle.load(model_file)

    verified_pipeline = verified_bundle["pipeline"]

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