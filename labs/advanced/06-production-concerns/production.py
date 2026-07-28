# Advanced Chapter 6 lab: three things that matter once real traffic hits
# your agent, but never show up in a demo -- caching repeated questions,
# rate limiting so one burst of traffic can't overwhelm you, and streaming
# so users see words appear instead of staring at a spinner.
#
# The provider used (Ollama, OpenAI, or Anthropic) is controlled by the
# PROVIDER variable in your .env file. See README.md for setup steps.

import hashlib
import json
import os
import time

from dotenv import load_dotenv

load_dotenv()

provider = os.getenv("PROVIDER", "ollama")

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
        print(f"Unknown PROVIDER '{provider}'. Set it to ollama, openai, or anthropic in .env")
        raise SystemExit(1)


def ask_streaming(user_message, system=None):
    # Same job as ask(), but prints words as they arrive instead of
    # waiting for the whole answer, then returns the full text at the end.
    if provider == "ollama":
        import requests

        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": user_message})

        response = requests.post(
            "http://localhost:11434/api/chat",
            json={"model": "llama3.2", "messages": messages, "stream": True},
            stream=True,
        )
        full_text = ""
        for line in response.iter_lines():
            if not line:
                continue
            chunk = json.loads(line)
            piece = chunk["message"]["content"]
            print(piece, end="", flush=True)
            full_text += piece
        print()
        return full_text

    elif provider == "openai":
        from openai import OpenAI

        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": user_message})

        stream = client.chat.completions.create(model="gpt-4o-mini", messages=messages, stream=True)
        full_text = ""
        for chunk in stream:
            piece = chunk.choices[0].delta.content
            if piece:
                print(piece, end="", flush=True)
                full_text += piece
        print()
        return full_text

    elif provider == "anthropic":
        import anthropic

        client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        full_text = ""
        with client.messages.stream(
            model="claude-haiku-4-5-20251001",
            max_tokens=300,
            system=system or "",
            messages=[{"role": "user", "content": user_message}],
        ) as stream:
            for piece in stream.text_stream:
                print(piece, end="", flush=True)
                full_text += piece
        print()
        return full_text

    else:
        print(f"Unknown PROVIDER '{provider}'. Set it to ollama, openai, or anthropic in .env")
        raise SystemExit(1)


# ---------------------------------------------------------------------------
# 1. Caching: a repeated question shouldn't pay for a repeated model call.
# ---------------------------------------------------------------------------

CACHE_FILE = "cache.json"


def load_cache():
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE) as f:
            return json.load(f)
    return {}


def save_cache(cache):
    with open(CACHE_FILE, "w") as f:
        json.dump(cache, f, indent=2)


def cache_key(user_message, system):
    raw = f"{system}||{user_message}"
    return hashlib.sha256(raw.encode()).hexdigest()


def cached_ask(user_message, system=None):
    cache = load_cache()
    key = cache_key(user_message, system)

    if key in cache:
        print("  [cache] hit -- skipping the model call")
        return cache[key]

    print("  [cache] miss -- calling the model")
    answer = ask(user_message, system=system)
    cache[key] = answer
    save_cache(cache)
    return answer


def demo_caching():
    print("=== 1. Caching ===")
    question = "How many purchases before I get a free drink?"

    start = time.time()
    answer = cached_ask(question, system=SYSTEM_PROMPT)
    elapsed = time.time() - start
    print(f"  A: {answer}")
    print(f"  took {elapsed:.2f}s\n")

    start = time.time()
    answer = cached_ask(question, system=SYSTEM_PROMPT)
    elapsed = time.time() - start
    print(f"  A: {answer}")
    print(f"  took {elapsed:.2f}s\n")


# ---------------------------------------------------------------------------
# 2. Rate limiting: a token bucket caps how many requests go out per second.
# ---------------------------------------------------------------------------


def new_bucket(capacity, refill_rate):
    # capacity: max requests the bucket can hold at once.
    # refill_rate: tokens added back per second.
    return {"tokens": capacity, "capacity": capacity, "refill_rate": refill_rate, "last_refill": time.time()}


def wait_for_token(bucket):
    while True:
        now = time.time()
        elapsed = now - bucket["last_refill"]
        refill = elapsed * bucket["refill_rate"]
        if refill > 0:
            bucket["tokens"] = min(bucket["capacity"], bucket["tokens"] + refill)
            bucket["last_refill"] = now

        if bucket["tokens"] >= 1:
            bucket["tokens"] -= 1
            return

        time.sleep(0.1)


def demo_rate_limiting():
    print("=== 2. Rate limiting ===")
    # 2 requests allowed instantly, then 1 per second after that.
    bucket = new_bucket(capacity=2, refill_rate=1)

    questions = [
        "What's your best-selling drink?",
        "How many locations do you have?",
        "What's the loyalty program?",
        "Do you have oat milk?",
    ]

    for i, question in enumerate(questions, start=1):
        start = time.time()
        wait_for_token(bucket)
        waited = time.time() - start
        print(f"  request {i}: waited {waited:.2f}s for a token -> \"{question}\"")

    print()


# ---------------------------------------------------------------------------
# 3. Streaming: show words as they arrive instead of one blocking pause.
# ---------------------------------------------------------------------------


def demo_streaming():
    print("=== 3. Streaming ===")
    question = "Tell me about your loyalty program and your best-selling drink."
    print(f"  Q: {question}")
    print("  A: ", end="")
    ask_streaming(question, system=SYSTEM_PROMPT)
    print()


if __name__ == "__main__":
    demo_caching()
    demo_rate_limiting()
    demo_streaming()
