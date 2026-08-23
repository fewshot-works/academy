# Lab: Beyond MCP -- Agent2Agent (A2A)

Companion lab for [MCP Chapter 7: Beyond MCP -- Agent2Agent (A2A)](https://fewshotacademy.com/docs/mcp/a2a). Two small A2A servers, `calculator_agent.py` and `wikipedia_agent.py`, each publish an Agent Card describing one skill. `orchestrator.py` discovers both cards, wraps each remote agent as a LangChain tool, and lets a local `create_agent` decide which remote agent to delegate a question to.

## Before you start

This lab assumes [MCP Chapter 3: One Agent, Many Servers](https://fewshotacademy.com/docs/mcp/one-agent-many-servers) (the "one client routes between several servers" pattern this lab reuses, one level up) and [MCP Chapter 4: Transports & Deployment](https://fewshotacademy.com/docs/mcp/transports-and-deployment) (A2A agents here run the same way as that chapter's HTTP server: started on their own, not by the client).

This lab is chat-only, no embeddings involved, so it supports all three providers: Ollama, OpenAI, and Anthropic.

## Steps

1. **Move into the lab folder.** If you already cloned the repo for an earlier lab, just `cd` into this one:

   ```bash
   cd academy/labs/mcp/07-a2a
   ```

   Otherwise, clone the repo first:

   ```bash
   git clone https://github.com/fewshot-works/academy.git
   cd academy/labs/mcp/07-a2a
   ```

2. **If you're using Ollama, make sure it's running and `llama3.2` is pulled:**

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

4. **Start both A2A agents, each in its own terminal, and leave them running:**

   ```bash
   uv run python calculator_agent.py
   ```

   ```bash
   uv run python wikipedia_agent.py
   ```

   Same reason as Chapter 4's HTTP server lab: an A2A agent runs independently, it isn't started by whoever talks to it. This lab needs two of them up before the third script can discover either one.

5. **In a third terminal, run the orchestrator:**

   ```bash
   uv run python orchestrator.py
   ```

## What the script is actually doing

Open the three scripts and follow along.

1. **`calculator_agent.py`** and **`wikipedia_agent.py`** are near-identical A2A servers. Each defines an `AgentCard` (name, description, and one `AgentSkill`) and an `AgentExecutor` subclass that does the actual work: read the incoming message's text, compute or look up an answer, publish it as a task artifact, mark the task complete. The arithmetic logic is the same as Chapter 2's `calculator_server.py`; the Wikipedia lookup is the same as Intermediate Chapter 5's `search_wikipedia`. Only how each is exposed has changed, an A2A task instead of an MCP tool call.
2. **`orchestrator.py`** never starts either agent. It uses `A2ACardResolver` to fetch each one's Agent Card from its `/.well-known/agent-card.json` endpoint, the A2A equivalent of Chapter 1's "what do you offer?". Both discovered agents get wrapped as ordinary LangChain `@tool` functions, `delegate_to_calculator_agent` and `delegate_to_wikipedia_agent`, each one sending a task to its remote agent and returning the resulting artifact's text.
3. **`create_agent(model=model, tools=[...])`** is the exact same call every earlier chapter's lab made. The model doesn't know or care that these two tools proxy to other agents over A2A instead of calling a function directly, it just picks whichever tool's description fits the question.
4. The script asks two questions, one that should route to the Wikipedia agent, one that should route to the calculator agent, and prints which tool (and therefore which remote agent) got called for each.

## What you should see

Real output from a run against `PROVIDER=ollama` (`llama3.2`). Model wording will vary between runs, and, per the callout below, so will how much of it is actually true.

```
Discovered calculator agent: Calculator Agent -- skills: ['Calculator']
Discovered wikipedia agent: Wikipedia Agent -- skills: ['Wikipedia Lookup']

You: What is the Model Context Protocol?
  -> delegating via delegate_to_wikipedia_agent({'topic': 'Model Context Protocol'})
Agent: Introducing the Model Context Protocol (MCP)

The Model Context Protocol (MCP) is an open standard and open-source framework
designed to standardize the way artificial intelligence (AI) models share context
information. This protocol aims to facilitate more accurate and reliable
predictions by enabling AI models to exchange contextual information.
[... continues for several more paragraphs, most of it invented, see the callout below]

You: Use the calculator agent to figure out 23 * 19.
  -> delegating via delegate_to_calculator_agent({'expression': '23 * 19'})
Agent: The result of the calculation 23 * 19 is 437.
```

Two discovery calls up front, then each question routed to a different remote agent entirely, no MCP server involved in either exchange.

## Troubleshooting

- **`httpx.ConnectError` when the orchestrator starts**: one or both agent servers aren't running yet. Both `calculator_agent.py` and `wikipedia_agent.py` need to already be up before `orchestrator.py` can discover them, same requirement as Chapter 4's HTTP server.
- **`ConnectionError` with `PROVIDER=ollama`**: make sure Ollama is running (`ollama serve`), and that you've pulled `llama3.2`.
- **`AuthenticationError` with `PROVIDER=openai` or `PROVIDER=anthropic`**: check that your key in `.env` has no extra quotes or spaces, and that the line isn't still commented out with `#`.
- **The calculator question gets answered without ever calling the tool**: a real model decision, not a scripted outcome, same caveat as every other agent lab in this course. `orchestrator.py` lists `delegate_to_wikipedia_agent` before `delegate_to_calculator_agent` deliberately, `llama3.2` was noticeably more consistent about calling the second-listed tool correctly when only two tools were available; swapping the order made the calculator question far less reliable in testing.
- **The Wikipedia answer contains details that aren't true**: `search_wikipedia` itself returns one accurate sentence; `llama3.2` routinely pads that into several confident paragraphs of invented specifics, fake maintainers, fictional named components, features nobody built. That's fabrication on top of a correct tool result, not a paraphrase of it. `PROVIDER=openai` or `PROVIDER=anthropic` stick to the actual tool result far more reliably if you need the answer itself to be trustworthy.
