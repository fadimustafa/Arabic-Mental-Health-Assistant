
from transformers import MarianMTModel, MarianTokenizer, AutoTokenizer, AutoModelForSequenceClassification
import torch
import torch.nn.functional as F
from functools import lru_cache

# Arabic → English
@lru_cache(maxsize=1)
def load_ar_to_en():
    model_name = "Helsinki-NLP/opus-mt-ar-en"
    tokenizer = MarianTokenizer.from_pretrained(model_name)
    model = MarianMTModel.from_pretrained(model_name)
    return tokenizer, model

# English → Arabic
@lru_cache(maxsize=1)
def load_en_to_ar():
    model_name = "Helsinki-NLP/opus-mt-en-ar"
    tokenizer = MarianTokenizer.from_pretrained(model_name)
    model = MarianMTModel.from_pretrained(model_name)
    return tokenizer, model
    

def translate_ar_to_en(text: str) -> str:
    try:
        tokenizer, model = load_ar_to_en()
        inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True)
        translated = model.generate(**inputs)
        return tokenizer.decode(translated[0], skip_special_tokens=True)
    except Exception as e:
        return f"❌ Error translating AR→EN: {e}"


def translate_en_to_ar(text: str) -> str:
    try:
        tokenizer, model = load_en_to_ar()
        inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True)
        translated = model.generate(**inputs)
        return tokenizer.decode(translated[0], skip_special_tokens=True)
    except Exception as e:
        return f"❌ Error translating EN→AR: {e}"