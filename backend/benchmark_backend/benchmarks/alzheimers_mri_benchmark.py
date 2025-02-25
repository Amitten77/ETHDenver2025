from tensorflow.keras.models import load_model
import os
import cv2
import numpy as np
import keras
from sklearn.metrics import accuracy_score, confusion_matrix




def run_alzheimers_mri_benchmark(model: str) -> dict:

    model_choices = ["biostake", "carex", "othentic_vital"]
    if model not in model_choices:
        output = {
            "success": False,
            "error": f"Model not found. Choose from {model_choices}"
        }
        return output

    # Load keras model
    model = load_model(f"models/Alzheimers/{model}.keras")

    categories = ["MildDemented", "ModerateDemented", "NonDemented", "VeryMildDemented"]

    IMG_SIZE = (128, 128)

    def load_images_from_folder(folder):
        images = []
        labels = []
        for category in categories:
            path = os.path.join(folder, category)
            label = categories.index(category)
            for img in os.listdir(path):
                img_path = os.path.join(path, img)
                image = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
                image = cv2.resize(image, IMG_SIZE)
                images.append(image)
                labels.append(label)
        return np.array(images), np.array(labels)
    
    X_test, y_test = load_images_from_folder("datasets/Alzheimers/test")
    X_test = X_test / 255.0
    X_test = X_test.reshape(-1, 128, 128, 1)

    y_test = keras.utils.to_categorical(y_test, num_classes=len(categories))

    # Predict and Score Accuracy
    y_pred = model.predict(X_test)
    y_pred = np.argmax(y_pred, axis=1)
    y_test = np.argmax(y_test, axis=1)

    accuracy = accuracy_score(y_test, y_pred)
    conf_matrix = confusion_matrix(y_test, y_pred)

    output = {
        "accuracy": accuracy,
        "confusion_matrix": conf_matrix.tolist(),
        "success": True
    }


    return output
