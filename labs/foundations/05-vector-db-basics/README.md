# Lab 5: Vector Database Basics

Companion lab for [Chapter 5: What Is a Vector Database, and Why?](https://fewshot-works.github.io/academy/docs/foundations/what-is-a-vector-database). You'll store ten sentences in a local vector database, then send in one new sentence and watch it instantly return the closest matches.

## Before you start

You should have already completed [Chapter 0: Set Up Your Machine](https://fewshot-works.github.io/academy/docs/foundations/setup) and [Chapter 4's lab](../04-embedding-similarity). **This lab only supports `PROVIDER=ollama` or `PROVIDER=openai`.** Anthropic doesn't offer an embeddings API, so if your `.env` from an earlier lab still has `PROVIDER=anthropic`, you'll need to change it here.

## Steps

1. **Move into the lab folder.** If you already cloned the repo for an earlier lab, just `cd` into this one:

   ```bash
   cd academy/labs/foundations/05-vector-db-basics
   ```

   Otherwise, clone the repo first:

   ```bash
   git clone https://github.com/fewshot-works/academy.git
   cd academy/labs/foundations/05-vector-db-basics
   ```

   Don't know git yet? [Download the Foundations labs as a zip](https://fewshot-works.github.io/academy/downloads/academy-labs-foundations.zip) instead, unzip it, and open `labs/foundations/05-vector-db-basics` in your terminal.

2. **If you're using Ollama, make sure you've pulled the embedding model.** This is the same model Chapter 4 used, so skip this if you already ran that lab:

   ```bash
   ollama pull nomic-embed-text
   ```

3. **Set up your `.env` file:**

   ```bash
   cp .env.example .env
   ```

   On Windows Command Prompt, `cp` isn't a built-in command, use `copy` instead:

   ```cmd
   copy .env.example .env
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
1. (0.63) my dog won't stop barking
2. (0.52) our puppy barks at everything
3. (0.46) I'm making pasta for dinner
```

Your exact numbers, and even the third match, will differ depending on your embedding model. The two dog sentences should always come out as the top 2 matches to a question about a cat, since they're the most related in meaning, that part doesn't change. Notice the script never checked every sentence one by one, it asked the database for the top 3 and got them back directly.

A new folder called `chroma_db/` also appears next to the script. That's the actual database, saved to disk so it's still there if you run the script again.

💡 A few honest notes on this real run:

- **Unlike Labs 2 and 3, this one is boringly repeatable.** Embeddings aren't generated word-by-word like chat replies, so running this script five times in a row against `nomic-embed-text` gave the exact same three matches with the exact same scores every time, not just the same ranking.
- **Running the script twice doesn't create a second copy of anything.** `collection.upsert(...)` uses each sentence's id to overwrite, not append, so `chroma_db/` stays at 10 sentences no matter how many times you rerun the script. That's worth noticing because it means you can experiment freely (rerun, tweak the query) without needing to delete `chroma_db/` between attempts.

With `PROVIDER=openai`, expect the same top-2 dog sentences and the same query-without-a-manual-loop behavior, just with different underlying scores from a different embedding model.

## What the script is actually doing

Open `vector_db_basics.py` and follow along:

1. `embed(text)` sends one sentence to whichever provider you picked and gets back its embedding, the same helper as Chapter 4's lab.
2. `chromadb.PersistentClient(path="./chroma_db")` opens (or creates) a local vector database saved to a folder on disk.
3. `collection.upsert(...)` adds all ten sentences and their embeddings to the database in one call, each with a unique id.
4. The query sentence gets embedded the same way, then `collection.query(...)` asks the database for the 3 closest matches. The database handles the search itself, no manual loop comparing every pair.

## Troubleshooting

- **`PROVIDER is set to 'anthropic'...` message and the script exits**: switch `PROVIDER` to `ollama` or `openai` in your `.env`. Anthropic has no embeddings API.
- **`ConnectionError` with `PROVIDER=ollama`**: Ollama isn't running. Run `ollama serve` in another terminal, or reopen the Ollama app.
- **`model not found` with `PROVIDER=ollama`**: you likely skipped step 2. Run `ollama pull nomic-embed-text`.
- **`AuthenticationError` with `openai`**: double check your key in `.env` has no extra quotes or spaces, and the line isn't still commented out with a `#`.
