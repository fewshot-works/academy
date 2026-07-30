import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './applied-agentic-ai-engineer.module.css';

const TITLE = 'Applied / Agentic AI Engineer';

const META_DESCRIPTION =
  'Building RAG pipelines and tool-using agents on top of foundation models, shipped into production. One real role behind six overlapping job titles.';

const HOOK =
  'Software engineers have wired up third-party APIs for two decades. What changed recently is that the API ' +
  'can now reason, call other tools, and act mostly on its own. That new shape of work got its name from an ' +
  'essay, not a job posting: Shawn "swyx" Wang’s 2023 piece "The Rise of the AI Engineer" argued this would ' +
  'become its own discipline, separate from ML research, and the label stuck. What never stuck was any ' +
  'agreement on what to call it. Postings for the same job now scatter across AI Engineer, Applied AI ' +
  'Engineer, GenAI Engineer, LLM Engineer, Agent Engineer, and RAG Engineer, sometimes at the same company ' +
  'for the same team. This guide treats them as one role, the person who builds RAG pipelines and ' +
  'tool-using agents into real products, and walks through what the job actually looks like day to day, who ' +
  'gets hired, what to learn first, and how the interview goes, grounded in real postings, comp data, and ' +
  'firsthand interview accounts, not guesswork.';

type QuickFact = {label: string; value: string};

const QUICK_FACTS: QuickFact[] = [
  {label: 'Typical base salary', value: '$150K–$245K'},
  {label: 'Experience floor', value: 'Often 1–3 yrs; 4–8+ yrs at frontier labs'},
  {label: 'Travel', value: 'Minimal to none, a build role, not a deployment role'},
  {label: 'Interview weight', value: 'System design & agent architecture, not LeetCode'},
];

type CompareRow = {role: string; scope: string; primarySkills: string};

const COMPARE_ROWS: CompareRow[] = [
  {
    role: 'Data Scientist',
    scope: 'Analysis and experimentation, often stops at a notebook rather than a shipped feature',
    primarySkills: 'Statistics, pandas, classical ML',
  },
  {
    role: 'ML Engineer (classical)',
    scope: 'Trains, tunes, and serves custom models from scratch, owns the training pipeline itself',
    primarySkills: 'Deep learning, GPU training infra, MLOps',
  },
  {
    role: 'Applied / Agentic AI Engineer',
    scope:
      'Builds product features on top of existing foundation models, RAG, tool-using agents, orchestration, and ships them to production',
    primarySkills: 'API integration, retrieval, evals, agent frameworks',
  },
];

type DaySlice = {label: string; pct: number; note: string; kind: 'customer' | 'code' | 'internal'};

const DAY_SLICES: DaySlice[] = [
  {
    label: 'Building & shipping',
    pct: 50,
    kind: 'code',
    note: 'Writing the actual RAG and agent code: retrieval logic, tool definitions, orchestration, and endless prompt iteration.',
  },
  {
    label: 'Evaluation & debugging',
    pct: 30,
    kind: 'internal',
    note: 'Reading agent traces, tracking down why a tool call looped or retrieval missed, tightening the eval set that gates every change before it ships.',
  },
  {
    label: 'Cross-functional work',
    pct: 20,
    kind: 'customer',
    note: 'Working with product and design on what the agent should actually do, and with support on what real users are hitting in production.',
  },
];

type ExperienceRow = {company: string; floor: string};

const EXPERIENCE_ROWS: ExperienceRow[] = [
  {company: 'Anthropic (Applied AI Engineer)', floor: '4+ yrs typical, 3+ yrs on the FDE-flavored entry track, 8+ yrs for senior/Labs roles'},
  {company: 'Sierra (Agent Engineer)', floor: 'Senior-SWE bar, roughly 5+ yrs for leadership-leaning openings'},
  {company: 'General market / product startups', floor: '1–3 yrs typical'},
  {company: 'Select startup apprentice programs', floor: '0–1 yr, a named but uncommon exception'},
];

type Callout = {title: string; body: string};

const ENTRY_PATHS: Callout[] = [
  {
    title: 'Backend or full-stack transition',
    body: 'The single most common path into this title: a working software engineer who added an LLM API, a vector database, and an agent framework to an existing toolkit, not a research background.',
  },
  {
    title: 'Data science or classical ML transition',
    body: 'Data scientists and classical ML engineers moving toward product-facing work, trading notebook experimentation for a shipped feature with real users.',
  },
  {
    title: 'Founding or early engineer at an AI-native startup',
    body: 'Someone who already built the eval harness and the agent because the startup needed one, not because a course taught them to, the same pattern of doing the job before it had a name that FDE hiring rewards too.',
  },
];

type CurriculumGroup = {tier: string; description: string; chapters: {title: string; to: string}[]};

const CURRICULUM_GROUPS: CurriculumGroup[] = [
  {
    tier: 'Foundations',
    description: 'The AI/LLM/RAG/agent literacy every posting assumes as a baseline.',
    chapters: [
      {title: 'What Is AI, Really?', to: '/docs/foundations/what-is-ai'},
      {title: 'What Is a Large Language Model?', to: '/docs/foundations/what-is-an-llm'},
      {title: 'Prompting 101', to: '/docs/foundations/prompting-101'},
      {title: 'What Is an Embedding?', to: '/docs/foundations/what-is-an-embedding'},
      {title: 'What Is a Vector Database and Why?', to: '/docs/foundations/what-is-a-vector-database'},
      {title: 'What Is RAG?', to: '/docs/foundations/what-is-rag'},
      {title: 'What Is an AI Agent?', to: '/docs/foundations/what-is-an-ai-agent'},
      {title: 'Capstone: A Q&A Bot Over Your Own Documents', to: '/docs/foundations/capstone-qa-bot'},
    ],
  },
  {
    tier: 'Intermediate',
    description:
      'The chunking, retrieval, tool-use, and eval depth this exact job is built on, arguably the core of the role rather than a supporting skill.',
    chapters: [
      {title: 'Chunking Strategies', to: '/docs/intermediate/chunking-strategies'},
      {title: 'Choosing an Embedding Model', to: '/docs/intermediate/choosing-embedding-model'},
      {title: 'Better Retrieval', to: '/docs/intermediate/better-retrieval'},
      {title: 'Tool Use', to: '/docs/intermediate/tool-use'},
      {title: 'Your First Agent', to: '/docs/intermediate/your-first-agent'},
      {title: 'Evaluating What You Built', to: '/docs/intermediate/evaluating'},
    ],
  },
  {
    tier: 'Advanced',
    description:
      'Multi-agent orchestration, guardrails, observability, and production concerns: the difference between a demo agent and one a company will actually ship.',
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
  'Fine-tuning and training custom models, this curriculum treats foundation models as an API you call, not something you train yourself',
  'Production-scale MLOps and GPU serving infra: Kubernetes-based model serving, distributed training, GPU cluster scheduling',
  'Classical ML fundamentals some postings still test for: regression, classification, and feature engineering outside the LLM/agent context',
  'General production software-engineering fundamentals most postings assume as a floor (this curriculum assumes zero prior CS background by design, it is the AI-specific layer, not a CS-degree substitute)',
  'Live, ambiguous system-design performance under interviewer pushback. A chapter can teach the concepts; it cannot teach the improvisation.',
];

type InterviewStep = {title: string; body: string; badge?: string; to?: string; toLabel?: string};

const INTERVIEW_STEPS: InterviewStep[] = [
  {
    title: 'Recruiter screen',
    body: 'Standard fit and background conversation, sometimes including a quick check on how you think about AI reliability and safety.',
  },
  {
    title: 'Coding / technical round',
    body: 'LLM-adjacent coding: a retrieval scorer, a token-budget allocator, a tool-use orchestrator, or a debugging pass through a buggy agent codebase.',
    to: '/career-tracks/applied-agentic-ai-engineer/technical-round',
    toLabel: 'What to expect, how to prepare, and two things to have ready',
  },
  {
    title: 'System design round',
    body: 'You design an agent or RAG system live, often on a whiteboard or in a tool like Excalidraw, while the interviewer pushes on your architecture and trade-offs.',
    badge: 'Highest weight in the loop, the round that actually decides most offers',
    to: '/career-tracks/applied-agentic-ai-engineer/system-design',
    toLabel: 'The framework, plus 3 full end-to-end walkthroughs',
  },
  {
    title: 'Behavioral round',
    body: 'Shipping under ambiguity, handling a regression a user found before your eval set did, and working with product and support on what the agent should actually do.',
    to: '/career-tracks/applied-agentic-ai-engineer/behavioral-round',
    toLabel: 'Sample questions and how to structure your answers',
  },
  {
    title: 'Take-home or live build (some companies)',
    body: 'A 3–4 hour build against a fictional customer or product brief, common at Sierra and Anthropic specifically.',
  },
];

const JOB_TITLES: string[] = [
  'AI Engineer',
  'Applied AI Engineer',
  'Agentic AI Engineer',
  'GenAI Engineer',
  'LLM Engineer',
  'Agent Engineer',
  'RAG Engineer',
  'AI Software Engineer',
  'Founding Engineer (AI)',
];

const JOB_SOURCES: Callout[] = [
  {
    title: 'Direct career pages',
    body: 'Anthropic, OpenAI, Sierra, Scale AI, and most well-funded startups building products on top of foundation models.',
  },
  {
    title: 'Search by responsibilities, not title',
    body: 'Since the same job hides under six or more overlapping titles, search for RAG, tool-using agents, evals, and orchestration in the responsibilities section rather than filtering by title alone.',
  },
  {
    title: 'Job boards',
    body: 'Wellfound’s AI-tagged listings, YC’s Work at a Startup, and a responsibilities-based search on LinkedIn rather than a title-based one.',
  },
  {
    title: 'Recruiting agencies',
    body: 'KORE1 has started running dedicated agentic AI engineer searches specifically, a signal of how fast this title cluster is growing, not necessarily a recommendation to use them.',
  },
];

type CompRow = {source: string; range: string};

const COMP_ROWS: CompRow[] = [
  {source: 'Glassdoor, Applied AI Engineer (US)', range: '$129,856–$198,385 base (25th–75th pct), avg $159,392'},
  {source: 'Levels.fyi, AI Engineer (title page)', range: '$153,750 median base'},
  {source: 'Levels.fyi, ML/AI Software Engineer focus', range: '$245,000 average total comp'},
  {source: 'KORE1, 2026 Agentic AI Engineering Hiring Survey', range: '$185K–$320K base specifically for agentic AI engineer postings'},
  {source: 'ZipRecruiter, AI Engineer (general market)', range: '~$140K–$185K base typical'},
];

type SourceLink = {label: string; href: string};

const SOURCES: SourceLink[] = [
  {label: 'The Rise of the AI Engineer, swyx / Latent Space', href: 'https://www.latent.space/p/ai-engineer'},
  {
    label: 'The AI Job Title Reference Guide 2026, Ivan Turkovic',
    href: 'https://www.ivanturkovic.com/the-ai-job-title-reference-guide-2026/',
  },
  {label: 'Making Sense of AI Job Titles, Drew Breunig', href: 'https://www.dbreunig.com/2025/08/21/a-guide-to-ai-titles.html'},
  {
    label: 'Anthropic Applied AI Engineer interview process, Perspective AI',
    href: 'https://getperspective.ai/blog/anthropic-applied-ai-engineer-interview-process-frontier-lab-2026',
  },
  {label: 'Sierra Agent Engineer interview guide, Exponent', href: 'https://www.tryexponent.com/guides/sierra-agent-engineer-interview'},
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

export default function AppliedAgenticAIEngineer(): ReactNode {
  return (
    <Layout title={TITLE} description={META_DESCRIPTION}>
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
              Beyond the elevator pitch, this is a product engineer whose core building blocks are a foundation
              model API, a retrieval layer, and a set of tools the model can call, not a researcher training
              models from scratch, and not a data scientist running offline experiments in a notebook. The
              shorthand that keeps showing up across sources: drop the word &ldquo;Applied&rdquo; and you are
              describing someone building the models; keep it, and you are describing someone building on top
              of them.
            </p>
            <p>
              That distinction sounds clean until you look at the job titles actually doing this work. Plenty
              of &ldquo;AI Engineer&rdquo; postings are really MLOps roles in disguise, and plenty of
              &ldquo;Machine Learning Engineer&rdquo; postings are really this job wearing an older label.
            </p>
            <p className={styles.aside}>
              Background:{' '}
              <a href="https://www.latent.space/p/ai-engineer" target="_blank" rel="noopener noreferrer">
                The Rise of the AI Engineer
              </a>{' '}
              by swyx, and{' '}
              <a
                href="https://www.ivanturkovic.com/the-ai-job-title-reference-guide-2026/"
                target="_blank"
                rel="noopener noreferrer"
              >
                The AI Job Title Reference Guide 2026
              </a>{' '}
              by Ivan Turkovic.
            </p>
          </Section>

          <Section eyebrow="Applied/Agentic vs. the adjacent titles" title="Is this really the role you want?">
            <p>
              The title chaos runs both directions: plenty of Data Scientist and classical ML Engineer postings
              quietly describe this same work too. Here is the actual gut check, by scope and primary skillset:
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Scope</th>
                    <th>Primary skillset</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row) => (
                    <tr key={row.role} className={row.role === TITLE ? styles.highlightRow : undefined}>
                      <td>{row.role}</td>
                      <td>{row.scope}</td>
                      <td>{row.primarySkills}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={styles.aside}>
              Compensation for this title cluster now regularly outpaces classical ML Engineer postings at the
              same company, a reflection of how far demand has outrun supply for people who can ship a reliable
              agent rather than train one.
            </p>
            <p>
              Assuming this still checks out as the role you actually want, the next question is blunter: what
              does the job look like once you are in it?
            </p>
          </Section>

          <Section title="A day in the life">
            <p>
              Per postings and interview accounts, the split runs roughly half building and shipping, a third
              on evaluation and debugging, and the rest on cross-functional work with product and support. The
              pitch companies make to candidates: getting a demo working against a clean example is maybe a
              fifth of the job. The rest is retrieval that breaks on real documents, a tool call that loops, and
              an eval set that has to catch a regression before a user does.
            </p>
            <div className={styles.dayBar}>
              {DAY_SLICES.map((slice) => (
                <div
                  key={slice.label}
                  className={`${styles.daySegment} ${styles[slice.kind]}`}
                  style={{width: `${slice.pct}%`}}
                />
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
            <p>
              Most of the job, in other words, happens after the first working prototype, not before it. That
              is the real reason this hiring bar looks nothing like a typical SWE loop, starting with who even
              gets in the door.
            </p>
          </Section>

          <Section title="Who actually gets hired">
            <p>
              This is <strong>not</strong>, in practice, a title you walk into straight out of a bootcamp,
              despite how much beginner-facing content frames &ldquo;AI Engineer&rdquo; as an entry-level path.
              Real experience floors, pulled directly from current postings and interview guides:
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Company</th>
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
            <p>A few named exceptions to that floor:</p>
            <CalloutList items={ENTRY_PATHS} />
            <p>
              The single best-predictor background across sources: someone who already shipped a feature using
              an LLM API at their current job, on their own initiative, before the title existed on their team.
              Other common entry paths: backend or full-stack engineering, data science, classical ML, or a
              lateral move from a data platform or analytics engineering role, since all three already carry the
              muscle of turning something messy into something reliable.
            </p>
            <p>
              If any of that describes you, the next question is what to actually go learn. The technical bar,
              unlike the hiring bar, is fairly explicit in the postings.
            </p>
          </Section>

          <Section title="Skills you’ll actually need">
            <p>
              Five categories show up again and again, roughly in this order of how often postings check for
              them.
            </p>
            <p>
              <strong>Languages:</strong> Python is the overwhelming default, with TypeScript or JavaScript a
              common second for teams building an agent-facing UI alongside the backend.
            </p>
            <p>
              <strong>Retrieval and data:</strong> vector databases (pgvector, Pinecone, Weaviate, or similar),
              embedding models, chunking strategy, and hybrid search combining keyword and semantic retrieval.
            </p>
            <p>
              <strong>Orchestration and agent frameworks:</strong> LangGraph, LangChain, CrewAI, DSPy, or a raw
              tool-calling loop written by hand. Most postings care less about the specific framework than
              whether you understand what it is actually doing underneath.
            </p>
            <p>
              <strong>Evaluation:</strong> precision and recall at k, LLM-as-judge, and a regression eval set
              that gates every change before it ships, cited repeatedly across sources as the actual
              differentiator between a demo and a shipped feature.
            </p>
            <p>
              <strong>Cloud and deployment:</strong> one major cloud provider, Docker, and basic observability
              or tracing (LangSmith, Langfuse, or an equivalent), enough to see what an agent actually did in
              production, not just what it was supposed to do.
            </p>
            <div className={styles.insightBox}>
              <p>
                <strong>The category that actually separates candidates isn’t technical at all:</strong>{' '}
                evaluation discipline, catching a regression before a user does, plus knowing when not to add
                another agent or another tool. The simplest system that solves the problem beats the most
                sophisticated one almost every time this comes up in an interview.
              </p>
            </div>
            <p className={styles.aside}>
              Weighting differs by company: Sierra leans hardest on debugging an existing agent codebase and
              live system design, Anthropic weights evals and a customer-conversation simulation heavily enough
              that it reportedly filters out a majority of candidates who already passed the coding stages.
            </p>
            <p>
              That’s a lot to learn cold. Here is specifically which parts of it this curriculum already
              covers, and which parts it deliberately doesn’t.
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
              With the technical bar covered, or at least mapped, the remaining unknown is the interview itself,
              which looks unlike almost any other engineering loop.
            </p>
          </Section>

          <Section title="The interview">
            <p>
              This isn’t a standard SWE loop either. System design and agent architecture carry the most
              weight, not raw coding speed, at both Sierra and Anthropic, the two companies with the most
              documented interview processes for this exact title.
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
              Timelines vary: Sierra reports an average of about 14 days from screen to offer, while
              Anthropic’s loop typically runs several weeks given the number of stages. The most-cited
              failure mode is treating the system design round like a whiteboard algorithm problem instead of a
              real architecture conversation with trade-offs.
            </p>
            <p>
              Once you’ve cleared that, the practical question gets a lot more mundane: what do you
              actually search for, and where?
            </p>
          </Section>

          <Section title="Actually landing one">
            <p>
              Search for these titles, all of them describe some version of the same job, and read the
              responsibilities section rather than the title itself; use the comparison table earlier as your
              gut check.
            </p>
            <div className={styles.chipRow}>
              {JOB_TITLES.map((title) => (
                <Chip key={title}>{title}</Chip>
              ))}
            </div>
            <p>Once you know what to search for, here’s where those postings actually live:</p>
            <CalloutList items={JOB_SOURCES} />
            <p>
              No standardized cross-company certification exists for this title, the role moves too fast for a
              testable exam body to keep up. What actually helps as a baseline: a cloud AI certification like{' '}
              <strong>AWS Certified AI Practitioner</strong> or <strong>Azure AI Engineer Associate (AI-102)</strong>,
              paired with a public, deployed project that actually uses retrieval and a tool-calling agent, not
              just a wrapped chat completion call.
            </p>
            <p className={styles.aside}>
              Every source is emphatic that certs are a distant second to a shipped project and a documented
              eval set, don’t lead with certs.
            </p>
            <p>One more number before you decide this is worth all that: what it actually pays.</p>
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
              Bottom line: base clusters $150K to $245K broadly across the general market, with the
              agentic-specific high end and frontier-lab total comp both running well above that as outlier
              headline numbers, not the median reality.
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
