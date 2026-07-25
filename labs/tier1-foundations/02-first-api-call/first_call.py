# Chapter 2 lab: send one prompt to an AI model and print what it replies.
#
# Which provider this uses (Ollama, OpenAI, or Anthropic) is controlled by
# the PROVIDER variable in your .env file. See README.md for setup steps.

import os
from dotenv import load_dotenv

load_dotenv()  # reads .env and makes PROVIDER (and any API keys) available below

provider = os.getenv("PROVIDER", "ollama")

prompt = "In one short sentence, explain what a large language model is, as if you were talking to a curious 10 year old."

print(f"Using provider: {provider}")
print(f"Prompt: {prompt}")
print("Waiting for a reply...\n")

if provider == "ollama":
    # Ollama runs a small local web server on your own machine - no SDK needed,
    # just a plain HTTP request to it.
    import requests

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "llama3.2",
            "prompt": prompt,
            "stream": False,
        },
    )
    reply = response.json()["response"]

elif provider == "openai":
    from openai import OpenAI

    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    response = client.chat.completions.create(
        # If this model has been retired by the time you're reading this,
        # check platform.openai.com/docs/models for the current small/cheap option.
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
    )
    reply = response.choices[0].message.content

elif provider == "anthropic":
    import anthropic

    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=200,
        messages=[{"role": "user", "content": prompt}],
    )
    reply = response.content[0].text

else:
    reply = f"Unknown provider '{provider}'. Set PROVIDER to ollama, openai, or anthropic in your .env file."

print("AI replied:")
print(reply)
