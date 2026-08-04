# Lab: Token & Cost Management

Companion lab for [Advanced Concepts: Token & Cost Management](https://fewshotacademy.com/docs/advanced-concepts/token-cost-management). Two experiments in one script: a growing support conversation sent both in full and trimmed down to see how many tokens that saves, then the same logic puzzle sent to a small model and a large model from the same provider, to see what the extra cost actually buys.

## Before you start

This lab assumes Foundations, at least [Chapter 3: Prompting 101](https://fewshotacademy.com/docs/foundations/prompting-101), and pairs well with [Advanced Concepts: Prompt Engineering](https://fewshotacademy.com/docs/advanced-concepts/prompt-engineering).

This lab is chat-only, no embeddings involved, so it supports all three providers: Ollama, OpenAI, and Anthropic. Part two needs two models per provider, one small and one large, see the pull step below if you're using Ollama.

## Steps

1. **Move into the lab folder.** If you already cloned the repo for an earlier lab, just `cd` into this one:

   ```bash
   cd academy/labs/advanced-concepts/02-token-cost-management
   ```

   Otherwise, clone the repo first:

   ```bash
   git clone https://github.com/fewshot-works/academy.git
   cd academy/labs/advanced-concepts/02-token-cost-management
   ```

2. **If you're using Ollama, pull both models:**

   ```bash
   ollama pull llama3.2:1b
   ollama pull llama3.2
   ```

   `llama3.2:1b` stands in for the "small" model, `llama3.2` (the 3B version) stands in for the "large" one. Neither is large by hosted-API standards, this is about the relative difference, not absolute size.

3. **Set up your `.env`:**

   ```bash
   cp .env.example .env
   ```

   On Windows Command Prompt, `cp` isn't a built-in command, use `copy` instead:

   ```cmd
   copy .env.example .env
   ```

   `PROVIDER=ollama` is already set. If you're using OpenAI or Anthropic instead, open `.env`, set `PROVIDER` accordingly, and add the matching API key.

4. **Run the script:**

   ```bash
   uv run token_cost_management.py
   ```

## What the script is actually doing

Open `token_cost_management.py` and follow along.

**Part one, context trimming**, builds an eight-turn support conversation about a fictional app, TaskFlow. Early on, the user mentions they're on the Pro plan; several turns later they ask a question that depends on remembering that. The script sends that question two ways:

1. **Full history**: the system prompt, all eight turns, and the new question, exactly what you'd get if you just kept appending every message to the list forever.
2. **Trimmed history**: the older turns folded into one summary sentence added to the system prompt, plus only the most recent exchange, plus the new question.

It prints the token count for both (using `tiktoken`, OpenAI's tokenizer, as a consistent ruler across all three providers, not an exact count for Ollama or Anthropic) and both responses, so you can check that the trimmed version, with a fraction of the tokens, still has enough information to answer correctly.

**Part two, model right-sizing**, runs two kinds of tasks:

1. **Easy**: four short messages, each classified in one word (billing, bug, feature, or other), sent only to the small model.
2. **Hard**: a three-person logic puzzle with several constraints, sent to both the small model and the large model, so you can compare the two answers directly.

## Troubleshooting

- **`ConnectionError` with `PROVIDER=ollama`**: make sure Ollama is running (`ollama serve`), and that you've pulled both `llama3.2:1b` and `llama3.2`.
- **`AuthenticationError` with `PROVIDER=openai` or `PROVIDER=anthropic`**: check that your key in `.env` has no extra quotes or spaces, and that the line isn't still commented out with `#`.
- **The trimmed history answers wrong**: that's not a bug, it's the point. If you trim too aggressively and drop the one fact that mattered, the model has no way to recover it, that's the real risk this experiment is meant to surface, not just a hypothetical.
- **The small model gets the logic puzzle right too**: small models don't fail every hard task, especially a puzzle this size. Try a puzzle with a few more constraints if you want to see the gap open up further.
