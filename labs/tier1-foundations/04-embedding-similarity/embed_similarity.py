# Chapter 4 lab: turn six sentences into embeddings, measure how similar
# every pair is to every other pair, and save a picture of them clustered
# on a 2D map.
#
# Which provider this uses is controlled by PROVIDER in your .env file.
# Anthropic doesn't offer an embeddings API, so this lab only supports
# ollama and openai. See README.md for setup steps.

import os
from dotenv import load_dotenv
import numpy as np

load_dotenv()

provider = os.getenv("PROVIDER", "ollama")

sentences = [
    "my dog won't stop barking",
    "our puppy barks at everything",
    "I'm making pasta for dinner",
    "this recipe needs more garlic",
    "the stock market dropped again",
    "interest rates went up this week",
]


def embed(text):
    if provider == "ollama":
        import requests

        response = requests.post(
            "http://localhost:11434/api/embeddings",
            json={"model": "nomic-embed-text", "prompt": text},
        )
        return response.json()["embedding"]

    elif provider == "openai":
        from openai import OpenAI

        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        response = client.embeddings.create(
            model="text-embedding-3-small",
            input=text,
        )
        return response.data[0].embedding

    else:
        print(
            f"PROVIDER is set to '{provider}', but Anthropic doesn't offer an "
            "embeddings API. Set PROVIDER to ollama or openai in your .env and try again."
        )
        raise SystemExit(1)


def cosine_similarity(vec_a, vec_b):
    vec_a = np.array(vec_a)
    vec_b = np.array(vec_b)
    return np.dot(vec_a, vec_b) / (np.linalg.norm(vec_a) * np.linalg.norm(vec_b))


print("Embedding sentences...")
embeddings = [embed(sentence) for sentence in sentences]

# Compare every sentence to every other sentence, remembering the best and worst pair
best_score = -1
worst_score = 1
best_pair = None
worst_pair = None

for i in range(len(sentences)):
    for j in range(i + 1, len(sentences)):
        score = cosine_similarity(embeddings[i], embeddings[j])
        if score > best_score:
            best_score = score
            best_pair = (sentences[i], sentences[j])
        if score < worst_score:
            worst_score = score
            worst_pair = (sentences[i], sentences[j])

print(f'\nMost similar pair ({best_score:.2f}): "{best_pair[0]}" <-> "{best_pair[1]}"')
print(f'Least similar pair ({worst_score:.2f}): "{worst_pair[0]}" <-> "{worst_pair[1]}"')

# Reduce the embeddings down to 2 dimensions so we can actually plot them
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt

points = PCA(n_components=2).fit_transform(embeddings)

plt.figure(figsize=(8, 6))
for i, sentence in enumerate(sentences):
    x, y = points[i]
    plt.scatter(x, y)
    plt.annotate(sentence, (x, y), fontsize=8, xytext=(5, 5), textcoords="offset points")

plt.title("Sentences plotted by meaning")
plt.savefig("embeddings_plot.png")
print("\nSaved plot to embeddings_plot.png")
