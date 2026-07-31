import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Heading from '@theme/Heading';

import styles from './ai-product-manager.module.css';

const TITLE = 'AI Product Manager';

const META_DESCRIPTION =
  'How to become an AI Product Manager: what the job actually is, real compensation data, who gets hired, ' +
  'the interview process, and how to prepare — grounded in real job postings, not guesswork.';

const HOOK =
  'Right now there are thousands of open product manager roles that are AI-shaped — OpenAI, Anthropic, ' +
  'Google DeepMind, and every large enterprise building an AI feature all have AI PM openings they can’t ' +
  'fill fast enough, and 2026 hiring data shows a real wage premium for candidates who can demonstrate AI-specific ' +
  'product judgment over a generalist PM background. The job itself hasn’t changed as much as the title ' +
  'suggests: you still own a roadmap, still write PRDs, still fight for headcount in a planning review. ' +
  'What’s different is that the thing you’re shipping is probabilistic — a model that behaves ' +
  'differently across user segments, drifts over time, and occasionally states something false with total ' +
  'confidence — so the job now includes deciding what “good enough” means for a system that’s ' +
  'never fully deterministic. This guide is built entirely from real postings, published salary data, and ' +
  'documented interview processes from OpenAI, Anthropic, Google, and the broader AI PM hiring market.';

type QuickFact = {label: string; value: string};

const QUICK_FACTS: QuickFact[] = [
  {
    label: 'Base salary, broad market',
    value: '$165K–$238K base; $244K–$390K total comp (25th–75th pct)',
  },
  {
    label: 'Entry point',
    value: 'No dedicated junior tier at frontier labs — Google’s APM program is the rare true 0–2yr pipeline',
  },
  {
    label: 'Coding required',
    value: 'No — non-coding, decision-making track, but SQL, eval design, and model-behavior fluency are now table stakes',
  },
  {
    label: 'What the interview actually weighs',
    value: '“AI product sense” — judging when AI is the right tool and defending an eval threshold — outweighs a generic case interview',
  },
];

type CompareRow = {title: string; scope: string; comp: string};

const COMPARE_ROWS: CompareRow[] = [
  {
    title: 'Product Manager (generalist)',
    scope: 'Owns roadmap and strategy for a product whose behavior is mostly deterministic — ships a feature, moves on.',
    comp: 'Median $229K total comp, all PM titles (Levels.fyi)',
  },
  {
    title: 'Technical Product Manager (TPM)',
    scope: 'Bridges deeply technical infra/architecture teams and business strategy; most common at larger engineering orgs.',
    comp: 'Comp tracks generalist PM, often with a technical-scope premium',
  },
  {
    title: 'Growth Product Manager',
    scope: 'Owns acquisition, activation, retention, and monetization; heavily experiment- and A/B-test-driven.',
    comp: 'Comp tracks generalist PM; upside tied to product-led-growth orgs',
  },
  {
    title: 'AI Product Manager',
    scope: 'Same PM core, plus fluency in model behavior, eval design, and data pipelines — the product itself behaves probabilistically, not deterministically.',
    comp: '$244K–$390K total comp, national (25th–75th pct); median ~$305K',
  },
  {
    title: 'Frontier-lab AI PM (OpenAI, Anthropic, Google DeepMind)',
    scope: 'Owns product experience around frontier models themselves — developer APIs, fine-tuning tooling, safety interfaces.',
    comp: '$400K–$600K+ total comp, senior; some packages reported above $700K',
  },
  {
    title: 'Associate Product Manager (APM)',
    scope: '0–2yr rotational entry program, not AI-specific, but the most reliable documented pipeline into product roles without prior PM experience.',
    comp: 'First-year total comp $200K+ in high-cost-of-living areas (Google APM, entry-level band)',
  },
];

type DaySlice = {label: string; pct: number; note: string; kind: 'customer' | 'code' | 'internal'};

const DAY_SLICES: DaySlice[] = [
  {
    label: 'Defining the eval threshold and the model spec',
    pct: 35,
    kind: 'code',
    note: 'Writing PRDs that specify model inputs/outputs, latency targets, and fallback behavior; partnering with ML engineers on eval sets, labeling guidelines, and data-quality standards; deciding the hallucination rate above which a feature doesn’t ship.',
  },
  {
    label: 'Cross-functional standups and roadmap reviews',
    pct: 35,
    kind: 'internal',
    note: 'Aligning data scientists, ML engineers, designers, legal/trust-and-safety, and executives who each speak a different technical language about the same feature; sprint planning and launch-readiness checks.',
  },
  {
    label: 'Watching production behavior and responding to drift',
    pct: 30,
    kind: 'customer',
    note: 'Monitoring live model performance, deciding when to retrain or adjust thresholds, coordinating rapid response to accuracy or latency degradation, running responsible-AI reviews before and after launch.',
  },
];

type ExperienceRow = {who: string; floor: string};

const EXPERIENCE_ROWS: ExperienceRow[] = [
  {
    who: 'Google’s APM program',
    floor: '0–2 years, ~12,000 applicants for 45–50 slots/year (0.67% acceptance) — narrow, but the cleanest documented entry point with no prior PM experience required.',
  },
  {
    who: 'OpenAI / Anthropic / Google DeepMind AI PM postings',
    floor: 'Almost always require prior AI PM experience or an exceptional adjacent technical background — published advice for outsiders is to build 1–2 years of AI-adjacent PM experience first.',
  },
  {
    who: 'AI-native companies broadly',
    floor: 'Explicitly look for what hiring guides describe as “PM-shaped engineers or engineer-shaped PMs” — a technical background substitutes for a formal AI PM title.',
  },
  {
    who: 'Big Tech AI teams (Google, Meta, Microsoft)',
    floor: 'Prefer internal transfers or PMs with 3+ years of experience shipping AI features over external entry-level hires.',
  },
  {
    who: 'Mid-market and startup AI PM postings',
    floor: 'Senior-leaning but less rigid than frontier labs — a portfolio of shipped AI-adjacent work often substitutes for a formal AI PM title on a resume.',
  },
];

const ENTRY_PATHS: Array<{title: string; body: string}> = [
  {
    title: 'Google’s APM program (or Microsoft, Meta, Salesforce, Uber equivalents)',
    body: 'The rare genuine 0–2yr rotational pipeline into product management. Not AI-specific, but the most reliable documented way in without needing PM experience first.',
  },
  {
    title: 'Transfer in from software or ML engineering',
    body: 'Technical backgrounds ramp fastest on the technical half of AI PM work, but need to deliberately build user-research and go-to-market instincts the role also requires.',
  },
  {
    title: 'Ship a portfolio of AI-adjacent side projects',
    body: 'Recommendation systems, personalization, a small RAG or agent build. Interviewers explicitly probe whether claimed “AI PM experience” is real — a demonstrable shipped project outweighs a title on a resume.',
  },
];

type CurriculumGroup = {tier: string; description: string; chapters: {title: string; to: string}[]};

const CURRICULUM_GROUPS: CurriculumGroup[] = [
  {
    tier: 'Foundations',
    description:
      'The vocabulary you need to sit in a room with ML engineers and not fake it — what a model actually is, and where RAG and agents fit.',
    chapters: [
      {title: 'What Is AI, Really?', to: '/docs/foundations/what-is-ai'},
      {title: 'What Is a Large Language Model?', to: '/docs/foundations/what-is-an-llm'},
      {title: 'What Is RAG?', to: '/docs/foundations/what-is-rag'},
      {title: 'What Is an AI Agent?', to: '/docs/foundations/what-is-an-ai-agent'},
    ],
  },
  {
    tier: 'Intermediate',
    description:
      'The technical-judgment layer — eval design, offline vs. online metrics, what an agent can and can’t reliably do — is the single most tested skill across real AI PM interview loops.',
    chapters: [
      {title: 'Prompt Patterns', to: '/docs/intermediate/prompt-patterns'},
      {title: 'Tool Use', to: '/docs/intermediate/tool-use'},
      {title: 'Your First Agent', to: '/docs/intermediate/your-first-agent'},
      {title: 'Evaluating What You Built', to: '/docs/intermediate/evaluating'},
    ],
  },
  {
    tier: 'Advanced',
    description:
      'The build-vs-buy and responsible-AI judgment calls that the frontier-lab interview loops are explicitly built around.',
    chapters: [
      {title: 'Fine-tuning vs. RAG vs. Prompting', to: '/docs/advanced/fine-tuning-vs-rag-vs-prompting'},
      {title: 'Guardrails and Safety', to: '/docs/advanced/guardrails-and-safety'},
      {title: 'Shipping It', to: '/docs/advanced/shipping-it'},
    ],
  },
];

const CURRICULUM_GAPS: string[] = [
  'No formal go-to-market, pricing, or business-strategy training — this curriculum teaches the technology, not product strategy.',
  'No SQL or data-analysis practice — a core screened skill (writing queries, auditing datasets, catching labeling issues) this curriculum doesn’t teach directly.',
  'No user-research or design methodology — interviews, usability testing, wireframing.',
  'No stakeholder or executive communication practice — a skill only a real cross-functional job builds.',
  'No formal experimentation or A/B-testing statistics.',
  'No portfolio-building guidance for the case studies and take-homes many PM interviews require.',
];

type InterviewStep = {title: string; body: string; badge?: string; to?: string; toLabel?: string};

const INTERVIEW_STEPS: InterviewStep[] = [
  {
    title: 'Recruiter screen',
    body: 'Background, motivation, and a first pass at comp expectations — 30 minutes, usually non-technical.',
  },
  {
    title: 'Technical / evaluation round',
    body: 'SQL and data-analysis exercises, offline-vs-online evaluation design, metrics definition, and build-vs-buy trade-offs.',
    to: '/career-tracks/ai-product-manager/technical-round',
    toLabel: 'Prep for this round',
  },
  {
    title: 'AI product sense round',
    body: 'Design an AI-powered feature, define success metrics, and — just as often — argue for why AI is not the right answer.',
    badge: 'The one round nearly every top AI company runs',
    to: '/career-tracks/ai-product-manager/product-sense',
    toLabel: 'Prep for this round',
  },
  {
    title: 'Behavioral / stakeholder round',
    body: 'How you’ve handled a model’s limitations, a cross-functional disagreement, or a hallucination in front of a user.',
    to: '/career-tracks/ai-product-manager/behavioral-round',
    toLabel: 'Prep for this round',
  },
  {
    title: 'Onsite loop / case study presentation',
    body: 'Larger companies (Meta’s 5-round loop, OpenAI’s additional legal and trust-and-safety conversations) add further rounds specific to their org.',
  },
];

const JOB_TITLES: string[] = [
  'AI Product Manager',
  'Product Manager',
  'AI/ML Product Manager',
  'Technical Product Manager — AI',
  'Associate Product Manager',
  'Product Manager, Applied AI',
  'Product Manager, Developer Platform',
  'Growth Product Manager — AI',
  'Product Manager, Responsible AI / Trust & Safety',
  'Group Product Manager, AI',
];

const JOB_SOURCES: Array<{title: string; body: string}> = [
  {
    title: 'Frontier-lab career pages directly',
    body: 'OpenAI, Anthropic, and Google DeepMind each post distinct AI PM roles across developer APIs, fine-tuning tooling, safety interfaces, and enterprise tiers — each with a different bar.',
  },
  {
    title: 'Google’s APM program specifically',
    body: 'Narrow (45–50 slots/year, ~12,000 applicants, 0.67% acceptance) but the cleanest documented 0–2yr pipeline into product.',
  },
  {
    title: 'Search every adjacent title, not just “AI Product Manager”',
    body: 'That exact phrase under-samples the market — Technical PM, ML PM, and Applied AI PM postings surface a much larger pool of genuinely equivalent roles.',
  },
  {
    title: 'Cross-check aggregators against each other',
    body: 'Glassdoor, ZipRecruiter, Levels.fyi, and Wellfound each sample a different population and disagree by $40K or more — treat any single number as one data point, not the answer.',
  },
];

type CompRow = {source: string; range: string};

const COMP_ROWS: CompRow[] = [
  {source: 'AI PM, broad market (blended aggregator data)', range: '$244K–$390K total comp, 25th–75th pct; median ~$305K'},
  {source: 'AI PM base salary (KORE1)', range: '$165K–$238K base'},
  {source: 'AI PM (Glassdoor, by seniority)', range: '$120,566–$305,213; average ~$196K'},
  {source: 'AI PM (ZipRecruiter, national)', range: '$141K–$197K, 25th–75th pct'},
  {source: 'Senior AI PM, Big Tech (~6 yrs exp)', range: '$320K–$420K total comp'},
  {source: 'Senior AI PM, AI-first labs (OpenAI/Anthropic, ~6 yrs exp)', range: '$400K–$600K+ total comp; some packages reported above $700K'},
  {source: 'Google APM, first year (high-COL area)', range: '$200K+ total comp'},
  {source: 'Generalist PM, all titles (Levels.fyi median)', range: '$229K total comp'},
];

type SourceLink = {label: string; url: string};

const SOURCES: SourceLink[] = [
  {label: 'Paraform — What Is an AI Product Manager?', url: 'https://www.paraform.com/blog/what-is-ai-product-manager'},
  {label: 'Institute of AI Product Management — AI PM Job Market in 2026', url: 'https://www.institutepm.com/knowledge-hub/ai-pm-job-market-2026'},
  {label: 'Sundeep Teki — How to Get Hired at OpenAI, Anthropic & Google DeepMind in 2026', url: 'https://www.sundeepteki.org/advice/how-to-get-hired-at-openai-anthropic-and-google-deepmind-in-2026'},
  {label: 'KORE1 — AI Product Manager Salary Guide 2026', url: 'https://www.kore1.com/ai-product-manager-salary-guide/'},
  {label: 'IdeaPlan — AI Product Manager Salary', url: 'https://www.ideaplan.io/product-manager-salary/ai-product-manager'},
  {label: 'Levels.fyi — Product Manager salary data', url: 'https://www.levels.fyi/t/product-manager'},
  {label: 'Leland — How to Get Into the Google APM Program', url: 'https://www.joinleland.com/library/a/how-to-get-into-the-google-apm-program'},
  {label: 'Aakash Gupta — How to Land a $500K AI PM Job at OpenAI: The 2026 Playbook', url: 'https://aakashgupta.medium.com/how-to-land-a-500k-ai-pm-job-at-openai-the-2026-playbook-ae074fed5b54'},
  {label: 'Crosschq — AI Product Manager Interview Questions', url: 'https://www.crosschq.com/blog/ai-product-manager-interview-questions'},
  {label: 'Exponent — Product Sense Interview Prep', url: 'https://www.tryexponent.com/blog/product-sense-interview'},
  {label: 'IGotAnOffer — AI Product Manager Interview Questions', url: 'https://igotanoffer.com/en/advice/ai-product-manager-interview'},
  {label: 'Aakash Gupta — The AI Product Sense Interview Guide', url: 'https://www.news.aakashg.com/p/ai-product-sense-guide'},
];

function Chip({children}: {children: ReactNode}) {
  return <span className={styles.chip}>{children}</span>;
}

function CalloutList({items}: {items: Array<{title: string; body: string}>}) {
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

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) {
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

export default function AiProductManager(): ReactNode {
  return (
    <Layout title={TITLE} description={META_DESCRIPTION}>
      <Head>
        <meta
          name="keywords"
          content="AI product manager, how to become an AI product manager, AI PM career path, AI product manager salary, AI product manager job"
        />
      </Head>
      <main className={styles.page}>
        <div className="container">
          <Link to="/career-tracks" className={styles.back}>
            &larr; Career Tracks
          </Link>

          <header className={styles.hero}>
            <Heading as="h1">AI Product Manager</Heading>
            <p className={styles.oneLiner}>{HOOK}</p>
            <div className={styles.factStrip}>
              {QUICK_FACTS.map((fact) => (
                <div key={fact.label} className={styles.factCard}>
                  <p className={styles.factLabel}>{fact.label}</p>
                  <p className={styles.factValue}>{fact.value}</p>
                </div>
              ))}
            </div>
          </header>

          <Section title="What the job actually is">
            <p>
              An AI Product Manager owns a roadmap the way any PM does — but the thing on that roadmap
              is a system that behaves probabilistically. A traditional feature either works or has a bug;
              an AI feature can be &ldquo;working&rdquo; and still confidently wrong 3% of the time, drift
              as usage patterns shift, or degrade silently when an upstream model provider ships an update
              you didn&rsquo;t ask for. The core PM skills — prioritization, stakeholder alignment,
              writing a spec, shipping under deadline — all transfer directly. What&rsquo;s new is a
              layer of technical judgment: defining what &ldquo;good enough&rdquo; means for a model,
              designing an evaluation set, and knowing when the right call is <em>not</em> to add AI at all.
            </p>
          </Section>

          <Section title="Which of these titles is actually this job?">
            <p>
              &ldquo;AI Product Manager&rdquo; isn&rsquo;t a single, standardized title — it overlaps
              heavily with Technical PM, Growth PM, and the generalist PM title depending on the company.
              Here&rsquo;s how they actually differ:
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Scope</th>
                    <th>Compensation</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row) => (
                    <tr key={row.title}>
                      <td>{row.title}</td>
                      <td>{row.scope}</td>
                      <td>{row.comp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="A day in the life">
            <div className={styles.dayBar}>
              {DAY_SLICES.map((slice) => (
                <div
                  key={slice.label}
                  className={`${styles.daySegment} ${styles[slice.kind]}`}
                  style={{width: `${slice.pct}%`}}
                  title={`${slice.label} — ${slice.pct}%`}
                />
              ))}
            </div>
            <ul className={styles.dayLegend}>
              {DAY_SLICES.map((slice) => (
                <li key={slice.label}>
                  <span className={`${styles.legendDot} ${styles[slice.kind]}`} />
                  <strong>{slice.label}</strong> ({slice.pct}%) &mdash; {slice.note}
                </li>
              ))}
            </ul>
            <div className={styles.insightBox}>
              <p>
                The loop never fully closes — it just gets tighter. A PRD you wrote against last
                quarter&rsquo;s eval set can go stale the moment the underlying model provider ships an
                update, which is why &ldquo;watching production behavior&rdquo; is a standing part of the
                job, not a one-time launch task.
              </p>
            </div>
          </Section>

          <Section title="Who actually gets hired">
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Hiring path</th>
                    <th>What it actually takes</th>
                  </tr>
                </thead>
                <tbody>
                  {EXPERIENCE_ROWS.map((row) => (
                    <tr key={row.who}>
                      <td>{row.who}</td>
                      <td>{row.floor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>Three realistic ways in, given that floor:</p>
            <CalloutList items={ENTRY_PATHS} />
          </Section>

          <Section title="Skills you'll actually need">
            <p>
              None of it is coding. What it is: enough fluency in how a model works to write a spec an ML
              engineer won&rsquo;t have to translate for you, enough comfort with SQL to audit a dataset
              yourself instead of waiting on an analyst, and the judgment to define an evaluation threshold
              and defend it when a launch date is on the line. Hiring guides for frontier labs describe the
              ideal candidate as a &ldquo;PM-shaped engineer or an engineer-shaped PM&rdquo; — not a
              coder, but not someone who can be talked past on a technical trade-off either.
            </p>
            <div className={styles.insightBox}>
              <p>
                The single most common weak signal named across hiring guides: a candidate whose only
                answer to &ldquo;how would you improve this?&rdquo; is &ldquo;add AI to it.&rdquo; Knowing
                when <em>not</em> to reach for a model is treated as a stronger signal than knowing how to
                spec one.
              </p>
            </div>
          </Section>

          <Section title="How Few-Shot Academy gets you there">
            <p>
              This curriculum won&rsquo;t teach you go-to-market strategy or how to run a user interview
              — it teaches the technical layer underneath the job, so you can hold your own in the
              rooms where those decisions get made:
            </p>
            <div className={styles.curriculumGrid}>
              {CURRICULUM_GROUPS.map((group) => (
                <div key={group.tier} className={styles.curriculumCard}>
                  <Heading as="h4" className={styles.curriculumTier}>
                    {group.tier}
                  </Heading>
                  <p className={styles.curriculumDesc}>{group.description}</p>
                  <ul className={styles.curriculumList}>
                    {group.chapters.map((chapter) => (
                      <li key={chapter.title}>
                        <Link to={chapter.to}>{chapter.title}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className={styles.gapsBox}>
              <Heading as="h4" className={styles.gapsHeading}>
                What this curriculum doesn&rsquo;t cover
              </Heading>
              <ul className={styles.gapsList}>
                {CURRICULUM_GAPS.map((gap) => (
                  <li key={gap}>{gap}</li>
                ))}
              </ul>
            </div>
          </Section>

          <Section title="The interview">
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
                      <p className={styles.aside}>
                        <Link to={step.to}>{step.toLabel} &rarr;</Link>
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </Section>

          <Section title="Actually landing one">
            <p>Titles to search beyond the exact phrase &ldquo;AI Product Manager&rdquo;:</p>
            <div className={styles.chipRow}>
              {JOB_TITLES.map((title) => (
                <Chip key={title}>{title}</Chip>
              ))}
            </div>
            <CalloutList items={JOB_SOURCES} />
            <p>
              There is no dominant AI PM certification the way there is, say, a PMP for traditional project
              management — shipped work and a real eval artifact you can walk an interviewer through
              outweigh any credential.
            </p>
          </Section>

          <Section title="Compensation">
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
            <div className={styles.insightBox}>
              <p>
                Aggregators disagree by $40K or more depending on which companies and titles they sample
                &mdash; treat any single number as one data point, and weight frontier-lab postings and
                Levels.fyi (self-reported, verified offers) over generic job-board averages.
              </p>
            </div>
          </Section>

          <Section title="Go deeper">
            <ul className={styles.sourceList}>
              {SOURCES.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer">
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </Section>

          <div className={styles.ctaRow}>
            <Link className="button button--primary button--lg" to="/docs/foundations/overview">
              Start Foundations
            </Link>
            <Link className="button button--secondary button--lg" to="/career-tracks">
              All career tracks
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}
