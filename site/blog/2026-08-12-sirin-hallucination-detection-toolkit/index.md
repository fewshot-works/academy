---
title: A new toolkit unifies three ways to catch a hallucination
description: Most tools that catch a RAG system inventing facts pick one detection method and stick with it. A new open-source toolkit, SIRIN, runs three completely different methods side by side and lets you compare them on the same answer.
slug: sirin-hallucination-detection-toolkit
authors: [mangatrai]
tags: [rag, evaluation, research]
image: ./social-card.png
---

Our [Chapter 8: Evaluating What You Built](/docs/intermediate/evaluating) lab uses a second LLM call as a judge: ask the judge model to compare a generated answer against a reference answer and reply `PASS` or `FAIL`. It works, but it's one technique among several, and the lab's own real output caught the judge writing `PASS` on the first line while its own one-sentence explanation said the answer "fails to provide accurate information about its location." A team of researchers built a toolkit, [SIRIN](https://arxiv.org/abs/2608.00033) (arXiv:2608.00033), around exactly that gap: instead of picking one hallucination-detection method and living with its blind spots, run three unrelated methods on the same answer and see where they agree.

{/* truncate */}

:::tip[TL;DR]
SIRIN is an open-source toolkit that unifies three different ways to catch a RAG system making things up: a second-model judge, a classifier trained on the model's internal hidden states, and an uncertainty score fused from 38 separate estimators. It also checks, before generation even happens, whether a question can be answered from the given context at all. Skip to [What SIRIN actually unifies](#what-sirin-actually-unifies) for the specifics, or [The gap our own lab already found](#the-gap-our-own-lab-already-found) for why one method alone isn't enough.
:::

## Three ways to guess a model is making things up

**Judge-style verification** is the one our own Chapter 8 lab already uses: a second model reads the evidence and the answer and checks whether they contradict each other. It's black-box, it needs no access to the model's internals, and it reads like a person grading an essay against an answer key. It's also just another LLM call, with all the same failure modes an LLM call can have.

**Representation probing** works differently. It trains a small classifier on the model's hidden states, the internal numbers a model produces while generating, learning to separate "this generation pattern usually means a faithful answer" from "this pattern usually means a hallucinated one." It's white-box: you need access to those internals, which rules it out for a model you only reach through an API.

**Uncertainty estimation** doesn't read the answer's content at all. It looks at how confident the model was while generating it, things like entropy and perplexity, and SIRIN fuses 38 separate estimators of this kind (wrapping an existing library called LM-Polygraph) into one calibrated score. A model that's "unsure" in a measurable way is more likely to be guessing.

Three methods, three completely different signals: what a second model thinks, what the first model's internals show, and how confident the first model was. SIRIN's premise is that none of them alone is trustworthy enough to be the whole answer.

## What SIRIN actually unifies

Before SIRIN, using more than one of these methods meant standing up three separate codebases, each with its own config format and its own idea of what a "detector" looks like. SIRIN puts all three, plus a fourth related task, under one interface:

- **One config system and evaluation pipeline** for all three detector families, instead of three separate ones.
- **Response-level and span-level scoring.** A response-level score grades the whole answer; a span-level score can point at the specific sentence that isn't supported by the evidence.
- **Query answerability**, a pre-generation check for whether a question can be answered from the given context at all, before the model even generates a response. Useful for filtering out unanswerable questions in a RAG pipeline before they produce a confident-sounding non-answer.
- **A web UI** for pasting in a context-question-answer triple and comparing what all three detectors say about it, side by side.

The paper reports SIRIN demonstrated as a faithfulness gate inside a long-term memory system, using detection scores to decide what a memory system is allowed to treat as true before storing it. The pattern is the same one our own Chapter 8 lab uses for grading, just applied one step upstream, before something bad gets written down instead of after it's already been said.

## The gap our own lab already found

Chapter 8's real lab output shows the exact failure SIRIN is aimed at. The question was where Whistlepost Coffee's most popular drink is located; the model's generated answer admitted the context didn't say. The judge's verdict:

```
verdict: PASS -- The candidate answer correctly identifies Whistlepost's most
popular drink as the Smoked Maple Cold Brew, but fails to provide accurate
information about its location and context regarding its introduction year.
```

`PASS`, followed immediately by a sentence explaining why the answer is incomplete. That's not a one-off glitch, it reproduced across two separate runs of the lab. A judge model is still just an LLM making a call, and it can write a verdict that contradicts its own reasoning in the same breath. A probing detector or an uncertainty score wouldn't automatically catch what a judge misses, but they're wrong in different ways than a judge is wrong, which is the whole argument for running more than one.

## What this looks like in code

SIRIN's actual API (from its [GitHub repo](https://github.com/sb-ai-lab/SIRIN), Apache 2.0-licensed) runs a detector on a list of context/answer turns and calls `.detect()`:

```python
from sirin.detectors import SequenceLinearProbingDetector, SequenceOpenAIJudge

sample = [
    {"role": "user", "content": "Where is Whistlepost's flagship location?"},
    {"role": "assistant", "content": "The context doesn't say."},
]

probe = SequenceLinearProbingDetector(config=probing_config, feature_processor=processor)
probe.load("./models/ensemble_detector")
probe_result = probe.detect([sample])

judge = SequenceOpenAIJudge(config=judge_config)
judge_result = judge.detect([sample])
```

Same shape as our Chapter 8 `judge()` function, a question, an answer, a verdict, except SIRIN gives you a second, unrelated detector to run on the same input and compare.

## Where this connects

Our [Chapter 8: Evaluating What You Built](/docs/intermediate/evaluating) chapter already says the honest thing about LLM-as-judge: "treat pass rates as a useful signal... not as proof any individual answer is correct." SIRIN is one concrete answer to what to do about that, run a second, structurally different detector alongside the judge, and see where they disagree.

This post is based on the paper ["SIRIN: A Unified Toolkit for Detecting Contextual Hallucinations in Retrieval-Augmented and Memory-Grounded LLM Systems"](https://arxiv.org/abs/2608.00033) (arXiv:2608.00033, submitted 20 Jul 2026, licensed CC BY 4.0) by Julia Belikova, Rauf Parchiev, Mikhail Filimonov, Konstantin Polev, Andrey Savchenko, and Maksim Makarenko.
