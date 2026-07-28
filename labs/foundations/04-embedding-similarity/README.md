# Lab 4: Embedding Similarity

Companion lab for [Chapter 4: What Is an Embedding?](https://fewshot-works.github.io/academy/docs/foundations/what-is-an-embedding). You'll turn six sentences into embeddings, measure how similar every pair is, and save a picture that shows related sentences clustering together.

## Before you start

You should have already completed [Chapter 0: Set Up Your Machine](https://fewshot-works.github.io/academy/docs/foundations/setup).

**This lab only supports `PROVIDER=ollama` or `PROVIDER=openai`.** Anthropic doesn't offer an embeddings API, so if your `.env` from an earlier lab still has `PROVIDER=anthropic`, you'll need to change it here.

## Steps

1. **Move into this lab folder.** If you already cloned the repo for an earlier lab, just `cd` into this one:

   ```bash
   cd academy/labs/foundations/04-embedding-similarity
   ```

   Otherwise, clone the repo first:

   ```bash
   git clone https://github.com/fewshot-works/academy.git
   cd academy/labs/foundations/04-embedding-similarity
   ```

   Don't know git yet? [Download the Foundations labs as a zip](https://fewshot-works.github.io/academy/downloads/academy-labs-foundations.zip) instead, unzip it, and open `labs/foundations/04-embedding-similarity` in your terminal.

2. **If you're using Ollama, pull the embedding model.** The chat model from earlier chapters (`llama3.2`) doesn't do embeddings; you need a separate model built for it:

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
   uv run embed_similarity.py
   ```

## What you should see

```
Embedding sentences...

Most similar pair (0.91): "my dog won't stop barking" <-> "our puppy barks at everything"
Least similar pair (0.08): "I'm making pasta for dinner" <-> "the stock market dropped again"

Saved plot to embeddings_plot.png
```

Open `embeddings_plot.png` in the same folder afterward. You should see the two dog sentences sitting close together, the two cooking sentences sitting close together, and the two finance sentences off on their own, all without the script ever being told which sentences were related.

Your exact numbers will differ slightly depending on the embedding model, but the two dog sentences should always come out as the most similar pair.

💡 A few honest notes on this real run:

- **The most similar pair held up exactly as promised**, the two dog sentences, every time this was run against `nomic-embed-text`. That part of the lab's claim is solid.
- **The least similar pair was not the pasta/stock-market comparison shown above**, it was "our puppy barks at everything" against the stock market sentence, scoring 0.31 (this model's scores also run lower overall, in the 0.3-0.7 range rather than the 0.08-0.91 shown above). Least-similar is a much closer contest than most-similar: several unrelated-topic pairs score in a similar low range, so which one comes out lowest can shift with the embedding model, while the two dog sentences being closest is the reliable, repeatable part of this lab.

With `PROVIDER=openai`, the shape stays the same, dog sentences closest, finance and cooking sentences off on their own, but the exact scores will differ since it's a different embedding model.

## What the script is actually doing

Open `embed_similarity.py` and follow along:

1. `embed(text)` sends one sentence to whichever provider you picked and gets back its embedding, a list of a few hundred to a few thousand numbers.
2. `cosine_similarity(vec_a, vec_b)` compares two embeddings using plain numpy: it takes the dot product of the two vectors and divides by the product of their lengths. The result is a score from -1 to 1, where higher means more similar.
3. The script loops over every possible pair of the six sentences, scores each pair, and keeps track of the highest and lowest score it saw.
4. Since each embedding has far more than 2 numbers in it, you can't plot it directly. `scikit-learn`'s `PCA` squashes each embedding down to just 2 numbers while trying to preserve which points were close together and which were far apart, so `matplotlib` can plot them on an ordinary 2D chart.

## Troubleshooting

- **`PROVIDER is set to 'anthropic'...` message and the script exits**: switch `PROVIDER` to `ollama` or `openai` in your `.env`. Anthropic has no embeddings API.
- **`ConnectionError` with `PROVIDER=ollama`**: Ollama isn't running. Run `ollama serve` in another terminal, or reopen the Ollama app.
- **`model not found` with `PROVIDER=ollama`**: you likely skipped step 2. Run `ollama pull nomic-embed-text`.
- **`AuthenticationError` with `openai`**: double check your key in `.env` has no extra quotes or spaces, and the line isn't still commented out with a `#`.
