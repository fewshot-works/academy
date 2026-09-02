---
title: Stop calling LLM APIs directly
description: Anthropic and OpenAI each had multi-day outage streaks in 2026, and most production apps still call one provider's SDK with no fallback. That's a solved problem now, most teams just haven't wired up the fix.
slug: stop-calling-llm-apis-directly
authors: [mangatrai]
tags: [infrastructure, llm-platforms, production, reliability]
image: ./social-card.png
---

Anthropic's Claude went dark for five and a half hours on June 2, 2026, taking Claude.ai, the API, Console, and Claude Code out together. Three days later, on June 5, a longer stretch began: ten separate service disruptions across the next twelve days, running through June 16. Seven weeks after that stretch began, OpenAI had its own rough stretch: four disruptions in four days between July 22 and July 25, with the July 25 incident knocking out ChatGPT, the API, and Codex at once.

If your app calls one provider's SDK directly with no fallback, both of those weeks were your outage too, whether or not anyone at your company noticed why the AI feature just went quiet.

{/* truncate */}

:::tip[TL;DR]
Routing LLM calls through a gateway instead of a raw SDK call, so a dead provider automatically fails over to a working one, isn't a new idea. LiteLLM has been doing this for years, and the pattern itself long predates any single vendor. What changed in 2026 isn't the tooling, it's how often the fallback path actually gets exercised for real. We've turned this into a full hands-on [Advanced Concepts chapter](/docs/advanced-concepts/ai-gateways) where you build a minimal gateway by hand and watch it survive a simulated outage, this post is just the "why now."
:::

## The math nobody argues with

Run the numbers on two independent providers, each at 99.53% uptime: a single one of them is down about 41 hours a year. Put a gateway in front of both, with the app failing over automatically when the primary errors out, and the *combined* setup only goes down when both providers are out at the same instant, roughly 11 to 12 minutes a year. Real providers aren't perfectly independent, a shared cloud region or a common upstream dependency can take two "different" providers down together, so treat that as a best case, not a guarantee. It's still the right order of magnitude for why teams that already had this wired up shrugged through June and July while everyone else's status page turned red.

None of the mechanics here are exotic. A gateway is a thin routing layer: one call shape in, try the primary provider, catch a failure, retry a fallback, return whichever one actually answered. You can build the core of it in about ten lines of Python, and teams that skipped it aren't missing sophistication, they're missing ten lines.

:::info
💡 This isn't an argument for a specific tool. LiteLLM, Portkey, and Kong AI Gateway all do this job at production scale, with dashboards, spend tracking, and caching layered on top of the same core idea. Which one fits depends more on what infrastructure you're already running than which is "best," a team already on Kong for its REST APIs gets LLM routing nearly for free.
:::

## Build it once, understand it forever

The fastest way to actually trust a gateway, instead of just installing one, is to build the failover path yourself once, badly, on purpose, and watch it work. That's the whole shape of the [Advanced Concepts: AI Gateways](/docs/advanced-concepts/ai-gateways) chapter we just published: a support bot that fails outright when its primary provider is simulated down with no fallback, then the identical call, wrapped in a ten-line gateway function that catches the exact same failure and routes around it automatically. Same failure, two outcomes, and the difference is a function most teams could write in the time it takes to read this post.

Sources: [OpenAI outage coverage, July 2026, The Next Web](https://thenextweb.com/news/openai-outage-chatgpt-codex-api-july-2026); [OpenAI July 25 outage report, BleepingComputer](https://www.bleepingcomputer.com/news/artificial-intelligence/openai-confirms-chatgpt-is-down-as-logins-and-signups-fail/); [Anthropic June 2026 outage pattern, Tech Times](https://www.techtimes.com/articles/318514/20260616/claude-outage-tenth-disruption-12-days-exposes-anthropic-infrastructure-strain.htm); [Claude outage details, Tech Insider](https://tech-insider.org/claude-outage-june-2026/).
