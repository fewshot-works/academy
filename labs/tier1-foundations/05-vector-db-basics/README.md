# Lab 5: Vector Database Basics

Companion lab for [Chapter 5: What Is a Vector Database, and Why?](https://fewshot-works.github.io/zero-to-agent/docs/tier-1-foundations/what-is-a-vector-database). You'll store ten sentences in a local vector database, then send in one new sentence and watch it instantly return the closest matches.

## Before you start

You should have already completed [Chapter 0: Set Up Your Machine](https://fewshot-works.github.io/zero-to-agent/docs/tier-1-foundations/setup) and [Chapter 4's lab](../04-embedding-similarity). **This lab only supports `PROVIDER=ollama` or `PROVIDER=openai`.** Anthropic doesn't offer an embeddings API, so if your `.env` from an earlier lab still has `PROVIDER=anthropic`, you'll need to change it here.

## Steps

1. **Move into the lab folder.** If you already cloned the repo for an earlier lab, just `cd` into this one:

   ```bash
   cd zero-to-agent/labs/tier1-foundations/05-vector-db-basics
   ```

   Otherwise, clone the repo first:

   ```bash
   git clone https://github.com/fewshot-works/zero-to-agent.git
   cd zero-to-agent/labs/tier1-foundations/05-vector-db-basics
   ```

2. **If you're using Ollama, make sure you've pulled the embedding model.** This is the same model Chapter 4 used, so skip this if you already ran that lab:

   ```bash
   ollama pull nomic-embed-text
   ```

3. **Set up your `.env` file:**

   ```bash
   cp .env.example .env
   ```

   The default `PROVIDER=ollama` works as-is. If you'd rather use OpenAI, change it to `openai` and fill in your API key.

4. **Run the script:**

   ```bash
   uv run vector_db_basics.py
   ```

## What you should see

```
Adding 10 sentences to the vector database...

Query: "my cat keeps meowing at 3am"

Top 3 closest matches:
1. (0.89) my dog won't stop barking
2. (0.84) our puppy barks at everything
3. (0.21) this recipe needs more garlic
```

Your exact numbers will differ slightly depending on your embedding model, but the two dog sentences should always come out as the closest matches to a question about a cat, since they're the most related in meaning. Notice the script never checked every sentence one by one, it asked the database for the top 3 and got them back directly.

A new folder called `chroma_db/` also appears next to the script. That's the actual database, saved to disk so it's still there if you run the script again.

## What the script is actually doing

Open `vector_db_basics.py` and follow along:

1. `embed(text)` sends one sentence to whichever provider you picked and gets back its embedding, the same helper as Chapter 4's lab.
2. `chromadb.PersistentClient(path="./chroma_data")` opens (or creates) a local vector database saved to a folder on disk.
3. `collection.upsert(...)` adds all ten sentences and their embeddings to the database in one call, each with a unique id.
4. The query sentence gets embedded the same way, then `collection.query(...)` asks the database for the 3 closest matches. The database handles the search itself, no manual loop comparing every pair.

## Troubleshooting

- **`PROVIDER is set to 'anthropic'...` message and the script exits**: switch `PROVIDER` to `ollama` or `openai` in your `.env`. Anthropic has no embeddings API.
- **`ConnectionError` with `PROVIDER=ollama`**: Ollama isn't running. Run `ollama serve` in another terminal, or reopen the Ollama app.
- **`model not found` with `PROVIDER=ollama`**: you likely skipped step 2. Run `ollama pull nomic-embed-text`.
- **`AuthenticationError` with `openai`**: double check your key in `.env` has no extra quotes or spaces, and the line isn't still commented out with a `#`.
