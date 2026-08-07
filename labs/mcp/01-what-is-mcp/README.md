# Lab 1: What Is MCP

Companion lab for [MCP Chapter 1: What Is MCP](https://fewshotacademy.com/docs/mcp/what-is-mcp). Every tool you've built so far, Intermediate Chapter 5's calculator, Chapter 6's Wikipedia search, was a Python function you wrote yourself, inside your own script. This lab's tool is different: it comes from `mcp-server-fetch`, an MCP server built by someone else, whose source code this script has never seen. The agent just asks the server what it can do, and calls it.

## Before you start

You should already have done [Intermediate Chapter 6: Your First Agent](https://fewshotacademy.com/docs/intermediate/06-your-first-agent), this lab reuses `create_agent` from there, just with a different source of tools.

This lab is chat-only, no embeddings involved, so it supports all three providers: Ollama, OpenAI, and Anthropic. It also needs `uv` itself (not just `uv run`), since the MCP server is launched with `uvx`, uv's tool-runner. If you installed `uv` to follow this curriculum, you already have `uvx`.

## Steps

1. **Move into the lab folder.** If you already cloned the repo for an earlier lab, just `cd` into this one:

   ```bash
   cd academy/labs/mcp/01-what-is-mcp
   ```

   Otherwise, clone the repo first:

   ```bash
   git clone https://github.com/fewshot-works/academy.git
   cd academy/labs/mcp/01-what-is-mcp
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

4. **Run the script:**

   ```bash
   uv run fetch_agent.py
   ```

   The first run downloads `mcp-server-fetch` via `uvx`, that only happens once, `uvx` caches it after that.

## What you should see

With `PROVIDER=ollama`:

```
Tools the fetch server offers: ['fetch']

Question: What is the page at https://example.com about? Answer in one sentence.
  -> calling fetch({'url': 'https://example.com'})
Answer: The page at https://example.com is a domain name used for demonstration purposes in Internet protocol documentation, and its content advises against using it in operational contexts without permission.
```

💡 A few honest notes on this real run:

- **The script never defines a `fetch` function.** `client.get_tools()` asks the running `mcp-server-fetch` process what it offers, and wraps whatever comes back as a LangChain tool. Compare that to Chapter 6's `@tool def search_wikipedia(...)`, that one you wrote by hand; this one you didn't.
- **`llama3.2` sometimes fumbles the extra parameters.** The `fetch` tool also accepts optional `max_length`, `start_index`, and `raw` arguments. During testing, `llama3.2` occasionally passed `start_index` as the string `'0'` instead of the integer `0`, and the server rejected the call with a real validation error, `"'0' is not of type 'integer'"`, instead of silently coercing it. That's a difference from your own hand-written tools: those accept whatever Python hands them, an MCP server enforces its declared schema strictly. If you see this on your run, rerun the script, hosted models (OpenAI, Anthropic) get the types right far more consistently than small local ones.
- **A version-skew workaround is baked into the script.** As of this writing, the latest `mcp-server-fetch` release imports a name that was renamed in the latest `mcp` package, so `uvx mcp-server-fetch` alone fails with an `ImportError`. The script's server config passes `--with mcp<2.0.0` to `uvx` to pin a compatible version. If a future `mcp-server-fetch` release fixes this upstream, that pin becomes unnecessary, but leaving it in doesn't hurt anything.

## What the script is actually doing

Open `fetch_agent.py` and follow along.

1. **`mcp_servers`** is a plain dict describing one server: run `uvx mcp-server-fetch` (with the version pin), talk to it over `stdio` (its standard input/output, piped between two local processes).
2. **`MultiServerMCPClient(mcp_servers)`** starts that server as a subprocess and speaks MCP to it. Its name says "multi", it works the same for one server as it does for several, Chapter 3 is where the "multi" part actually matters.
3. **`await client.get_tools()`** asks the server what tools it exposes and wraps each one as a LangChain tool, ready to hand to `create_agent` exactly like Chapter 6's hand-written `@tool` functions.
4. **`create_agent(model=model, tools=tools)`** is the same call as Chapter 6, the agent doesn't know or care that these tools came from a subprocess instead of a Python function in this file.
5. **Everything is `async`.** MCP servers communicate over a persistent connection, not a one-off function call, so talking to one is naturally asynchronous. That's why this script uses `asyncio.run(main())` instead of Chapter 6's plain top-to-bottom calls.

## Troubleshooting

- **`uvx: command not found`**: `uvx` ships with `uv`. If you can run `uv run` but not `uvx`, your `uv` install may be old, reinstall uv from [docs.astral.sh/uv](https://docs.astral.sh/uv/).
- **`ImportError: cannot import name 'McpError'`**: this is the version-skew bug described above. Make sure you're running the script as-is, the `--with mcp<2.0.0` pin in `mcp_servers` is the fix.
- **`ConnectionError` with `PROVIDER=ollama`**: make sure Ollama is running (`ollama serve`), and that you've pulled `llama3.2`.
- **`AuthenticationError` with `PROVIDER=openai` or `PROVIDER=anthropic`**: check that your key in `.env` has no extra quotes or spaces, and that the line isn't still commented out with `#`.
- **The answer says it couldn't fetch the page, even though the tool call above it succeeded**: this is the same kind of small-model quirk Intermediate Chapter 5 documented, `llama3.2` occasionally misreads a tool's result even when the tool itself worked. Rerun the script, or switch `PROVIDER` to a hosted model.
