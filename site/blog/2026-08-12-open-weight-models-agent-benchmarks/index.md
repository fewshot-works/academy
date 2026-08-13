---
title: Every major AI lab shipped an agent model this week
description: Meta, OpenAI, and xAI all shipped new models the same week, and every one leads with agentic benchmarks. Muse Glimmer is a 30B open-weight model built to run on one GPU that beats similarly sized rivals on tool-calling tasks. GPT-5.6 and Grok 4.6 are closed flagships chasing the same territory. Here's what's in each.
slug: open-weight-models-agent-benchmarks
authors: [mangatrai]
tags: [agents, open-source, benchmarks]
image: ./social-card.png
---

For the last two years, open-weight model releases have mostly been a China story: DeepSeek, Alibaba's Qwen team, Moonshot AI's Kimi, Zhipu's GLM, MiniMax, all shipping frontier-class open weights on a cadence Western labs haven't matched. This week Meta broke that pattern, twice, in one release. It shipped [Muse Glimmer](https://developer.meta.com/ai/models/muse-glimmer/), a 30-billion-parameter model with Apache 2.0 weights on Hugging Face, alongside [Muse Spark 1.2](https://developer.meta.com/ai/models/muse-spark/), a hosted sibling built for long coding sessions. The interesting part isn't that Meta released open weights again. It's that, by Meta's own benchmarks, Glimmer beats two other well-known open-weight models roughly its own size at the kind of multi-step, tool-using tasks that used to separate the labs with the biggest budgets from everyone else.

{/* truncate */}

:::tip[TL;DR]
Meta shipped two models this week. Muse Glimmer (30B, Apache 2.0, runs on one consumer GPU) beats Gemma4-31B and Qwen3.6-27B at agent-style benchmarks like MCP Atlas, though it still loses to Qwen3.6-27B on computer-use and terminal tasks. Muse Spark 1.2 is Meta's hosted, 1M-token sibling for long sessions. The same week, OpenAI shipped a new flagship family, GPT-5.6 (Sol/Terra/Luna), and xAI shipped Grok 4.6, a closed model built for long-running agent work that lands about even with GPT-5.6 Sol on Artificial Analysis's Intelligence Index. OpenAI also has a narrower cybersecurity-specific model built on top of GPT-5.6, more on that one in a follow-up post. Skip to [What Muse Glimmer actually gets you](#what-muse-glimmer-actually-gets-you) for the numbers.
:::

## Muse Glimmer: built to run on one consumer GPU

Muse Glimmer is a dense transformer, not a mixture-of-experts model, with a 2-billion-parameter vision encoder feeding a 28-billion-parameter text decoder, about 30B total. It reads text and images (no audio, video is sampled as individual frames) and writes text back. Context tops out past 131,000 tokens, and Meta's own documentation lists a knowledge cutoff of January 4, 2026.

What makes it notable is where it's meant to run: one consumer GPU. The minimum viable setup is 24GB of VRAM, an RTX 4090, RTX 5090, or an Apple Silicon Mac from the M3 Max up. Quantized to Q4_K_M GGUF and paired with a speculative-decoding drafter Meta ships alongside it, the whole thing fits a 24-32GB card. Full BF16 precision needs 64GB, workstation territory, but that's the exception, not the requirement.

## What Muse Glimmer actually gets you

Meta compared it against Gemma4-31B and Qwen3.6-27B, two similarly sized rivals, on agent-style benchmarks:

- **MCP Atlas: 75.5**, versus 54.2 (Gemma4) and 62.5 (Qwen3.6) — a wide lead on tool-calling-heavy tasks
- **DeepSearch QA: 74.6**
- **Gaia2: 43.3**
- **SWE-Bench Pro: 51.2**
- **AIME 2026: 94.7**, **IFBench: 77.0**, **AA-LCR: 80.0**

On the safety side, Meta reports a Siren AgentDojo attack success rate of 28.4% with 94.2% utility retained, and states the model doesn't meet the "Frontier AI" bar in its own Advanced AI Scaling Framework, rating chem/bio, cyber, and loss-of-control risk as moderate or lower.

## Where it still loses

Not every number favors Glimmer. Qwen3.6-27B stays ahead on tasks that involve directly operating a computer:

- **OSWorld-Verified:** Qwen3.6-27B at 75.6 vs. Glimmer's 65.9
- **TerminalBench 2.1:** Qwen3.6-27B at 60.7 vs. Glimmer's 51.7
- **SWE-Bench Verified:** Qwen3.6-27B at 77.2 vs. Glimmer's 76.0, a near-tie

The pattern holds across the whole benchmark suite: Glimmer wins on agentic orchestration and multi-step reasoning, Qwen3.6-27B wins on hands-on-keyboard computer use and terminal work. Neither model wins everything, which is the honest read, not the marketing one.

## What this looks like in code

Neither of these two model names has a LangChain provider integration as of this post, but the pattern our [Chapter 6: Your First Agent](/docs/intermediate/your-first-agent) lab teaches, one string decides both provider and model, is exactly the shape you'd reach for once one does:

```python
from langchain.agents import create_agent

# same idea Chapter 6 uses for "ollama:llama3.2" vs "openai:gpt-5.1":
# one string picks both the provider and the specific model.

if task_needs_million_token_context:
    model = "meta:muse-spark-1.2"   # hosted, 1M-token context, billed per token
else:
    model = "ollama:muse-glimmer"   # local, free, one consumer GPU

agent = create_agent(model=model, tools=tools)
```

The tradeoff a router like this is actually encoding: pay per token for a huge context window when a task genuinely needs it, or run for free on your own GPU when it doesn't.

## Muse Spark 1.2: built for sessions that don't fit in one context window

Muse Spark 1.2 is API-only, no open weights, and both its variants carry a 1-million-token context window. Meta's own framing is that long-running tasks should run start to finish in one session instead of getting chunked and re-summarized. Compared to 1.1, Meta reports higher first-attempt accuracy and more reliable tool calling, though it doesn't publish a detailed changelog of what changed under the hood.

Pricing is per million tokens, and there are two tiers:

| Tier | Input | Cached input | Output |
|---|---|---|---|
| Standard | $1.25 | $0.15 | $4.25 |
| Contributor (Meta can use your data to improve its products) | $0.10 | $0.002 | $0.20 |

That's a real tradeoff, not a rounding difference: the contributor tier is roughly 12x cheaper on input, in exchange for giving up data privacy. Spark 1.2 also powers Muse Code, Meta's terminal coding agent, which can run multiple sub-agents in parallel, each working in its own isolated git worktree so they don't collide on the same files.

## OpenAI and xAI shipped flagships too

The same stretch saw OpenAI roll out **GPT-5.6**, a three-tier family: Sol (flagship), Terra (mid-tier), Luna (budget). All three ship a 1-million-token context window, 128,000 max output tokens, and a February 16, 2026 knowledge cutoff. Pricing per million tokens: Luna at $1/$6 (input/output), Terra at $2.50/$15, Sol at $5/$30. The family also introduced **Programmatic Tool Calling**, letting the model write JavaScript that orchestrates its own tool calls inside an isolated, network-disabled runtime, instead of making one tool call at a time.

xAI shipped **Grok 4.6** the same day this post went up: closed, API-only, no open weights. Pricing starts at $2 per million input tokens and $6 per million output tokens, with a faster variant at double that. xAI's pitch is squarely about long-running agent work, its system card describes the model checking its own output mid-task instead of running straight through, with training leaning on agentic RL across coding, kernel optimization, web development, and CAD-style tasks. It scores 61 on Artificial Analysis's Intelligence Index, matching GPT-5.6 Sol. Worth noting: this isn't in the same weight class as Muse Glimmer above, it's a frontier proprietary model competing with GPT-5.6, not the 30B run-on-your-GPU bracket.

Days later, OpenAI shipped a narrower, cybersecurity-specific model on top of Sol, available only to vetted defenders. That release, and an academic paper on keeping autonomous cyber-defense agents on a leash, is its own story. We're covering it in a follow-up post.

## Where this connects

Our [Chapter 6: Your First Agent](/docs/intermediate/your-first-agent) chapter teaches the exact `model="provider:model-name"` pattern this post's code snippet leans on. Nothing in that chapter changes because of these releases, they're just more strings you could plug into the same line, once support lands.

Sources: [Muse Glimmer, Meta's developer page](https://developer.meta.com/ai/models/muse-glimmer/); [Muse Spark, Meta's developer page](https://developer.meta.com/ai/models/muse-spark/); [VentureBeat's coverage of the Muse Glimmer release](https://venturebeat.com/technology/meta-returns-to-open-source-with-muse-glimmer-an-apache-2-0-licensed-30b-parameter-ai-model-optimized-for-agents-available-now); [OpenAI's GPT-5.6 announcement](https://openai.com/index/gpt-5-6/); [xAI's Grok 4.6 announcement](https://x.ai/news/grok-4-6).
