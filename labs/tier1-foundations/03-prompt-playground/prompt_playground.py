# Chapter 3 lab: ask the same question three ways (zero-shot, few-shot,
# and with a system prompt) and print all three answers so you can compare them.
#
# Which provider this uses (Ollama, OpenAI, or Anthropic) is controlled by
# the PROVIDER variable in your .env file. See README.md for setup steps.

import os
from dotenv import load_dotenv

load_dotenv()  # reads .env, makes PROVIDER (and any API keys) available below

provider = os.getenv("PROVIDER", "ollama")

review = "The battery died after two days and support never responded."


def ask(user_message, system=None):
    # Sends one message, plus an optional system prompt, to whichever
    # provider is set in .env, and returns the model's reply as plain text.
    if provider == "ollama":
        # Ollama's /api/chat endpoint understands system/user roles directly,
        # unlike the /api/generate endpoint used in the Chapter 2 lab.
        import requests

        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": user_message})

        response = requests.post(
            "http://localhost:11434/api/chat",
            json={"model": "llama3.2", "messages": messages, "stream": False},
        )
        return response.json()["message"]["content"]

    elif provider == "openai":
        from openai import OpenAI

        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": user_message})

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
        )
        return response.choices[0].message.content

    elif provider == "anthropic":
        # Anthropic keeps the system prompt as its own top-level argument
        # instead of a message with role "system".
        import anthropic

        client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        if system:
            response = client.messages.create(
                model="claude-haiku-4-5-20251001",
                max_tokens=200,
                system=system,
                messages=[{"role": "user", "content": user_message}],
            )
        else:
            response = client.messages.create(
                model="claude-haiku-4-5-20251001",
                max_tokens=200,
                messages=[{"role": "user", "content": user_message}],
            )
        return response.content[0].text

    else:
        return f"Unknown provider '{provider}'. Set PROVIDER to ollama, openai, or anthropic in your .env"


print(f'Review to classify: "{review}"\n')

# --- Zero-shot: just ask, no examples, no rules ---
zero_shot_answer = ask(f'Classify the sentiment of this review: "{review}"')
print("--- Zero-shot ---")
print(zero_shot_answer.strip())
print()

# --- Few-shot: show two worked examples before the real question ---
few_shot_prompt = f"""Review: "Fast shipping and the case fits perfectly." -> positive
Review: "Screen cracked out of the box, no reply from seller." -> negative

Review: "{review}" ->"""
few_shot_answer = ask(few_shot_prompt)
print("--- Few-shot ---")
print(few_shot_answer.strip())
print()

# --- System prompt: set a standing rule once, then ask normally ---
system_rule = (
    "You are a strict sentiment classifier. Respond with exactly one word: "
    "positive or negative. Never explain your answer."
)
system_answer = ask(review, system=system_rule)
print("--- System prompt ---")
print(system_answer.strip())
