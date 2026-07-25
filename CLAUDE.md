# zero-to-agent — project instructions

A free, open-source, chapter-wise curriculum teaching GenAI/LLMs/Vector DBs/RAG/Agents from
complete-beginner level up. Docs live in `site/` (Docusaurus), runnable code lives in `labs/`.
Full details: `PRD.md`.

## Audience and voice

Assume **zero CS background**. Readers range from a curious high schooler to a 50-year-old
career changer. Write accordingly:

- Plain language, no jargon. If a technical term is unavoidable, define it in the same breath.
- Every new concept gets a **story, anecdote, or real-world analogy** before the technical
  explanation — not after, not instead of. Established examples: phone autocomplete →
  next-token prediction, Russian nesting dolls → AI/ML/DL/GenAI nesting, teaching a kid to
  recognize dogs → machine learning, a chef improvising vs. following a recipe →
  generative vs. non-generative AI.
- Step-by-step instructions explain **why** a step happens, not just what to type.
- Keep sentences short. Prefer concrete examples over abstract description.

## Chapter format (PRD §8)

Every chapter follows this shape:

**Concept → Diagram (Mermaid) → Hands-on Lab (expected output shown inline) → Checkpoint
(`<details>`/`<summary>` reveal-answer questions, no backend) → Cost/time note → What's Next.**

Mermaid is already wired up (`@docusaurus/theme-mermaid` in `docusaurus.config.ts`) — use it
for any diagram rather than a static image.

## Lab code style — no AI slop

Lab code must read like something a beginner wrote, not what a senior engineer would ship:

- No classes, no decorators, no clever one-liners.
- Minimal or no error handling — only what a beginner would naturally think to add.
- No shared library across labs. Every lab folder is copy-paste self-contained: its own
  `README.md`, script, `pyproject.toml`, `.env.example`.
- Provider choice (Ollama / OpenAI / Anthropic) is a single `PROVIDER` value read from `.env`
  with a plain `if/elif` — never an abstraction, factory, or shared client class.
- Top-to-bottom scripts. Functions only if they genuinely aid a beginner's reading, not as a
  default habit.

## Python environment: uv, not venv/pip

This project uses **[uv](https://docs.astral.sh/uv/)** for all Python environment and
dependency management — not manual `venv` + `pip`. Concretely:

- Each lab folder has a `pyproject.toml` listing its dependencies (and a committed `uv.lock`).
- Learners run scripts with `uv run <script>.py` — uv creates the isolated `.venv` and installs
  dependencies automatically on first run. No `pip install`, no `source venv/bin/activate`, no
  separate Python install step (uv can fetch Python itself).
- When writing a new lab: add a `pyproject.toml` (see
  `labs/tier1-foundations/02-first-api-call/pyproject.toml` as the template), not a
  `requirements.txt`.
- `.gitignore` already ignores `labs/**/.venv/` and `labs/**/venv/` — no changes needed per lab.

## No-code tool: Langflow only

Use **Langflow only** for any no-code/visual bonus section — not n8n, and not both. Langflow
covers both RAG-style chain building and agent building (including exposing flows as an MCP
server), so one tool spans everything Tier 1/2 needs a visual bonus for. Do not introduce a
second no-code tool "for variety" — consistency matters more than breadth here, and the project
owner has direct Langflow experience to draw on when writing those sections.

## Local Ollama — always stop it when done

Ollama uses the local GPU. Never leave it running idle after testing.

- Start: `/Users/mrai/datastax/codesample/help-scripts/start_ollama.sh`
- Stop: `/Users/mrai/datastax/codesample/help-scripts/stop_ollama.sh`

Use these scripts, not a bare `ollama serve &` — they handle logging and PID tracking so the
stop script can reliably find and kill the right process. **Always run the stop script after
you're done testing a lab against Ollama**, in the same turn/session, not "later."

## Hosting and CI/CD

- Hosted on **GitHub Pages**, deployed via GitHub Actions (`.github/workflows/deploy.yml`) on
  every push to `main` that touches `site/**`. No manual `npm run deploy` — just push.
- Live at https://fewshot-works.github.io/zero-to-agent/
- After any change under `site/`, you can verify deployment landed with:
  `gh run list --workflow=deploy.yml --limit 3` and `gh run view <id> --json status,conclusion`.

## Current state

Tier 1 Chapters 0–2 are written and live. Chapters 3–8 (Prompting, Embeddings, Vector DB, RAG,
Agents, Capstone) are not yet written — see `PRD.md` §7 for the outline. Continue chapter by
chapter, following the format and voice rules above without re-deriving them from scratch.
