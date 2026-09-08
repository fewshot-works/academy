---
title: "AGENTS.md: one guide for your coding agents"
title_meta: "AGENTS.md: one guide for your coding agents"
description: What AGENTS.md does, how to write a useful one, and which coding tools load it automatically. Includes an example and setup for Claude Code and Gemini CLI.
slug: agents-md-guide
authors: [mangatrai]
tags: [agents, developer-tools, open-source, standards]
keywords: [AGENTS.md, coding agent instructions, AGENTS.md example, Claude Code, Cursor, GitHub Copilot]
image: ./social-card.png
---

`AGENTS.md` is a Markdown file you keep in your repository to tell coding agents how to work on the project. It can explain where the code lives, which commands to run, and which decisions the agent should leave to you. The [open format](https://agents.md/) has no required fields or schema.

The useful idea is portability. If one contributor uses Codex and another uses Cursor, they should be able to share the same project instructions. An open-source maintainer should not have to rewrite the build command for every contributor's preferred tool.

My recommendation is to make `AGENTS.md` the shared starting point. Keep it short enough to review, specific enough to act on, and check that the tools your team uses actually load it.

{/* truncate */}

## Why a shared file matters

Consider an open-source documentation project. A contributor asks an agent to fix a broken example. The source lives in `site/`, the generated output lives in `site/build/`, and verification requires the project's own commands. Put those decisions in a shared file and you can review them alongside the code. When a build command changes, the instructions can change in the same pull request.

That is the standardization `AGENTS.md` offers: a common filename and a readable place for project guidance. It emerged from collaboration across tools including Codex, Amp, Jules, Cursor, and Factory, and is now stewarded by the Linux Foundation's Agentic AI Foundation. The [project site describes that shared ownership](https://agents.md/#about).

Open stewardship matters because the instructions should remain useful when contributors change tools. Each tool still decides how it discovers and applies those instructions.

## What belongs in AGENTS.md

A useful file answers the questions that would otherwise interrupt the work: where to start, what to run, what to preserve, and how to know the change is ready.

For the documentation project, “follow best practices” adds little. “Edit source files in `site/`; do not edit generated files in `site/build/`” settles a concrete decision. “Run the checks” is vague. Naming the commands and their working directory makes the instruction usable.

Four sections are a useful starting structure:

1. **Project and layout.** What the project does and the few directories an agent needs to understand.
2. **Setup and verification.** Exact commands, where to run them, and any prerequisites.
3. **Conventions and boundaries.** Existing patterns to reuse, files to preserve, and actions that need approval.
4. **Completion.** What evidence to report and how to describe anything left untested.

Keep long explanations in the README or contribution guide. Point to the relevant section and say when to read it. The root instruction file should help the agent find the right context without becoming a second copy of all the documentation.

These are instructions the model receives, so they still need judgment and verification. A sentence saying “do not deploy” is useful guidance; actual deployment access belongs in permissions and approval controls. Anthropic makes this distinction explicit in its [instruction-file documentation](https://code.claude.com/docs/en/memory): the files provide context, not enforced configuration.

## How long should it be?

For a small repository, I would start with roughly 30–60 short lines. That is my editing budget, not a limit imposed by the format. If ten lines cover the project's important decisions, stop there. Add a rule when you can explain which recurring mistake or missing context it addresses.

Tool limits are a separate question. Codex caps the combined project instructions it loads at 32 KiB by default. That is a loading limit, not a recommended document size. Its [discovery documentation](https://learn.chatgpt.com/docs/agent-configuration/agents-md) explains the setting and how it combines files.

As the repository grows, move specialized guidance closer to the relevant code. A frontend package might need accessibility checks that do not belong in a database task. Nested `AGENTS.md` files can express that distinction, but verify your tool's discovery rules first. In Codex, for example, startup discovery follows the path from the repository root to the current working directory; it does not preload every nested file in the repository.

Before adding more instructions, remove stale commands, repeated rules, and contradictions. A short file that tells the agent to use two different package managers still needs editing.

## A useful starting example

Here is an illustrative, shortened file for the website portion of Few-Shot Academy. The paths and commands come from this repository; the example is not a replacement for our full [contributor instructions](https://github.com/fewshot-works/academy/blob/main/AGENTS.md).

```markdown title="AGENTS.md"
# Project instructions

Few-Shot Academy is a free GenAI curriculum. Write for readers
who may have no programming or AI background.

## Project layout
- `site/docs/`: curriculum pages.
- `site/blog/`: standalone practitioner articles.
- `site/src/`: shared components and styles.
- `site/build/`: generated output; edit the source instead.

## Setup and checks
- Use Node.js 22 or newer.
- From `site/`, run `npm ci` to install dependencies.
- After site changes, run these from `site/`:
  - `npm run typecheck`
  - `npm run build`
- For visual changes, check mobile layout, keyboard navigation,
  and both light and dark themes.

## Working rules
- Read the relevant page and nearby examples before editing.
- Reuse design tokens in `site/src/css/custom.css`.
- Preserve published URLs.
- Verify factual claims against primary sources.
- Keep changes focused and preserve unrelated work.
- Ask before pushing, merging, or deploying.

## Before finishing
- Summarize the change and the checks that passed.
- State what you could not verify and why.
```

The value is in the decisions it makes explicit. It identifies generated output, gives the checks a working directory, and defines what a useful handoff contains. Those instructions can be checked against the work.

Replace these paths and commands with ones you have verified in your own repository.

## Which coding tools load it?

This is a selection of coding editors and agents, not a popularity ranking. The table reflects their official documentation checked on September 8, 2026. “Automatic” means the tool recognizes the file without a filename bridge; settings can still affect loading.

| Tool | Root `AGENTS.md` | Details or setup |
| --- | --- | --- |
| [Codex](https://learn.chatgpt.com/docs/agent-configuration/agents-md) | Automatic | Combines guidance along the root-to-working-directory path. An `AGENTS.override.md` takes priority over `AGENTS.md` in the same directory. |
| [Cursor Agent](https://cursor.com/docs/rules#agentsmd) | Automatic | Also applies nested files to their directory and children. More specific instructions take precedence. |
| [GitHub Copilot in VS Code](https://code.visualstudio.com/docs/agent-customization/custom-instructions) | Automatic | Root loading is enabled by default. Nested discovery is a separate experimental opt-in; see the [settings reference](https://code.visualstudio.com/docs/agents/reference/ai-settings). |
| [Cascade (Windsurf / Devin Desktop)](https://docs.devin.ai/desktop/cascade/memories) | Automatic | Root instructions are always on; subdirectory files apply to that part of the project. |
| [Amp](https://ampcode.com/docs/customize/agents-md) | Automatic | Discovers instructions in the working directory, parents, and relevant subdirectories. |
| [Cline](https://docs.cline.bot/customization/cline-rules) | Automatic | Recognizes `AGENTS.md`; check the Rules panel for whether a detected rule is enabled. |
| [Gemini CLI](https://geminicli.com/docs/cli/gemini-md/) | Configure filename | Defaults to `GEMINI.md`. Set `context.fileName` to include `AGENTS.md`. |
| [Claude Code](https://code.claude.com/docs/en/memory#agentsmd) | Import or symlink | Reads `CLAUDE.md`. Import the shared file as shown below. |

The Copilot row is specifically about VS Code. Do not assume that an editor extension, a command-line agent, and a hosted pull-request agent load instructions identically just because they share a product name.

## Bridge the tools that need setup

For Claude Code, put this line in the root `CLAUDE.md`:

```text title="CLAUDE.md"
@AGENTS.md
```

Copy the line without the surrounding code fences. That is the arrangement in this repository. Claude's [documented import](https://code.claude.com/docs/en/memory#agentsmd) loads the shared instructions at session start. Keep any existing Claude-specific guidance below it. A root import does not by itself wire up every nested `AGENTS.md`.

A symlink is another supported option: `ln -s AGENTS.md CLAUDE.md` on macOS or Linux, when `CLAUDE.md` does not already exist. I prefer the import because it is a plain-text edit on macOS, Linux, and Windows. Anthropic also recommends it on Windows, where creating symlinks can require extra privileges.

For Gemini CLI, merge this into `.gemini/settings.json`, preserving your other settings:

```json title=".gemini/settings.json"
{
  "context": {
    "fileName": ["AGENTS.md", "GEMINI.md"]
  }
}
```

Gemini's [context configuration](https://geminicli.com/docs/cli/gemini-md/) supports multiple filenames. Keeping both lets existing Gemini-specific guidance remain discoverable; avoid repeating the shared rules in both files.

## Check the file against real work

Start a fresh session after changing the setup. Ask the agent which instruction files it loaded and which checks apply to a small task. Then inspect the commands and changes it actually makes. A convincing summary alone does not establish that the instructions shaped its work.

For the documentation example, try a small page edit. Did the agent change the source, run the checks from `site/`, and report any verification it could not complete? If it missed a rule, check loading and conflicting instructions before adding another paragraph.

I would start with one root file, verify it in the tools contributors use, and refine it when real work exposes a gap. The payoff is a set of project decisions you can maintain once and carry with the repository.
