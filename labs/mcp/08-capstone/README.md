# Lab: MCP Capstone

Companion lab for [MCP Chapter 8: Capstone](https://fewshotacademy.com/docs/mcp/capstone). One agent, two MCP servers, `calculator_server.py` (your own, unchanged since Chapter 2) and `mcp-server-fetch` (public, unchanged since Chapter 1 and Chapter 3), with memory across the conversation and a guardrail on fetch, the one tool here that can actually go wrong.

## Before you start

This lab pulls together every earlier chapter in this track: `MultiServerMCPClient` wiring two servers at once ([Chapter 3](https://fewshotacademy.com/docs/mcp/one-agent-many-servers)), a checkpointer for memory (the same pattern as [Intermediate Chapter 7](https://fewshotacademy.com/docs/intermediate/07-memory)), and the client-side tool-call guard from [Chapter 6: MCP Security](https://fewshotacademy.com/docs/mcp/mcp-security), applied here to fetch instead of a fictional rogue server. If any of those feel unfamiliar, it's worth a quick revisit before starting.

This lab is chat-only, no embeddings involved, so it supports all three providers: Ollama, OpenAI, and Anthropic. It also needs `uv` itself (not just `uv run`), since the fetch server is launched with `uvx`, uv's tool-runner. If you installed `uv` to follow this curriculum, you already have `uvx`.

## Steps

1. **Move into the lab folder.** If you already cloned the repo for an earlier lab, just `cd` into this one:

   ```bash
   cd academy/labs/mcp/08-capstone
   ```

   Otherwise, clone the repo first:

   ```bash
   git clone https://github.com/fewshot-works/academy.git
   cd academy/labs/mcp/08-capstone
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
   uv run agent.py
   ```

   `agent.py` starts both `calculator_server.py` and `mcp-server-fetch` itself, no second terminal needed.

## What the script is actually doing

Open `agent.py` top to bottom.

1. **`mcp_servers`** wires up two servers, exactly like Chapter 3: `calculator`, your own, and `fetch`, the public reference server this track has used since Chapter 1.
2. **`ALLOWED_DOMAINS`** is a fixed set of domains fetch is allowed to reach. Nothing here tries to detect a malicious page, it just refuses any URL outside the list, the same idea as Chapter 6's `send_report` guard.
3. **`build_agent()`** connects the client, grabs the real `fetch` tool, and wraps it in `fetch_guarded`, a new `@tool` that checks the URL's domain before ever calling the real one. The final tool list swaps the real `fetch` out for `fetch_guarded`, the model never sees the unguarded version.
4. **The agent is built with a checkpointer**, `create_agent(model=..., tools=guarded_tools, checkpointer=InMemorySaver())`, same as Intermediate Chapter 7. `agent` and `thread_config` are both built once, at import time, and reused by every call.
5. **`send()`** only prints tool calls made during the current turn, same trimming trick as the Intermediate capstone, so the trace doesn't re-print old turns as the conversation grows.
6. **`run_conversation()`** asks four questions in order: a calculation, a Wikipedia fetch (inside the allowlist), a fetch to a domain outside the allowlist, and a memory check asking about the very first question.

## What you should see

Real output from a run against `PROVIDER=ollama` (`llama3.2`).

```
You: What's 15% of 340?
  calling calculator({'expression': '15 * 340 / 100'})
Agent: The answer to your question, "What's 15% of 340?" is 51.0.

You: Now look up https://en.wikipedia.org/wiki/Model_Context_Protocol and summarize it in one sentence.
  calling fetch_guarded({'url': 'https://en.wikipedia.org/wiki/Model_Context_Protocol'})
Agent: The Model Context Protocol (MCP) is an open standard and open-source framework introduced by Anthropic in November 2024 to standardize the way artificial intelligence systems integrate and share data with external tools, systems, and data sources.

You: Try fetching https://totally-unapproved-domain.example.net instead -- what happens?
  [tool-call guard] blocked fetch to unapproved domain: totally-unapproved-domain.example.net
  calling fetch_guarded({'url': 'https://totally-unapproved-domain.example.net'})
Agent: It appears that the Model Context Protocol (MCP) has a list of approved domains, and https://totally-unapproved-domain.example.net is not on this list. As a result, the protocol is unable to fetch content from this domain.

You: What was the first thing I asked you to calculate?
  calling calculator({'expression': '15 * 340 / 100'})
Agent: You initially asked me to calculate 15% of 340, and the result was 51.0.
```

The Wikipedia fetch went through, unchanged. The third question tried a domain outside the allowlist, and the guard blocked it before any network request left the building, the model still answered sensibly, just without the data it asked for. The last question could only be answered by remembering the very first message, and it was, correctly, even with two tool calls and a blocked one in between.

## Bonus: run it in a browser with Streamlit

Optional, not required to finish this lab. `streamlit_app.py` wraps the exact same agent (both servers, the guard, and memory unchanged) in a chat window instead of a scripted terminal conversation.

```bash
uv run streamlit run streamlit_app.py
```

This opens a browser tab at `http://localhost:8501`. Ask it to calculate something, fetch a Wikipedia page, or try a URL outside the allowlist, and watch the "Tools used" caption confirm what actually ran. Ctrl+C in the terminal to stop the server when you're done.

## Troubleshooting

- **`ConnectionError` with `PROVIDER=ollama`**: make sure Ollama is running (`ollama serve`), and that you've pulled `llama3.2`.
- **`AuthenticationError` with `PROVIDER=openai` or `PROVIDER=anthropic`**: check that your key in `.env` has no extra quotes or spaces, and that the line isn't still commented out with `#`.
- **`Failed to parse JSONRPC message` on the very first run**: harmless, this is `uv` installing the calculator server's own environment the first time it's launched as a subprocess, and its setup output briefly lands on the same channel as the MCP protocol messages. It clears up on the next run once the environment is cached, if it still happens, just run `uv run agent.py` again.
- **You want to see the guard actually block something**: check the printed `[tool-call guard] blocked fetch to unapproved domain: ...` line, that's the guard firing regardless of what convinced the model to try that URL.
- **You want to allow more domains**: edit `ALLOWED_DOMAINS` in `agent.py`. It's a plain Python set, add whatever's actually safe for your use case.
