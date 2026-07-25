# PRD: zero-to-agent — A Free, Local-First, Chapter-Wise Curriculum for LLMs, Vector DBs, RAG & Agents

**Status:** Approved for build (decisions locked in §14)
**Owner:** (you)
**Repo:** github.com/fewshot-works/zero-to-agent
**Last updated:** 2026-07-25

---

## 1. Executive Summary

GenAI/LLM/Agent skills are in extremely high demand (Andrew Ng's "Generative AI for Everyone" alone has hundreds of thousands of enrollments; Hugging Face's LLM/Agents courses report six-figure signups; 88+ GenAI bootcamps are tracked on Course Report) — but the *learning path* is fragmented and has real friction points:

- Most content is **video-first**, with code as an afterthought (companion repo, not integrated).
- Programs that are hands-on often **assume prior Python/API/cloud familiarity** — true beginners ("what is a token?") are underserved.
- Deep, hands-on labs frequently **require cloud credits** (Google Cloud, Azure) or a credit card, which is a real barrier for hobbyists and students.
- **No single resource spans the whole arc** — "I don't know what an LLM is" all the way to "I can build and deploy a production agentic RAG system" — in one coherent, versioned, free curriculum.

**zero-to-agent** fills that gap: a free, open-source, chapter-wise curriculum delivered as a static website (content, diagrams, explanations) paired with a companion code repository (runnable Python labs). Everything runs on the learner's own laptop — no servers, no accounts, no vendor lock-in. Vector storage uses local ChromaDB (zero infra). LLM access is bring-your-own-key (OpenAI/Anthropic), with an explicit free/local path via Ollama for learners who can't or won't pay for an API key. Hosting is a static site on Vercel's free tier — there is no backend, no database, and no user accounts for v1.

---

## 2. Problem Statement

> "Generative AI, LLMs, Vector DBs, Agents, Agentic AI, RAG, inference — still very unknown. Very few people truly understand these concepts, even though the field is exploding."

Three distinct audiences are underserved today:

1. **Complete beginners** (non-engineers, students, career switchers) who are curious but intimidated — existing "for everyone" content (Coursera's Ng course) is conceptual-only, with no hands-on practice, so understanding doesn't stick.
2. **Software engineers** who are comfortable coding but have never touched embeddings, vector search, or agent loops — they want to skip the fluff and get to working code fast, but most beginner content wastes their time and most advanced content assumes context they don't have.
3. **Self-learners without a budget or company card** — cloud-credit-gated labs (Azure/GCP) and paid bootcamps ($400–$2000+) exclude students and hobbyists in a field where the tooling itself (open models, local vector DBs) is actually free.

## 3. Market Validation (Due Diligence Summary)

Research across DeepLearning.AI, Hugging Face, LangChain Academy, Coursera, Udemy, Microsoft Learn, and Google Cloud learning paths found:

| Finding | Implication for us |
|---|---|
| Strong, proven demand (6-figure enrollments across multiple free and paid GenAI courses) | Market is not saturated relative to demand; a well-executed free resource can find an audience |
| Most hands-on content is notebook-first, not a structured "textbook + labs" site | A clean, navigable, versioned web curriculum is a differentiator, not a commodity |
| Local-first, no-cloud-credit, step-by-step labs are conspicuously rare | This is our sharpest wedge — explicitly market "runs entirely on your laptop, $0 infra cost" |
| Intermediate/advanced agent content (LangChain Academy, HF Agents course) assumes prior familiarity | Confirms a gap for true beginners; also means we shouldn't try to out-depth LangChain Academy on advanced agent internals — we differentiate on the *full arc* and the *practice-first* format, not on being the deepest agent-framework reference |
| Learner complaints: cost, cloud-credit requirements, promotional/shallow "short courses,", setup friction | Directly validates: free, BYOK-or-local, one clear setup chapter, real depth not just marketing content |

**Verdict:** There is a real, evidenced gap. This is not "yet another GenAI course" — the differentiated position is *one free, coherent, local-first, beginner-to-advanced arc with runnable code at every step.*

**Competitive positioning statement:**
> "The only free course that takes you from 'what is a token' to a deployed, evaluated, guardrailed agentic RAG system — running entirely on your own laptop, at near-zero cost."

## 4. Target Users / Personas

1. **Priya, Curious Beginner** — marketer or student, uses ChatGPT daily, has never written Python professionally. Needs: plain-English explanations, tiny copy-pasteable code, hand-holding on setup, visible progress, confidence-building wins.
2. **Sam, Software Engineer** — 5+ years coding, comfortable with APIs/pip/venv, has never built with embeddings or agents. Needs: skip-ahead capability, real patterns (not toy examples), production-adjacent best practices, minimal hand-holding on basic Python.
3. **Devi, ML/Data Practitioner** — knows classic ML, new to the LLM-specific tool stack (prompting, vector DBs, agent loops). Needs: how GenAI-specific tooling differs from what she already knows; wants the "why," not just the "how."

Primary launch persona for content tone: **Priya for Tier 1, Sam for Tier 2–3.** (Devi is served by both, without dedicated content.)

## 5. Goals & Non-Goals

### Goals (v1)
- A learner with zero AI background can complete Tier 1 and understand + hand-build a basic RAG Q&A bot.
- A learner with coding experience can go from zero GenAI knowledge to a working multi-tool agent (Tier 2) in a single sitting-based, self-paced track.
- Every lesson has runnable, local, BYOK-or-free code — no lesson is video/reading only if a hands-on version is feasible.
- Zero infrastructure cost to run: no backend, no database, no paid hosting, no required paid API key (Ollama path always available for Tier 1–2).
- Open-source, so the community can extend it and the project can outlive any single content refresh cycle.

### Non-Goals (v1 — explicitly out of scope)
- No user accounts, login, or server-side progress tracking.
- No payments, certificates, or accreditation.
- No live/cohort instructor-led sessions.
- No in-browser code execution sandbox (labs run in the learner's local terminal/IDE).
- No mobile app.
- Not attempting to be the deepest agent-framework reference (that's LangChain Academy's niche) — we own the *full beginner-to-advanced arc*, not framework-internals depth.

## 6. Key Architecture Decision (flagging a tension in the original ask)

The brief asks for both: (a) a **web UI** experience, and (b) code that **"runs local."** These aren't in conflict, but the shape matters:

- **The website is a static content browser** (lessons, diagrams, explanations, embedded code *snippets* for reading) — hosted free on Vercel, no backend, no DB. This matches "static content" and free-tier hosting perfectly.
- **The actual hands-on labs run in the learner's own terminal/IDE**, not in the browser. Each lesson links to a folder in the companion code repo; the learner clones the repo once, `pip install`s once, and runs each chapter's lab locally with their own `.env` (API keys) and a local Chroma data folder.
- This is **the only architecture consistent with "no DB," "static content," "free tier hosting," and "runs local"** simultaneously. A browser-based code sandbox (e.g., full WASM execution or a hosted Jupyter backend) would require either paid infrastructure or heavy engineering — explicitly rejected for v1.
- **Exception:** trivial, zero-dependency *conceptual* widgets (e.g., a client-side JS visualization of cosine similarity between two vectors, or a tokenizer visualizer) can run directly in-browser with no Python needed — these are nice-to-have enhancements for the most basic lessons only, not a general execution engine.

## 7. Curriculum Outline

Each tier is a set of chapters; each chapter = **Concept → Diagram → Hands-on Lab → Checkpoint → What's Next**.

### Tier 1 — Foundations (zero prior knowledge assumed)
0. **Set up your machine** (Python, venv, VS Code, get an API key *or* install Ollama) — the "Chapter 0" that removes setup as a blocker
1. What is AI / ML / Deep Learning / Generative AI — the vocabulary map
2. What is an LLM — tokens, next-token prediction, context windows → *lab: your first API call*
3. Prompting 101 — zero-shot, few-shot, system prompts → *lab: a prompt playground script*
4. What is an embedding — vectors & similarity → *lab: visualize + compute cosine similarity*
5. What is a vector database, and why — *lab: store & query vectors in local Chroma*
6. What is RAG — *lab: build your first RAG bot over a text file*
7. What is an AI agent — tools + reasoning loop vs. a plain chatbot (concept only)
8. **Capstone:** a Q&A bot over your own documents

### Tier 2 — Intermediate
1. Chunking strategies (fixed, recursive, semantic) and why they matter
2. Choosing an embedding model — OpenAI vs. open-source (sentence-transformers): cost/quality/latency
3. Better retrieval — hybrid search, metadata filtering, re-ranking
4. Prompt patterns — chain-of-thought, structured/JSON output, function calling
5. Tool use — *lab: build a tool-calling assistant (calculator, web search)*
6. Your first agent — raw function-calling loop, then a light framework (compare vs. rolling your own)
7. Memory — short-term context vs. summarized long-term memory
8. Evaluating what you built — retrieval precision/recall basics, intro to LLM-as-judge
9. **Capstone:** a multi-tool agent (web search + calculator + RAG over your docs)

### Tier 3 — Advanced
1. Multi-agent patterns — supervisor, hierarchical, swarm
2. Advanced RAG — query rewriting, HyDE, multi-hop retrieval, self-correcting RAG
3. Fine-tuning vs. RAG vs. prompting — when to use what (conceptual + optional local fine-tune demo)
4. Guardrails & safety — prompt injection defense, output validation
5. Observability — tracing agent runs, cost/latency/token tracking
6. Production concerns — caching, rate limiting, streaming, cost optimization
7. Shipping it — packaging your agent/RAG app as an API, basic containerization
8. **Capstone:** an end-to-end agentic RAG system with evaluation, guardrails, and tracing

**MVP scope (v1 launch):** Tier 1 (complete) + Tier 2 chapters 1–6. Tier 2 chapters 7–9 and all of Tier 3 ship in v1.1/v1.2. This keeps the initial content lift achievable solo while still delivering a genuinely useful, differentiated product on day one.

## 8. Lesson Format (applies to every chapter)

1. **Concept** — plain-language explanation, analogy-driven for Tier 1, diagram (Mermaid) for flow/architecture.
2. **Hands-on lab** — link to the companion repo folder; step-by-step README; expected output shown inline on the page so learners can self-verify without running anything if they're just reading.
3. **Checkpoint** — 2–4 self-check questions (client-side only, no grading backend, just reveal-the-answer).
4. **Cost/time note** — estimated $ cost (if using a paid API) and time to complete, set upfront so there are no surprises.
5. **What's next** — one-line bridge to the following chapter.

## 9. Technical Architecture & Stack

**No database. No backend. No user accounts.** Two artifacts in one repo:

```
zero-to-agent/
├── site/              # static content site (deployed to Vercel)
│   └── docs/           # one MDX file per lesson, organized by tier
├── labs/              # companion runnable code, one folder per chapter
│   ├── tier1-foundations/
│   ├── tier2-intermediate/
│   └── tier3-advanced/
├── LICENSE            # MIT (code) — see §12
└── README.md
```

| Concern | Choice | Why |
|---|---|---|
| **Content site framework** | **Docusaurus** | Purpose-built for exactly this (chaptered technical docs), MDX support for embedding React widgets in lessons, built-in sidebar/versioning/search, free Algolia DocSearch for OSS, huge ecosystem precedent (used for countless dev curricula). *Alternative considered: Astro Starlight — lighter/faster, excellent DX, but fewer built-in docs-site conveniences (versioning, admonitions) out of the box. Recommend Docusaurus for v1; low switching cost later since content is just Markdown/MDX.* |
| **Hosting** | **Vercel (free tier)** | Zero cost for static sites, git-integrated auto-deploy, preview URLs per PR (useful once external contributors show up), easy custom domain later. |
| **Diagrams** | **Mermaid** (native Docusaurus plugin) | No image assets to maintain; diagrams live as text in the same MDX file, easy for contributors to edit. |
| **Code labs language** | **Python** (scripts + a few Jupyter notebooks for exploratory lessons like embeddings) | Matches the ecosystem's dominant language; lowest friction for the target audience. |
| **Vector DB** | **ChromaDB, `PersistentClient` (local, file-based)** | Exactly matches "self-sufficient, runs local" — zero servers, zero infra, `pip install chromadb` and go. |
| **LLM access** | **BYOK: OpenAI or Anthropic API key**, *plus* **Ollama as a first-class free/local alternative for Tier 1–2** | BYOK avoids us ever handling secrets or costs. Adding Ollama support directly addresses the #1 friction point found in research (cloud-credit/cost barriers) and is a genuine differentiator — "you don't even need a credit card to finish Tier 1." Tier 3 (agents, evaluation, guardrails) may lean on hosted-model function-calling reliability, so BYOK is recommended there, with Ollama noted as best-effort. |
| **Secrets handling** | `.env` file (git-ignored) + `python-dotenv`; `.env.example` committed | Standard, zero-infra, keeps keys on the learner's machine only. |
| **Analytics (optional)** | Privacy-friendly, no-login pageview analytics (e.g., Vercel Analytics or Plausible free tier) | Enough to measure which chapters get read/dropped, without accounts or PII. |
| **License** | **MIT** for code, **CC BY 4.0** for lesson content | Standard for open educational resources; explicitly enables community contributions, which matters once you can't maintain 20+ chapters solo forever. |

## 10. Repo & Project Naming

**Decided:** `zero-to-agent` — public GitHub repo under the `fewshot-works` org. The name reflects the curriculum's actual arc: it starts at zero prior knowledge and ends with the learner having built an agent (the Tier 2/3 capstones).

## 11. Success Metrics (v1, no accounts = proxy metrics only)

- GitHub stars, forks, and repo clones (leading indicator of reach)
- Site unique visitors and per-chapter engagement (via privacy-friendly analytics)
- Community signal: issues opened, PRs from external contributors, Discussions activity
- Qualitative: unsolicited "I built X after this" mentions (social, GitHub Discussions)
- *Not* tracked in v1 (would require accounts): completion rates, quiz scores, learner accounts

## 12. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| **Content staleness** — GenAI APIs/models change monthly | Keep *concept* lessons evergreen; isolate provider-specific code behind a thin, swappable client wrapper; add a visible "Last verified: <date>" badge per lab; open to community PRs for provider updates |
| **Scope creep / solo-maintainer burnout** — 3 tiers × ~20 chapters is a lot | Ruthless MVP (Tier 1 + partial Tier 2 only for launch); open-source from day one so contributions can offset later chapters |
| **Setup friction even for "local"** — installing Python/pip is already a wall for true beginners | Dedicated, OS-specific "Chapter 0" setup guide; recommend VS Code; note a Colab-link fallback for anyone stuck, so nobody is fully blocked |
| **Learner API costs** — even BYOK, beginners can be surprised by a bill | Default all examples to cheapest models (e.g., gpt-4o-mini / claude-haiku-class); show a cost estimate per lab; push Ollama as the default zero-cost path for Tier 1 |
| **Discoverability** — crowded content landscape | Lead with the differentiator (free + local-first + full arc) in all marketing; launch via Hacker News, r/LocalLLaMA, dev.to, LinkedIn |
| **Chroma/tooling choices feel dated in 12 months** | Advanced tier explicitly notes alternatives (pgvector, Qdrant, etc.) so learners know the landscape, even though labs standardize on Chroma for simplicity |

## 13. Roadmap

- **v1 (MVP):** Tier 1 complete + Tier 2 chapters 1–6, site live on Vercel, repo public, MIT/CC-BY licensed.
- **v1.1:** Tier 2 chapters 7–9 (capstone), community contribution guidelines, Discussions enabled.
- **v1.2:** Tier 3 in full.
- **v2 (exploratory, not committed):** optional progress-tracking via local browser storage (still no backend/accounts); community-submitted lesson translations; a "cookbook" of extra recipes beyond the core arc.

## 14. Decisions Locked

1. **Project name:** `zero-to-agent`.
2. **Site framework:** Docusaurus (MIT-licensed, free).
3. **Ollama/local-LLM path:** first-class in Tier 1–2, alongside BYOK OpenAI/Anthropic.
4. **Repo:** public, `github.com/fewshot-works/zero-to-agent`, created and scaffolded as part of this same work session.

## 15. Next Steps After Scaffold

- Author Tier 1 content (Chapter 0 setup guide through the Tier 1 capstone) — the actual content-writing work, not covered by this PRD/scaffold pass.
- Decide on a lightweight provider-abstraction pattern for the labs (thin wrapper so each lab can target OpenAI, Anthropic, or Ollama without three copies of every script).
- Set up Vercel project + auto-deploy from the repo once there's enough content to preview.
- Decide on a domain name (or ship on the default Vercel subdomain for v1).
