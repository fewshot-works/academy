# Intermediate Chapter 2 lab: embed the same sentences with two different
# embedding models and compare them on quality, speed, and cost.
#
# Which provider this uses (Ollama or OpenAI) is controlled by PROVIDER in
# your .env file. This lab compares two models within that provider, a
# smaller/faster one against a larger/more accurate one. Anthropic doesn't
# offer an embeddings API, so this lab only supports ollama or openai. See
# README.md for setup steps.

import os
import time
from dotenv import load_dotenv
import numpy as np

load_dotenv()

provider = os.getenv("PROVIDER", "ollama")

# The same six sentences from Chapter 4's embedding lab, reused here. What's
# different this time isn't the sentences, it's the model doing the embedding.
SIMILAR_PAIRS = [
    ("my dog won't stop barking", "our puppy barks at everything"),
    ("I'm making pasta for dinner", "this recipe needs more garlic"),
]
DIFFERENT_PAIRS = [
    ("my dog won't stop barking", "the stock market dropped again"),
    ("I'm making pasta for dinner", "interest rates went up this week"),
]

if provider == "ollama":
    MODELS = ["nomic-embed-text", "mxbai-embed-large"]
elif provider == "openai":
    MODELS = ["text-embedding-3-small", "text-embedding-3-large"]
else:
    print(
        f"PROVIDER is set to '{provider}', but Anthropic doesn't offer an "
        "embeddings API. Set PROVIDER to ollama or openai in your .env and try again."
    )
    raise SystemExit(1)

# Dollars per 1 million tokens, from OpenAI's published pricing. Ollama runs
# on your own machine, so there's no per-token charge at all.
OPENAI_PRICE_PER_MILLION_TOKENS = {
    "text-embedding-3-small": 0.02,
    "text-embedding-3-large": 0.13,
}


def embed(text, model):
    if provider == "ollama":
        import requests

        response = requests.post(
            "http://localhost:11434/api/embeddings",
            json={"model": model, "prompt": text},
        )
        return response.json()["embedding"], 0

    elif provider == "openai":
        from openai import OpenAI

        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        response = client.embeddings.create(model=model, input=text)
        return response.data[0].embedding, response.usage.total_tokens


def cosine_similarity(vec_a, vec_b):
    vec_a = np.array(vec_a)
    vec_b = np.array(vec_b)
    return np.dot(vec_a, vec_b) / (np.linalg.norm(vec_a) * np.linalg.norm(vec_b))


def evaluate_model(model):
    all_sentences = [s for pair in SIMILAR_PAIRS + DIFFERENT_PAIRS for s in pair]
    unique_sentences = list(dict.fromkeys(all_sentences))

    start = time.time()
    embeddings = {}
    total_tokens = 0
    for sentence in unique_sentences:
        vector, tokens = embed(sentence, model)
        embeddings[sentence] = vector
        total_tokens += tokens
    elapsed = time.time() - start

    similar_scores = [cosine_similarity(embeddings[a], embeddings[b]) for a, b in SIMILAR_PAIRS]
    different_scores = [cosine_similarity(embeddings[a], embeddings[b]) for a, b in DIFFERENT_PAIRS]

    avg_similar = sum(similar_scores) / len(similar_scores)
    avg_different = sum(different_scores) / len(different_scores)

    cost = 0.0
    if provider == "openai":
        cost = (total_tokens / 1_000_000) * OPENAI_PRICE_PER_MILLION_TOKENS[model]

    return {
        "model": model,
        "avg_similar": avg_similar,
        "avg_different": avg_different,
        "gap": avg_similar - avg_different,
        "seconds": elapsed,
        "count": len(unique_sentences),
        "total_tokens": total_tokens,
        "cost": cost,
    }


print(f"Comparing embedding models via {provider}...\n")
results = [evaluate_model(model) for model in MODELS]

for r in results:
    print(r["model"])
    print(f"  Similar-pair avg similarity:    {r['avg_similar']:.3f}")
    print(f"  Different-pair avg similarity:  {r['avg_different']:.3f}")
    print(f"  Quality gap (bigger is better): {r['gap']:.3f}")
    print(f"  Time for {r['count']} embeddings:    {r['seconds']:.2f}s")
    if provider == "openai":
        print(f"  Cost for this run:              ${r['cost']:.6f} ({r['total_tokens']} tokens)")
    else:
        print("  Cost for this run:              $0 (runs locally)")
    print()

faster = min(results, key=lambda r: r["seconds"])
better = max(results, key=lambda r: r["gap"])
print(f"{faster['model']} was faster. {better['model']} had the bigger quality gap.")
