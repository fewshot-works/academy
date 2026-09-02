# Lab: AI Gateways (Multi-Provider Failover)

Companion lab for [Advanced Concepts: AI Gateways](https://fewshotacademy.com/docs/advanced-concepts/ai-gateways). TaskFlow's support assistant (the same fictional app from [Token & Cost Management](https://fewshotacademy.com/docs/advanced-concepts/token-cost-management)) needs to answer a customer question, and today its primary AI provider is having a (simulated) outage. The script runs the same question two ways: once as a direct call to the primary provider with no fallback, and once through a tiny hand-rolled gateway function that catches the failure and automatically retries a second provider.

## Before you start

This lab assumes you've read at least [Advanced Concepts: Token & Cost Management](https://fewshotacademy.com/docs/advanced-concepts/token-cost-management) or another earlier Advanced Concepts chapter.

This lab is different from every other lab in this course: it needs **two** backends configured, not one. The whole lesson is routing across providers, so a single `PROVIDER` value wouldn't have anywhere to fail over to. `PRIMARY_PROVIDER` and `FALLBACK_PROVIDER` each accept `ollama`, `openai`, or `anthropic`, and the fault injector always simulates `PRIMARY_PROVIDER` as down, regardless of which one you pick. `FALLBACK_PROVIDER` defaults to `ollama` since it's free and most labs in this course already assume it's installed.

## Steps

1. **Move into the lab folder.** If you already cloned the repo for an earlier lab, just `cd` into this one:

   ```bash
   cd academy/labs/advanced-concepts/08-ai-gateways
   ```

   Otherwise, clone the repo first:

   ```bash
   git clone https://github.com/fewshot-works/academy.git
   cd academy/labs/advanced-concepts/08-ai-gateways
   ```

2. **If you're using Ollama as your fallback (the default), make sure the model is pulled:**

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

   `PRIMARY_PROVIDER=openai` and `FALLBACK_PROVIDER=ollama` are already set. Add your `OPENAI_API_KEY` for the primary. If you'd rather use Anthropic as the primary, or use two cloud providers instead of Ollama as the fallback, change `PRIMARY_PROVIDER` and/or `FALLBACK_PROVIDER` and add the matching key(s).

4. **Run the script:**

   ```bash
   uv run ai_gateways.py
   ```

## What the script is actually doing

Open `ai_gateways.py` and follow along.

1. **`call_provider(provider, messages)`** is one real call to one real provider, OpenAI, Anthropic, or a local Ollama model, all accepting the same `messages` shape. This is the "one interface" half of what a gateway buys you: your code doesn't change shape depending on which provider answers.
2. **`flaky_call_provider(provider, messages)`** wraps that with a fault injector: any call to `PRIMARY_PROVIDER` raises a simulated `ConnectionError` before it ever reaches the network. Every call to any *other* provider goes through untouched. This stands in for a real provider outage, deterministically, so the lab doesn't depend on an actual outage happening while you run it.
3. **`call_with_failover(messages, providers)`** is the gateway itself, in about ten lines: try each provider in the given order, catch a failure, move to the next one, and return which provider actually answered.
4. **PART ONE** calls `flaky_call_provider(PRIMARY_PROVIDER, ...)` directly, no gateway involved. The simulated outage isn't caught by anything, so the request just fails.
5. **PART TWO** calls `call_with_failover(MESSAGES, [PRIMARY_PROVIDER, FALLBACK_PROVIDER])`. The same simulated failure happens on the first attempt, but this time something catches it and retries the fallback, which succeeds.

## What you should see

The fault injector and gateway routing lines are deterministic, code-generated, not model output, so they'll look exactly like this regardless of which providers you configure. The actual reply text is real model output and will vary:

```
============================================================
PART ONE: no gateway, direct call to openai (today's outage)
============================================================
  [fault injector] simulating a openai outage (connection refused)

Request failed: simulated outage: openai is not responding
No fallback exists here. The support widget shows an error until the provider recovers.

============================================================
PART TWO: with a gateway, openai -> ollama on failure
============================================================
  [fault injector] simulating a openai outage (connection refused)
  [gateway] openai failed (simulated outage: openai is not responding), trying next provider

(answered by: ollama)
<the fallback model's actual answer about exporting TaskFlow tasks to CSV>
```

Part one fails outright, there's nothing downstream of the direct call to catch it. Part two hits the identical simulated failure but never surfaces it to the caller, `call_with_failover` already moved on to `FALLBACK_PROVIDER` before returning.

## Troubleshooting

- **`ConnectionError` in part two as well**: check that `PRIMARY_PROVIDER` and `FALLBACK_PROVIDER` aren't set to the same value. The fault injector simulates *whichever provider matches `PRIMARY_PROVIDER`* as down, so if both variables point at the same provider, the "fallback" attempt fails the exact same way the primary did, there's no real redundancy to fall back on. That's not a bug, it's the same lesson production systems learn the hard way: a fallback that's secretly the same backend as your primary isn't a fallback.
- **`ConnectionError` with `FALLBACK_PROVIDER=ollama`**: make sure Ollama is running (`ollama serve`) and that you've pulled `llama3.2`.
- **`AuthenticationError` with a provider set to `openai` or `anthropic`**: check that your key in `.env` has no extra quotes or spaces, and that the line isn't still commented out with `#`.
- **You want to see it fail all the way through**: pass two providers that are both `PRIMARY_PROVIDER` to `call_with_failover` (or just set `FALLBACK_PROVIDER` equal to `PRIMARY_PROVIDER`) to see the "All providers failed" error the gateway raises when it genuinely runs out of options.
