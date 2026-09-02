---
title: Stop calling LLM APIs directly
description: Anthropic and OpenAI each recorded clusters of service incidents in 2026. A gateway can keep one affected provider from taking an application feature down with it.
slug: stop-calling-llm-apis-directly
authors: [mangatrai]
tags: [infrastructure, llm-platforms, production, reliability]
image: ./social-card.png
---

On June 2, 2026, Claude had a [major service incident affecting its API and Claude Code](https://www.thoughtworks.com/en-us/insights/blog/generative-ai/claude-outage-june-2026). From June 5 through June 16, its [status history](https://status.claude.com/history) recorded more disruptions; [Tech Times counted ten incidents across twelve days](https://www.techtimes.com/articles/318514/20260616/claude-outage-tenth-disruption-12-days-exposes-anthropic-infrastructure-strain.htm). OpenAI's [status history](https://status.openai.com/history?page=2) then recorded separate incidents on each day from July 22 through July 25. The [July 25 incident](https://status.openai.com/incidents/x9p6qd31) affected API, ChatGPT, and Codex components.

These were separate incidents with varying scope, not uninterrupted week-long outages. But if your application depended only on an affected service, any one of those incidents could become your feature's outage too.

{/* truncate */}

:::tip[TL;DR]
Routing LLM calls through a gateway lets a temporary provider failure move to a compatible fallback. LiteLLM, Portkey, and Kong each implement that pattern, with different hosting models and product tiers. The clusters of incidents in 2026 are a useful reminder to exercise the fallback path before you need it. Our hands-on [Advanced Concepts chapter](/docs/advanced-concepts/ai-gateways) builds a minimal version and runs it through a simulated outage; this post is the "why now."
:::

## The best-case math

Take a hypothetical pair of independent providers, each at 99.5% uptime. One is down about 44 hours a year. If the application can use either provider, the provider path is unavailable only when both are down at the same time: `0.005 x 0.005 = 0.000025`, or about 13 minutes a year.

That is best-case arithmetic, not an availability promise. Real providers can share a cloud region, network, or DNS dependency. The gateway can fail too, and the fallback may not support every context window, tool schema, policy, or data-region requirement. Redundancy helps only when the fallback is genuinely independent and compatible.

None of the mechanics here are exotic. A gateway is a thin routing layer: one call shape in, try the primary provider, catch a retryable failure, try a compatible fallback, and return whichever one answered. The routing loop takes about ten lines of Python. A production version also needs deadlines, a deliberate error policy, monitoring, and a plan for the gateway's own availability.

:::info
💡 This isn't an argument for a specific tool. LiteLLM, Portkey, and Kong AI Gateway all offer multi-provider routing, with different hosting models and product tiers. A team already using Kong can reuse that gateway platform, but Kong's multi-provider failover requires its paid AI Proxy Advanced plugin. The chapter compares the tradeoffs and links to current first-party documentation.
:::

## Build it once, understand it forever

The fastest way to understand a gateway is to build the routing core once and watch it work. That is the shape of the [Advanced Concepts: AI Gateways](/docs/advanced-concepts/ai-gateways) chapter: a support bot fails when its simulated primary has no fallback, then handles the same retryable failure through a small gateway function. The chapter also shows the parts hidden by that tiny loop, including timeouts, error classification, provider compatibility, and the gateway's own failure risk.

Sources: [Claude's June 2 incident, Thoughtworks](https://www.thoughtworks.com/en-us/insights/blog/generative-ai/claude-outage-june-2026); [Claude incident history](https://status.claude.com/history); [OpenAI incident history](https://status.openai.com/history?page=2); [OpenAI July 25 incident](https://status.openai.com/incidents/x9p6qd31); [Anthropic June incident count, Tech Times](https://www.techtimes.com/articles/318514/20260616/claude-outage-tenth-disruption-12-days-exposes-anthropic-infrastructure-strain.htm).
