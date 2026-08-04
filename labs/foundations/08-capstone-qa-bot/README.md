# Lab 8: Capstone: Your Own Q&A Bot

Companion lab for [Chapter 8: Capstone: A Q&A Bot Over Your Own Documents](https://fewshotacademy.com/docs/foundations/capstone-qa-bot). This is the Foundations capstone: a reusable bot that answers questions about a whole folder of documents, saved to disk so it doesn't have to redo the embedding work every time you run it.

## Before you start

You should have already completed [Chapter 0: Set Up Your Machine](https://fewshotacademy.com/docs/foundations/setup) and the [Chapter 6 lab](../06-first-rag-bot). **This lab only supports `PROVIDER=ollama` or `PROVIDER=openai`.** It needs one provider that can handle both embeddings and chat, and Anthropic doesn't offer an embeddings API.

## Steps

1. **Move into the lab folder.** If you already cloned the repo for an earlier lab, just `cd` into this one:

   ```bash
   cd academy/labs/foundations/08-capstone-qa-bot
   ```

   Otherwise, clone the repo first:

   ```bash
   git clone https://github.com/fewshot-works/academy.git
   cd academy/labs/foundations/08-capstone-qa-bot
   ```

   Don't know git yet? [Download the Foundations labs as a zip](https://fewshotacademy.com/downloads/academy-labs-foundations.zip) instead, unzip it, and open `labs/foundations/08-capstone-qa-bot` in your terminal.

2. **If you're using Ollama, make sure you've pulled the embedding model.** Same model used since Chapter 4, skip this if you already have it:

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
   uv run capstone_qa_bot.py
   ```

   It'll load the two sample documents in `docs/`, then ask you for a question. Type one, read the answer, and keep going. Type `quit` when you're done.

## What you should see

```
Loading documents from ./docs...
Added 8 chunks from 2 documents to the vector database.

Ask a question (or type 'quit' to exit): What is Fernwood Coffee Co.'s most popular drink?

Retrieved context:
1. Fernwood Coffee Co. was founded in 2016 in a converted train depot...
2. The bestselling drink at Fernwood is the "Depot Latte"...

Answer: Fernwood Coffee Co.'s most popular drink is the Depot Latte.

Ask a question (or type 'quit' to exit): How often does the Mountain View Hiking Club meet?

Retrieved context:
1. The Mountain View Hiking Club meets every Saturday morning...
2. New members are welcome at any meetup...

Answer: The Mountain View Hiking Club meets every Saturday morning.

Ask a question (or type 'quit' to exit): quit
```

Both documents are made up on purpose, "Fernwood Coffee Co." and the "Mountain View Hiking Club" don't exist. If the bot answers a coffee question using the coffee document and a hiking question using the hiking document, without mixing them up, that's proof it's actually retrieving the relevant text, not guessing from memory.

A new folder called `chroma_db/` appears next to the script after the first run. That's the saved database, so re-running the script won't re-embed anything that's already in it.

💡 A few honest notes on this real run:

- **Retrieval crossed documents on both questions, and it still worked out.** Asking about Fernwood's most popular drink correctly retrieved the Depot Latte chunk first, but the second-closest chunk wasn't from the coffee document at all, it was the hiking club's "Ridge Trail Sunrise Hike" chunk. Asking about the hiking club's meeting time pulled that same sunrise-hike chunk as its second match too. In both cases the model answered correctly anyway, because the one relevant chunk it needed was still there in the context, and it didn't get distracted by the unrelated second chunk.
- **This is a good reminder of what "retrieve the 2 closest chunks" actually promises.** It doesn't promise both chunks will be relevant, only that they're the closest by embedding distance. With just 8 chunks total across 2 documents, there often isn't a second genuinely-related chunk to find, so the database returns its best remaining guess instead of an empty slot.

With `PROVIDER=openai`, expect the same correct answers on these two questions; which second chunk gets retrieved may differ, but it doesn't need to be relevant for the model to answer correctly.

## Try it on your own documents

This is the actual capstone step. Open the `docs/` folder, delete the two sample files, and drop in a few of your own, notes, a resume, an FAQ, meeting minutes, anything in plain `.txt` format. Delete the `chroma_db/` folder too, so old sample data doesn't linger, then run the script again and ask it real questions about your own material.

## What the script is actually doing

Open `capstone_qa_bot.py` and follow along:

1. It reads every `.txt` file in `./docs` and splits each one on blank lines, so each paragraph becomes one chunk, the same simple chunking strategy from Chapter 6, just applied to a whole folder instead of one file.
2. `embed(text)` turns each chunk into a vector, the same helper shape used since Chapter 4. `chromadb.PersistentClient(path="./chroma_db")` saves those embeddings to disk instead of losing them when the script ends, the same approach as Chapter 5's lab.
3. `collection.upsert(...)` uses ids built from each chunk's filename and position, so re-running the script updates existing chunks instead of duplicating them.
4. A `while True` loop asks for a question, embeds it, retrieves the 2 closest chunks with `collection.query(...)`, builds a prompt that says to answer *using only the context below*, and sends it to the LLM through `ask(...)`. It keeps looping until you type `quit`.

## Troubleshooting

- **The message about needing an embedding-and-chat provider, and the script exits**: switch `PROVIDER` to `ollama` or `openai` in your `.env`.
- **`ConnectionError` with `PROVIDER=ollama`**: Ollama isn't running. Run `ollama serve` in another terminal, or reopen the Ollama app.
- **`model not found` with `PROVIDER=ollama`**: you likely skipped step 2. Run `ollama pull nomic-embed-text`.
- **`AuthenticationError` with `openai`**: double check your key in `.env` has no extra quotes or spaces, and the line isn't still commented out with a `#`.
- **The answer says it doesn't know, or mixes up the two topics**: try re-running, small local models occasionally ignore the "use only this context" instruction. Same caveat as Chapter 6: grounding reduces hallucination, it doesn't eliminate it.
- **Switched to your own documents but old answers still show up**: delete the `chroma_db/` folder before re-running, so it doesn't mix your new documents with the old sample data.
