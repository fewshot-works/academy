# Lab 2: Choosing an Embedding Model

Companion lab for [Intermediate Chapter 2: Choosing an Embedding Model](https://fewshot-works.github.io/zero-to-agent/docs/intermediate/choosing-embedding-model). You'll embed the same sentences with two different embedding models and compare them on quality, speed, and cost.

## Before you start

You should already have Foundations done, at least [Chapter 4: What Is an Embedding?](https://fewshot-works.github.io/zero-to-agent/docs/foundations/what-is-an-embedding) — this lab reuses the same `embed()` and `cosine_similarity()` building blocks from that lab's `embed_similarity.py`.

**This lab only supports `PROVIDER=ollama` or `PROVIDER=openai`.** Anthropic doesn't offer an embeddings API, so if your `.env` from an earlier lab still has `PROVIDER=anthropic`, you'll need to change it here.

## Steps

1. **Move into the lab folder.** If you already cloned the repo for an earlier lab, just `cd` into this one:

   ```bash
   cd zero-to-agent/labs/intermediate/02-choosing-embedding-model
   ```

   Otherwise, clone the repo first:

   ```bash
   git clone https://github.com/fewshot-works/zero-to-agent.git
   cd zero-to-agent/labs/intermediate/02-choosing-embedding-model
   ```

   Don't know git yet? [Download the Intermediate labs zip](https://fewshot-works.github.io/zero-to-agent/downloads/zero-to-agent-labs-intermediate.zip) instead, unzip it, and open `labs/intermediate/02-choosing-embedding-model` in a terminal.

2. **If you're using Ollama, pull both embedding models.** This lab compares a smaller model against a larger one, so you need both on your machine:

   ```bash
   ollama pull nomic-embed-text
   ollama pull mxbai-embed-large
   ```

   (Skip `nomic-embed-text` if you already pulled it for an earlier lab.)

3. **Set up your `.env`:**

   ```bash
   cp .env.example .env
   ```

   If you're using Ollama, `PROVIDER=ollama` is already set, leave it as-is. If you're using OpenAI, open `.env` and set `PROVIDER=openai`, then add your `OPENAI_API_KEY`.

4. **Run the script:**

   ```bash
   uv run embedding_models.py
   ```

## What you should see

With `PROVIDER=ollama`:

```
Comparing embedding models via ollama...

nomic-embed-text
  Similar-pair avg similarity:    0.621
  Different-pair avg similarity:  0.346
  Quality gap (bigger is better): 0.275
  Time for 6 embeddings:    0.91s
  Cost for this run:              $0 (runs locally)

mxbai-embed-large
  Similar-pair avg similarity:    0.684
  Different-pair avg similarity:  0.302
  Quality gap (bigger is better): 0.382
  Time for 6 embeddings:    0.65s
  Cost for this run:              $0 (runs locally)

mxbai-embed-large was faster. mxbai-embed-large had the bigger quality gap.
```

Your exact numbers will shift a little run to run, but the quality gap should be consistent: `mxbai-embed-large` (the bigger of the two models) should separate the similar pairs from the different pairs more clearly than `nomic-embed-text` does, every time.

**One thing to notice about the timing:** it doesn't behave the way you might expect. Run the script twice in a row and the *second* run is much faster for both models, and the two models end up close to each other, sometimes with the bigger model even edging out the smaller one. That's because most of what you're timing on the first run is Ollama loading the model into memory, not the embedding computation itself. Locally, latency is a noisy signal. The tradeoff that holds up consistently is quality versus cost, not quality versus speed. On a hosted API, where you're paying per call over the network, latency becomes a much more dependable thing to compare, which is one more reason the `PROVIDER=openai` path is worth trying if you have a key.

## What the script is actually doing

Open `embedding_models.py` and follow along.

1. Six sentences from Chapter 4's lab are grouped into two "similar" pairs (a paraphrase of the same idea) and two "different" pairs (two unrelated ideas). The sentences themselves aren't new, only what we're asking of them is.
2. For each of the two models, `evaluate_model()` embeds all six sentences, timing how long that takes, then computes the average cosine similarity across the similar pairs and across the different pairs.
3. The **quality gap** is `avg_similar - avg_different`. A model that's good at telling meaning apart should score the similar pairs noticeably higher than the different pairs, so a bigger gap means a model that separates meaning more clearly.
4. With `PROVIDER=openai`, each API response includes `usage.total_tokens`. The script multiplies that by the model's published per-token price to print a real dollar cost for the run. With `PROVIDER=ollama`, cost is always `$0`, since the model runs on your own machine.

## Troubleshooting

- **`PROVIDER is set to 'anthropic'...` message and the script exits**: switch `PROVIDER` to `ollama` or `openai` in your `.env`. Anthropic has no embeddings API.
- **`ConnectionError` with `PROVIDER=ollama`**: make sure Ollama is running (`ollama serve`), and that you've pulled both `ollama pull nomic-embed-text` and `ollama pull mxbai-embed-large`.
- **`AuthenticationError` with `PROVIDER=openai`**: check that your key in `.env` has no extra quotes or spaces, and that the line isn't still commented out with `#`.
- **A model name error from Ollama**: double-check `ollama list` shows both `nomic-embed-text` and `mxbai-embed-large`. If one's missing, pull it.
