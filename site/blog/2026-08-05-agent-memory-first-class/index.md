---
title: Agent memory just became its own product category
description: LangMem, Mem0, Zep, and half a dozen other memory frameworks shipped real benchmarks in 2026, and then publicly disagreed with each other's numbers. A tour of where agent memory is heading, and what's still unsolved.
slug: agent-memory-first-class
authors: [mangatrai]
tags: [agents, memory, langchain]
image: ./social-card.png
---

Two memory startups published head-to-head benchmarks against each other in 2026. Neither could agree on how much context the other one actually used to get its numbers. That disagreement, more than any single feature, is the clearest sign that "agent memory" went from a prompt-engineering trick to a real, contested product category this year.

{/* truncate */}

## What "first-class" memory looks like now

A year ago, agent memory mostly meant stuffing more of the conversation into the prompt. Now it's dedicated SDKs, published benchmarks, and academic papers on temporal knowledge graphs for agents that remember you across sessions. A few of the frameworks driving that shift:

- **LangMem**, LangChain's dedicated memory library, tracks three memory types at once: episodic (what happened), semantic (facts learned), and procedural (agents rewriting their own instructions based on feedback). On the LOCOMO long-conversation benchmark, it scores around 58%, with a p95 search latency near 60 seconds, fine for a background job, noticeably slow if you need memory recall inside a live response.
- **Mem0** takes a different approach: an extraction pipeline that decides, turn by turn, whether to ADD, UPDATE, DELETE, or leave alone a piece of remembered information. It's the most widely adopted of the group (around 48,000 GitHub stars as of mid-2026, on $24 million raised as of late 2025), and its published benchmarks claim a 26% accuracy improvement over OpenAI's built-in memory feature, plus roughly 90% lower token costs and 91% lower p95 latency than a full-context approach.
- **Zep**'s Graphiti architecture is built specifically for temporal reasoning: remembering not just *what* you said, but *when*, and how that changes what's still true later.

Underneath the branding, most of these tools converge on the same split: **short-term memory** (what happened in this conversation) versus **long-term memory** (what's worth carrying into the next one). Different frameworks are just optimizing for different sides of that line, and dressing it up in different vocabulary: episodic vs. semantic, ADD/UPDATE/DELETE, temporal graphs.

## The honest caveat: even the vendors don't agree

This is where the opening anecdote comes back in. Mem0 published a benchmark claiming its memory footprint for a given conversation was around 1,764 tokens, against roughly 600,000 tokens for Zep's graph-based approach on the same task, a massive gap. Zep pushed back publicly, arguing the comparison didn't reflect how its retrieval actually works in practice.

:::info
Neither company is necessarily lying. They're measuring different things, under different assumptions about what counts as "memory used." That's the state of the field right now: no shared benchmark methodology, so vendor-published numbers should be read as *directional*, not as an apples-to-apples comparison.
:::

Worth saying plainly: despite all this tooling, memory isn't a solved problem. The frameworks above are real progress, but they're competing approaches, not a converged standard. If you pick one, you're coupling to its ecosystem, LangMem assumes you're already in LangGraph, for instance, and its own benchmark numbers (58% on LOCOMO, a 60-second p95) show there's real room left to improve, not a finished solution.

:::tip
Before adopting a memory framework, ask what it actually adds over the plain short-term/long-term split: cross-session extraction, temporal reasoning, multi-agent shared memory. If your project doesn't need those specifically, the plain version usually holds up longer than the marketing suggests.
:::

## Where this connects to what you'd build

The short-term/long-term split itself isn't new, and it isn't something you need a dedicated SDK to get right. If you want to see it built from scratch, no external framework required, [Chapter 7](/docs/intermediate/memory) walks through both layers: a plain `checkpointer` for short-term memory and `SummarizationMiddleware` for long-term memory. Whether LangMem, Mem0, or Zep is worth adopting on top of that comes down to whether your project needs what they specifically add. For a lot of projects, it doesn't yet.
