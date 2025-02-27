import joblib
import pandas as pd
from sklearn.metrics import accuracy_score, confusion_matrix
import requests
import os


def run_fetal_health_benchmark(model: str) -> dict:

    model_name = None
    ai_model = None
    if "https" in model:
        # Extract model name
        model_name = model.split("/")[-1].split(".")[1]
        local_model_path = f"models/Fetal_Health/{model_name}.pkl"

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
        ai_model = joblib.load(f"models/Fetal_Health/{model}.pkl")


    df = pd.read_csv("datasets/Fetal_Health/fetal_health.csv")

    sample_size = 589
    df_sample = df.sample(n=min(sample_size, len(df)))

    X_test = df_sample.drop(columns=['fetal_health'])
    y_test = df_sample['fetal_health']

    y_pred = ai_model.predict(X_test)

    accuracy = accuracy_score(y_test, y_pred)
    conf_matrix = confusion_matrix(y_test, y_pred)

    output = {
        "accuracy": accuracy,
        "confusion_matrix": conf_matrix.tolist(),
        "success": True
    }

    return output
