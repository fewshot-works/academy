# Lab: AI Gateways (Multi-Provider Failover)

Companion lab for [Advanced Concepts: AI Gateways](https://fewshotacademy.com/docs/advanced-concepts/ai-gateways). TaskFlow's support assistant (the same fictional app from [Token & Cost Management](https://fewshotacademy.com/docs/advanced-concepts/token-cost-management)) needs to answer a customer question, and today its primary AI provider is having a (simulated) outage. The script runs the same question two ways: once as a direct call to the primary provider with no fallback, and once through a tiny hand-rolled gateway function that catches the failure and automatically retries a second provider.

## Before you start

This lab assumes you've read at least [Advanced Concepts: Token & Cost Management](https://fewshotacademy.com/docs/advanced-concepts/token-cost-management) or another earlier Advanced Concepts chapter.

This lab is different from every other lab in this course: it names **two** distinct backends, not one. The whole lesson is routing across providers, so a single `PROVIDER` value wouldn't have anywhere to fail over to. `PRIMARY_PROVIDER` and `FALLBACK_PROVIDER` each accept `ollama`, `openai`, or `anthropic`. The fault injector simulates `PRIMARY_PROVIDER` as down before touching the network, so only `FALLBACK_PROVIDER` needs to be running and authenticated. It defaults to `ollama` since it's free and most labs in this course already assume it's installed.

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

   `PRIMARY_PROVIDER=openai` and `FALLBACK_PROVIDER=ollama` are already set. You do not need an OpenAI key for this run because the simulated primary fails before making a network call. If you use OpenAI or Anthropic as the fallback, change `FALLBACK_PROVIDER` and add that provider's key.

4. **Run the script:**

   ```bash
   uv run ai_gateways.py
   ```

## What the script is actually doing

Open `ai_gateways.py` and follow along.

1. **`call_provider(provider, messages)`** is one real call to one real provider, OpenAI, Anthropic, or a local Ollama model, all behind the same `messages` interface. Each call has a 30-second deadline. Temporary connection, timeout, rate-limit, and server errors become `RetryableProviderError`; authentication mistakes, invalid requests, unknown providers, and code defects do not.
2. **`flaky_call_provider(provider, messages)`** wraps that with a fault injector: any call to `PRIMARY_PROVIDER` raises a simulated `RetryableProviderError` before it ever reaches the network. Every call to any *other* provider goes through untouched. This stands in for a real provider outage, deterministically, so the lab doesn't depend on an actual outage happening while you run it.
3. **`call_with_failover(messages, providers)`** is the gateway itself, in about ten lines: try each provider in the given order, catch only a retryable provider failure, move to the next one, and return which provider actually answered.
4. **PART ONE** calls `flaky_call_provider(PRIMARY_PROVIDER, ...)` directly, no gateway involved. Its error handler prints the failure but never tries another provider, so the request still fails.
5. **PART TWO** calls `call_with_failover(MESSAGES, [PRIMARY_PROVIDER, FALLBACK_PROVIDER])`. The same simulated failure happens on the first attempt, but this time something catches it and retries the fallback, which succeeds.

## What you should see

The fault injector and gateway routing lines are deterministic, code-generated, not model output, so they'll look exactly like this regardless of which providers you configure. The actual reply text is real model output and will vary:

```
============================================================
PART ONE: no gateway, direct call to openai (simulated outage)
============================================================
  [fault injector] simulating outage for openai (connection refused)

Request failed: simulated outage: openai is not responding
No fallback exists here. The support widget shows an error until the provider recovers.

============================================================
PART TWO: with a gateway, openai -> ollama on failure
============================================================
  [fault injector] simulating outage for openai (connection refused)
  [gateway] openai failed (simulated outage: openai is not responding), trying next provider

(answered by: ollama)
To export your TaskFlow tasks to a CSV file, navigate to the "Reports" section of your TaskFlow dashboard and click on "Export", then select "CSV" as the file format. Follow the prompts to choose which columns you'd like to include in the exported file.
```

Part one fails outright, there's nothing downstream of the direct call to catch it. Part two hits the identical simulated failure but never surfaces it to the caller, `call_with_failover` already moved on to `FALLBACK_PROVIDER` before returning.

The error boundary is deliberate. A temporary outage is a reason to try a compatible fallback. A bad API key, malformed request, unknown provider name, or bug in your own response handling is a reason to stop and fix the problem, not hide it by sending the request somewhere else. The deadline matters too: without one, a provider that hangs instead of returning an error can prevent the gateway from ever reaching its fallback.

## Troubleshooting

- **`All providers failed` in part two**: check that `PRIMARY_PROVIDER` and `FALLBACK_PROVIDER` aren't set to the same value. The fault injector simulates *whichever provider matches `PRIMARY_PROVIDER`* as down, so if both variables point at the same provider, the "fallback" attempt fails the exact same way the primary did. A fallback that points to the same backend provides no redundancy.
- **`All providers failed` with `FALLBACK_PROVIDER=ollama`**: make sure Ollama is running (`ollama serve`) and that you've pulled `llama3.2`. The last error in the traceback contains the underlying connection or timeout details.
- **`AuthenticationError` with `FALLBACK_PROVIDER=openai` or `FALLBACK_PROVIDER=anthropic`**: check that your key in `.env` has no extra quotes or spaces, and that the line isn't still commented out with `#`. Authentication failures stop immediately instead of triggering failover because another provider cannot repair a bad credential.
- **You want to see it fail all the way through**: pass two providers that are both `PRIMARY_PROVIDER` to `call_with_failover` (or just set `FALLBACK_PROVIDER` equal to `PRIMARY_PROVIDER`) to see the "All providers failed" error the gateway raises when it genuinely runs out of options.
