# Lab 2: Your First LLM Call

Companion lab for [Chapter 2: What Is a Large Language Model?](https://fewshot-works.github.io/academy/docs/foundations/what-is-an-llm). You'll send one prompt to an AI model and print what it generates.

## Before you start

You should have already completed [Chapter 0: Set Up Your Machine](https://fewshot-works.github.io/academy/docs/foundations/setup). This lab assumes uv is installed, and either Ollama or an API key are already working.

## Steps

1. **Get the code.** If you haven't already, clone the repo once. You'll reuse this same copy for every lab in the course:

   ```bash
   git clone https://github.com/fewshot-works/academy.git
   cd academy/labs/foundations/02-first-api-call
   ```

   Don't know git yet? [Download the Foundations labs as a zip](https://fewshot-works.github.io/academy/downloads/academy-labs-foundations.zip) instead, unzip it, and open `labs/foundations/02-first-api-call` in your terminal.

2. **Set up your `.env` file.** This is where you tell the script which AI provider to use, and it holds your API key if you're using one. It's never committed to git (it's in `.gitignore`), so your key stays on your machine only.

   ```bash
   cp .env.example .env
   ```

   Open `.env` in your editor. By default `PROVIDER=ollama`, leave it as-is if you're using the free local model from Chapter 0. If you'd rather use a hosted model, change it to `openai` or `anthropic` and uncomment/fill in the matching API key line.

3. **Make sure Ollama is running** (skip this step if you're using `openai` or `anthropic`). Ollama usually starts automatically after installation; if not, open a separate terminal and run:

   ```bash
   ollama serve
   ```

4. **Run the script:**

   ```bash
   uv run first_call.py
   ```

   The first time you run this in a lab folder, uv reads `pyproject.toml`, creates an isolated `.venv` just for this lab, and installs its dependencies, so you'll see a bit of extra output as that happens. Every run after that skips straight to executing the script.

## What you should see

```
Using provider: ollama
Prompt: In one short sentence, explain what a large language model is, as if you were talking to a curious 10 year old.
Waiting for a reply...

AI replied:
A large language model is like a computer that has read a huge number of books and websites, so it can guess what word should come next when you ask it a question!
```

Your exact wording will differ every time you run it, that's expected. The model is generating a new answer one token at a time (that's the whole subject of Chapter 2), not reciting a fixed, memorized sentence.

💡 A few honest notes on this real run:

- **Three runs against `llama3.2`, three different explanations**, and each one reached for its own comparison on the fly: a librarian who knows all the answers, a computer that's read a huge number of books, math that lets it learn from the internet. Nothing in the prompt asks for an analogy, that's just where the model's next-token guessing happened to land each time.
- **"One short sentence" held up every time**, even across those different phrasings. A 3-billion-parameter model getting a simple length instruction right consistently is worth noting here, because later labs (Chapter 4's prompt patterns, for instance) show this same small model struggling with more demanding instructions.

With `PROVIDER=openai` or `PROVIDER=anthropic`, expect the same one-sentence shape and similar run-to-run wording variation, just noticeably faster since there's no local GPU inference involved.

## What the script is actually doing

Open `first_call.py` and follow along:

1. `load_dotenv()` reads your `.env` file so `PROVIDER` (and your API key, if you set one) are available to the script.
2. It checks which `provider` you chose, and sends the exact same `prompt` to whichever one it is:
   - **Ollama:** a plain web request to `http://localhost:11434`, the local server Ollama runs on your machine. No API key, because nothing leaves your computer.
   - **OpenAI / Anthropic:** uses each company's official Python library to send your prompt to their servers, along with your API key so they know who's asking (and who to bill).
3. Whichever path ran, it prints the model's reply.

That's the entire lab: one prompt in, one generated reply out. Every later lab builds on this same basic shape: send some text to a model, get text back.

## Troubleshooting

- **`ConnectionError` with `PROVIDER=ollama`**: Ollama isn't running. Run `ollama serve` in another terminal, or just reopen the Ollama app.
- **`AuthenticationError` with `openai` or `anthropic`**: double check you pasted the full key into `.env`, with no extra quotes or spaces, and that the line isn't still commented out with a `#`.
- **`ModuleNotFoundError`**: make sure you ran the script with `uv run first_call.py`, not plain `python first_call.py`. `uv run` is what installs the dependencies and points Python at them; running the script directly skips that.
