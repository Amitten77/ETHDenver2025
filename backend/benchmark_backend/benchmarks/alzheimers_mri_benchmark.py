from tensorflow.keras.models import load_model
import os
import cv2
import numpy as np
import keras
from sklearn.metrics import accuracy_score, confusion_matrix
import requests
import random




def run_alzheimers_mri_benchmark(model: str) -> dict:

    model_name = None
    ai_model = None
    if "https" in model:
        # Read AWS file and save it locally
        model_name = model.split("/")[-1].split(".")[1]
        local_path = f"models/Alzheimers/{model_name}.keras"
        if not os.path.exists(local_path):
            print(f"Downloading model to {local_path}...")
            r = requests.get(model)
            with open(local_path, "wb") as f:
                f.write(r.content)
        else:
            print(f"Model already exists at {local_path}, skipping download.")
        ai_model = load_model(local_path)
    else:
        ai_model = load_model(local_path)

    categories = ["MildDemented", "ModerateDemented", "NonDemented", "VeryMildDemented"]

    IMG_SIZE = (128, 128)

    def load_images_from_folder(folder, sample_size=67):
        images = []
        labels = []

        for category in categories:
            path = os.path.join(folder, category)
            label = categories.index(category)

            # Get all image files in the category folder
            all_images = os.listdir(path)
            
            # Randomly sample images (if sample_size is larger than available images, take all)
            sampled_images = random.sample(all_images, min(sample_size, len(all_images)))

            for img in sampled_images:
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
    y_pred = ai_model.predict(X_test)


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

