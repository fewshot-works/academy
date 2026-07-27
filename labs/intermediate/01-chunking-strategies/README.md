# Lab 1: Chunking Strategies

Companion lab for [Intermediate Chapter 1: Chunking Strategies](https://fewshot-works.github.io/zero-to-agent/docs/intermediate/chunking-strategies). You'll cut the same short document three different ways, fixed-size, recursive, and semantic, and compare what each one actually produces.

## Before you start

You should have already completed Foundations, or at least [Chapter 4: What Is an Embedding?](https://fewshot-works.github.io/zero-to-agent/docs/foundations/what-is-an-embedding) — this lab reuses the same `embed()` and `cosine_similarity()` building blocks from that lab's `embed_similarity.py`.

**This lab only supports `PROVIDER=ollama` or `PROVIDER=openai`.** Semantic chunking needs an embedding model, and Anthropic doesn't offer one, so if your `.env` from an earlier lab still has `PROVIDER=anthropic`, you'll need to change it here.

## Steps

1. **Move into this lab folder.** If you already cloned the repo for an earlier lab, just `cd` into this one:

   ```bash
   cd zero-to-agent/labs/intermediate/01-chunking-strategies
   ```

   Otherwise, clone the repo first:

   ```bash
   git clone https://github.com/fewshot-works/zero-to-agent.git
   cd zero-to-agent/labs/intermediate/01-chunking-strategies
   ```

   Don't know git yet? [Download the Intermediate labs as a zip](https://fewshot-works.github.io/zero-to-agent/downloads/zero-to-agent-labs-intermediate.zip) instead, unzip it, and open `labs/intermediate/01-chunking-strategies` in your terminal.

2. **If you're using Ollama, pull the embedding model** (skip if you already did this for a Foundations lab):

   ```bash
   ollama pull nomic-embed-text
   ```

3. **Set up your `.env` file:**

   ```bash
   cp .env.example .env
   ```

   By default `PROVIDER=ollama`. Leave it as-is, or switch it to `openai` and fill in your key.

4. **Make sure Ollama is running** (skip if you're using `openai`):

   ```bash
   ollama serve
   ```

5. **Run the script:**

   ```bash
   uv run chunking.py
   ```

## What you should see

```
Document length: 1519 characters

Fixed-size (260 chars, no overlap): 6 chunks
  1. Mossbank Public Library is extending its hours starting next month. The building will now stay open ...
  2. can reshelve before the doors lock.  Library cards remain free for anyone who lives, works, or atten...
  3. are ten cents per day per item, capped at five dollars.  Fernwood Coffee is opening a second locatio...
  4.  same menu, headlined by the bestselling Depot Latte.  The downtown shop will open at 6 AM on weekda...
  5. ugh the end of the month.  The Mountain View Hiking Club meets every Saturday morning at the trailhe...
  6.  featured hike climbs to the old fire lookout tower, a six-mile round trip with about 1,200 feet of ...

Fixed-size with overlap (260 chars, 40 overlap): 7 chunks
  ...

Recursive (paragraph -> sentence, max 260 chars): 8 chunks
  1. Mossbank Public Library is extending its hours starting next month. The building will now stay open ...
  2. The children's section will still close at 7 PM so staff can reshelve before the doors lock.
  ...

Semantic chunking needs an embedding for every sentence, calling ollama...

Semantic (embedding similarity, threshold 0.55): 6 chunks
  1. Mossbank Public Library is extending its hours starting next month. The building will now stay open ...
  2. Library cards remain free for anyone who lives, works, or attends school in the county.
  3. Cardholders can borrow up to ten items for three weeks, with two renewals allowed if nobody else has...
  4. Fernwood Coffee is opening a second location downtown next Saturday. The original shop, a converted ...
  5. The Mountain View Hiking Club meets every Saturday morning at the trailhead parking lot, rain or shi...
  6. This month's featured hike climbs to the old fire lookout tower, a six-mile round trip with about 1,...

Look at the boundary between chunk 1 and chunk 2 in the fixed-size split above: it cuts a sentence in half. The recursive split never does that, and the semantic split groups the whole Fernwood Coffee story into one chunk even though it spans two paragraphs.
```

Your exact chunk boundaries may shift slightly with a different embedding model, but the fixed-size split should always cut mid-sentence somewhere, and the semantic split should always keep the whole Fernwood Coffee story (which spans two paragraphs) together in one chunk.

## What the script is actually doing

Open `chunking.py` and follow along. The document itself is a small fictional town newsletter with three unrelated stories glued together, library hours, a coffee shop opening, a hiking club update, on purpose, so it's obvious when a chunking method blends two unrelated stories into one chunk versus keeps them apart.

1. `fixed_chunk(text, size)` slices the text every `size` characters. It has no idea where a sentence starts or ends, so it will cut through a word or a sentence whenever the count runs out.
2. `fixed_chunk_overlap(text, size, overlap)` does the same thing, but repeats the last `overlap` characters of one chunk at the start of the next, so if a thought does get cut in half, at least some of what came before it survives into the next chunk too.
3. `recursive_chunk(text, max_size)` tries to keep whole paragraphs together first (splitting on blank lines). Only if a single paragraph is still bigger than `max_size` does it fall back to sentence boundaries, and only if a single sentence is still too big does it fall back to raw characters, same as `fixed_chunk`. This is why it never cuts mid-sentence in the output above.
4. `semantic_chunk(text, threshold)` splits the document into sentences, embeds each one with `embed()` (the same function from Chapter 4's lab), and compares each sentence to the one before it with `cosine_similarity()`. When the similarity drops below `threshold`, that's treated as a topic change and a new chunk starts.

## Troubleshooting

- **`PROVIDER is set to 'anthropic'...` message and the script exits**: switch `PROVIDER` to `ollama` or `openai` in your `.env`. Anthropic has no embeddings API.
- **`ConnectionError` with `PROVIDER=ollama`**: Ollama isn't running. Run `ollama serve` in another terminal, or reopen the Ollama app.
- **`model not found` with `PROVIDER=ollama`**: you likely skipped step 2. Run `ollama pull nomic-embed-text`.
- **`AuthenticationError` with `openai`**: double check your key in `.env` has no extra quotes or spaces, and the line isn't still commented out with a `#`.
- **Semantic chunking is slow**: it calls the embedding model once per sentence (15 calls for this document). That's normal, embedding is one of the cheapest API calls there is, but it's still one network round-trip per sentence.
