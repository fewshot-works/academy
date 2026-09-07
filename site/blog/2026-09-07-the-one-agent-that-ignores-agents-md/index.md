---
title: The one agent that ignores AGENTS.md
description: AGENTS.md is now the closest thing coding agents have to a universal config format, backed by the Linux Foundation and read by Codex, Cursor, and a dozen others. Claude Code still isn't one of them.
slug: the-one-agent-that-ignores-agents-md
authors: [mangatrai]
tags: [agents, developer-tools, open-source, standards]
image: /img/academy-social-card.png
---

Every coding agent worth using now claims to read the same file. Drop an `AGENTS.md` at the root of your repo, write down your build commands, test setup, and code style once, and Codex, Cursor, GitHub Copilot, and a growing list of others will pick it up without you touching a single tool-specific config again. That is the pitch, and for most of the ecosystem it is true.

Claude Code is the exception. Point it at a repo with nothing but an `AGENTS.md` file and it will not read a word of it. It looks for `CLAUDE.md`, and only `CLAUDE.md`, unless you go out of your way to bridge the two.

That gap is worth pausing on, because it is not a rounding error. Claude Code is one of the most widely used coding agents on the market, built by a company that co-founded the very foundation now stewarding this "universal" standard.

{/* truncate */}

:::tip[TL;DR]
`AGENTS.md` is a plain-Markdown, no-schema convention, one file, checked into your repo, that tells a coding agent how to build, test, and work in your project. OpenAI released it in August 2025, and as of late 2025 it moved under the Linux Foundation's Agentic AI Foundation alongside Anthropic's own MCP. Over 60,000 open-source projects have adopted it, and it's read natively by Codex, Cursor, GitHub Copilot, Amp, Devin, Factory, Gemini CLI, Jules, and VS Code. Claude Code is not on that list. It reads `CLAUDE.md` instead, and the only way to get both working is to make one point at the other. This project does exactly that, and you should too if you support more than one agent.
:::

## What the file actually is

`AGENTS.md` has no required fields and no schema. It is Markdown, full stop. Write a "Setup" section, a "Testing" section, a "Code style" section, whatever headings make sense for your project, and the agent parses the prose directly. There is no linter to satisfy and no JSON to get wrong.

The idea behind it is simple: an agent dropped into an unfamiliar repo spends real time and tokens re-deriving things a human contributor would just read in a README, which package manager to use, how to run the test suite, which directories are generated and shouldn't be edited by hand. `AGENTS.md` exists to hand that context over up front instead of making the agent rediscover it turn after turn.

For a monorepo, you nest the file. An agent walks up the directory tree from wherever it's currently editing and uses the closest `AGENTS.md` it finds, so a `packages/billing/AGENTS.md` can carry instructions specific to that package without repeating everything from the repo root. This project actually does something adjacent to that: our root `CLAUDE.md` is one line, `@AGENTS.md`, which pulls in the real instructions living in `AGENTS.md` right next to it.

## The adoption numbers are real

OpenAI released `AGENTS.md` in August 2025, and it wasn't a solo effort. Cursor, Google's Jules, Factory, and Amp all had a hand in shaping the format from early on, which is part of why it caught on faster than most single-vendor conventions do. By December 9, 2025, the Linux Foundation had formalized that momentum into the Agentic AI Foundation (AAIF), with `AGENTS.md` as a founding project alongside Anthropic's Model Context Protocol and Block's `goose` agent.

The site that hosts the spec, [agents.md](https://agents.md), reports more than 60,000 open-source projects now carry the file, read natively by Codex, Cursor, GitHub Copilot, Amp, Devin, Factory, Gemini CLI, Jules, and VS Code. That's a genuinely broad coalition for a format that's barely a year old, and it's why "just write an `AGENTS.md`" has become reasonable default advice for anyone maintaining a repo that more than one kind of agent might touch.

| Tool | Reads `AGENTS.md` natively? |
|---|---|
| Codex | Yes |
| Cursor | Yes |
| GitHub Copilot | Yes |
| Amp | Yes |
| Devin | Yes |
| Factory | Yes |
| Gemini CLI | Yes |
| Jules | Yes |
| VS Code | Yes |
| Claude Code | No, reads `CLAUDE.md` |

## Claude Code didn't get the memo

Here's the part that undercuts the "universal" framing: Claude Code, built by one of AAIF's own founding members, does not read `AGENTS.md` natively. Point it at a repo that only has that file and it behaves as if no project instructions exist at all. It looks specifically for `CLAUDE.md`.

Anthropic's own documentation lays out two supported ways to close that gap:

1. **Import it.** Create a `CLAUDE.md` at your repo root containing a single line, `@AGENTS.md`, which pulls the other file's contents in. This is exactly what this repository does, and it's the pattern I'd default to for most teams: one real source of truth, one thin pointer.
2. **Symlink it.** Run `ln -s AGENTS.md CLAUDE.md` and let the filesystem do the work instead.

Both get Claude Code to the same instructions every other agent already reads. Neither is automatic, and neither is something a new contributor will discover without being told.

This isn't a case of Anthropic simply not having heard the request. It's a frequently requested feature on Claude Code's own issue tracker, which makes the gap more interesting than a simple oversight. A founding member of the foundation that stewards the format still ships a product that treats it as a second-class citizen, months after the format had already cleared 60,000 repos elsewhere.

:::info
Codex has already extended the base format with its own `AGENTS.override.md`, which takes precedence over a plain `AGENTS.md` when both are present. A convention with zero required schema is still, in practice, growing tool-specific dialects. That's worth watching if you maintain instructions for more than one agent, since "the same file" can quietly stop meaning the same thing.
:::

## What this means if you maintain a repo

The lesson isn't "don't bother with `AGENTS.md`." Sixty thousand repos and a Linux Foundation project aren't nothing, and if your team uses Codex, Cursor, or Copilot day to day, writing one is close to free and genuinely saves an agent from re-deriving your build steps every session. The lesson is narrower: don't assume "I wrote an `AGENTS.md`" means every agent your contributors might reach for actually reads it.

If Claude Code is in your toolchain alongside anything else, check which file it's actually loading before you trust that your setup instructions, security notes, or style rules are reaching it. A one-line import costs you nothing and closes the gap completely. Skipping that check costs you an agent that's confidently wrong about how your project works, because it never saw the file telling it otherwise.

Two practical habits follow from this:

- **Write `AGENTS.md` as your source of truth, then point everything else at it.** Prefer the import over the symlink. A symlink works, but it hides the relationship from anyone browsing the repo on GitHub, where it just looks like a second file with identical contents. `@AGENTS.md` in `CLAUDE.md` makes the dependency explicit in the one place a new contributor is most likely to look.
- **Don't assume "universal" means every agent behaves identically once it reads the file.** Codex's `AGENTS.override.md` shows the format is already growing tool-specific extensions on top of a spec with zero required fields. Read a tool's own docs before betting a security-sensitive instruction on cross-agent consistency.

We keep our own root `CLAUDE.md` and `AGENTS.md` wired together the same way described above, specifically so contributors using either agent get the same ground rules. It's a small thing, but it's the kind of small thing that only bites you once you've already shipped on the wrong assumption.
