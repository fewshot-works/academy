# Advanced Chapter 7 lab: wrapping the support bot in a small FastAPI app,
# so it's not just a script you run from a terminal, it's a service other
# programs (or a Docker container) can call over HTTP.
#
# The provider used (Ollama, OpenAI, or Anthropic) is controlled by the
# PROVIDER variable in your .env file. See README.md for setup steps.

import os

from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel

load_dotenv()

provider = os.getenv("PROVIDER", "ollama")

# When this app runs inside Docker, "localhost" means the container itself,
# not your Mac, so it can't reach Ollama on your host that way. OLLAMA_URL
# lets the Docker run override it to "http://host.docker.internal:11434".
# See README.md for the full explanation.
ollama_url = os.getenv("OLLAMA_URL", "http://localhost:11434")

SYSTEM_PROMPT = """You are the support bot for Fernwood Coffee Co. Answer briefly, one or two
sentences, using only these facts: best-selling drink is the Depot Latte; three locations,
all in the same state; loyalty program gives a free drink after every ten purchases."""


def ask(user_message, system=None):
    if provider == "ollama":
        import requests

        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": user_message})

        response = requests.post(
            f"{ollama_url}/api/chat",
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

        response = client.chat.completions.create(model="gpt-4o-mini", messages=messages)
        return response.choices[0].message.content

    elif provider == "anthropic":
        import anthropic

        client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=300,
            system=system or "",
            messages=[{"role": "user", "content": user_message}],
        )
        return response.content[0].text

    else:
        raise RuntimeError(f"Unknown PROVIDER '{provider}'. Set it to ollama, openai, or anthropic in .env")


app = FastAPI(title="Fernwood Coffee Co. support bot")


class Question(BaseModel):
    question: str


class Answer(BaseModel):
    answer: str


@app.get("/health")
def health():
    return {"status": "ok", "provider": provider}


@app.post("/ask")
def ask_endpoint(body: Question) -> Answer:
    answer = ask(body.question, system=SYSTEM_PROMPT)
    return Answer(answer=answer)
