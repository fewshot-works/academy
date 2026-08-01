# Lab: Prompt Engineering

Companion lab for [Advanced Concepts: Prompt Engineering](https://fewshot-works.github.io/academy/docs/advanced-concepts/prompt-engineering). One question about a fictional bike shop, asked through four increasingly deliberate prompts: bloated, trimmed, structured, and grounded, so you can watch the same source document produce a different answer at each stage.

## Before you start

This lab assumes Foundations, at least [Chapter 3: Prompting 101](https://fewshot-works.github.io/academy/docs/foundations/prompting-101).

This lab is chat-only, no embeddings involved, so it supports all three providers: Ollama, OpenAI, and Anthropic.

## Steps

1. **Move into the lab folder.** If you already cloned the repo for an earlier lab, just `cd` into this one:

   ```bash
   cd academy/labs/advanced-concepts/01-prompt-engineering
   ```

   Otherwise, clone the repo first:

   ```bash
   git clone https://github.com/fewshot-works/academy.git
   cd academy/labs/advanced-concepts/01-prompt-engineering
   ```

2. **If you're using Ollama, make sure the model is pulled:**

   ```bash
   ollama pull llama3.2
   ```

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
   uv run prompt_engineering.py
   ```

## What the script is actually doing

Open `prompt_engineering.py` and follow along. All four prompts ask about the same `SOURCE_DOC`, a short paragraph about a fictional bike shop that answers two things (store hours, return policy) and stays silent on a third (the head mechanic's years of experience). That silence is deliberate, it's the hallucination test: does a given prompt make the model admit it doesn't know, or does it guess a plausible-sounding number?

1. **Bloated**: a long, over-polite, filler-heavy prompt that buries the actual questions and explicitly invites a guess ("if you know or can guess, just give me your best sense").
2. **Trimmed**: the same three questions, stated once, plainly, with the filler removed.
3. **Structured**: the source is wrapped in `"""` delimiters and separated from the instructions, with the output format spelled out.
4. **Grounded**: same structure as #3, plus one explicit line: only use CONTEXT, and say "Not stated in the source" when it isn't there.

Each variant prints its word count (a rough stand-in for token count) alongside its response, so you can see the prompt getting shorter as it gets better, not longer.

## Troubleshooting

- **`ConnectionError` with `PROVIDER=ollama`**: make sure Ollama is running (`ollama serve`), and that you've pulled `llama3.2`.
- **`AuthenticationError` with `PROVIDER=openai` or `PROVIDER=anthropic`**: check that your key in `.env` has no extra quotes or spaces, and that the line isn't still commented out with `#`.
- **The bloated or trimmed prompt happens to answer question 3 correctly with "I don't know" on your run**: it's a real LLM call, not scripted, small models don't fail the same way every time. Run it a few times, the grounded prompt should be the one that reliably gets it right.
