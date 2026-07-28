# Lab 6: Your First RAG Bot

Companion lab for [Chapter 6: What Is RAG?](https://fewshot-works.github.io/academy/docs/foundations/what-is-rag). You'll build a tiny bot that answers a question using a made-up document as its only source of truth.

## Before you start

You should have already completed [Chapter 0: Set Up Your Machine](https://fewshot-works.github.io/academy/docs/foundations/setup) and the [Chapter 5 lab](../05-vector-db-basics). **This lab only supports `PROVIDER=ollama` or `PROVIDER=openai`.** It needs one provider that can handle both embeddings and chat, and Anthropic doesn't offer an embeddings API.

## Steps

1. **Move into the lab folder.** If you already cloned the repo for an earlier lab, just `cd` into this one:

   ```bash
   cd academy/labs/foundations/06-first-rag-bot
   ```

   Otherwise, clone the repo first:

   ```bash
   git clone https://github.com/fewshot-works/academy.git
   cd academy/labs/foundations/06-first-rag-bot
   ```

   Don't know git yet? [Download the Foundations labs as a zip](https://fewshot-works.github.io/academy/downloads/academy-labs-foundations.zip) instead, unzip it, and open `labs/foundations/06-first-rag-bot` in your terminal.

2. **If you're using Ollama, make sure you've pulled the embedding model.** Same model used in Chapters 4 and 5, skip this if you already have it:

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
   uv run rag_bot.py
   ```

## What you should see

```
Question: What is Fernwood Coffee Co.'s most popular drink?

Retrieved context:
1. Fernwood Coffee Co. was founded in 2016 in a converted train depot on the edge of a small town...
2. The bestselling drink at Fernwood is the "Depot Latte," a vanilla-and-cardamom latte...

Answer:
Fernwood Coffee Co.'s most popular drink is the Depot Latte.
```

"Fernwood Coffee Co." is entirely made up for this lab, it doesn't exist anywhere in the real world. If the bot answers correctly anyway, that's proof it's actually using the retrieved text from `sample_facts.txt`, not something it already knew.

💡 A few honest notes on this real run:

- **The two retrieved chunks weren't the ones shown above.** Every run here pulled the bestselling-drink chunk (the one that actually answers the question) and the loyalty-program chunk, which has nothing to do with what's most popular. The founding-year chunk shown in the example above never came back at all. Retrieval isn't grabbing "the founding fact plus the answer," it's grabbing whatever the embedding model scores closest, and that won't always match a hand-picked example.
- **The wrong second chunk didn't throw the model off.** Every run answered "the Depot Latte" correctly anyway, worded slightly differently each time, because the prompt still handed it the one chunk that actually contains the answer, and the model was able to ignore the irrelevant second chunk rather than getting confused by it.

With `PROVIDER=openai`, expect the same correct answer, retrieval quality and which two chunks come back can shift with the embedding model, but a well-grounded question like this one tends to succeed either way.

## What the script is actually doing

Open `rag_bot.py` and follow along:

1. It reads `sample_facts.txt` and splits it on blank lines, so each paragraph becomes one chunk. This is the simplest possible chunking strategy; smarter ones come later in the course.
2. `embed(text)` turns each chunk into a vector, the same helper shape as Chapters 4 and 5, and all the chunks get stored in an in-memory Chroma collection (nothing is saved to disk this time).
3. The hardcoded `question` gets embedded the same way, then `collection.query(...)` retrieves the 2 closest chunks.
4. Those chunks get inserted directly into a prompt that tells the model to answer *using only the context below*, and that prompt gets sent to the LLM through `ask(...)`.
5. The script prints both the retrieved chunks and the model's final answer, so you can see exactly what the model was given before it answered.

## Troubleshooting

- **The message about needing an embedding-and-chat provider, and the script exits**: switch `PROVIDER` to `ollama` or `openai` in your `.env`.
- **`ConnectionError` with `PROVIDER=ollama`**: Ollama isn't running. Run `ollama serve` in another terminal, or reopen the Ollama app.
- **`model not found` with `PROVIDER=ollama`**: you likely skipped step 2. Run `ollama pull nomic-embed-text`.
- **`AuthenticationError` with `openai`**: double check your key in `.env` has no extra quotes or spaces, and the line isn't still commented out with a `#`.
- **The answer says it doesn't know**: try re-running, small local models occasionally ignore the "use only this context" instruction. This is also a preview of why grounding reduces hallucination but doesn't eliminate it, exactly what Chapter 6 covers.
