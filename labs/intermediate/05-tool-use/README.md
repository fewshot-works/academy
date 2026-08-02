# Lab 5: Tool Use

Companion lab for [Intermediate Chapter 5: Tool Use](https://fewshot-works.github.io/academy/docs/intermediate/tool-use). Chapter 4 ended with a model *choosing* a tool but never running it. This lab closes that gap: two real tools (a calculator, a Wikipedia search), a loop that actually calls them, and results that feed back into the conversation.

## Before you start

You should already have done [Chapter 4: Prompt Patterns](https://fewshot-works.github.io/academy/docs/intermediate/04-prompt-patterns), specifically its function-calling section, this lab builds directly on it.

This lab is chat-only, no embeddings involved, so it supports all three providers: Ollama, OpenAI, and Anthropic.

## Steps

1. **Move into the lab folder.** If you already cloned the repo for an earlier lab, just `cd` into this one:

   ```bash
   cd academy/labs/intermediate/05-tool-use
   ```

   Otherwise, clone the repo first:

   ```bash
   git clone https://github.com/fewshot-works/academy.git
   cd academy/labs/intermediate/05-tool-use
   ```

   Don't know git yet? [Download the Intermediate labs zip](https://fewshot-works.github.io/academy/downloads/academy-labs-intermediate.zip) instead, unzip it, and open `labs/intermediate/05-tool-use` in a terminal.

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
   uv run tool_use.py
   ```

## What you should see

With `PROVIDER=ollama`:

```
Question: What's 18 * 7 + 4?
  -> calling calculator({'expression': '18 * 7 + 4'})
Answer: The answer to the expression "18 * 7 + 4" is 130.

Question: What year did construction of the Eiffel Tower finish?
  -> calling search_wikipedia({'query': 'Eiffel Tower completion year'})
Answer: Gustave Eiffel, who designed and built the tower. The construction of the Eiffel Tower finished in 1889.

Question: In one sentence, what's a good tip for staying focused while studying?
  -> calling search_wikipedia({'query': 'tips for staying focused while studying'})
  -> calling search_wikipedia({'query': 'tips for staying focused while studying'})
Answer: According to Wikipedia, a good tip for staying focused while studying is to set specific, achievable goals for each study session, break them down into smaller tasks, and take regular breaks to help maintain concentration and retain information.

Question: What's 15% of 340, and what year did construction of the Eiffel Tower finish?
  -> calling calculator({'expression': '0.15 * 340'})
  -> calling search_wikipedia({'query': 'Eiffel Tower completion date'})
Answer: So, to recap:

* 15% of 340 is 51.
* The construction of the Eiffel Tower finished in 1889.
```

💡 A few honest notes on this real run, not the tidy version:

- **Question 1 and 2 behave exactly as designed.** One calculator call, one Wikipedia call, each result folded correctly into the final answer.
- **Question 3 is the interesting one.** It doesn't need any live data, "what's a good tip for staying focused" is an opinion question, so the plan was for the model to just answer directly. Instead, `llama3.2` reached for `search_wikipedia` anyway, and called it twice with the same query. This isn't a bug in the loop, it's the model being a little tool-happy. The loop doesn't care either way: it keeps running until the model stops asking for tools, however many calls that takes, up to `MAX_STEPS`. If you see this on your run too, that's a real small-model quirk, not something broken.
- **Question 4 shows the loop handling two different tools in one question.** The model called `calculator` for the percentage and `search_wikipedia` for the Eiffel Tower date, then combined both results into one answer.
- **The Wikipedia tool needs a `User-Agent` header.** Wikipedia's API rejects requests without one (HTTP 403, "please set a user-agent and respect our robot policy"). The script sets a descriptive one. If you ever adapt `search_wikipedia()` for your own use, keep that header, or your requests will get blocked too.
- **`call_tool()` catches errors instead of crashing.** The model won't always call a tool with arguments that actually work, early testing of this exact lab had `llama3.2` try to hand the calculator a plain-English sentence instead of an arithmetic expression. Rather than letting that crash the whole script, the error gets caught and handed back to the model as the tool's result, the same way a real result would be. The model then sees the error and can try something else, or just answer without the tool.

With `PROVIDER=openai` or `PROVIDER=anthropic`, the shape is the same, only the request/response mechanics underneath differ (see below).

## What the script is actually doing

Open `tool_use.py` and follow along.

1. **Two real tools.** `calculator(expression)` evaluates basic arithmetic by parsing the expression into a syntax tree with Python's `ast` module and walking it, allowing only `+ - * / **` and unary minus. This is deliberately not `eval()`, the model's own generated text becomes the input here, and `eval()` would run anything, not just math. `search_wikipedia(query)` hits Wikipedia's free public search API and returns the top result's title and snippet, no API key needed.
2. **`call_tool(name, args)`** wraps the actual call to either tool in a `try/except`, so a badly-formed call from the model turns into an error string instead of a crash.
3. **`run_with_tools(question)`** is the loop, one `if/elif` branch per provider. Each branch keeps its own growing `messages` list and repeats, up to `MAX_STEPS` times: send the conversation so far (plus the two tool descriptions) to the model; if the reply has no tool call, that's the final answer; if it does, run the real tool via `call_tool()`, append the result to `messages` in whatever shape that provider expects, and loop back.
4. **The provider differences are real, not just cosmetic.** Ollama's tool arguments arrive as an already-parsed dict; OpenAI's arrive as a JSON string you have to `json.loads()`; Anthropic's tool calls are `tool_use` content blocks, and results have to go back as a **user**-role message (not assistant), the only one of the three that works this way.
5. **Four example questions** run through `run_with_tools()`: one that needs only the calculator, one that needs only Wikipedia, one that (in theory) needs neither, and one that needs both.

## Troubleshooting

- **`ConnectionError` with `PROVIDER=ollama`**: make sure Ollama is running (`ollama serve`), and that you've pulled `llama3.2`.
- **`AuthenticationError` with `PROVIDER=openai` or `PROVIDER=anthropic`**: check that your key in `.env` has no extra quotes or spaces, and that the line isn't still commented out with `#`.
- **The model calls a tool when you didn't expect it to (or vice versa)**: this is a real LLM decision, not a fixed script. Smaller local models especially will sometimes reach for a tool they don't need, or skip one they do. `call_tool()`'s error handling and `MAX_STEPS` exist specifically so the script survives that instead of crashing or looping forever.
- **`(gave up after too many tool calls)`**: the model called tools `MAX_STEPS` times in a row without ever giving a plain-text answer. Try rerunning, or raise `MAX_STEPS` if you want to give it more room.
