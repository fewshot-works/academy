# Lab: Chaos Engineering (Fault Injection)

Companion lab for [Advanced Concepts: Chaos Engineering](https://fewshotacademy.com/docs/advanced-concepts/chaos-engineering). Fernwood Coffee Co.'s support assistant is asked the same question twice: what's the status of order #4521, and how much was it for? Both times, a simulated flaky order-lookup service corrupts the first response. The exact same question is run twice, changing only the tool: a naive tool that trusts whatever comes back, and a guarded tool that checks the response before trusting it.

## Before you start

This lab assumes you've read at least [Advanced Concepts: RBAC](https://fewshotacademy.com/docs/advanced-concepts/rbac) or another earlier Advanced Concepts chapter, so the `create_agent` / `@tool` pattern is familiar. This lab doesn't extend RBAC directly, it's a different angle: instead of guarding *who* can call a tool, it guards *what a tool call actually returns*.

This lab is chat-only, no embeddings involved, so it supports all three providers: Ollama, OpenAI, and Anthropic.

## Steps

1. **Move into the lab folder.** If you already cloned the repo for an earlier lab, just `cd` into this one:

   ```bash
   cd academy/labs/advanced-concepts/06-chaos-engineering
   ```

   Otherwise, clone the repo first:

   ```bash
   git clone https://github.com/fewshot-works/academy.git
   cd academy/labs/advanced-concepts/06-chaos-engineering
   ```

2. **If you're using Ollama, make sure the model is pulled:**

   ```bash
   ollama pull qwen2.5:3b
   ```

   Same small model earlier chapters used, so the fault injector's behavior, not the model quietly reasoning its way around a bad response, is what's on display.

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
   uv run chaos_engineering.py
   ```

## What the script is actually doing

Open `chaos_engineering.py` and follow along.

1. **`ORDERS`** holds one fake order, #4521, a $95 item marked delivered with damaged packaging.
2. **`_real_lookup(order_id)`** is the order-lookup service working correctly, no faults involved. It builds a plain string with the item, amount, and status.
3. **`flaky_lookup(order_id, tool_name)`** wraps `_real_lookup` and simulates a flaky service: the *first* call for a given tool comes back truncated to 40 characters, cutting the response off mid-word, before the dollar amount ever appears. Every call after the first for that same tool comes back clean, simulating a transient blip rather than a permanently broken service.
4. **`look_up_order_naive(order_id)`** calls `flaky_lookup` and returns exactly what comes back, corrupted or not. No check, no retry.
5. **`look_up_order_guarded(order_id)`** calls the same `flaky_lookup`, but checks the result first: a real order line always contains a dollar amount (`"$"`) and a status (`"status:"`). If either is missing, the response is incomplete, so the guard retries once before giving up and returning a plain "temporarily unavailable" message instead of passing broken data along.
6. **`QUESTION`** is identical in both parts: what's the status of order #4521, and how much was it for?
7. **PART ONE** runs the question against `look_up_order_naive`. The tool's one and only call is the corrupted one, there's no second chance.
8. **PART TWO** runs the identical question against `look_up_order_guarded`. The first call is corrupted the same way, the guard notices, retries, and the second call comes back clean.

## What you should see

Real output from a run against `PROVIDER=ollama` (`qwen2.5:3b`). Model wording will vary between runs, but the shape holds: part one gets a truncated response and has to work with it, part two's guard catches the same truncation and retries before the model ever sees it.

```
============================================================
PART ONE: naive tool, first call comes back corrupted
============================================================

--- look_up_order_naive ---
  [fault injector] corrupting this response (simulated value fault)
  -> calling look_up_order_naive({'order_id': '4521'})
Answer: The order #4521 for the product "12oz Ethiopia Yirgacheffe" was placed and is currently under processing. The total amount for this order is not specified in the provided information, as only the product details were given. Please note that without additional context, I cannot determine the exact price of the order.

============================================================
PART TWO: guarded tool, same corrupted first call
============================================================

--- look_up_order_guarded ---
  [fault injector] corrupting this response (simulated value fault)
  [fault guard] response looks incomplete, retrying once
  -> calling look_up_order_guarded({'order_id': '4521'})
Answer: The order #4521 was for a set of 12oz Ethiopia Yirgacheffe coffee beans and it originally cost $95. The delivery status is that the items have been delivered to you, but the customer reported that the packaging was damaged upon arrival.
```

The tool itself never raised an error in part one, `look_up_order_naive` returned a plain string, same as always, just a truncated one. Nothing in the transcript says "this is broken." The model correctly noticed the dollar amount was missing and said so, but it also guessed a status ("currently under processing") that isn't what the real order says at all, the actual status is "delivered, customer reports damaged packaging." That's the fault this lab is about: no crash, no error message, just a quietly wrong answer next to an honest one, in the same sentence. Part two's guard caught the same truncated response before the model ever saw it, retried, and got the model a complete, accurate answer.

## Troubleshooting

- **`ConnectionError` with `PROVIDER=ollama`**: make sure Ollama is running (`ollama serve`), and that you've pulled `qwen2.5:3b`.
- **`AuthenticationError` with `PROVIDER=openai` or `PROVIDER=anthropic`**: check that your key in `.env` has no extra quotes or spaces, and that the line isn't still commented out with `#`.
- **Part one's model already says the right thing anyway**: this is a real model decision, not a scripted outcome, same caveat as every other agent lab in this course. A stronger model can sometimes reason its way to a caveated, mostly-honest answer even from truncated input. Check the printed `[fault injector]` and `Answer:` lines to see exactly what the tool returned versus what the model did with it.
- **You want to see the guard actually catch something**: check the printed `[fault guard] response looks incomplete, retrying once` line in part two, that's the guard doing its job before the model ever sees the bad data.
