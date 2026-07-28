# Lab 6: Production Concerns

Companion lab for [Advanced Chapter 6: Production Concerns](https://fewshot-works.github.io/academy/docs/advanced/06-production-concerns). Three things that don't show up in a demo but matter the moment real traffic hits: caching a repeated question, rate limiting a burst of requests, and streaming output instead of making the user stare at a spinner.

## Before you start

This lab works with any provider. Ollama is free and local.

## Steps

1. **Move into the lab folder.** If you already cloned the repo for an earlier lab, just `cd` into this one:

   ```bash
   cd academy/labs/advanced/06-production-concerns
   ```

   Otherwise, clone the repo first:

   ```bash
   git clone https://github.com/fewshot-works/academy.git
   cd academy/labs/advanced/06-production-concerns
   ```

2. **If you're using Ollama, make sure the model is pulled:**

   ```bash
   ollama pull llama3.2
   ```

3. **Set up your `.env`:**

   ```bash
   cp .env.example .env
   ```

   If you're using Ollama, `PROVIDER=ollama` is already set, leave it as-is.

4. **Run the script:**

   ```bash
   uv run production.py
   ```

## What you should see

With `PROVIDER=ollama`, a real run:

```
=== 1. Caching ===
  [cache] miss -- calling the model
  A: At Fernwood Coffee Co., you can redeem a free Depot Latte after every 10 purchases with our loyalty program.
  took 2.53s

  [cache] hit -- skipping the model call
  A: At Fernwood Coffee Co., you can redeem a free Depot Latte after every 10 purchases with our loyalty program.
  took 0.00s

=== 2. Rate limiting ===
  request 1: waited 0.00s for a token -> "What's your best-selling drink?"
  request 2: waited 0.00s for a token -> "How many locations do you have?"
  request 3: waited 1.03s for a token -> "What's the loyalty program?"
  request 4: waited 1.02s for a token -> "Do you have oat milk?"

=== 3. Streaming ===
  Q: Tell me about your loyalty program and your best-selling drink.
  A: Our loyalty program rewards customers with a free Depot Latte after every 10 purchases made across our three Fernwood Coffee Co. locations in the state. Our top seller is, of course, the popular Depot Latte!
```

💡 A few honest notes on this real run:

- **The same question, asked twice, costs one model call.** The first `cached_ask()` takes 2.53s (a real Ollama call). The second, identical question, hits the on-disk cache and returns in 0.00s, no model call at all. The cache key is a hash of the system prompt plus the question, ask something even slightly different and it's a fresh miss.
- **The rate limiter's bucket starts with 2 tokens (`capacity=2`) and refills at 1 token/second (`refill_rate=1`).** The first two requests go through with no wait, tokens 1 and 2 are already sitting in the bucket. Request 3 has to wait about a second for the bucket to refill by one token, request 4 waits about a second more. That 1.03s / 1.02s pattern isn't approximate, it's the refill math working exactly as configured.
- **The streaming answer above shows the final text**, but running it yourself looks different: words appear one at a time as the model generates them, instead of the whole answer showing up at once after a pause. That's the actual point of streaming, it doesn't make the model faster, it makes the wait feel shorter because the user sees progress immediately.

## What the script is actually doing

Open `production.py`.

1. **Caching (`cached_ask`)**: hashes `system + user_message` with `hashlib.sha256` to build a cache key, checks a JSON file (`cache.json`) for that key before calling the model, and writes the answer to it after a miss. A real production cache would use Redis or a database with an expiry, this is the same idea with the smallest possible storage.
2. **Rate limiting (`new_bucket` / `wait_for_token`)**: a token bucket, plain dict, no class, holding `tokens`, `capacity`, `refill_rate`, and `last_refill`. Every call to `wait_for_token()` computes how much time has passed, adds that many tokens back (capped at `capacity`), and blocks in a short sleep loop until at least one token is available. This caps your request rate without ever rejecting a request outright, it just makes it wait its turn.
3. **Streaming (`ask_streaming`)**: same three-provider shape as `ask()`, but each branch uses its provider's streaming API (`stream=True` for Ollama and OpenAI, `client.messages.stream()` for Anthropic) and prints each piece of text as it arrives instead of waiting for the full response.

## Troubleshooting

- **`ConnectionError` with `PROVIDER=ollama`**: make sure Ollama is running (`ollama serve`) and you've pulled `llama3.2`.
- **Second run shows a cache hit on request 1**: expected, `cache.json` persists between runs. Delete it (`rm cache.json`) to see a fresh miss.
- **Rate limiting wait times differ slightly from the transcript above**: expected, the bucket's timing depends on real wall-clock time and how fast your machine responds, the pattern (first `capacity` requests instant, then roughly `1/refill_rate` seconds apart) should hold.
- **Streaming prints everything at once instead of gradually**: some terminals or IDE consoles buffer output, try running it in a plain terminal (not inside an IDE's embedded console) if this happens.
