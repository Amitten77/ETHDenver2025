import joblib
import pandas as pd
from sklearn.metrics import accuracy_score, confusion_matrix


def run_stroke_risk_benchmark(model: str) -> dict:

    model_choices = ["biostake", "carex", "othentic_vital"]
    if model not in model_choices:
        output = {
            "success": False,
            "error": f"Model not found. Choose from {model_choices}"
        }
        return output
    
    # Load the model
    model = joblib.load(f"models/Stroke_Risk/{model}.pkl")

    df = pd.read_csv("datasets/Stroke_Risk/stroke_risk_dataset.csv")

    X_test = df.drop(columns=['At Risk (Binary)'])
    y_test = df['At Risk (Binary)']

    y_pred = model.predict(X_test)

    accuracy = accuracy_score(y_test, y_pred)
    conf_matrix = confusion_matrix(y_test, y_pred)

    output = {
        "accuracy": accuracy,
        "confusion_matrix": conf_matrix.tolist(),
        "success": True
    }


    return output






