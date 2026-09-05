# Few-Shot Academy: Agent Rules

Repository-wide rules; a deeper `AGENTS.md` overrides them.

## Authority and context

1. Follow the user's current request and decisions.
2. Follow this file.
3. Use `site/PRODUCT.md`, current code/configuration, linked issues, and `site/ANALYTICS.md` where relevant.
4. Verify stale notes, issue state, and live behavior before relying on them.

This is Few-Shot Academy (`fewshotacademy.com`, `fewshot-works/academy`; `zero-to-agent` is historical): a free, open-source, local-first GenAI curriculum for curious high-school students through career changers. Assume no AI or CS background; deeper content must remain readable.

- `site/`: Docusaurus site, blog, quizzes, and Cloudflare Pages Functions.
- `labs/`: self-contained Python labs. `email-worker/`: contact notifications.
- Foundations, Intermediate, and Advanced are linear; MCP stands alone; Advanced Concepts is a production cookbook; Career/Interview content is outcome-oriented; the blog is industry analysis, not curriculum recap.

## Non-negotiables

- Preserve the calm Basecamp system: tokens from `site/src/css/custom.css`, pine/warm-stone/amber palette, serif headings, restrained surfaces, and contour motifs. No neon AI styling, generic robots, gratuitous gradients, noisy gamification, or duplicate local colors.
- Design changes must improve hierarchy, comprehension, practice, or navigation.
- Never fabricate courses, testimonials, ratings, logos, metrics, sources, quotes, incidents, company practices, job requirements, benchmarks, or learner results.
- Preserve URLs. Do not add Docusaurus redirects or `_redirects` unless the owner reverses the existing decision.

## Workflow

### 1. Scope

- Read the issue and current implementation; treat one issue or bounded deliverable as the unit of work.
- Check `git status`; preserve unrelated changes, never strand uncommitted work, and remain on the shared branch unless the user asks otherwise.
- Do not expand content work into a framework, design, or product migration without approval.
- Local focused commits are allowed after verification. Use `Closes #N` only when fully done; otherwise `Refs #N`. Push, merge, deploy, PR, and issue-closing actions require a user request in the current conversation.

### 2. Content planning

- Classify work as new content, existing-draft revision, targeted correction, or factual update.
- For an existing draft, read it completely before editing; rank findings as `keep`, `clarify`, `restructure`, `cut`, or `rewrite`, then address the three highest-impact problems. Replace or remove a weak premise.
- Before drafting, define the reader, question, one-sentence thesis, outcome, next action, and primary path.
- Require logical buildup, concrete examples, tradeoffs, and limits. A blog must remain useful without curriculum links.
- Verify examples against the lab, README, configuration, defaults, and neighboring pages. Prefer exercises, diagrams, comparisons, rubrics, tested artifacts, or decision checklists over filler.
- Complete plan, draft, cold review, and fixes in one task unless a material scope decision requires the user.

### 3. Research

- Fact-check every claim, number, date, anecdote, product/protocol behavior, compensation figure, and hiring claim; preserve source qualifiers.
- For changeable facts, use current primary sources: specifications, official documentation, papers, regulators, and first-party job postings. Use secondary sources only for necessary reporting/context.
- Keep a claim-to-source map. Narrow uncertain or conflicting claims instead of guessing.
- Clearly label invented training scenarios as illustrative; never present them as real incidents or transcripts.

### 4. Model effort

- When useful and supported, use a fast subagent such as Luna for bounded inventory, source extraction, mechanical checks, and initial gap detection; use a strong reasoning model such as Sol for thesis, teaching structure, substantive writing, and fresh-context final review.
- The primary agent fixes review findings and owns the result. Skip delegation when coordination costs more than it saves.

### 5. Implementation and verification

- Follow existing route, component, data, and styling patterns; reuse shared structures and logic.
- Run relevant checks: `cd site && npm run typecheck`, `cd site && npm run build`, the exact lab README command from a clean environment, and interactive UI checks for keyboard, focus, responsiveness, and both themes.
- Run the 12-point review below for new/materially revised chapters and labs; apply relevant items elsewhere. Report failures plus a concise pass summary.
- State exactly what was not verified and why. A lab read but not run is untested.

### 6. Communication

- Lead with the outcome, decision, or blocker in 3-5 short bullets or paragraphs, one idea each.
- Prioritize changes, decisions, verification, and limitations. Separate blockers from optional context.
- Do not restate the request, narrate routine tool use, or repeat checklists. Expand only when requested or necessary; use a small table only when faster to scan.
- Link relevant files/issues. Record agreed future work in an existing or new `fewshot-works/academy` issue.

## Mandatory 12-point content review

1. **Claims:** Verify every claim/data point and retain source qualifiers.
2. **History/trivia:** Verify dates, firsts, origins, anecdotes, and quotes; remove unsupported or distracting trivia.
3. **Lab:** Run README steps end to end; check dependencies, `.env.example`, commands, fixtures, output, and troubleshooting; freshly recapture nondeterministic model output.
4. **Language:** Use short, concrete sentences; define jargon immediately and explain why, not only how.
5. **Logic/emphasis:** Check progression, transitions, and conclusions; use headings structurally, bold sparingly, backticks for literals, and existing typography.
6. **Callouts:** Reserve 💡 and tip/note/warning blocks for genuinely important context; avoid decorative emoji.
7. **Teaching arc:** Preview, teach, recap, and give a concrete next action; overviews also connect prior learning to the new outcome and exclude authoring status.
8. **Quiz:** Verify questions, options, correct indices, and explanations; answers must follow from the lesson with no ambiguous or multiple-correct distractors.
9. **Distinctness:** Checkpoints and quizzes must test different scenarios or reasoning; rewrite either when their explanations substantially overlap.
10. **Cross-platform:** Validate macOS/Linux and native Windows Terminal/Command Prompt or PowerShell; show both forms where syntax differs.
11. **Accessibility:** Keep one idea per short paragraph; use descriptive structure, TL;DRs for long concepts, semantic headings/links, alt text, keyboard/focus support, contrast, reduced motion, and `<details>` for optional depth.
12. **Lab UI:** Decide explicitly whether UI improves learning/showcase value; capstones normally need UI, focused mechanism labs may stay CLI-only, and substantial unrequested UI requires approval.

## Curriculum and content

### Author voice

- Write like an experienced practitioner explaining how he reached a decision: practical, conversational, direct, candid, and aware of real constraints.
- Start with the main point or governing constraint. For teaching content, a concrete situation may establish that constraint before explaining the mechanism. Then give the relevant context, show what happens in practice, identify the important tradeoff, and make a clear recommendation or next step.
- Use concrete examples and practical consequences. Consider the alternatives that could change the decision, but do not turn every statement into a qualification or every argument into a perfectly balanced list.
- Make the call when the evidence supports one. Say plainly when something is unknown, a claim is weak, or another objection is valid.
- Prefer ordinary professional language over academic, promotional, corporate, or inflated wording. Avoid generic scene-setting, artificial enthusiasm, and formulaic transitions.
- Use first person selectively for judgment and recommendations. Favor cohesive paragraphs; use bullets and tables only when they make a decision, comparison, responsibility, or takeaway easier to scan.
- Preserve the owner's reasoning while correcting grammar, spelling, sentence structure, and unclear transitions. The result should sound like a polished version of the owner, not a communications department or an executive memo.

### Voice and chapters

- Write like a patient practitioner, not a generated textbook. Introduce concepts through a situation, story, or analogy before the mechanism; keep one coherent example across prose, diagram, lab, checkpoint, and quiz.
- Avoid stylistic em dashes; search new user-facing `.md`, `.mdx`, `.tsx`, and `.ts` copy for `—`.
- Default chapter order: H1; one Time/Cost blockquote; motivating concept; useful Mermaid diagram; hands-on lab with real output; `<details>` Checkpoint; 3-4 question `<Quiz>`; concrete What's Next.
- Every chapter needs a Checkpoint. Overview/preface pages need no quiz. Use Mermaid instead of static diagram screenshots.

### Labs

- Each lab contains README, scripts, `pyproject.toml`, committed `uv.lock`, and `.env.example` when needed. Use `uv`, not `requirements.txt`, manual virtual environments, or `pip install`.
- Prefer beginner-readable top-to-bottom code; use functions when clearer and avoid unnecessary classes, factories, frameworks, cleverness, or defensive abstractions.
- Keep provider selection as a plain `PROVIDER` value with clear `if/elif`; teach plain Python before optional visual/low-code work. Langflow is the only approved visual bonus tool.
- Test Ollama from the repository root with `../help-scripts/start_ollama.sh` and `../help-scripts/stop_ollama.sh`; always stop it in the same session.

### Blog

- Make one sharp, standalone argument for practitioners; open with a concrete claim, number, incident, or opinion and end with a concrete implication/action.
- Keep titles short and free of chapter/course framing. Place curriculum links briefly, usually near the end.
- Use purposeful evidence-based diagrams/tables rather than generic AI art: roughly one visual per 800-1,000 words when the topic has a real flow, architecture, or numeric comparison.
- Keep paragraphs near 3-4 sentences and break every 150-250 words with meaningful structure.
- Co-locate and reference each social card from front matter.

### Career and interview content

- Research roles with current postings, employer pages, credible interview documentation, and firsthand accounts; distinguish market patterns from one employer.
- Date/qualify compensation and hiring figures; label unsourced practice cases illustrative.
- Favor prompts, constraints, starter code, tests, worksheets, rubrics, alternatives, and self-assessment; a polished model answer alone is insufficient.

## Done

The requested scope is complete only when sources, relevant checks, fresh lab output, quiz/checkpoint distinctness, cross-platform steps, accessibility, UI suitability, and the concise handoff all pass, with any unverified item stated.
