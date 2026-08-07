# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: complete beginners to GenAI — a curious high schooler through a 50-year-old career
changer, zero CS background assumed (per project CLAUDE.md's stated voice/audience).

Growing secondary audience, confirmed by the site owner: technical job-seekers who arrive
searching for how to prepare for a specific AI-era role (Forward-Deployed Engineer, Applied /
Agentic AI Engineer, AI Product Manager, SRE for AI Agent Applications, AI Solutions
Architect / Presales) rather than searching for "learn GenAI from scratch." The owner's belief,
stated directly, is that this role-preparation search intent is now larger than the
foundational-training search intent.

## Product Purpose

Few-Shot Academy is a free, open-source, chapter-wise curriculum teaching LLMs, Vector
Databases, RAG, and Agents from zero to a working AI agent, runnable entirely on the learner's
own laptop (local-first, Ollama-friendly, no signup). Existing hero copy states its purpose
plainly: "Not just training — a roadmap to the AI-era job you actually want." Curriculum
chapters map directly to the skills each AI-era career track needs.

## Positioning

Compared to the nearest free-curriculum competitors — freeCodeCamp (structure + certification),
The Odin Project (curation + authenticity: "the website we wish we had"), roadmap.sh (visual
skill-map) — Few-Shot Academy's distinguishing mechanism is that it maps its chapter-by-chapter
curriculum directly onto named AI-era job roles. A learner arrives already knowing which
chapters matter for the job they want, not just a generic skill checklist.

## Operating Context

- Runnable labs live in `labs/`, each self-contained (own README, script, `pyproject.toml` via
  `uv`), targeting Ollama/OpenAI/Anthropic via a plain `PROVIDER` `.env` value.
- This docs site (`site/`) is Docusaurus, hosted on Cloudflare Pages with a D1-backed
  page-view/rate-limit function — the only non-static piece.
- Three training tracks exist today and are live: Foundations, Intermediate, Advanced.
- Five career-track pages exist today (`src/pages/career-tracks/*.tsx`), each with a
  `CurriculumGroup` data structure mapping curriculum chapters to that role.
- More training courses are planned (confirmed intent, not yet built) — e.g., an MCP-focused
  course. Homepage/course-listing surfaces should be architected to add a 4th/5th entry as a
  content change, not a redesign, even though only 3 tracks exist today.

## Capabilities and Constraints

- No paid product, no user accounts. The only backend is the Cloudflare D1 page-view/rate-limit
  function; everything else is static Docusaurus content.
- Career-track pages currently surface role framing before the curriculum-chapter mapping; a
  restructure (soft intro → training-recommendation callout nearer the top) is confirmed as
  wanted but out of scope for the homepage pass — tracked as a separate issue.
- Pre-redesign homepage stacked 6 sections at equal visual weight (Hero, Tracks, Career Tracks,
  Most Popular, What's New, Features) — flagged by the site owner as "crammed, bunch of stuff
  thrown together."
- Nothing shown may be fabricated: no invented course cards, testimonials, logos, or metrics
  ahead of what's actually built.

## Brand Commitments

- Site name: Few-Shot Academy (formerly zero-to-agent — renamed 2026-07-28).
- Incumbent "Basecamp" visual system, authoritative via `src/css/custom.css`: pine-green primary
  (`#1f5d4c` light / `#78c8a6` dark), warm-stone background (`#f6f4ef`) / near-black dark
  (`#131a17`), amber accent, serif headings, a recurring topographic-contour line motif used in
  the homepage hero and blog thumbnails. No DESIGN.md exists yet; the CSS is the design record
  of authority until one is written.

## Evidence on Hand

- Live, real per-role curriculum mappings on each career-track page.
- Live D1-backed "Most Popular" page-view data — a real usage signal, not fabricated.
- Live blog with Giscus comments.
- No customer testimonials, partner logos, or case-study proof exist. Do not fabricate any.

## Product Principles

1. Career-outcome intent is a first-class entry point, not an afterthought — most search
   traffic is believed to arrive wanting to prepare for a specific role, not to "learn GenAI" in
   the abstract.
2. The curriculum (Foundations → Intermediate → Advanced, plus future courses) remains the
   substance underneath every career track; career framing routes people into it, it doesn't
   replace it.
3. Everything shown must be real — no fabricated course cards, testimonials, or metrics ahead of
   what's actually built.
4. Free and local-first is a durable differentiator (no signup, runs on a laptop) and must stay
   visible, not buried at the bottom of the page.
5. Homepage and course-listing surfaces must scale to more courses without repeated redesigns.

## Accessibility & Inclusion

No product-specific requirement beyond general WCAG AA. Partially audited under issue #20
(still open): `aria-live` added to the Quiz component; jsx-a11y lint tooling,
`prefers-reduced-motion` handling, and a manual screen-reader pass remain outstanding.
