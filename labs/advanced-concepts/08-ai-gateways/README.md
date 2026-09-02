# Lab: Build the Failover Boundary

This lab builds the smallest useful AI gateway for TaskFlow's fictional support assistant. You will see three different outcomes from the same application boundary:

1. A direct provider call fails and the feature has nowhere else to go.
2. A retryable provider failure moves to a compatible fallback.
3. A configuration error stops immediately because another provider cannot repair it.

The distinction between the last two cases is the lesson. Reliable routing is not "catch every exception and try something else." It is a policy decision about which failures another provider can plausibly solve.

## Before you start

The lab names two backends because it is specifically about routing across providers. `PRIMARY_PROVIDER` and `FALLBACK_PROVIDER` each accept `ollama`, `openai`, or `anthropic`.

The fault injector stops the primary before any network call. Only the fallback must be available and authenticated. The default fallback is Ollama, so the documented run is free and does not need an OpenAI key.

## Run the lab

1. **Move into the lab folder.** If you already cloned the repository:

   ```bash
   cd academy/labs/advanced-concepts/08-ai-gateways
   ```

   Otherwise, clone it first:

   ```bash
   git clone https://github.com/fewshot-works/academy.git
   cd academy/labs/advanced-concepts/08-ai-gateways
   ```

2. **Pull and start the default fallback:**

   ```bash
   ollama pull llama3.2
   ollama serve
   ```

   If Ollama is already running, you do not need to start a second server.

3. **Create your local configuration:**

   macOS or Linux:

   ```bash
   cp .env.example .env
   ```

   Windows PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

   Windows Command Prompt:

   ```cmd
   copy .env.example .env
   ```

   The defaults are `PRIMARY_PROVIDER=openai` and `FALLBACK_PROVIDER=ollama`. You do not need an OpenAI key because the simulated primary fails before it reaches the network. If you choose OpenAI or Anthropic as the fallback, change `FALLBACK_PROVIDER` and add that provider's API key.

4. **Run the exact lab command:**

   ```bash
   uv run ai_gateways.py
   ```

## Read the code in three layers

Open `ai_gateways.py` and find these functions:

### 1. Provider adapter: `call_provider`

The three APIs do not have identical SDK calls or response objects. `call_provider` hides those differences behind one local contract:

```python
reply = call_provider(provider, messages)
```

It also translates connection failures, timeouts, rate limits, and provider-side server failures into the shared `RetryableProviderError`. Authentication errors, invalid requests, unknown providers, and ordinary code defects remain non-retryable.

Every provider attempt has a 30-second timeout, and the cloud SDKs' internal retries are disabled. That keeps retry ownership in one place so the gateway, rather than an SDK hidden underneath it, decides when to move to the fallback.

### 2. Test faults: `flaky_call_provider` and `misconfigured_call_provider`

Waiting for a real outage would make a poor lab. These wrappers deterministically create two different failure classes:

- `flaky_call_provider` raises `RetryableProviderError`, similar to a connection failure.
- `misconfigured_call_provider` raises `ValueError`, standing in for a request or configuration problem that routing cannot solve.

Both fail before touching the primary provider. Calls to the fallback go through to the real adapter.

### 3. Routing policy: `call_with_failover`

The gateway accepts a provider-call function so the same routing policy can use the real adapter or a fault injector:

```python
def call_with_failover(messages, providers, provider_call=call_provider):
    last_error = None

    for provider in providers:
        try:
            reply = provider_call(provider, messages)
            return reply, provider
        except RetryableProviderError as error:
            print(f"  [gateway] {provider} failed ({error}), trying next provider")
            last_error = error

    raise RuntimeError(f"All providers failed. Last error: {last_error}")
```

Notice what is missing: `except Exception`. The loop catches only the failure class its routing policy recognizes as temporary. Every other exception leaves the gateway immediately.

## What you should see

The routing lines are deterministic. The fallback answer comes from a live model, so its wording will vary:

```text
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
To export your TaskFlow tasks to a CSV file, open the project, choose More actions, and then choose Export CSV.

============================================================
PART THREE: a non-retryable error stops immediately
============================================================
  [fault injector] simulating bad configuration for openai

Request stopped: simulated configuration error: invalid openai API key
Fallback was not called. Another provider cannot repair configuration.
```

Part two and part three differ by one exception type. That small code difference represents an important operational boundary. A temporary provider problem may justify another attempt elsewhere. A broken request should reach the developer instead of being hidden behind more calls, more latency, and possibly more charges.

## Experiments

Try these after the default run:

- Change the fallback to another live provider and confirm the application-facing call does not change.
- Temporarily change `except RetryableProviderError` to `except Exception`. Observe that part three now tries the fallback, then restore the narrow exception. Why would that make a bad API key harder to diagnose?
- Set both provider variables to the same value. Both retryable attempts hit the same simulated fault, demonstrating that two configuration entries are not necessarily two independent backends.

## Troubleshooting

- **`All providers failed` in part two:** Check that the two provider values differ. The outage injector rejects every call whose name matches `PRIMARY_PROVIDER`.
- **Ollama connection or timeout error:** Make sure `ollama serve` is running and `ollama list` includes `llama3.2`.
- **Authentication error with a cloud fallback:** Check the corresponding key in `.env`. Remove extra quotes or spaces and make sure the line is not commented out.
- **A different model answer:** Expected. Model wording is nondeterministic; verify the routing labels and the provider named in `(answered by: ...)`.
