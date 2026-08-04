# Lab 6: Your First Agent

Companion lab for [Intermediate Chapter 6: Your First Agent](https://fewshotacademy.com/docs/intermediate/06-your-first-agent). Same two tools, same four questions as [Chapter 5](../05-tool-use/), rebuilt with LangChain's `create_agent` instead of a hand-written loop, so you can compare the two directly.

## Before you start

You should already have done [Chapter 5: Tool Use](https://fewshotacademy.com/docs/intermediate/05-tool-use) — this lab reuses its exact `calculator` and `search_wikipedia` logic and its exact four example questions, just wired up differently.

This lab is chat-only, no embeddings involved, so it supports all three providers: Ollama, OpenAI, and Anthropic.

## Steps

1. **Move into the lab folder.** If you already cloned the repo for an earlier lab, just `cd` into this one:

   ```bash
   cd academy/labs/intermediate/06-your-first-agent
   ```

   Otherwise, clone the repo first:

   ```bash
   git clone https://github.com/fewshot-works/academy.git
   cd academy/labs/intermediate/06-your-first-agent
   ```

   Don't know git yet? [Download the Intermediate labs zip](https://fewshotacademy.com/downloads/academy-labs-intermediate.zip) instead, unzip it, and open `labs/intermediate/06-your-first-agent` in a terminal.

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
   uv run agent.py
   ```

## What you should see

With `PROVIDER=ollama`:

```
Question: What's 18 * 7 + 4?
  -> calling calculator({'expression': '18 * 7 + 4'})
Answer: The result of the calculation 18 * 7 + 4 is 130.

Question: What year did construction of the Eiffel Tower finish?
  -> calling search_wikipedia({'query': 'Eiffel Tower construction completion year'})
Answer: The construction of the Eiffel Tower finished in 1889. The tower was built for the World's Fair, held that year in Paris, and it officially opened on March 31, 1889.

Question: In one sentence, what's a good tip for staying focused while studying?
  -> calling search_wikipedia({'query': 'productivity tips while studying'})
Answer: Use a timer to block out dedicated study sessions with regular breaks to maintain focus and avoid burnout.

Question: What's 15% of 340, and what year did construction of the Eiffel Tower finish?
  -> calling calculator({'expression': '0.15 * 340'})
  -> calling search_wikipedia({'query': 'Eiffel Tower construction completion date'})
Answer: The answer to the original question is 51.0, which represents 15% of 340. As for the second part of the question, according to Wikipedia, the construction of the Eiffel Tower finished in 1889, marking its completion on March 31, 1889.
```

💡 A few honest notes on this real run:

- **`agent.py` is 123 lines. Chapter 5's `tool_use.py` is 270.** The gap is almost entirely the provider-branching logic: Chapter 5 wrote ~40 lines of message-shape handling per provider (120 lines total). Here, switching providers is 3 lines, an `if/elif` that only picks a model string. `create_agent` handles the rest, whichever provider it is.
- **No `MAX_STEPS` loop, no `call_tool()` try/except, and it still didn't run away or crash.** `create_agent` has its own internal step limit (LangGraph's default `recursion_limit`, 25 by default) and its own handling of a tool call that errors out. We didn't write either by hand this time.
- **Question 3 shows the same tool-happy quirk as Chapter 5, but it's not identical run to run.** "What's a good tip for staying focused while studying?" needs no live lookup, it's an opinion question. Across different runs, `llama3.2` sometimes reaches for `search_wikipedia` (as shown above), sometimes for `calculator` with a nonsense expression it just makes up, and occasionally answers directly with no tool call at all. This is real model non-determinism, not something the framework changes, Chapter 5 hit the same quirk with its own hand-written loop.
- **Tool schemas came from Python type hints and docstrings, not a JSON dict we wrote.** Compare `calculator`'s `@tool`-decorated definition here to Chapter 5's hand-written `tool_schemas` list, same information, expressed once, in the function signature itself.

With `PROVIDER=openai` or `PROVIDER=anthropic`, the code doesn't change at all beyond the `model` string, that consistency is the other half of what the framework buys you.

## What the script is actually doing

Open `agent.py` and follow along.

1. **The same two tools as Chapter 5**, `calculator(expression)` and `search_wikipedia(query)`, unchanged internally, now decorated with `@tool` and given type hints and a docstring. LangChain reads those to build the same JSON schema Chapter 5 wrote out by hand.
2. **`model = "ollama:llama3.2"` (or `"openai:gpt-4o-mini"`, or `"anthropic:claude-haiku-4-5-20251001"`)**, picked by a 3-line `if/elif` on `PROVIDER`. This is the entire provider-switching logic, compare to Chapter 5's three ~40-line branches.
3. **`agent = create_agent(model=model, tools=[calculator, search_wikipedia])`** builds the whole reason/act/observe loop in one call: send the question, check for tool calls, run them, feed results back, repeat until there's a final answer.
4. **`run_with_tools(question)`** calls `agent.invoke({"messages": [...]})`, then walks the returned `messages` list to print which tools got called (mirroring Chapter 5's `-> calling ...` trace), and returns the last message's content as the answer.
5. **The same four example questions** run through `run_with_tools()`, unchanged from Chapter 5, so the two runs are directly comparable.

## Troubleshooting

- **`ConnectionError` with `PROVIDER=ollama`**: make sure Ollama is running (`ollama serve`), and that you've pulled `llama3.2`.
- **`AuthenticationError` with `PROVIDER=openai` or `PROVIDER=anthropic`**: check that your key in `.env` has no extra quotes or spaces, and that the line isn't still commented out with `#`.
- **`ImportError` mentioning `langchain_ollama`, `langchain_openai`, or `langchain_anthropic`**: these are separate packages from core `langchain`; `uv run` should install them automatically from `pyproject.toml`, but if you're not using `uv`, install them explicitly.
- **The model calls a different tool than you expected, or none at all**: this is a real LLM decision, not a fixed script, same as Chapter 5. Smaller local models especially will sometimes reach for a tool they don't need.
