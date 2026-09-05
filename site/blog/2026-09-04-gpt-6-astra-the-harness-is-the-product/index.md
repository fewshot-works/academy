---
title: "GPT-6 Astra: the harness is the product"
title_meta: "GPT-6 Astra: the harness is the product"
description: GPT-6 Astra scored 54.8% or 99.9% on the same benchmark depending on the harness. That gap matters more than the AGI headline.
slug: gpt-6-astra-the-harness-is-the-product
authors: [mangatrai]
tags: [agents, evaluation, llm-platforms, infrastructure]
keywords: [GPT-6 Astra, AGI, agent harness, Codex context, async tool calling, mid-turn steering]
image: ./social-card.png
---

GPT-6 Astra does not prove that OpenAI has reached AGI. What it does prove is that the harness can no longer be treated as plumbing.

Astra scored 54.8% on ARC-AGI-3 at high reasoning in the standard harness. The same model scored 99.9% when the harness preserved its reasoning state and compacted long conversations. That is a 45.1-point difference without changing the model.

My takeaway is simple: if you evaluate only the model name, you are evaluating the wrong product. For long-running agent work, the product is the model, memory, tools, context management, and control loop together.

That is why Astra matters even if you are not interested in arguing about AGI.

{/* truncate */}

## The AGI claim is ahead of the evidence

OpenAI President Greg Brockman believes Astra qualifies as artificial general intelligence. During the launch briefing, he left the final judgment to others but said, “I think we're there,” according to [The Washington Post](https://www.washingtonpost.com/technology/2026/09/03/openai-greg-brockman-says-its-new-model-astra-is-agi/). OpenAI's [Charter defines AGI](https://openai.com/charter/) as highly autonomous systems that outperform humans at most economically valuable work. No launch benchmark can establish that on its own.

Astra gives OpenAI a serious case to make. The company reports 98% on FrontierMath Tier 4, 99.9% on ARC-AGI-3, and large gains in computer use and coding. [OpenAI is positioning Astra](https://openai.com/index/gpt-6-astra/) to work inside browsers, development tools, spreadsheets, and other software with less supervision.

I would not call it “pre-AGI” either. That avoids the argument without giving us anything measurable. Astra is a meaningful step toward a general-purpose digital worker, but we do not yet have evidence that it can reliably outperform people across most economically valuable work.

ARC Prize calls Astra a major step forward while stating plainly that saturating ARC-AGI-3 is not proof of AGI. The benchmark uses bounded environments with deterministic rules. Real work is messier and carries consequences when the agent gets something wrong.

## The biggest Astra number is really a harness result

An agent harness is the software around the model. It supplies tools, carries context forward, manages retries, records state, and decides when the model gets another turn.

ARC Prize tested Astra through two harnesses:

| Evaluation setup | Reasoning effort | Score | Evaluation cost |
| --- | --- | ---: | ---: |
| Standard, provider-neutral harness | Max | 62.7% | $26,098 |
| Standard, provider-neutral harness | High | 54.8% | $40,705 |
| OpenAI Provider Adapter harness | High | 99.9% | $18,817 |

The standard harness gives the model a common interface and lets it decide what to preserve in visible notes. The OpenAI adapter also keeps Astra's opaque reasoning state between requests and uses compaction to manage long conversations.

At the same high reasoning setting, the adapter moved the score from 54.8% to 99.9%, according to [ARC Prize's analysis](https://arcprize.org/blog/astra).

The 99.9% result is valid. It is just not a property of the model in isolation. It is the result of Astra operating inside the runtime OpenAI designed for it.

The neutral harness is better for comparing models under the same conditions. The native harness measures the system you might actually deploy. One score cannot answer both questions.

## The new context system is the feature I would watch

Astra has a 1,050,000-token context window, but a coding agent can still fill it with source files, test output, logs, and failed approaches. Eventually, something has to be removed or compressed.

Compaction turns the old conversation into a shorter summary. That summary preserves what looked important at the time. A constraint, test failure, or rejected approach can disappear and become important again later.

With Astra, OpenAI says Codex can now [keep notes across context windows and search earlier windows](https://openai.com/index/gpt-6-astra/). If a detail did not make it into the notes, the agent can retrieve the earlier message or tool result instead of depending entirely on a chain of summaries.

Consider a repository migration. The agent learns early that one service must stay compatible with an older client, then spends an hour inspecting unrelated code and running tests. When it finally edits that service, searchable history gives it another way to recover the compatibility requirement instead of hoping the detail survived compaction.

This could make a long-running agent more dependable, but it needs real testing. The Codex feature is experimental at launch, and we do not yet know how reliably Astra will find the right old detail across large, messy repositories.

## Astra can keep working while the task changes

Two new API capabilities support the same idea.

[Async tool calling](https://developers.openai.com/api/docs/guides/async-tool-calling) lets Astra start a function or custom tool and continue with independent work while the application runs it. An agent can begin a slow dependency scan, inspect configuration files while it waits, and use the scan after it returns. Your application still runs the job and has to return the result with the correct call ID.

[Mid-turn steering](https://developers.openai.com/api/docs/guides/steering) lets a user change requirements while Astra is working over a WebSocket connection. You can tell the migration agent to keep the project within one engineer-week without discarding the research it already completed.

That sounds like a small interface improvement. In practice, it changes the agent from a request-response system into a process you can supervise while it runs.

The tradeoff is control. Steering does not undo an action that already happened or cancel a tool already in flight. Async tools can also finish in an unexpected order. If two of them write to the same system, the application needs isolation, idempotency, and a clear approval policy. A more capable model does not remove those engineering responsibilities.

## More autonomy also raises the cost of a mistake

OpenAI calls Astra its most aligned model and reports better respect for task boundaries. Its safety review also found that Astra can sometimes evade internal monitors when adversarial tests explicitly tell it to do so. OpenAI says this came from adversarial evaluation rather than normal use, but the result is serious enough that the company is developing monitoring methods beyond reading the model's written reasoning.

Astra is also OpenAI's first broadly deployed model to reach its [Critical cybersecurity capability threshold](https://openai.com/index/safety-overview-gpt-6-astra/). OpenAI says that, with the right tools and access, Astra can find previously unknown vulnerabilities and develop exploits against hardened systems without a person directing each step. Less-restricted access for advanced cyber work is limited to vetted participants in the Daybreak program.

This is the real tradeoff. Better memory, more tools, and longer autonomy make the system more useful. They also give it more time and more access to act on a bad assumption before someone catches it.

## Run two evaluations, not one

I would evaluate Astra in two passes.

First, use a provider-neutral harness with the same prompts, tools, retry limits, and grading criteria you use for other models. That tells you whether Astra itself improves the work you care about.

Then test the native OpenAI harness with persisted reasoning, compaction, searchable context, async tools, and steering enabled where appropriate. That tells you whether the complete Astra system is worth deploying.

Use 20 to 50 real tasks, not polished demos. For long tasks, force at least one compaction and plant an early requirement that matters near the end. Interrupt a run with a changed constraint. Delay tool results and return them out of order. Put an approval boundary in front of an irreversible action. Measure accepted results, recovery from mistakes, latency, and total cost.

The last point matters because [Astra costs $10 per million input tokens and $50 per million output tokens](https://developers.openai.com/api/docs/models/gpt-6-astra), before tool fees. If your application needs short answers or straightforward extraction, these harness features may not justify that price. If it needs sustained work across tools and changing requirements, token price alone is a poor way to judge it.

## By the way, this was a crowded release week

Anthropic released [Claude Fable 5.1](https://www.anthropic.com/claude/fable) for long-running coding and knowledge work. Meta released [Muse Spark 1.3](https://research.meta.ai/blog/introducing-muse-spark-1-3), with a focus on long-horizon collaboration, interruptions, and coding efficiency. Google released [Gemini 3.8 Flash](https://blog.google/innovation-and-ai/models-and-research/gemini-models/3-8-flash-and-3-8-flash-cyber/) as a lower-cost agentic reasoning and coding model.

All three belong on an evaluation list if they fit your workload. They do not change my conclusion about Astra: its most important advance is not the AGI label or the model name. It is the tighter integration between the model and the system that keeps it working.

My recommendation is to stop treating the harness as an implementation detail. Compare models with a neutral harness, then evaluate the native system you would actually deploy. The [evaluation chapter](/docs/intermediate/evaluating) shows how to build the task set. Let the AGI debate continue somewhere else.
