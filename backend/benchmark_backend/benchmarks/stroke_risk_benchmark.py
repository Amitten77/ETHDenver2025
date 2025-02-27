import joblib
import pandas as pd
from sklearn.metrics import accuracy_score, confusion_matrix
import requests
import os


def run_stroke_risk_benchmark(model: str) -> dict:

    model_name = None
    ai_model = None
    if "https" in model:
        # Extract model name
        model_name = model.split("/")[-1].split(".")[1]
        local_model_path = f"models/Stroke_Risk/{model_name}.pkl"

        # Check if file already exists
        if not os.path.exists(local_model_path):
            print(f"Downloading model to {local_model_path}...")
            r = requests.get(model)
            with open(local_model_path, "wb") as f:
                f.write(r.content)
        else:
            print(f"Model already exists at {local_model_path}, skipping download.")

        # Load model
        ai_model = joblib.load(local_model_path)

    else:
        ai_model = joblib.load(f"models/Stroke_Risk/{model}.pkl")

    df = pd.read_csv("datasets/Stroke_Risk/stroke_risk_dataset.csv")

    sample_size = 589
    df_sample = df.sample(n=min(sample_size, len(df)))

    X_test = df_sample.drop(columns=['At Risk (Binary)'])
    y_test = df_sample['At Risk (Binary)']

    y_pred = ai_model.predict(X_test)

    accuracy = accuracy_score(y_test, y_pred)
    conf_matrix = confusion_matrix(y_test, y_pred)

    output = {
        "accuracy": accuracy,
        "confusion_matrix": conf_matrix.tolist(),
        "success": True
    }


    return output






