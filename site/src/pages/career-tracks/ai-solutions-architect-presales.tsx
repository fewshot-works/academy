import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Heading from '@theme/Heading';

import styles from './ai-solutions-architect-presales.module.css';

const TITLE = 'AI Solutions Architect / Presales Engineer';

const META_DESCRIPTION =
  'Pre-sales and consulting: demoing, proposal-writing, and requirement analysis for enterprise AI adoption.';

const HOOK =
  'Presales existed long before AI — a Sales Engineer or Solutions Architect has always been the one who ' +
  'proves a product works before anyone signs a contract. What changed is what “proving it works” now ' +
  'requires: instead of demoing a dashboard, you’re designing a RAG pipeline, defending a token-cost ' +
  'estimate, or standing in front of a security team explaining how an agent won’t leak the customer’s ' +
  'data. The title itself is famously inconsistent — one long-running Glassdoor thread on the subject ' +
  'calls it “a bit of a mess,” since Solutions Architect, Sales Engineer, Solutions Engineer, and Solutions ' +
  'Consultant all get used almost interchangeably depending on the company. This guide sorts through that ' +
  'mess: what the job actually is, who gets hired, what to learn first, and how the interview goes — ' +
  'grounded in real postings, comp data, and firsthand accounts, not guesswork.';

type QuickFact = {label: string; value: string};

const QUICK_FACTS: QuickFact[] = [
  {label: 'Typical base salary', value: '$95K–$190K, plus commission/OTE'},
  {label: 'Experience floor', value: 'Usually 3–5 yrs (junior tracks exist under 2)'},
  {label: 'Travel', value: 'Regional to national, for on-site discovery and demos'},
  {label: 'Interview weight', value: '~40% live design & discovery, not take-home coding'},
];

type CompareRow = {role: string; scope: string; codeOwnership: string};

const COMPARE_ROWS: CompareRow[] = [
  {
    role: 'Sales Engineer',
    scope: 'Pre-sale technical support paired with an Account Executive — demos, RFP responses, objection handling',
    codeOwnership: 'Configures demos and PoCs; rarely owns a deliverable after signature',
  },
  {
    role: 'Solutions Engineer',
    scope: 'Pre-sale, sometimes through early onboarding — hands-on with the product in the customer’s own environment',
    codeOwnership: 'Builds working PoCs and light integrations',
  },
  {
    role: 'Solutions Architect',
    scope: 'Pre-sale design authority — owns the end-to-end technical blueprint a deal gets built on',
    codeOwnership: 'Designs architecture, codes PoCs, occasionally stays through early implementation',
  },
  {
    role: 'Solutions Consultant',
    scope: 'Company-dependent — most vendors mean post-sale implementation, though some (ServiceNow) mean presales',
    codeOwnership: 'Business-case and ROI modeling more than hands-on building',
  },
];

type DaySlice = {label: string; pct: number; note: string; kind: 'customer' | 'code' | 'internal'};

const DAY_SLICES: DaySlice[] = [
  {
    label: 'Discovery & design',
    pct: 50,
    kind: 'customer',
    note: 'Discovery calls, design sessions, and architecture reviews with a prospect’s engineering and security teams — working out what they actually need before anyone commits to buying it.',
  },
  {
    label: 'Building PoCs and demos',
    pct: 30,
    kind: 'code',
    note: 'Wiring up a proof-of-concept, sizing an architecture, and estimating token/inference cost for whatever gets proposed.',
  },
  {
    label: 'Internal & enablement',
    pct: 20,
    kind: 'internal',
    note: 'Proposal and RFP writing, reference-architecture content, and strategizing the next opportunity with the sales team.',
  },
];

type ExperienceRow = {company: string; floor: string};

const EXPERIENCE_ROWS: ExperienceRow[] = [
  {company: 'Typical enterprise presales SA/SE posting', floor: '3–5 yrs'},
  {company: 'Solvd, presales AI Solutions Architect (remote)', floor: '2+ yrs hands-on GenAI/agentic, on top of prior cloud or software architecture experience'},
  {company: 'Solvd, senior AI Solution Architect (onsite)', floor: '8–15 yrs overall IT, 3–5 yrs AI-specific'},
  {company: 'Databricks, Solutions Architect', floor: 'A named new-grad L3 entry track exists'},
  {company: 'Junior / Associate Solutions Engineer programs', floor: '0–2 yrs — a real, named entry tier'},
];

type Callout = {title: string; body: string};

const ENTRY_PATHS: Callout[] = [
  {
    title: 'Associate / Junior SE programs',
    body: 'Several vendors run a named junior tier — entry-level base pay lands around $61K–$104K, well below the senior presales range, as a genuine on-ramp rather than a rebranded internship.',
  },
  {
    title: 'A customer-facing technical background',
    body: 'Support engineers, technical account managers, and implementation consultants who already know how to translate a customer’s problem into a technical ask move into presales laterally more often than straight-from-college hires.',
  },
  {
    title: 'Cloud / AI certifications as a credential substitute',
    body: 'At the junior tier specifically, an AWS or Azure AI certification can stand in for some of the missing years of experience. It won’t at the senior or staff tier, where a track record of closed deals matters more.',
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
    description: 'The RAG engineering, tool-use, and eval depth needed to design and defend a real architecture, not just demo one.',
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
    description: 'What lets a proposed architecture survive a skeptical security and platform review, not just a demo.',
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
  'Sales methodology and qualification frameworks — MEDDIC/MEDDPICC, discovery-call structure, how a deal actually moves through a pipeline (this curriculum teaches the technology, not how to sell it)',
  'TCO/ROI modeling and business-case writing — translating an architecture into a dollar figure a budget-holder can defend internally',
  'RFP and proposal writing, and the enterprise procurement process — security questionnaires, MSAs, the paperwork that actually closes a deal',
  'Cloud platform certifications at a hands-on infra level — AWS/Azure/GCP fluency deep enough to defend an architecture live, not just describe one (this curriculum runs locally via Ollama, not against real cloud infra)',
  'Whiteboarding and live-presentation practice under real-time questioning — a different muscle than writing code alone at a keyboard',
];

type InterviewStep = {title: string; body: string; badge?: string; to?: string; toLabel?: string};

const INTERVIEW_STEPS: InterviewStep[] = [
  {
    title: 'Recruiter screen',
    body: 'Standard fit and background conversation, often with an early gut-check on presales motivation specifically — this is a sales-adjacent role, and interviewers screen for candidates who actually want that.',
  },
  {
    title: 'Live design / discovery round',
    body: 'Given a vague prompt, design an architecture out loud and defend it under questioning — the presales equivalent of a whiteboard interview.',
    to: '/career-tracks/ai-solutions-architect-presales/technical-round',
    toLabel: 'What to expect, how to prepare, and what to have ready',
  },
  {
    title: 'Case-study / PoC round',
    body: 'A hypothetical customer hands you a vague ask, and you work it live from discovery through a proposed architecture and demo plan.',
    badge: 'Often the most heavily weighted round',
    to: '/career-tracks/ai-solutions-architect-presales/case-studies',
    toLabel: 'The framework, plus full end-to-end walkthroughs',
  },
  {
    title: 'Behavioral / stakeholder round',
    body: 'A mock customer call — objection handling, value anchoring, and navigating a deal team of Account Executive, delivery, and legal/procurement.',
    to: '/career-tracks/ai-solutions-architect-presales/behavioral-round',
    toLabel: 'Sample scenarios and how to work through them',
  },
  {
    title: 'Exec / culture round (some companies)',
    body: 'At larger vendors, a final round with a senior leader or cross-functional panel, weighted more on values fit than technical depth.',
  },
];

const JOB_TITLES: string[] = [
  'Solutions Architect',
  'AI Solutions Architect',
  'Solutions Engineer',
  'Sales Engineer',
  'Presales Engineer',
  'Presales Solutions Architect',
  'Solutions Consultant',
  'AI Solutions Consultant',
  'Customer Engineer (Google)',
  'Enterprise Architect (AI)',
];

const JOB_SOURCES: Callout[] = [
  {
    title: 'Direct career pages',
    body: 'AWS, Google Cloud, Microsoft, Databricks, Snowflake, and Salesforce all list presales/solutions-architect roles directly, alongside AI-native vendors like Anthropic and OpenAI.',
  },
  {
    title: 'Consulting and staffing postings',
    body: 'Firms like Solvd post AI-specific presales roles directly on Dice and BeBee — useful as a signal of what a “typical” posting actually asks for, outside the biggest-name vendors.',
  },
  {
    title: 'Search every title variant, not just one',
    body: 'Because the title is this inconsistent, a single LinkedIn or Glassdoor search misses postings — run the whole chip list above, not just “Solutions Architect.”',
  },
  {
    title: 'Enterprise infra vendors',
    body: 'Hardware and infra vendors (HPE and similar) run their own presales orgs, often with a lower experience floor than the AI-native names.',
  },
];

type CompRow = {source: string; range: string};

const COMP_ROWS: CompRow[] = [
  {source: 'Broad market (ZipRecruiter, AI presales engineer)', range: '$85K–$176K'},
  {source: 'AI Solutions Architect average (ZipRecruiter)', range: '~$146K, 25th–75th pct $126K–$166K'},
  {source: 'General presales average (ZipRecruiter, multiple titles)', range: '$95K–$144K'},
  {source: 'Enterprise / senior base', range: '$140K–$190K'},
  {source: 'Databricks Solutions Architect, Senior/Staff (Levels.fyi)', range: '$349K–$359K median total comp ($172K–$197K base + stock + bonus)'},
  {source: 'Databricks Solutions Architect, new-grad L3 (Levels.fyi)', range: '~$231K median total comp'},
];

type SourceLink = {label: string; href: string};

const SOURCES: SourceLink[] = [
  {
    label: 'Glassdoor Community: Sales Engineer vs. Solutions Engineer vs. Solutions Consultant vs. Solutions Architect',
    href: 'https://www.glassdoor.com/Community/salessolution-engineers/how-can-i-tellwhat-is-the-difference-between-the-sales-engineer-se-solutions-engineer-se-and-solutions-consultant-sc-titles-i',
  },
  {
    label: 'MIT NANDA: 95% of enterprise AI pilots fail to deliver measurable ROI',
    href: 'https://www.healthcareitnews.com/news/mit-95-enterprise-ai-pilots-fail-deliver-measurable-roi',
  },
  {label: 'ZipRecruiter: AI Solutions Architect salary', href: 'https://www.ziprecruiter.com/Salaries/Ai-Solutions-Architect-Salary'},
  {
    label: 'Levels.fyi: Databricks Solution Architect compensation',
    href: 'https://www.levels.fyi/companies/databricks/salaries/solution-architect/locations/united-states',
  },
  {
    label: 'A day in the life of a Microsoft Pre-Sales Architect',
    href: 'https://medium.com/@techinsightswithDillonWhite/a-day-in-the-life-of-a-microsoft-pre-sales-architect-day-1-of-365-8e44653723e',
  },
  {
    label: 'AWS Certified Solutions Architect – Associate exam guide',
    href: 'https://docs.aws.amazon.com/aws-certification/latest/examguides/solutions-architect-associate-03.html',
  },
  {label: 'Presales AI Solutions Architect posting (Solvd, via Dice)', href: 'https://www.dice.com/job-detail/6f335149-95f5-485a-b82c-570dbea2391f'},
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

export default function AiSolutionsArchitectPresales(): ReactNode {
  return (
    <Layout title={TITLE} description={META_DESCRIPTION}>
      <Head>
        <meta
          name="keywords"
          content="AI solutions architect, AI presales engineer, how to become an AI solutions architect, AI presales career path, AI solutions architect salary"
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
              Strip away the title confusion and the job is this: you’re the technical half of a sales motion.
              An Account Executive owns the relationship and the quota; you own proving, to a skeptical
              technical audience, that the thing being sold actually works for their specific environment. You
              run discovery calls, design a proposed architecture, build a proof-of-concept, and defend it in
              front of engineers and security reviewers who are actively looking for reasons to say no.
            </p>
            <p>
              What the AI layer adds on top of the classic version of this job: the thing you’re proving now
              usually involves an LLM, which means the questions get harder to dodge. “How do you know it won’t
              hallucinate on our data?” and “what does this cost to run at 10x the volume?” are now standard
              parts of the pitch, not edge cases.
            </p>
            <p className={styles.aside}>
              Background:{' '}
              <a
                href="https://www.glassdoor.com/Community/salessolution-engineers/how-can-i-tellwhat-is-the-difference-between-the-sales-engineer-se-solutions-engineer-se-and-solutions-consultant-sc-titles-i"
                target="_blank"
                rel="noopener noreferrer">
                Glassdoor Community thread on SE vs. SA vs. Solutions Consultant naming
              </a>
              .
            </p>
          </Section>

          <Section eyebrow="Presales vs. the adjacent titles" title="Is this really the role you want?">
            <p>
              None of these four titles has a fixed, universal meaning — the same responsibilities show up under
              different names at different companies, and the same title means different things at two
              companies down the street from each other. Here’s the closest thing to a consistent gut-check,
              by scope and where the role sits relative to the signature:
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Scope</th>
                    <th>Pre-sale vs. post-sale</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row) => (
                    <tr key={row.role}>
                      <td>{row.role}</td>
                      <td>{row.scope}</td>
                      <td>{row.codeOwnership}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={styles.aside}>
              Verify per company before you trust a title on a job board — the safest move is looking up
              current employees with that exact title at that exact company on LinkedIn.
            </p>
            <p>
              Assuming presales still checks out as the shape of work you want, the next question is blunter:
              what does the job look like once you’re in it?
            </p>
          </Section>

          <Section title="A day in the life">
            <p>
              Per direct accounts from people doing the job, the split runs roughly 50% discovery and design
              work with prospects, 30% building PoCs and demos, 20% internal and enablement work. One Microsoft
              presales architect’s running diary put it bluntly: engineering and testing is maybe 5% of the job
              — the actual work is consultative, building a solution <em>with</em> the customer rather than
              unilaterally deciding what’s best and demoing it at them.
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
                <strong>A working demo is table stakes now, not a differentiator.</strong> MIT’s NANDA
                initiative found that 95% of enterprise generative-AI pilots deliver no measurable ROI — which
                means almost anyone can wire up a demo that looks impressive in a sandbox. What actually
                separates a good presales engineer from a great one isn’t the demo; it’s knowing which of a
                prospect’s stated “requirements” is the real blocker to a signed deal and which is noise, and
                being able to defend an architecture against the question every technical buyer eventually
                asks: “okay, but does this actually work in production, at our scale, on our data?”
              </p>
            </div>
            <p>
              Most of the job, in other words, happens before a contract is signed — and the bar for getting
              hired to do it reflects that. That’s the next thing worth being honest about.
            </p>
          </Section>

          <Section title="Who actually gets hired">
            <p>
              This is <strong>not</strong> a uniform entry-level title — the experience floor swings hard
              depending on how senior and how AI-specific the posting is. Real experience floors, pulled
              directly from current postings:
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
            <p>Three real entry paths into that range:</p>
            <CalloutList items={ENTRY_PATHS} />
            <p>
              The single best-predictor background across sources: someone who already has customer-facing
              technical experience — implementation consulting, technical account management, or cloud
              professional services (AWS ProServe, Azure customer engineering) — and is layering AI-specific
              depth on top of it, rather than a pure software engineer trying to move sideways into sales.
            </p>
            <p>
              If any of that describes you, the next question is what to actually go learn — the technical bar,
              unlike the hiring bar, is fairly explicit in the postings.
            </p>
          </Section>

          <Section title="Skills you’ll actually need">
            <p>
              Six categories show up again and again in postings, roughly in this order of how often they get
              checked for.
            </p>
            <p>
              <strong>Communication and discovery:</strong> the single most-cited skill. Running a discovery
              call, asking questions that surface the actual constraint — budget, security posture, existing
              vendor lock-in — instead of just the stated wishlist.
            </p>
            <p>
              <strong>Cloud and infra:</strong> AWS, GCP, or Azure, with enough hands-on fluency to defend an
              architecture live, not just describe one from a slide. Enough Docker/Kubernetes literacy to stand
              up a containerized PoC without help.
            </p>
            <p>
              <strong>AI/LLM specifics:</strong> RAG design and vector-database trade-offs, prompt engineering,
              agent and tool-use patterns, and — increasingly — the ability to size and defend a token- or
              inference-cost estimate live, since “what will this cost to run at scale” is now a standard
              objection rather than an edge case.
            </p>
            <p>
              <strong>Business acumen:</strong> TCO/ROI modeling, procurement and RFP-process fluency, and
              enough sales methodology (MEDDIC/MEDDPICC-style qualification) to tell a real deal from a
              distraction.
            </p>
            <p>
              <strong>Demoing and live presentation:</strong> building and running a PoC in front of an
              audience, recovering gracefully when a live demo breaks — it will — and presenting architecture on
              a whiteboard under questioning.
            </p>
            <p>
              <strong>Writing:</strong> proposal and RFP responses, reference architectures, and content — blog
              posts, tutorials — that doubles as a credibility signal with prospects before you’re even in the
              room.
            </p>
            <div className={styles.insightBox}>
              <p>
                <strong>The category that actually separates candidates isn’t the AI layer at all.</strong>{' '}
                Plenty of technically strong engineers fail this role. What matters is the discovery and
                qualification instinct — knowing which stated requirement is the real blocker and which is
                noise, and being comfortable steering a demo somewhere the customer didn’t explicitly ask for
                because it answers a concern they haven’t voiced yet.
              </p>
            </div>
            <p className={styles.aside}>
              Weighting differs by vendor: cloud-platform presales (AWS, Azure, GCP) leans harder on
              infrastructure and cost modeling; SaaS-platform presales (Salesforce, ServiceNow) leans harder on
              platform-specific configuration and business-process mapping; AI-native vendor presales leans
              hardest on RAG and agent-design fluency.
            </p>
            <p>
              That’s a lot to learn cold. Here’s specifically which parts of it this curriculum already covers
              — and which parts it deliberately doesn’t.
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
              With the technical bar covered — or at least mapped — the remaining unknown is the interview
              itself, which looks unlike almost any other engineering loop.
            </p>
          </Section>

          <Section title="The interview">
            <p>
              This isn’t a standard SWE loop, and it isn’t a standard sales loop either. Live design ability,
              discovery instinct, and stakeholder handling are all weighted roughly evenly — most of the loop
              is you talking, reasoning out loud, and reacting to pushback in real time, not writing code
              silently in an editor.
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
              Atlassian’s published loop for this kind of role is a good concrete example: five rounds moving
              from motivation and technical depth, through diagnosing a customer’s technical context and
              scoping a fit, to presenting a reference architecture live and defending it, and finally a mock
              customer call with an Account Executive — anchoring value and navigating objections.
            </p>
            <p>
              Once you’ve cleared that, the practical question gets a lot more mundane: what do you actually
              search for, and where?
            </p>
          </Section>

          <Section title="Actually landing one">
            <p>
              Search for these titles — some are genuine variants, others are the same job rebranded to sound
              more or less technical depending on the audience. Read the responsibilities section, not the
              title; use the comparison table earlier as your gut check.
            </p>
            <div className={styles.chipRow}>
              {JOB_TITLES.map((title) => (
                <Chip key={title}>{title}</Chip>
              ))}
            </div>
            <p>Once you know what to search for, here’s where those postings actually live:</p>
            <CalloutList items={JOB_SOURCES} />
            <p>
              No single certification is required, but a handful reliably show up as nice-to-haves:{' '}
              <strong>AWS Certified Solutions Architect</strong> (Associate or Professional) and{' '}
              <strong>AWS Certified AI Practitioner</strong> as a cloud-and-AI fluency baseline; Microsoft’s{' '}
              <strong>Azure AI Engineer Associate</strong> track for a multi-cloud profile, since a lot of
              enterprise customers run Azure or a hybrid of AWS and Azure (Microsoft retired the original AI-102
              exam in mid-2026 in favor of an updated agentic-AI-focused version — check Microsoft Learn for the
              current exam code before you register); and, for Salesforce-ecosystem roles specifically,{' '}
              <strong>Salesforce Agentforce Specialist</strong>.
            </p>
            <p className={styles.aside}>
              Every source is emphatic that certs are a distant second to a demoable portfolio and real
              discovery-call practice — don’t lead with certs.
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
              Bottom line: base clusters $95K–$190K broadly, with commission or OTE on top at most employers.
              The $300K+ total-comp figures belong to senior/staff roles at a handful of high-margin platform
              vendors — the outlier headline number, not the median reality.
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
