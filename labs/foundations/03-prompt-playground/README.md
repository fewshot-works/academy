# Lab 3: Prompt Playground

Companion lab for [Chapter 3: Prompting 101](https://fewshot-works.github.io/zero-to-agent/docs/foundations/prompting-101). You'll ask an AI model to classify the same product review three different ways (zero-shot, few-shot, and with a system prompt) and compare the answers.

## Before you start

You should have already completed [Lab 2](../02-first-api-call) at least once, so Ollama or your API key is already working. If you're reusing your cloned repo from that lab, you don't need to clone again.

## Steps

1. **Move into this lab folder.** If you already cloned the repo for an earlier lab, just `cd` into this one:

   ```bash
   cd zero-to-agent/labs/foundations/03-prompt-playground
   ```

   Otherwise, clone the repo first:

   ```bash
   git clone https://github.com/fewshot-works/zero-to-agent.git
   cd zero-to-agent/labs/foundations/03-prompt-playground
   ```

   Don't know git yet? [Download the Foundations labs as a zip](https://fewshot-works.github.io/zero-to-agent/downloads/zero-to-agent-labs-foundations.zip) instead, unzip it, and open `labs/foundations/03-prompt-playground` in your terminal.

2. **Set up your `.env` file:**

   ```bash
   cp .env.example .env
   ```

   By default `PROVIDER=ollama`. Leave it as-is to use the free local model, or switch it to `openai`/`anthropic` and fill in your key, same as Lab 2.

3. **Make sure Ollama is running** (skip if you're using `openai` or `anthropic`):

   ```bash
   ollama serve
   ```

4. **Run the script:**

   ```bash
   uv run prompt_playground.py
   ```

## What you should see

```
Review to classify: "The battery died after two days and support never responded."

--- Zero-shot ---
This review expresses negative sentiment. The customer is unhappy about the battery failing quickly and receiving no support response.

--- Few-shot ---
negative

--- System prompt ---
negative
```

Zero-shot tends to ramble because you never told the model what shape you wanted the answer in. Few-shot and the system prompt both land on a clean one-word answer, but for different reasons: few-shot copies the pattern of the examples you showed it, while the system prompt is a standing rule the model was told to follow.

## What the script is actually doing

Open `prompt_playground.py` and follow along:

1. It defines one small helper, `ask(user_message, system=None)`, that sends a message to whichever provider you picked in `.env` and hands back the plain-text reply. This exists so the zero-shot, few-shot, and system-prompt sections below it don't have to repeat the same provider if/elif logic three separate times.
2. **Zero-shot** calls `ask()` with just the question, nothing else.
3. **Few-shot** calls `ask()` with two worked examples typed directly into the message text, followed by the real review. The model pattern-matches the format of those examples.
4. **System prompt** calls `ask()` with the `system` argument set, which each provider treats differently under the hood:
   - Ollama and OpenAI accept a `system` role inside the same `messages` list as the user's question.
   - Anthropic takes `system` as its own separate argument, outside of `messages`.

## Troubleshooting

- **`ConnectionError` with `PROVIDER=ollama`**: Ollama isn't running. Run `ollama serve` in another terminal, or reopen the Ollama app.
- **`AuthenticationError` with `openai` or `anthropic`**: double check your key in `.env` has no extra quotes or spaces, and the line isn't still commented out with a `#`.
- **Answers look identical across all three sections**: some models are consistent enough that zero-shot happens to match the others on this particular review. Try editing the `review` variable near the top of the script to a messier, more ambiguous review and rerun.
