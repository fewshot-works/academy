# Lab 5: Observability

Companion lab for [Advanced Chapter 5: Observability](https://fewshot-works.github.io/academy/docs/advanced/05-observability). Instruments a two-turn conversation with OpenLLMetry (`traceloop-sdk`, built on OpenTelemetry) so every model call becomes a span with the prompt, the completion, the token counts, and the timing, printed straight to your own console. No account, no API key, nothing leaves your machine.

## Before you start

This lab works with any provider. Ollama is free and local. Note: the Ollama branch here uses the official `ollama` Python package instead of the raw `requests` calls used in earlier labs, OpenLLMetry auto-instruments that specific package, so this is what actually turns Ollama calls into real LLM spans instead of generic HTTP traffic.

## Steps

1. **Move into the lab folder.** If you already cloned the repo for an earlier lab, just `cd` into this one:

   ```bash
   cd academy/labs/advanced/05-observability
   ```

   Otherwise, clone the repo first:

   ```bash
   git clone https://github.com/fewshot-works/academy.git
   cd academy/labs/advanced/05-observability
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

   If you're using Ollama, `PROVIDER=ollama` is already set, leave it as-is. No Traceloop account or API key is needed either way, traces go to your own console.

4. **Run the script:**

   ```bash
   uv run observability.py
   ```

## What you should see

With `PROVIDER=ollama`, the printed conversation looks like any other lab:

```
Q1: What's your best-selling drink?
A1: Our top pick is the Depot Latte - a rich and smooth blend of espresso, steamed milk, and hints of caramel. It's a fan favorite among our customers!

Q2: How many locations do you have?
A2: We have three locations, all within the state of Oregon.
```

But interleaved with that, before each answer prints, OpenLLMetry dumps the span for the call that just finished. Here's the real one for Q1, exactly as printed (only re-indented to fit the page):

```json
{
  "name": "ollama.chat",
  "context": {"trace_id": "0xefa38332e42104c3722bd589062abf4a", "span_id": "0x373826855cb62641"},
  "kind": "SpanKind.CLIENT",
  "parent_id": "0x589927e17f88e5d6",
  "start_time": "2026-07-28T04:01:04.831316Z",
  "end_time": "2026-07-28T04:01:05.231962Z",
  "status": {"status_code": "OK"},
  "attributes": {
    "gen_ai.request.model": "llama3.2",
    "gen_ai.prompt.0.role": "system",
    "gen_ai.prompt.0.content": "You are the support bot for Fernwood Coffee Co. ...",
    "gen_ai.prompt.1.role": "user",
    "gen_ai.prompt.1.content": "What's your best-selling drink?",
    "gen_ai.completion.0.role": "assistant",
    "gen_ai.completion.0.content": "Our top pick is the Depot Latte - a rich and smooth blend of espresso, steamed milk, and hints of caramel. It's a fan favorite among our customers!",
    "llm.usage.total_tokens": 123,
    "gen_ai.usage.input_tokens": 87,
    "gen_ai.usage.output_tokens": 36
  }
}
```

`end_time` minus `start_time` says this call took about 400ms. That single span already answers "what did we ask, what came back, how many tokens, how long" without adding a single `print()` to `ask()`.

Two more spans print around it. An `ask_model.task` span (`SpanKind.INTERNAL`) is the parent of the `ollama.chat` span above, its `span_id` is exactly the `parent_id` shown in that JSON. And a `support_conversation.workflow` span prints last, with `parent_id: null`, the root of the whole trace, and it's the parent of both `ask_model.task` spans in turn. Every span shares the same `trace_id`, that's what lets a UI (like the Jaeger bonus below) draw them as one nested tree instead of five unrelated events. The second question produces the identical shape: `ollama.chat` inside `ask_model.task` inside the same `support_conversation.workflow`.

💡 A real, unedited detail worth noticing: the injected facts say only "three locations, all in the same state," no state name. The model's answer says "all within the state of Oregon." That's the model adding a detail nobody gave it, and the trace is exactly how you'd catch it: `gen_ai.prompt.0.content` shows what it was told, `gen_ai.completion.0.content` shows what it said, side by side, in the same span. Without a trace, that mismatch is invisible, you'd just see a plausible-sounding answer.

## What the script is actually doing

Open `observability.py`.

1. **`Traceloop.init(app_name=..., exporter=ConsoleSpanExporter(), disable_batch=True)`** wires up OpenTelemetry with a console exporter instead of Traceloop's hosted backend, and turns off batching so each span prints the moment it finishes instead of waiting to accumulate a batch.
2. **`@task(name="ask_model")`** on `ask()` wraps every model call in a named span, this is what produces the `ask_model.task` span.
3. **`@workflow(name="support_conversation")`** on `run_conversation()` wraps the whole two-question exchange in one root span, `support_conversation.workflow`.
4. **Nothing inside `ask()` talks to OpenTelemetry directly.** The `ollama.chat` span appears because OpenLLMetry auto-instruments the `ollama` package at import time, call it normally and the span, prompt, completion, and token counts are captured for you.

## Bonus: a real trace UI

The console dump above is honest but not fun to read once you have more than a couple of calls. Pick whichever of these two fits what you have on hand, both send the exact same spans, only `Traceloop.init()` changes.

### Option A: local Jaeger (needs Docker)

[Jaeger](https://www.jaegertracing.io/) is a free, open-source trace UI, run it locally and OpenLLMetry can send traces there instead of (or alongside) the console.

1. **Start Jaeger:**

   ```bash
   docker run --rm -d --name jaeger -p 16686:16686 -p 4318:4318 jaegertracing/all-in-one:latest
   ```

   `16686` is the web UI, `4318` is Jaeger's built-in OTLP/HTTP receiver, recent Jaeger versions accept OpenTelemetry traces natively, no separate collector needed.

2. **Point the script at it.** Swap the `exporter=` line in `observability.py` for `api_endpoint=`:

   ```python
   Traceloop.init(app_name="fernwood-support-agent", api_endpoint="http://localhost:4318", disable_batch=True)
   ```

   Traceloop parses the scheme (`http://`) and appends the OTLP traces path itself, so this line alone is enough, no manual exporter import needed.

3. **Run the script again**, then open [http://localhost:16686](http://localhost:16686), pick `fernwood-support-agent` from the Service dropdown, and find the `support_conversation` trace. You'll see the same three-level nesting from the console output (`support_conversation` → `ask_model` → `ollama.chat`) as an actual waterfall diagram, with timing bars instead of raw JSON.

4. **Stop Jaeger when you're done:**

   ```bash
   docker stop jaeger
   ```

### Option B: LangSmith (free account, no Docker)

No local container to run, no port to remember to stop, at the cost of an account and your traces leaving your machine. [LangSmith](https://smith.langchain.com) is LangChain's hosted trace UI, and it accepts plain OTLP, so it works here even though this lab never imports LangChain.

1. **Get a free API key** at [smith.langchain.com](https://smith.langchain.com) -> Settings -> API Keys, and add it to `.env`:

   ```bash
   LANGSMITH_API_KEY=lsv2_...
   ```

2. **Point the script at LangSmith's OTLP endpoint**, with your key as a header:

   ```python
   Traceloop.init(
       app_name="fernwood-support-agent",
       api_endpoint="https://api.smith.langchain.com/otel",
       headers={"x-api-key": os.getenv("LANGSMITH_API_KEY")},
       disable_batch=True,
   )
   ```

3. **Run the script again**, then open [smith.langchain.com](https://smith.langchain.com), go to the default project (or the one set via a `Langsmith-Project` header, see LangSmith's OTel docs), and find the `support_conversation` trace, same nesting, same fields, hosted trace UI instead of a local one.

Same instrumentation either way, `@task`/`@workflow` and the `ollama.chat` auto-instrumentation don't know or care where `Traceloop.init()` sends the spans, that's the actual point of building on OpenTelemetry instead of a vendor SDK.

## Troubleshooting

- **`ConnectionError` with `PROVIDER=ollama`**: make sure Ollama is running (`ollama serve`) and you've pulled `llama3.2`.
- **No spans print at all**: check that `disable_batch=True` is still set, batching is the usual cause of "it ran but nothing showed up," spans are just waiting in a buffer.
- **Jaeger UI shows no service in the dropdown**: give it a few seconds after the script exits, and confirm the container is actually running with `docker ps`. If you changed the port mapping, update the `api_endpoint` in the script to match.
- **LangSmith shows no trace**: double check `LANGSMITH_API_KEY` is set in `.env` and the header key is exactly `x-api-key`, a missing or wrong key fails silently at the export step rather than crashing the script.
- **Your token counts or exact wording differ from the transcript above**: expected, this is a real, live model call, not a fixture. The nested-span shape and which fields are populated should stay the same.
