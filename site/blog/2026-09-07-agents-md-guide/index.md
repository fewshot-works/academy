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

Imagine asking an agent to add a page on Monday. You explain the project's colors, where the source lives, and why the navigation must stay as it is. On Friday, a contributor picks up the work in another coding tool. Their agent proposes a new color scheme and reorganizes the navigation. The decisions are still in Monday's conversation, but they never made it into the repository.

That is the gap this file is meant to close. Write the ground rules down once, keep them with the code, and give the next agent a place to start.

{/* truncate */}

## The instructions should travel with the project

For an open-source maintainer, Friday's contributor may use a different coding tool. Keeping the instructions in the repository makes them available to both people; a shared filename gives their tools a common place to look. One contributor can use Codex and another Cursor without needing separate copies of the same build instructions.

That practical benefit is also the story behind the name. Amp initially used `AGENT.md`, singular. When OpenAI chose `AGENTS.md`, Amp agreed to switch if OpenAI secured the matching domain. On [August 20, 2025, Amp announced the change](https://ampcode.com/news/AGENTS.md). Sharing a standard mattered more than keeping its original filename.

The Linux Foundation dates the format's release to August 2025. By its [December 9 announcement of the Agentic AI Foundation](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation), it reported adoption by more than 60,000 open-source projects and agent frameworks. That is a dated adoption report, not a live count. `AGENTS.md` became one of the foundation's initial projects.

The convention gives those contributors a common starting point, although each tool still decides how to discover and apply the file. First, that shared file needs instructions worth carrying forward.

## Write down the decisions the next agent needs

A useful file answers the questions that would otherwise interrupt the work: where to start, what to run, what to preserve, and how to know the change is ready.

For our imagined documentation project, “follow best practices” adds little. “Edit source files in `site/`; do not edit generated files in `site/build/`” settles a concrete decision. “Run the checks” is vague. Naming the commands and their working directory makes the instruction usable.

Four sections are a useful starting structure:

1. **Project and layout.** What the project does and the few directories an agent needs to understand.
2. **Setup and verification.** Exact commands, where to run them, and any prerequisites.
3. **Conventions and boundaries.** Existing patterns to reuse, files to preserve, and actions that need approval.
4. **Completion.** What evidence to report and how to describe anything left untested.

For a small repository, I would start with roughly 30–60 short lines. That is my editing budget, not a format limit. If ten lines cover the important decisions, stop there. Add a rule when you can name the recurring mistake it should prevent.

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

The next agent now has somewhere to find the source paths, design rules, and checks that were stranded in Monday's conversation. Replace the example's paths and commands with ones you have verified in your own repository.

These are still instructions the model receives, so check its work. “Do not deploy” is useful guidance; actual deployment access belongs in permissions and approval controls. Anthropic's [documentation](https://code.claude.com/docs/en/memory) explicitly distinguishes instruction files from enforced configuration.

## Make sure your tool reads it

With the file written, the next step is to connect it to the agent. Some tools recognize `AGENTS.md` directly; others need a small configuration change.

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

### Connecting Claude Code and Gemini CLI

The last two rows need setup, but you can keep the shared rules in `AGENTS.md`. For Claude Code, put this line in the root `CLAUDE.md`:

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

## Let the setup grow with the work

Once the short file is written and your tool is set up to read it, you have a starting point for the next session. Over time, you may also want to preserve architecture explanations, design reasoning, or the state of unfinished work. Those do not all belong in the everyday instructions.

Separate architecture, design, and decision notes can preserve reasoning the code cannot explain. In our Monday-to-Friday example, “use these colors” records a rule. “We kept the existing palette so new pages match the rest of the site” records why it exists.

But five overlapping summaries give you five places to forget an update. Choose a pattern that solves a problem you actually have:

| Pattern | When it helps | What to watch |
| --- | --- | --- |
| Short root file with links to project docs | Architecture or design explanations are too long for everyday instructions. | Say when to read each document; a link alone does not guarantee it gets read. |
| Instructions scoped to a directory | Different packages need different checks or conventions. | Confirm the tool's nesting rules. Avoid copying root rules into every package. |
| A temporary handoff note | A task spans sessions or pauses halfway through. | Record the current state, unresolved questions, and next step; replace outdated notes when work moves on. |

The first two have direct support in tools such as [Cursor](https://cursor.com/docs/rules), which documents references and nested instructions. For handoffs, Anthropic describes [using progress files alongside Git history](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents).

### Splitting files does not create more memory

The context window, the material a model can use at once, is finite. Summarizing a long conversation helps it continue, but that summary can miss details the next session needs.

Tools can also limit how much they load. Codex has a [32 KiB default limit](https://learn.chatgpt.com/docs/agent-configuration/agents-md) on the combined project instructions it loads, but that is a ceiling, not a target.

The loading strategy matters more than the file count. Claude Code's [`@` imports](https://code.claude.com/docs/en/memory#import-additional-files) load the referenced content at launch. Splitting one large file into five and importing all five still puts that material into context. To keep startup context small, keep the root guidance brief and instruct the agent to read the relevant supporting document when the task calls for it.

A “resume this project” prompt can tell the agent to read a handoff; it cannot recover details nobody saved. Update the relevant document when a decision changes. Before pausing, record unfinished work, checks performed, and the next step. Review those updates in the diff instead of assuming the agent made them.

My default is one short `AGENTS.md`, existing project docs for durable decisions, and a handoff note only when there is work to resume. Add files when they remove confusion.

## Try the next handoff

Return to Friday's contributor. The useful test is whether the saved instructions help them pick up the work. Start a fresh session after changing the setup and try a small page edit. Did the agent find the source, use the existing design, run the right checks, and report anything it could not verify?

If it misses a rule, check which files loaded and whether their instructions conflict before adding another paragraph. The goal is to stop re-explaining the same decisions, while keeping those decisions easy to find and maintain.
