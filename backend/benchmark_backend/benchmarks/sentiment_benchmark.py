import openai
import random
import os
from datasets import load_dataset
from dotenv import load_dotenv
import json

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")



def run_sentiment_test(model="openai", samples=10):

    model_choices = ["openai", "claude", "bob"]
    if model not in model_choices:
        output = {
            "success": False,
            "error": f"Model not found. Choose from {model_choices}"
        }
        return output


    dataset = load_dataset("glue", "sst2", split="train")
    random_samples = random.sample(list(dataset), samples)


    def get_sentiment(sentence):
        """Calls OpenAI API to classify sentiment."""
        client = openai.OpenAI()
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "Classify the sentiment of the following sentence as 'positive' (1) or 'negative' (0). Only return the number 1 or 0."},
                {"role": "user", "content": sentence}
            ]
        )
        return int(response.choices[0].message.content.strip())

    # Evaluate AI predictions
    correct = 0
    results = []

    for sample in random_samples:
        sentence, label = sample["sentence"], sample["label"]
        prediction = get_sentiment(sentence)
        #print(f"Sentence: {sentence}\nGround Truth: {label}, GPT Prediction: {prediction}\n")
        results.append({
            "sentence": sentence,
            "ground_truth": label,
            "prediction": prediction,
            "correct": prediction == label
        })

        if prediction == label:
            correct += 1

    # Print final accuracy
    accuracy = correct / len(random_samples) * 100
    #print(f"GPT Sentiment Classification Accuracy: {accuracy:.2f}%")
    output = {
        "accuracy": accuracy,
        "results": results
    }

    return output