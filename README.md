# Arabic Mental Health Assistant

This project is an **AI-powered mental health assistant** designed to support users through empathetic and intelligent conversations, with a focus on **Arabic language support**.

The system combines **multiple AI models** to understand user input, detect emotions, and generate supportive responses. It works by translating Arabic text to English, analyzing emotional state, and then using a large language model to provide psychologically informed replies. Responses can then be translated back into Arabic for the user.

## Key Features
- 🧠 **Emotion Detection** using a pretrained transformer model
- 🌍 **Arabic ↔ English Translation** using neural machine translation models
- 💬 **AI Conversation Engine** powered by a large language model (via Together.ai)
- ⚡ **Efficient model loading** with caching to improve performance

## Technologies Used
- Python
- PyTorch
- Hugging Face Transformers
- Together.ai API
- Google Colab (for experimentation and testing)

## Project Structure
- `server/` → Python backend (AI logic and models)
- `client/` → Frontend application
- Models are downloaded automatically at runtime and are **not included** in the repository.

## Purpose
This project was developed as an academic project to explore how modern AI models can be combined to enhance **mental health support systems**, particularly for Arabic-speaking users.

## Running in Google Colab

1. Clone the repository
2. Install requirements
3. Set environment variables in the notebook:
   - API_KEY
   - API_URL
4. Run the application
