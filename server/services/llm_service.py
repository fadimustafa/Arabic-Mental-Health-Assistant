import os
import requests

load_dotenv()

API_KEY = os.getenv("API_KEY")
API_URL = os.getenv("API_URL")

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}
def get_llm_summary(conversation_en: list[dict]) -> dict:
    """
    Send full conversation to the LLM with a summarization prompt.
    """
    summary_prompt = f"""
    You are an intelligent assistant. Your task is to summarize the conversation below in **English**.

    Requirements:
    - **Title**: 3–6 words only, no punctuation at the end.
    - **Summary**: 1–2 sentences, concise, clear, and objective.

    Conversation:
    {conversation_en}

    Return the result strictly in this format:
    Title: <your short title>
    Summary: <your concise summary>
    """


    payload = {
        "model": "meta-llama/Llama-4-Scout-17B-16E-Instruct",
        "messages": [{"role": "system", "content": summary_prompt}],
        "temperature": 0.3,
        "max_tokens": 256
    }

    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=20)
        response.raise_for_status()
        data = response.json()
        return {
            "success": True,
            "response": data.get("choices", [{}])[0].get("message", {}).get("content", ""),
            "raw": data
        }
    except requests.exceptions.RequestException as e:
        return {"success": False, "error": f"Request failed: {str(e)}"}


def get_llm_response(conversation_en: list[dict], emotion_summary: str) -> dict:
    """
    Send full conversation and last detected emotion to the LLM and return the response.
    """
    prompt = (
        "You are a professional psychotherapist who communicates in clear and supportive English. "
        "Engage naturally with the user, and occasionally ask thoughtful questions to better understand their situation so you can provide helpful guidance. "
        "If the user shows any signs of suicidal thoughts, respond with empathy, express concern, and take appropriate supportive actions. "
        "Keep your responses concise and focused—avoid unnecessary lists or overly long explanations unless more detail is truly needed. "
        f"\n\n🧠 The user's current emotional state: {emotion_summary}"
    )

    # Build messages for Together API
    messages = [{"role": "system", "content": prompt}] + conversation_en

    payload = {
        "model": "meta-llama/Llama-4-Scout-17B-16E-Instruct",
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 512
    }

    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=20)
        response.raise_for_status()
        data = response.json()
        return {
            "success": True,
            "response": data.get("choices", [{}])[0].get("message", {}).get("content", ""),
            "raw": data
        }
    except requests.exceptions.RequestException as e:
        return {"success": False, "error": f"Request failed: {str(e)}"}
    except Exception as e:
        return {"success": False, "error": f"Unexpected error: {str(e)}"}
