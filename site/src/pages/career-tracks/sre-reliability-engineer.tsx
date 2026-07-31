import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Heading from '@theme/Heading';

import styles from './sre-reliability-engineer.module.css';

const TITLE = 'SRE / Reliability Engineer for AI Agent Applications';

const META_DESCRIPTION =
  'Keeps AI agents running reliably in production: observability, guardrails, and cost/latency budgets.';

const HOOK =
  'Anthropic runs an internal team called AI Reliability Engineering, tagline: “Claude has your back. AIRE ' +
  'has Claude’s.” That’s the job in one sentence — classic Site Reliability Engineering (SLOs, on-call, ' +
  'postmortems) applied to a system that can be technically “up” — no crashed pods, no 5xx errors — while ' +
  'quietly looping on a tool call, burning API spend, or drifting into wrong answers nobody notices until a ' +
  'user complains. The title itself is still being invented in real time: the same work shows up under AI ' +
  'Reliability Engineer, MLOps Engineer, LLMOps Engineer, AI Platform Engineer, and a traditional “Site ' +
  'Reliability Engineer” badge at a company that happens to serve LLMs. This guide sorts through that, using ' +
  'real postings from Anthropic, OpenAI, and the broader market — not guesswork.';

type QuickFact = {label: string; value: string};

const QUICK_FACTS: QuickFact[] = [
  {label: 'Typical base salary', value: '$140K–$280K broad market; $320K–$485K at frontier-lab staff level'},
  {label: 'Experience floor', value: 'No dedicated junior tier — most hires transfer in from SRE/DevOps/Platform Eng'},
  {label: 'On-call', value: 'Standard, including rotating nights/weekends — this is operations, not just design'},
  {label: 'Interview weight', value: 'Incident response & operational system design outweigh algorithm puzzles'},
];

type CompareRow = {role: string; scope: string; comp: string};

const COMPARE_ROWS: CompareRow[] = [
  {
    role: 'Traditional SRE',
    scope: 'Keeps existing, mostly deterministic services up — SLOs, on-call, incident response, capacity planning',
    comp: '$130K–$210K broad market; $139K–$216K Glassdoor 25th–75th pct',
  },
  {
    role: 'AI Reliability Engineer (AIRE)',
    scope: 'SRE discipline applied to LLM-serving and agent systems — the same job, on a system that fails in new ways',
    comp: '$180K–$280K base broad market; $320K–$485K staff at Anthropic (outlier, frontier lab)',
  },
  {
    role: 'MLOps Engineer',
    scope: 'Manages the ML lifecycle infra — deployment, monitoring, retraining pipelines, experiment tracking',
    comp: '$116K–$158K average, depending on source',
  },
  {
    role: 'LLMOps Engineer',
    scope: 'MLOps specialized for LLMs — prompt versioning, eval pipelines, hallucination/quality drift, cost control',
    comp: '$160K–$240K base, reportedly a 10–15% premium over MLOps',
  },
  {
    role: 'AI Platform Engineer',
    scope: 'Builds the internal platform — eval harness, model registry, orchestration, observability — that AI engineers build on top of',
    comp: '$180K–$400K total comp',
  },
  {
    role: 'AI Infrastructure Engineer',
    scope: 'Owns the GPU clusters and serving/training stack itself — the layer underneath AI Reliability',
    comp: '$220K–$600K total comp; over $1M at NVIDIA/Anthropic/OpenAI staff+',
  },
];

type DaySlice = {label: string; pct: number; note: string; kind: 'customer' | 'code' | 'internal'};

const DAY_SLICES: DaySlice[] = [
  {
    label: 'Building tooling & observability',
    pct: 40,
    kind: 'code',
    note: 'Instrumenting every LLM call with tracing (LangSmith, Langfuse, Helicone, or raw OpenTelemetry), building SLO dashboards, and writing the guardrail logic that stops a runaway agent loop before it drains a budget overnight.',
  },
  {
    label: 'On-call & incident response',
    pct: 35,
    kind: 'customer',
    note: 'Diagnosing production issues, leading incident response, and writing the postmortem — the classic SRE core, now applied to LLM-serving paths, accelerator failures, and agent-specific failure modes like tool-call loops or silent quality drift.',
  },
  {
    label: 'SLOs, capacity & cross-team reviews',
    pct: 25,
    kind: 'internal',
    note: 'Setting service-level objectives that balance availability/latency against development velocity, GPU/accelerator capacity planning, and launch reviews with the ML and product teams shipping the next agent feature.',
  },
];

type ExperienceRow = {company: string; floor: string};

const EXPERIENCE_ROWS: ExperienceRow[] = [
  {company: 'Anthropic, AI Reliability Engineering (Staff SWE, San Francisco)', floor: '“Talented and experienced” — no explicit year count, but scoped as a senior/staff hire'},
  {company: 'OpenAI, SRE — Public Sector', floor: '5+ yrs operating infrastructure at scale, plus an active US security clearance'},
  {company: 'OpenAI, SRE — Frontier Systems Infrastructure', floor: 'Execute at software-engineer level; deep Kubernetes/hyperscale experience expected'},
  {company: 'Google, Technology SRE (University Graduate track)', floor: '0–2 yrs — a genuine new-grad program, but not AI-specific at entry'},
  {company: 'Typical 2026 “SRE + AI agents” hybrid posting (mid-market)', floor: 'Senior — blends Kubernetes/Go/Python fundamentals with agentic-framework and LLM-API exposure'},
];

type Callout = {title: string; body: string};

const ENTRY_PATHS: Callout[] = [
  {
    title: 'Transfer in from traditional SRE, DevOps, or Platform Engineering',
    body: 'The dominant path by far. Most people doing this work today moved sideways from an adjacent infrastructure discipline and layered AI-specific knowledge on top — there is no established from-scratch pipeline yet.',
  },
  {
    title: 'A genuine new-grad SRE track, then specialize later',
    body: 'Google and companies of similar scale run real 0–2 year new-grad SRE programs. The AI-specific layer — agent failure modes, LLM observability — typically gets added after landing the generalist role, not before.',
  },
  {
    title: 'MLOps or LLMOps as the realistic near-term search target',
    body: '“AI Reliability Engineer” isn’t yet a standardized title on job boards. Searching MLOps Engineer, LLMOps Engineer, or Platform Engineer postings surfaces a much larger, more realistic pool of openings right now.',
  },
];

type CurriculumGroup = {tier: string; description: string; chapters: {title: string; to: string}[]};

const CURRICULUM_GROUPS: CurriculumGroup[] = [
  {
    tier: 'Foundations',
    description: 'The AI/LLM/RAG/agent literacy every posting assumes as a baseline — you can’t keep an agent reliable if you don’t know what it’s doing.',
    chapters: [
      {title: 'What Is AI, Really?', to: '/docs/foundations/what-is-ai'},
      {title: 'What Is a Large Language Model?', to: '/docs/foundations/what-is-an-llm'},
      {title: 'What Is an AI Agent?', to: '/docs/foundations/what-is-an-ai-agent'},
      {title: 'Capstone: A Q&A Bot Over Your Own Documents', to: '/docs/foundations/capstone-qa-bot'},
    ],
  },
  {
    tier: 'Intermediate',
    description: 'How agents actually behave — tool calls, loops, and the evaluation discipline you need before you can tell "reliable" from "silently degrading."',
    chapters: [
      {title: 'Tool Use', to: '/docs/intermediate/tool-use'},
      {title: 'Your First Agent', to: '/docs/intermediate/your-first-agent'},
      {title: 'Memory', to: '/docs/intermediate/memory'},
      {title: 'Evaluating What You Built', to: '/docs/intermediate/evaluating'},
    ],
  },
  {
    tier: 'Advanced',
    description: 'The closest 1:1 match in this entire curriculum to the job description: guardrails, tracing, and production concerns for agentic systems specifically.',
    chapters: [
      {title: 'Multi-Agent Patterns', to: '/docs/advanced/multi-agent-patterns'},
      {title: 'Guardrails and Safety', to: '/docs/advanced/guardrails-and-safety'},
      {title: 'Observability', to: '/docs/advanced/observability'},
      {title: 'Production Concerns', to: '/docs/advanced/production-concerns'},
      {title: 'Shipping It', to: '/docs/advanced/shipping-it'},
      {title: 'Capstone: A Guarded, Traced, Evaluated Agent', to: '/docs/advanced/capstone'},
    ],
  },
];

const CURRICULUM_GAPS: string[] = [
  'Kubernetes and container orchestration at a hands-on, CKA-caliber level — this curriculum runs locally via Ollama, never against a real cluster',
  'Infrastructure as Code (Terraform, Pulumi, CDK) and real cloud platform ops on AWS/GCP/Azure',
  'SLI/SLO/error-budget frameworks and incident-command practice — the operational vocabulary a real on-call rotation runs on isn’t taught here',
  'GPU/accelerator-specific operations — RDMA, InfiniBand, multi-node training infra — only relevant at frontier-lab scale, but explicitly named in Anthropic’s own posting',
  'Actual on-call experience and chaos engineering — you can read about paging and failure injection, but this is a muscle only a real rotation builds',
  'Classic SRE fundamentals — Linux internals, networking, distributed-systems theory — this curriculum teaches the AI application layer, not systems-level infrastructure',
];

type InterviewStep = {title: string; body: string; badge?: string; to?: string; toLabel?: string};

const INTERVIEW_STEPS: InterviewStep[] = [
  {
    title: 'Recruiter screen',
    body: 'Background and motivation check, plus an early read on whether you actually want an on-call, operations-adjacent role — a real difference from a pure application-engineering job.',
  },
  {
    title: 'Technical round',
    body: 'Format varies more than almost any other track in this guide: Google-style rounds lean on data-structures-and-algorithms coding, while AI-native and mid-market companies lean toward debugging observability pipelines, writing automation, or an SLO-design exercise.',
    to: '/career-tracks/sre-reliability-engineer/technical-round',
    toLabel: 'What to expect, and how the format splits by company type',
  },
  {
    title: 'Incident response / operational system design',
    body: 'Google calls this NALSD. Whatever the name, you’re handed a system and a failure, and asked to triage, mitigate, and design around it live — the round that most consistently decides the offer.',
    badge: 'Highest-weighted round almost everywhere',
    to: '/career-tracks/sre-reliability-engineer/incident-response',
    toLabel: 'The framework, plus full end-to-end incident walkthroughs',
  },
  {
    title: 'Behavioral / “Googleyness” round',
    body: 'Blameless postmortem culture, cross-team collaboration between ML and infra, and judgment calls under 3 a.m. pressure — not fluff, since trust and composure under incidents are exactly what the job requires.',
    to: '/career-tracks/sre-reliability-engineer/behavioral-round',
    toLabel: 'Sample questions and how to build a story bank',
  },
  {
    title: 'Onsite loop (larger companies)',
    body: 'Microsoft’s published Staff SRE loop is a representative example: a phone screen followed by five onsite rounds in one day, covering systems architecture, technical depth, incident response, problem-solving, and leadership.',
  },
];

const JOB_TITLES: string[] = [
  'Site Reliability Engineer',
  'Site Reliability Engineer, AI',
  'AI Reliability Engineer',
  'MLOps Engineer',
  'LLMOps Engineer',
  'AI Platform Engineer',
  'AI Infrastructure Engineer',
  'ML Platforms SRE',
  'Production ML Engineer',
  'AIOps Engineer',
];

const JOB_SOURCES: Callout[] = [
  {
    title: 'Frontier-lab career pages, directly',
    body: 'Anthropic runs a named team (AI Reliability Engineering / AIRE); OpenAI posts multiple distinct SRE roles (Public Sector, Applied Engineering, Frontier Systems Infrastructure, Research Platform) — each with a different scope and bar.',
  },
  {
    title: 'Search every adjacent title, not just “AI Reliability Engineer”',
    body: 'The title hasn’t standardized yet, so MLOps Engineer, LLMOps Engineer, and Platform Engineer postings are a larger, more realistic pool of current openings than the exact title alone.',
  },
  {
    title: 'AI-native companies that use a plain “SRE” title',
    body: 'Mistral AI and similar model-serving companies fold AI-specific responsibilities — LLM-serving on-call, model rollout reliability — into a standard Site Reliability Engineer title, not a rebranded one.',
  },
  {
    title: 'Cross-check aggregators, don’t trust one',
    body: 'Built In, Dice, and ZipRecruiter each sample a different slice of the market and will show meaningfully different numbers for the same title — treat any single source as a data point, not the answer.',
  },
];

type CompRow = {source: string; range: string};

const COMP_ROWS: CompRow[] = [
  {source: 'SRE, broad market (ZipRecruiter, national)', range: '$114K–$151.5K (25th–75th pct), $175K at the 90th pct'},
  {source: 'SRE, broad market (Glassdoor)', range: '$139K–$216K (25th–75th pct)'},
  {source: 'MLOps Engineer (ZipRecruiter, broad query)', range: '$82.8K–$143.1K (25th–75th pct)'},
  {source: 'LLMOps Engineer (industry salary guide estimate)', range: '$160K–$240K base'},
  {source: 'AI Reliability Engineer-style role (industry salary guide estimate)', range: '$180K–$280K base'},
  {source: 'Anthropic, Staff SWE, AI Reliability Engineering (San Francisco)', range: '$320K–$485K'},
];

type SourceLink = {label: string; href: string};

const SOURCES: SourceLink[] = [
  {
    label: 'Anthropic — Software Engineer, AI Reliability Engineering (posting via Built In SF)',
    href: 'https://www.builtinsf.com/job/software-engineer-ai-reliability-engineering/6867889',
  },
  {
    label: 'OpenAI — Site Reliability Engineer, Frontier Systems Infrastructure',
    href: 'https://openai.com/careers/site-reliability-engineer-frontier-systems-infrastructure-san-francisco/',
  },
  {label: 'Resolve.ai — What Is an AI SRE?', href: 'https://resolve.ai/glossary/what-is-ai-sre'},
  {
    label: 'Rootly — What Is an AI SRE Agent? How AI Is Changing Incident Response in 2026',
    href: 'https://rootly.com/sre/ai-sre-agent-ai-changing-incident-response-2026',
  },
  {
    label: 'Ivan Turkovic — The AI Job Title Reference Guide 2026',
    href: 'https://www.ivanturkovic.com/the-ai-job-title-reference-guide-2026/',
  },
  {label: 'ZipRecruiter — Site Reliability Engineer Salary', href: 'https://www.ziprecruiter.com/Salaries/Site-Reliability-Engineer-Salary'},
  {
    label: 'Google — Site Reliability Workbook, Ch. 8, O’Reilly',
    href: 'https://www.oreilly.com/library/view/the-site-reliability/9781492029496/ch08.html',
  },
  {label: 'Cribl — A Day in the Life of a Site Reliability Engineer', href: 'https://cribl.io/resources/sb/a-day-in-the-life-of-a-site-reliability-engineer/'},
  {label: 'IGotAnOffer — Google SRE Interview Guide', href: 'https://igotanoffer.com/blogs/tech/google-site-reliability-engineer-interview'},
  {
    label: 'InterviewStack — Microsoft Staff SRE Prep Guide',
    href: 'https://interviewstack.io/preparation-guide/microsoft/site_reliability_engineer/staff',
  },
];

function Chip({children}: {children: ReactNode}) {
  return <span className={styles.chip}>{children}</span>;
}

function CalloutList({items}: {items: Callout[]}) {
  return (
    <div className={styles.calloutList}>
      {items.map((item) => (
        <div key={item.title} className={styles.callout}>
          <Heading as="h4" className={styles.calloutTitle}>
            {item.title}
          </Heading>
          <p>{item.body}</p>
        </div>
      ))}
    </div>
  );
}

function Section({eyebrow, title, children}: {eyebrow?: string; title: string; children: ReactNode}) {
  return (
    <section className={styles.section}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <Heading as="h2" className={styles.sectionTitle}>
        {title}
      </Heading>
      {children}
    </section>
  );
}

export default function SreReliabilityEngineer(): ReactNode {
  return (
    <Layout title={TITLE} description={META_DESCRIPTION}>
      <Head>
        <meta
          name="keywords"
          content="AI SRE, AI reliability engineer, how to become an SRE for AI systems, AI site reliability engineer career path, SRE for AI agents salary"
        />
      </Head>
      <main className={styles.page}>
        <div className="container">
          <Link to="/career-tracks" className={styles.back}>
            &larr; Career Tracks
          </Link>

          <header className={styles.hero}>
            <Heading as="h1">{TITLE}</Heading>
            <p className={styles.oneLiner}>{HOOK}</p>
            <div className={styles.factStrip}>
              {QUICK_FACTS.map((fact) => (
                <div key={fact.label} className={styles.factCard}>
                  <span className={styles.factValue}>{fact.value}</span>
                  <span className={styles.factLabel}>{fact.label}</span>
                </div>
              ))}
            </div>
          </header>

          <Section title="What the job actually is">
            <p>
              Strip away the naming chaos and the job is this: you keep AI-serving systems reliable using the
              same core discipline as any Site Reliability Engineer — service-level objectives, on-call
              rotations, incident response, blameless postmortems — applied to a system with a genuinely new
              failure category. A crashed pod is easy to see. An agent that’s technically healthy by every
              traditional metric while it silently loops on a tool call, drains a token budget, or quietly
              gives wrong answers for a week, is not.
            </p>
            <p>
              Anthropic’s own internal team name for this says it plainly: AI Reliability Engineering, tagline
              “Claude has your back. AIRE has Claude’s.” The team partners across the company to improve
              reliability across the full serving path — SDK, network, API layer, serving infrastructure,
              accelerators, and back — and is explicit that this means bridging two groups that don’t usually
              share a vocabulary: ML engineers and infrastructure teams.
            </p>
            <p className={styles.aside}>
              Background:{' '}
              <a href="https://www.builtinsf.com/job/software-engineer-ai-reliability-engineering/6867889" target="_blank" rel="noopener noreferrer">
                Anthropic, Software Engineer, AI Reliability Engineering posting
              </a>
              .
            </p>
          </Section>

          <Section eyebrow="A still-forming title cluster" title="Which of these titles is actually this job?">
            <p>
              This is the newest, least-settled title in this whole guide. The underlying work — keeping AI
              systems reliable in production — currently gets sold under at least six overlapping names, each
              with a different comp band and a different center of gravity:
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Scope</th>
                    <th>Compensation signal</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row) => (
                    <tr key={row.role}>
                      <td>{row.role}</td>
                      <td>{row.scope}</td>
                      <td>{row.comp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={styles.aside}>
              Per{' '}
              <a href="https://www.ivanturkovic.com/the-ai-job-title-reference-guide-2026/" target="_blank" rel="noopener noreferrer">
                Ivan Turkovic’s 2026 AI job title reference guide
              </a>
              , which groups all of these under one informal umbrella: “the plumbing” — compute, platforms,
              monitoring, reliability — as distinct from AI Engineer (application-layer) or ML Engineer
              (model training).
            </p>
            <p>
              None of that ambiguity matters much once you’re actually doing the job day to day — which looks
              remarkably consistent across all six titles.
            </p>
          </Section>

          <Section title="A day in the life">
            <p>
              The classic Google SRE rule of thumb — no more than half your time on “ops” work, the rest on
              engineering — still roughly holds, but the ops half now includes failure modes that didn’t exist
              five years ago: a tool call that loops forever, a cost anomaly from a runaway agent, an inference
              latency spike from a regional accelerator failover.
            </p>
            <div className={styles.dayBar}>
              {DAY_SLICES.map((slice) => (
                <div key={slice.label} className={`${styles.daySegment} ${styles[slice.kind]}`} style={{width: `${slice.pct}%`}} />
              ))}
            </div>
            <dl className={styles.dayLegend}>
              {DAY_SLICES.map((slice) => (
                <div key={slice.label} className={styles.dayLegendRow}>
                  <dt>
                    <span className={`${styles.legendDot} ${styles[slice.kind]}`} />
                    {slice.label} &mdash; {slice.pct}%
                  </dt>
                  <dd>{slice.note}</dd>
                </div>
              ))}
            </dl>
            <div className={styles.insightBox}>
              <p>
                <strong>“Up” isn’t the same question anymore.</strong> A dashboard full of green latency and
                availability graphs can coexist with an agent that’s confidently wrong, or one whose tool-use
                loop is quietly burning through an API budget. Anthropic’s own posting names this directly:
                candidates need to be “comfortable working with both traditional metrics (latency, availability)
                and AI-specific metrics (model performance, training convergence).” The traditional dashboard
                is necessary and no longer sufficient.
              </p>
            </div>
            <p>
              That new failure surface is also why the experience floor for this role looks different from a
              standard SRE posting — worth being direct about before you start prepping for it.
            </p>
          </Section>

          <Section title="Who actually gets hired">
            <p>
              There is currently <strong>no standardized junior tier</strong> for this exact title. Real
              experience floors pulled directly from current and recent postings:
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Company / posting</th>
                    <th>Experience floor</th>
                  </tr>
                </thead>
                <tbody>
                  {EXPERIENCE_ROWS.map((row) => (
                    <tr key={row.company}>
                      <td>{row.company}</td>
                      <td>{row.floor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>Three real paths in, given that:</p>
            <CalloutList items={ENTRY_PATHS} />
            <p>
              The pattern across every source is consistent: this is a lateral move for someone who already
              has infrastructure or operations experience, not a from-scratch entry point. If that’s where you
              are, the technical bar is at least explicit — six categories show up again and again in postings.
            </p>
          </Section>

          <Section title="Skills you’ll actually need">
            <p>
              <strong>Observability & instrumentation:</strong> the traditional stack — Prometheus, Grafana,
              Datadog, OpenTelemetry — plus LLM-specific tracing (LangSmith, Langfuse, or Helicone) that logs
              every prompt, response, retrieval context, latency, and cost per call. Without this layer, quality
              regressions fail silently.
            </p>
            <p>
              <strong>SLO / error-budget discipline:</strong> defining service-level objectives for a system
              where “correct” isn’t binary, and balancing availability/latency against development
              velocity — language pulled directly from Anthropic’s own posting.
            </p>
            <p>
              <strong>Incident response for AI-specific failure modes:</strong> runaway tool-call loops, cost
              anomalies, multi-provider fallback, and — increasingly — treating prompt-injection and jailbreak
              resistance as an operational concern, not only a security-team one.
            </p>
            <p>
              <strong>Infrastructure fundamentals:</strong> Kubernetes, Infrastructure-as-Code (Terraform or
              equivalent), and cloud platform fluency (AWS/GCP/Azure). At frontier-lab scale specifically,
              GPU/TPU/accelerator experience and networking optimizations like RDMA and InfiniBand show up as
              named preferred qualifications.
            </p>
            <p>
              <strong>Coding for automation, not app features:</strong> Python or Go, chaos engineering,
              systematic resilience testing. This is SRE, not ops — the expectation is that you build the
              tooling, not click through a console.
            </p>
            <p>
              <strong>Cross-team communication:</strong> named explicitly in Anthropic’s posting as “the ability
              to bridge the gap between ML engineers and infrastructure teams” — arguably the hardest skill on
              this list to demonstrate in an interview, and the one that separates a good hire from a great one.
            </p>
            <div className={styles.insightBox}>
              <p>
                <strong>Operational judgment beats technical trivia.</strong> A 2026 recruiter-sourced guide to
                SRE interviews put it bluntly: most candidates fail on operational judgment, not technical
                knowledge. The tell is subtle — defaulting to developer framing (“I would fix the bug”) instead
                of operator framing (“I would mitigate the impact, then investigate”) reads as inexperience even
                when the underlying technical answer is correct.
              </p>
            </div>
            <p>
              That’s a wide skill set to build cold. Here’s specifically where this curriculum already gets you
              there — and where it deliberately doesn’t.
            </p>
          </Section>

          <Section eyebrow="Curriculum mapping" title="How Few-Shot Academy gets you there">
            <div className={styles.curriculumGrid}>
              {CURRICULUM_GROUPS.map((group) => (
                <div key={group.tier} className={styles.curriculumCard}>
                  <Heading as="h4" className={styles.curriculumTier}>
                    {group.tier}
                  </Heading>
                  <p className={styles.curriculumDesc}>{group.description}</p>
                  <ul className={styles.curriculumList}>
                    {group.chapters.map((ch) => (
                      <li key={ch.to}>
                        <Link to={ch.to}>{ch.title}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className={styles.insightBox}>
              <p>
                <strong>This track has the tightest curriculum fit in this whole guide.</strong> Advanced
                Chapters 2–5 — Guardrails and Safety, Observability, Production Concerns, Shipping It — map
                almost one to one onto the job description: guardrails against runaway agent behavior, real
                OpenTelemetry tracing, SLO-shaped production concerns, and deploying it for real.
              </p>
            </div>
            <div className={styles.gapsBox}>
              <Heading as="h4" className={styles.gapsHeading}>
                What this curriculum doesn’t cover
              </Heading>
              <ul className={styles.gapsList}>
                {CURRICULUM_GAPS.map((gap) => (
                  <li key={gap}>{gap}</li>
                ))}
              </ul>
            </div>
            <p className={styles.aside}>
              With the technical bar mapped, the remaining unknown is the interview itself — which splits into
              formats more sharply than almost any other track in this guide.
            </p>
          </Section>

          <Section title="The interview">
            <p>
              Expect real variance by company type. Google-scale companies still run algorithmic coding
              screens for entry-level and campus candidates; AI-native and mid-market companies weight
              incident response, operational system design, and practical debugging far more heavily. Every
              source agrees on one thing: the round that decides most offers is incident response, not coding.
            </p>
            <ol className={styles.timeline}>
              {INTERVIEW_STEPS.map((step, i) => (
                <li key={step.title} className={styles.timelineStep}>
                  <span className={styles.timelineIndex}>{i + 1}</span>
                  <div>
                    <Heading as="h4" className={styles.timelineTitle}>
                      {step.title}
                    </Heading>
                    <p>{step.body}</p>
                    {step.badge && <span className={styles.timelineBadge}>{step.badge}</span>}
                    {step.to && (
                      <p>
                        <Link to={step.to}>{step.toLabel} &rarr;</Link>
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
            <p className={styles.aside}>
              Per{' '}
              <a href="https://igotanoffer.com/blogs/tech/google-site-reliability-engineer-interview" target="_blank" rel="noopener noreferrer">
                a detailed breakdown of Google’s SRE loop
              </a>
              , the operational system-design round (Google calls it NALSD) is deliberately more concrete than a
              classic product system-design interview — traffic flow, failure modes, monitoring, and reliability
              trade-offs, not abstract scalability.
            </p>
            <p>Once you’ve cleared that, the practical question is where these postings actually live.</p>
          </Section>

          <Section title="Actually landing one">
            <p>
              Search every title below, not just the exact one on this page — the category is too new and too
              fragmented for a single search to surface the real pool of openings.
            </p>
            <div className={styles.chipRow}>
              {JOB_TITLES.map((title) => (
                <Chip key={title}>{title}</Chip>
              ))}
            </div>
            <p>Where those postings actually live:</p>
            <CalloutList items={JOB_SOURCES} />
            <p>
              No dedicated certification exists for this exact role — Google has never offered an official “SRE
              certification” despite popularizing the discipline. The certifications that reliably show up as
              nice-to-haves instead: <strong>CKA (Certified Kubernetes Administrator)</strong>, an associate-level{' '}
              <strong>AWS or GCP</strong> cloud certification, and the <strong>Linux Foundation Certified System
              Administrator (LFCS)</strong> as a systems-fundamentals baseline. Datadog also runs a structured (non-
              certifying) SRE learning path worth working through for the observability-specific vocabulary.
            </p>
            <p className={styles.aside}>
              Every source is consistent here too: certifications help a resume get a first look, but proven
              incident-response judgment and hands-on tooling experience are what actually get an offer.
            </p>
            <p>One more number before deciding this is worth the operational trade-offs: what it actually pays.</p>
          </Section>

          <Section eyebrow="Context, not a headline number" title="Compensation">
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Source</th>
                    <th>Range</th>
                  </tr>
                </thead>
                <tbody>
                  {COMP_ROWS.map((row) => (
                    <tr key={row.source}>
                      <td>{row.source}</td>
                      <td>{row.range}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={styles.aside}>
              The spread here is wider than any other track in this guide, for a simple reason: platforms
              sample different populations (ZipRecruiter casts the widest net; Glassdoor and Levels.fyi skew
              toward larger and Big Tech employers), and the title itself spans everything from a generalist
              SRE role to a frontier-lab team keeping a trillion-parameter model online. Bottom line: base
              clusters roughly $140K–$280K at most employers, with the $300K+ figures belonging specifically to
              staff-level roles at a handful of frontier AI labs — the outlier, not the median.
            </p>
          </Section>

          <Section title="Go deeper">
            <ul className={styles.sourceList}>
              {SOURCES.map((src) => (
                <li key={src.href}>
                  <a href={src.href} target="_blank" rel="noopener noreferrer">
                    {src.label}
                  </a>
                </li>
              ))}
            </ul>
          </Section>

          <div className={styles.ctaRow}>
            <Link className="button button--primary button--lg" to="/docs/foundations/setup">
              Start Foundations, free &rarr;
            </Link>
            <Link className="button button--secondary button--lg" to="/career-tracks">
              &larr; All career tracks
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}
