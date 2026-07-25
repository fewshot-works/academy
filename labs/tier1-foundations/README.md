# Tier 1 — Foundations

Hands-on labs for the zero-prior-knowledge tier. Each numbered folder corresponds to one chapter in the [site](../../site) (Chapter 0 setup guide through the Tier 1 capstone).

- [`02-first-api-call`](./02-first-api-call) — Chapter 2 lab: send one prompt to an AI model and print the reply.

The rest are being written — see `PRD.md` §7 for the planned chapter list.

Every lab in this tier runs with **either**:
- A local [Ollama](https://ollama.com) model (free, no API key), or
- Your own OpenAI or Anthropic API key (via a `.env` file, never committed)

and will use a local, file-based [ChromaDB](https://www.trychroma.com/) instance for any vector storage — no servers, no accounts.
