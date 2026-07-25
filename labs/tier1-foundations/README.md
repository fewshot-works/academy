# Tier 1 — Foundations

Hands-on labs for the zero-prior-knowledge tier. Each numbered folder corresponds to one chapter in the [site](../../site) (Chapter 0 setup guide through the Tier 1 capstone).

- [`02-first-api-call`](./02-first-api-call): Chapter 2 lab, send one prompt to an AI model and print the reply.
- [`03-prompt-playground`](./03-prompt-playground): Chapter 3 lab, ask the same question zero-shot, few-shot, and with a system prompt, and compare the answers.
- [`04-embedding-similarity`](./04-embedding-similarity): Chapter 4 lab, turn sentences into embeddings and measure how similar they are.
- [`05-vector-db-basics`](./05-vector-db-basics): Chapter 5 lab, store sentences in a local vector database and query it for the closest matches.
- [`06-first-rag-bot`](./06-first-rag-bot): Chapter 6 lab, answer a question by retrieving relevant chunks from a document and handing them to an LLM as context.

The rest are being written, see `PRD.md` §7 for the planned chapter list.

Every lab in this tier runs with **either**:
- A local [Ollama](https://ollama.com) model (free, no API key), or
- Your own OpenAI or Anthropic API key (via a `.env` file, never committed)

and will use a local, file-based [ChromaDB](https://www.trychroma.com/) instance for any vector storage. No servers, no accounts.
