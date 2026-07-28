# Lab 1: Multi-Agent Patterns

Companion lab for [Advanced Chapter 1: Multi-Agent Patterns](https://fewshot-works.github.io/academy/docs/advanced/01-multi-agent-patterns). Instead of one agent juggling every tool itself, this lab splits the work across three agents: a `research_agent` with only `search_wikipedia`, a `math_agent` with only `calculator`, and a `supervisor` that has no tools of its own except those two agents, wrapped as tools it can call.

## Before you start

You should already have done Intermediate [Chapter 6: Your First Agent](../../intermediate/06-your-first-agent/) and [Chapter 7: Memory](../../intermediate/07-memory/) — this lab reuses `calculator` and `search_wikipedia` unchanged from those chapters, plus the checkpointer/`thread_id` pattern from Chapter 7.

This lab is chat-only, no embeddings involved, so it supports all three providers: Ollama, OpenAI, and Anthropic.

## Steps

1. **Move into the lab folder.** If you already cloned the repo for an earlier lab, just `cd` into this one:

   ```bash
   cd academy/labs/advanced/01-multi-agent-patterns
   ```

   Otherwise, clone the repo first:

   ```bash
   git clone https://github.com/fewshot-works/academy.git
   cd academy/labs/advanced/01-multi-agent-patterns
   ```

2. **If you're using Ollama, make sure the model is pulled:**

   ```bash
   ollama pull llama3.2
   ```

3. **Set up your `.env`:**

   ```bash
   cp .env.example .env
   ```

   `PROVIDER=ollama` is already set. If you're using OpenAI or Anthropic instead, open `.env`, set `PROVIDER` accordingly, and add the matching API key.

4. **Run it:**

   ```bash
   uv run multi_agent.py
   ```

## What you should see

With `PROVIDER=ollama`:

```
You: What year did construction of the Eiffel Tower finish?
  supervisor -> calling ask_research_agent({'expression': 'null', 'object': 'null', 'topic': {'type': 'string'}})
Supervisor: The construction of the Eiffel Tower finished in 1889. It was built for the World's Fair, held in Paris that year, and was officially opened on March 31, 1889.

You: What's 18 * 7 + 4?
  supervisor -> calling ask_math_agent({'expression': '18 * 7 + 4'})
Supervisor: The result of the calculation 18 * 7 + 4 is 130.

You: What's 15% of the year the Eiffel Tower finished construction?
  supervisor -> calling ask_math_agent({'expression': '0.15 * 1889'})
Supervisor: 15% of the year the Eiffel Tower finished construction (which was 1889) is approximately 283.35.
```

💡 A few honest notes on this real run:

- **Every answer above is correct**, but look closely at the first tool call: the arguments the supervisor sent to `ask_research_agent` are a mess, an extra `expression` and `object` field that don't belong, and `topic` wrapped in a type descriptor instead of the plain string you'd expect. That's `llama3.2` (a 3-billion-parameter model) visibly struggling with the harder part of this pattern — filling in a tool's arguments gets noticeably less reliable once that tool's job is "hand this off to another agent" instead of "run this one calculation."
- **The math delegation is clean every time**, because an arithmetic expression is a much narrower thing to get right than an open-ended research topic. Run the script a few times yourself and you'll see the research call's argument shape change each run, while the final answer stays correct.
- **The third answer never re-asks what year the tower finished.** The supervisor pulls `1889` straight out of thread history, thanks to the same checkpointer mechanism from Chapter 7, and hands only the derived expression, `0.15 * 1889`, to the math agent. That's why the lab asks this as a separate turn instead of one combined question, it turns one hard single-shot coordination problem into two easy ones.

With `PROVIDER=openai` or `PROVIDER=anthropic`, the script doesn't change beyond the `model` string, and you should see the same three correct answers with cleaner tool-call arguments throughout.

## What the script is actually doing

Open `multi_agent.py`.

1. **The same two tools from Chapters 5, 6, 7, and 9**, `calculator` and `search_wikipedia`, completely unchanged.
2. **Two specialist agents, each with exactly one tool**: `research_agent = create_agent(model=model, tools=[search_wikipedia])` and `math_agent = create_agent(model=model, tools=[calculator])`. Neither has a checkpointer, they don't need their own memory, they just do one job when asked.
3. **Each specialist agent gets wrapped as a tool**: `ask_research_agent(topic: str)` and `ask_math_agent(expression: str)` are plain `@tool`-decorated functions whose bodies call `.invoke()` on a specialist agent and return its last message's content. This is the whole trick of the "agent-as-tool" pattern, from the supervisor's point of view, delegating to another agent looks exactly like calling any other tool.
4. **The supervisor**: `create_agent(model=model, tools=[ask_research_agent, ask_math_agent], checkpointer=InMemorySaver())`. No tools of its own besides the two specialist wrappers. The checkpointer is Chapter 7's, unchanged, it's what lets the third question reuse the first question's answer.
5. **`send(message)`** calls `supervisor.invoke()` with the new message and a fixed `thread_id`, prints any tool calls found in the last three messages of the result (so you can see exactly what arguments the supervisor sent), then prints the final answer.
6. **Three scripted `send()` calls**: a pure research question, a pure math question, and a follow-up that only works if the supervisor remembers the research answer from turn one.

## Troubleshooting

- **`ConnectionError` with `PROVIDER=ollama`**: make sure Ollama is running (`ollama serve`), and that you've pulled `llama3.2`.
- **`AuthenticationError` with `PROVIDER=openai` or `PROVIDER=anthropic`**: check that your key in `.env` has no extra quotes or spaces, and that the line isn't still commented out with `#`.
- **The research tool-call arguments look broken/malformed**: that's expected with `llama3.2`, see the notes above, not a bug in the lab. The final answer is still correct.
- **The third question gets the wrong year, or asks you to repeat it**: if you're re-running the script with a modified `thread_id` or a fresh `InMemorySaver()` between questions, the checkpointer has nothing to recall from. Run the script as-is, top to bottom, in one process.
- **`ImportError` mentioning `langgraph`**: `InMemorySaver` comes from `langgraph`, not a separate install; `uv run` should install everything automatically from `pyproject.toml`.
