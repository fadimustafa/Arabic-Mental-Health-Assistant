from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import torch.nn.functional as F
from functools import lru_cache

# Labels for the emotion model
emotion_labels = ['anger', 'disgust', 'fear', 'joy', 'neutral', 'sadness', 'surprise']

# --- CACHED LOADERS ---

@lru_cache(maxsize=1)
def load_emotion_model():
    model_name = "j-hartmann/emotion-english-distilroberta-base"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSequenceClassification.from_pretrained(model_name)
    return tokenizer, model

def classify_emotion(text_en):
    try:
        tokenizer, model = load_emotion_model()
        inputs = tokenizer(text_en, return_tensors="pt", truncation=True, padding=True)
        with torch.no_grad():
            logits = model(**inputs).logits
        probs = F.softmax(logits, dim=1)[0]
        scores = {emotion_labels[i]: round(float(probs[i]) * 100, 2) for i in range(len(emotion_labels))}
        sorted_scores = dict(sorted(scores.items(), key=lambda item: item[1], reverse=True))
        return sorted_scores
    except Exception as e:
        return {"error": str(e)}

def emotion_pipeline(translated_text):
    try:
        emotion_scores = classify_emotion(translated_text)
        dominant_emotion = next(iter(emotion_scores))  # Top one
        return {
            "dominant_emotion": dominant_emotion,
            "emotion_scores": emotion_scores
        }
    except Exception as e:
        return {"error": str(e)}
