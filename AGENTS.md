# Few-Shot Academy: Working Procedure

This file is the repository-level operating agreement for agents working on Few-Shot Academy.
It applies to the entire repository unless a more specific `AGENTS.md` exists deeper in a
directory.

## Source of truth and instruction priority

1. Follow the user's current request and explicit decisions.
2. Follow this `AGENTS.md` for repository process and quality gates.
3. Use `site/PRODUCT.md`, existing implementations, and linked GitHub issues as supporting
   context.
4. Treat status summaries in older notes as potentially stale. Verify the current source tree,
   live configuration, and issue state before relying on them.

The project is **Few-Shot Academy**, hosted at `fewshotacademy.com`, in the
`fewshot-works/academy` repository. Older references to `zero-to-agent` are historical.

## Product and audience

Few-Shot Academy is a free, open-source, local-first curriculum for Generative AI, LLMs,
embeddings, vector databases, RAG, agents, MCP, production concerns, and AI-era career
preparation.

Primary readers range from a curious high-school student to an experienced career changer.
Assume no prior AI knowledge and do not assume a computer-science degree. Career and Advanced
Concepts content may be technically deeper, but it must remain readable.

Repository map:

- `site/`: Docusaurus content site, custom React pages, blog, quizzes, and Cloudflare Pages
  Functions.
- `site/ANALYTICS.md`: privacy boundaries, GA4 event taxonomy, setup, and reporting definitions.
- `labs/`: self-contained Python labs, one folder per lesson/project.
- `email-worker/`: Cloudflare Worker used for contact notifications.
- `.github/workflows/deploy.yml`: production build, lab ZIP creation, migrations, and deployment.

Current curriculum shape:

- Foundations, Intermediate, and Advanced are the linear core curriculum.
- MCP is a standalone course.
- Advanced Concepts is a non-linear production-pattern cookbook.
- Career Tracks and Interview Prep are outcome-oriented editorial/practice surfaces.
- The blog is timely industry analysis, not a recap of the curriculum.

## Non-negotiable design commitments

Preserve the existing calm Basecamp visual system unless the user explicitly authorizes a
brand change:

- Pine green primary, warm-stone light background, near-black green dark background, and amber
  accent.
- Serif headings, restrained surfaces, borders, shadows, and topographic/contour motifs.
- No neon “AI” aesthetic, generic robot art, gratuitous gradients, or visually noisy gamification.
- Reuse tokens from `site/src/css/custom.css`; do not introduce near-duplicate colors locally.
- Design changes must improve hierarchy, comprehension, practice, or navigation, not decoration
  for its own sake.

## Standard working procedure

### 1. Establish scope before editing

- Read the relevant issue and inspect the current implementation before proposing a rewrite.
- Treat one GitHub issue or one clearly bounded deliverable as the unit of work.
- Check `git status` before editing. Preserve unrelated user changes.
- Continue on the repository's current shared work branch. Do not create or switch to a separate
  branch for each issue unless the user explicitly asks. Never switch branches if doing so would
  overwrite or strand uncommitted user work.
- Do not broaden a content edit into a framework/design migration without explicit approval.
- Agents may create local git commits autonomously when a coherent unit of work is complete and
  verified. Use focused commits with clear messages, and never include unrelated user changes.
- Link issue-related commits explicitly. Use `Closes #N` when the commit fully satisfies an
  issue so GitHub closes it when the change reaches the default branch. Use `Refs #N` when the
  commit is only a partial step. Never use a closing keyword before the issue's acceptance
  criteria and the repository definition of done are satisfied.
- Do not push, merge, deploy, close issues, or open a pull request unless the user asks for that
  action in the current conversation.

### 2. Research before writing

- Fact-check every factual claim, number, date, historical statement, anecdote, product behavior,
  protocol detail, compensation figure, and hiring claim.
- For current or changeable facts, use live authoritative sources. Prefer specifications,
  official documentation, research papers, regulator/government sources, and current first-party
  job postings.
- Use secondary sources only when they add firsthand reporting or practical context that primary
  sources cannot provide.
- Keep a claim-to-source map while researching. Do not rely on memory for facts that may have
  changed.
- Never invent a source, quote, benchmark, learner result, job requirement, incident, company
  practice, testimonial, or metric.
- If evidence is limited or conflicting, say so directly and narrow the claim.
- Training scenarios may be invented for practice, but label them clearly as illustrative. Never
  imply they are transcripts or incidents from a named company.

### 3. Diagnose and plan content

- Classify the task as a new idea, existing-draft revision, targeted correction, or factual
  update. For an existing draft, read it completely before editing, rank findings as `keep`,
  `clarify`, `restructure`, `cut`, or `rewrite`, and identify the three highest-impact problems.
  A weak premise may justify replacing or removing the artifact.
- Before drafting, define the reader, question, one-sentence thesis, outcome, next action, and
  primary path. Require logical buildup, concrete examples, tradeoffs, and the mechanism's limits.
  A blog must remain valuable after all curriculum links are removed.
- Verify examples against the real lab, README, configuration, defaults, and neighboring pages.
  Prefer useful artifacts over filler prose. Complete the plan, draft, cold review, and fixes in
  one task unless a material scope decision requires the user.

### 4. Use model effort deliberately

- When useful and supported, delegate bounded inventory, source extraction, mechanical checks,
  and initial gap detection to a fast model such as Luna. Use a strong reasoning model such as Sol
  for thesis, teaching structure, substantive writing, and a fresh-context final review. The
  primary agent fixes review findings and owns the result. Skip delegation when its coordination
  cost exceeds its benefit.

### 5. Implement the smallest complete unit

- Follow existing route, component, data, and styling patterns unless the issue explicitly changes
  them.
- Keep content data structured when the same shape repeats.
- Avoid duplicating CSS or component logic when a shared implementation already exists.
- Preserve URLs unless changing them is part of the approved scope.
- The owner has explicitly declined redirect infrastructure for page moves. Do not introduce a
  Docusaurus redirect plugin or `_redirects` file unless the user reverses that decision.
- Do not fabricate unfinished courses, testimonials, ratings, logos, or usage claims.

### 6. Verify before presenting work

Run the checks appropriate to the changed surface:

- Site TypeScript: `cd site && npm run typecheck`
- Site production build and internal links: `cd site && npm run build`
- Lab: run the exact documented command from a clean lab environment, normally
  `uv run <script>.py`.
- Interactive UI: verify keyboard use, focus visibility, responsive behavior, and both themes.
- Content: run the mandatory 12-point review below. Report failures and a concise pass summary for
  new or materially revised chapters/labs before committing or declaring the work complete.

If a check cannot be run, state exactly what was not verified and why. Never describe a lab as
tested if it was only read.

### 7. Hand off clearly

- Lead with the outcome, decision, or blocker. Default to 3-5 short bullets or brief paragraphs,
  with one idea each and plain language.
- Prioritize changes, decisions, and verification. Separate blockers from optional context. Avoid
  restating the request, narrating routine tool use, or repeating checklists.
- Expand only when requested or necessary. Use a small table only when it is faster to scan.
- Mention important limitations, assumptions, and intentionally deferred work.
- Link the relevant files and issue.
- Record agreed future work or out-of-scope bugs in GitHub issues so it does not live only in
  chat. Check existing issues first and use `fewshot-works/academy`, not the historical repo name.

## Mandatory 12-point content review

Apply the full checklist to every new or materially revised chapter and lab. Apply the relevant
items to blog, career, interview, and landing-page work.

1. **Claims and data accuracy**
   - Fact-check every claim and data point against real sources.
   - Check that qualifiers in the source survive into the prose.

2. **Historical context and trivia accuracy**
   - Verify dates, firsts, origin stories, anecdotes, quotations, and “did you know” facts.
   - Remove trivia that cannot be supported or that distracts from the lesson.

3. **Lab accuracy and reproducibility**
   - Run the lab end to end using the README instructions.
   - Confirm dependencies, `.env.example`, commands, fixtures, expected output, and troubleshooting.
   - Re-capture any output quoted in the chapter or README. Model output is nondeterministic; do
     not trust an earlier transcript without a fresh run.

4. **Plain, understandable language**
   - Use short sentences, concrete examples, and plain language.
   - Define unavoidable jargon in the same breath.
   - Explain why a step exists, not only what to type.

5. **Logical writing and meaningful emphasis**
   - Check sentence boundaries, paragraph order, transitions, and conclusions.
   - Use **bold** sparingly for concepts, backticks for literal commands/code/identifiers, and
     headings for structure. Do not use typography as decoration.
   - Use the existing fonts and style tokens; do not add ad hoc font treatments.

6. **Visible tips and important context**
   - Use an obvious marker such as 💡 with a `:::tip`, `:::note`, or equivalent callout when a
     genuine tip, warning, or memorable fact deserves extra attention.
   - Do not scatter emoji through ordinary prose or label unimportant text as a tip.

7. **Tell–tell–tell structure**
   - Tell readers what they are about to learn or build.
   - Teach or demonstrate it.
   - Recap what changed and point to the next action.
   - Track overview/preface pages must recap what came before, explain what is different now, and
     state the concrete outcome by the end. Keep authoring status out of reader-facing prose.

8. **Quiz accuracy**
   - Verify every question, option, correct index, and explanation.
   - A learner must be able to derive the answer from the chapter or lab.
   - Avoid ambiguous distractors and accidental multiple-correct-answer questions.

9. **Checkpoint and quiz distinctness**
   - Cross-check every quiz question against every Checkpoint question.
   - Do not repeat the same scenario, fact, or reasoning in different words.
   - If the explanation for both would be substantially the same, rewrite the quiz to test a
     different angle: analogy, lab observation, ecosystem detail, failure mode, or generalization.

10. **Cross-platform commands**
    - Validate commands for macOS/Linux shells and native Windows Terminal/Command Prompt or
      PowerShell, not WSL.
    - Show both forms where syntax differs, such as `cp` versus `copy`.
    - Do not publish a command merely because it works on the author's Mac.

11. **ADHD- and disability-friendly presentation**
    - Keep paragraphs to roughly 3–5 sentences and one idea each.
    - Break long stretches with descriptive subheadings, lists, tables, diagrams, code, or
      purposeful callouts.
    - Add a brief TL;DR before unusually long concept sections.
    - Use semantic headings, descriptive link text, alt text, keyboard-operable controls, visible
      focus, adequate contrast, and reduced-motion behavior.
    - Preserve a clear primary reading path; move optional history and edge cases into
      `<details>` where appropriate.

12. **UI suitability for labs**
    - Explicitly evaluate whether a UI would materially help the learner understand, demonstrate,
      or showcase the result.
    - Capstone and deployment/showcase labs should normally have a visible UI.
    - Focused cookbook/mechanism labs may remain CLI-only when a UI would hide the lesson or add
      disproportionate setup.
    - Do not silently expand scope. Record the UI decision and ask the user before adding a
      substantial UI that was not part of the task.

## Curriculum writing rules

### Voice

- Write like a patient human practitioner, not a generated textbook.
- Avoid em dashes as a stylistic crutch. Prefer periods, commas, or conjunctions. Search all new
  user-facing `.md`, `.mdx`, `.tsx`, and `.ts` copy for `—` before declaring it finished.
- Introduce new concepts with a story, real situation, or analogy before the technical mechanism.
- Prefer concrete observed behavior over abstract claims.
- Keep examples coherent across the explanation, diagram, lab, Checkpoint, and quiz.

### Standard chapter structure

Use this default shape unless the user approves a different teaching format:

1. H1 title
2. Single Time/Cost blockquote immediately after the H1
3. Concept and motivating example
4. Mermaid diagram where a relationship or flow benefits from one
5. Hands-on lab with real expected output
6. Checkpoint using `<details>` / `<summary>` reveal-answer questions
7. Check Your Knowledge using the graded `<Quiz>` component, normally 3–4 questions
8. What's Next with a concrete transition

Every chapter needs a Checkpoint. Overview/preface pages are lighter and do not need a quiz.
Use Mermaid for diagrams instead of embedding static diagram screenshots.

### Lab implementation

- Labs are self-contained: README, script(s), `pyproject.toml`, committed `uv.lock`, and
  `.env.example` where needed.
- Use `uv`; do not add `requirements.txt`, manual `venv`, or `pip install` workflows.
- Prefer beginner-readable, top-to-bottom code. Avoid unnecessary classes, factories, shared
  frameworks, clever one-liners, or defensive abstractions.
- Use functions when they improve comprehension. Use required library decorators only when the
  concept depends on them, and explain what they do.
- Provider selection remains a plain `PROVIDER` value with understandable `if/elif` behavior.
- Langflow is the only no-code/visual bonus tool unless the user explicitly approves another.
- Default teaching order is plain Python first, then an optional visual/low-code version.

When testing with Ollama, use:

- Start from the repository root: `../help-scripts/start_ollama.sh`
- Stop from the repository root: `../help-scripts/stop_ollama.sh`

Always stop Ollama in the same working session after testing.

## Blog rules

- Blog posts are industry observations and arguments for engineers/practitioners, not curriculum
  recaps.
- Lead with a concrete claim, number, named incident, or opinion in the first 1–2 sentences.
- Keep the visible title short and centered on one sharp claim. Do not mention chapter numbers or
  “what you built in this course” in the title.
- Curriculum/career links may appear briefly where useful, usually near the end. Do not organize
  the entire post around mapping back to lessons.
- End with a concrete opinion, implication, or action, not a generic summary.
- Target at least one purposeful visual per roughly 800–1,000 words when the subject contains a
  real flow, mechanism, architecture, or numeric comparison.
- Avoid three or more uninterrupted prose paragraphs. Break every roughly 150–250 words with
  meaningful structure.
- Keep paragraphs to about 3–4 sentences.
- Co-locate each social card in the post folder and reference it through front matter.
- Prefer diagrams/tables built from evidence over generic generated AI illustration.

## Career and interview content rules

- Research each role as thoroughly as the existing strongest career guides.
- Use current job postings, employer career pages, credible interview documentation, and
  firsthand practitioner accounts.
- Distinguish observed market patterns from a single employer's process.
- Date or qualify compensation and hiring figures. Do not present a point-in-time range as a
  timeless universal fact.
- Label practice cases as illustrative unless they document a sourced real case.
- Favor active practice: prompts, progressive constraints, starter code, tests, worksheets,
  rubrics, alternative solutions, and self-assessment.
- A polished model answer alone is not sufficient interview preparation.

## Definition of done

Work is done only when:

- The requested scope is complete without unrelated changes.
- Claims and sources pass review.
- Required tests/builds/lab runs pass.
- Real output shown to learners matches a fresh run.
- Checkpoint and quiz do not duplicate each other.
- Cross-platform instructions are present and checked.
- Accessibility and short-attention-span formatting have been reviewed.
- UI suitability has been explicitly considered.
- The handoff states what was verified and what remains unverified.
