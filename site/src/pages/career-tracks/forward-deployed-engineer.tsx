import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Heading from '@theme/Heading';

import styles from './forward-deployed-engineer.module.css';

const TITLE = 'Forward-Deployed Engineer (FDE)';

const META_DESCRIPTION =
  'Embedded with a customer, shipping production AI inside their org. The deepest track: full curriculum plus judgment skills the labs alone don’t teach.';

const HOOK =
  'The title started at Palantir: a regular engineer owns one capability across many customers, ' +
  'a Forward-Deployed Engineer flips that around and owns one customer across everything it takes ' +
  'to ship. In the last year the model went mainstream well beyond Palantir — OpenAI spun off an ' +
  'entire company just to do this (“The Deployment Company,” $4B+ raised), AWS built a $1B org ' +
  'around it, and Anthropic, Databricks, and Scale AI are all hiring for the role directly. This ' +
  'guide walks through what the job actually looks like day to day, who really gets hired, what to ' +
  'learn first, and how the interview goes — grounded in real postings, comp data, and firsthand ' +
  'accounts, not guesswork.';

type QuickFact = {label: string; value: string};

const QUICK_FACTS: QuickFact[] = [
  {label: 'Typical base salary', value: '$150K–$220K'},
  {label: 'Experience floor', value: 'Usually 3–7+ yrs (exceptions below)'},
  {label: 'Travel', value: '25–50%, varies by employer'},
  {label: 'Interview weight', value: '~50% case study & judgment, not coding'},
];

type CompareRow = {role: string; scope: string; codeOwnership: string};

const COMPARE_ROWS: CompareRow[] = [
  {
    role: 'Sales Engineer',
    scope: 'Pre-sale, ends at contract signature',
    codeOwnership: 'Sales-first, no production code owned',
  },
  {
    role: 'Solutions Engineer / Architect',
    scope: 'Pre-sale through early implementation, designs the blueprint',
    codeOwnership: 'Codes mostly for proof-of-concepts',
  },
  {
    role: 'Forward-Deployed Engineer',
    scope: 'Post-sale through full production deployment',
    codeOwnership: 'Engineering-first — ships and owns production code',
  },
];

type DaySlice = {label: string; pct: number; note: string; kind: 'customer' | 'code' | 'internal'};

const DAY_SLICES: DaySlice[] = [
  {
    label: 'Customer-facing',
    pct: 60,
    kind: 'customer',
    note: 'Requirements analysis with end users, live discovery, iterating in place as edge cases surface.',
  },
  {
    label: 'Deployment-specific coding',
    pct: 30,
    kind: 'code',
    note: 'Integrating with the client’s existing systems, configuring data pipelines, shipping into a live environment.',
  },
  {
    label: 'Internal',
    pct: 10,
    kind: 'internal',
    note: 'Feeding field learnings back to the core product team.',
  },
];

type ExperienceRow = {company: string; floor: string};

const EXPERIENCE_ROWS: ExperienceRow[] = [
  {company: 'Salesforce', floor: '3+ yrs (6–10 for Senior)'},
  {company: 'OpenAI', floor: '5+ yrs (8+ for Manager)'},
  {company: 'Anthropic', floor: '4+ yrs'},
  {company: 'Scale AI', floor: '3+ yrs post-grad'},
  {company: 'Databricks', floor: '6+ yrs (15+ yrs big-data exp. at Staff level)'},
];

type Callout = {title: string; body: string};

const ENTRY_PATHS: Callout[] = [
  {
    title: 'New Grad tracks',
    body: 'Scale AI and Palantir both run a dedicated New Grad FDE track — a real, named exception to the years-of-experience floor.',
  },
  {
    title: 'Founder background',
    body: 'Anthropic explicitly welcomes former technical founders as a substitute for the years-of-experience bar.',
  },
  {
    title: 'Federal / public sector',
    body: 'Palantir, OpenAI, Anthropic, Databricks, and Scale AI all run a government-track variant, gated on US citizenship plus an active or obtainable Secret / TS-SCI clearance instead of a years-of-experience floor. Scale AI’s public-sector base alone runs $138K–$219K.',
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
    description: 'The RAG engineering, tool-use, and eval depth a custom enterprise deployment actually needs.',
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
    description: 'The closest thing in this curriculum to an actual FDE-shaped deliverable.',
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
  'Cloud infra hands-on depth — Docker, Kubernetes, Terraform, VPC/IAM at production scale (this curriculum runs locally via Ollama, not against real cloud infra)',
  'Enterprise data engineering at scale — Spark, Airflow/dbt, Snowflake, BigQuery',
  'Enterprise integration protocols — OAuth/SAML/SCIM, legacy ETL, on-prem systems',
  'General production software-engineering fundamentals most postings assume as a floor (this curriculum assumes zero prior CS background by design — it’s the AI-specific layer, not a CS-degree substitute)',
  'The judgment half of the job — case-study decomposition, live discovery, stakeholder management. That’s a different kind of practice than a chapter can teach.',
];

type InterviewStep = {title: string; body: string; badge?: string; to?: string; toLabel?: string};

const INTERVIEW_STEPS: InterviewStep[] = [
  {title: 'Recruiter screen', body: 'Standard fit and background conversation.'},
  {
    title: 'Coding / technical round',
    body: 'Integration design, debugging, production-quality code — explicitly not LeetCode-style.',
    to: '/career-tracks/forward-deployed-engineer/technical-round',
    toLabel: 'What to expect, how to prepare, and two things to have ready',
  },
  {
    title: 'Case-study round',
    body: 'A hypothetical customer hands you a vague problem and you decompose it live, 45–60 minutes.',
    badge: 'Lowest pass rate (~40%), highest weight (~30%)',
    to: '/career-tracks/forward-deployed-engineer/case-studies',
    toLabel: 'The framework, plus 3 full end-to-end walkthroughs',
  },
  {
    title: 'Behavioral round',
    body: 'Client ownership, accountability under repeat failure, communicating technically to non-technical stakeholders, navigating internal client politics.',
    to: '/career-tracks/forward-deployed-engineer/behavioral-round',
    toLabel: 'Sample questions and how to structure your answers',
  },
  {
    title: 'System design (some companies)',
    body: 'At AI-native companies, sometimes a fifth round on agentic/ML system design.',
  },
];

const JOB_TITLES: string[] = [
  'Forward Deployed Engineer',
  'Forward-Deployed Software Engineer',
  'Customer Engineer',
  'Solutions Architect (AWS)',
  'Deployment Strategist',
  'Field Engineer',
  'Agent Engineer',
  'Implementation Engineer',
  'Technical Delivery Engineer',
];

const JOB_SOURCES: Callout[] = [
  {
    title: 'Direct career pages',
    body: 'Palantir, OpenAI, Anthropic, Google Cloud, Databricks, Scale AI, Salesforce, C3 AI.',
  },
  {
    title: 'Dedicated FDE orgs',
    body: 'OpenAI’s "The Deployment Company" (majority-owned joint venture, $4B+ raised, announced May 2026), AWS’s $1B FDE org (announced June 2026), Microsoft’s "Frontier Company" (roughly 6,000 embedded experts).',
  },
  {
    title: 'Beyond the famous names',
    body: 'Vertical AI startups are hiring for this title too — examples found in research: Sarvam AI, Talan, Machinify, 3Pillar, Next League.',
  },
  {
    title: 'Job boards',
    body: 'startup.jobs (filtered to Forward Deployed Engineer), Built In, and title search on Glassdoor/Indeed.',
  },
  {
    title: 'Recruiting agencies',
    body: 'A cluster has formed specifically around this title — Perspective AI, KORE1, Paraform, Recruiting From Scratch. Useful as a signal of how hot the market is, not necessarily a recommendation to use them.',
  },
];

type CompRow = {source: string; range: string};

const COMP_ROWS: CompRow[] = [
  {source: 'General market average (ZipRecruiter / Glassdoor)', range: '~$116K–$198K base'},
  {source: 'Posting-level analysis (Recruiting From Scratch, n=924)', range: 'Median $183K, 25th–75th pct $160K–$215K'},
  {
    source: 'Frontier-lab total comp (Palantir, OpenAI, Anthropic)',
    range: '$215K median at Palantir up to $600K–$1.2M+ for Staff/Principal, equity 55–70% of comp at the top',
  },
  {source: 'Salesforce (published range, JR349466)', range: '$88,970–$287,910 base ($97,860–$316,750 in top metros)'},
  {source: 'Palantir FDSE (estimate)', range: '~$135K–$200K base + RSUs / sign-on'},
  {source: 'Scale AI, public sector (Honolulu posting)', range: '$138K–$219K'},
];

type SourceLink = {label: string; href: string};

const SOURCES: SourceLink[] = [
  {label: 'Forward Deployed Engineer — Wikipedia', href: 'https://en.wikipedia.org/wiki/Forward_Deployed_Engineer'},
  {
    label: 'A day in the life of a Palantir Forward Deployed Software Engineer',
    href: 'https://blog.palantir.com/a-day-in-the-life-of-a-palantir-forward-deployed-software-engineer-45ef2de257b1',
  },
  {
    label: 'The Pragmatic Engineer: Forward Deployed Engineers',
    href: 'https://newsletter.pragmaticengineer.com/p/forward-deployed-engineers',
  },
  {label: 'a16z: Forward-deployed job titles', href: 'https://a16z.com/forward-deployed-job-titles/'},
  {
    label: 'Exponent: Forward Deployed Engineer interview guide',
    href: 'https://www.tryexponent.com/blog/forward-deployed-engineer-interview-the-definitive-2026-guide-fde',
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

export default function ForwardDeployedEngineer(): ReactNode {
  return (
    <Layout title={TITLE} description={META_DESCRIPTION}>
      <Head>
        <meta
          name="keywords"
          content="forward-deployed engineer, how to become a forward-deployed engineer, FDE career path, forward deployed engineer job, FDE interview prep, what does a forward-deployed engineer do"
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
              Beyond the elevator pitch, the boundary is what matters: it’s not sales, and there’s no quota. An
              FDE embeds inside a client’s organization — often on-site — and writes and owns production code,
              not demos or scripts, accountable for it running in the client’s actual environment. The shorthand
              that keeps showing up across sources: “the SE closes the deal, the FDE delivers on it.”
            </p>
            <p>
              That distinction sounds clean in a job description. It gets muddier once you look at who else uses
              the phrase “forward-deployed” to describe what is, in practice, a very different job.
            </p>
            <p className={styles.aside}>
              Background:{' '}
              <a href="https://en.wikipedia.org/wiki/Forward_Deployed_Engineer" target="_blank" rel="noopener noreferrer">
                Forward Deployed Engineer on Wikipedia
              </a>
              .
            </p>
          </Section>

          <Section eyebrow="FDE vs. the adjacent titles" title="Is this really the role you want?">
            <p>
              “Forward-deployed” gets used loosely — plenty of Solutions Engineer and Sales Engineer postings
              borrow the label because it sounds more technical. Here’s the actual gut-check, by scope and code
              ownership:
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Scope</th>
                    <th>Code ownership</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row) => (
                    <tr key={row.role} className={row.role === TITLE ? styles.highlightRow : undefined}>
                      <td>{row.role}</td>
                      <td>{row.scope}</td>
                      <td>{row.codeOwnership}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={styles.aside}>
              Compensation tends to run above SE/SA for the same company, because of the code-ownership
              difference.
            </p>
            <p>
              Assuming FDE still checks out as the role you actually want, the next question is blunter: what
              does the job look like once you’re in it?
            </p>
          </Section>

          <Section title="A day in the life">
            <p>
              Per postings analysis, the split runs roughly 60% customer-facing time, 30% deployment-specific
              coding, 10% internal. The pitch companies make to candidates: getting a demo working in a sandbox
              is about 20% of the job — the other 80% is enterprise SSO, legacy ETL, regulatory constraints, and
              getting production credentials out of a client security team, something people in the field call
              “the integration wall.”
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
                <strong>That 10% “internal” slice undersells what happens after launch.</strong> The job doesn’t
                end when the deployment goes live. An FDE keeps watching what they built — catching model drift or
                a broken integration before the customer notices — and packages what they learned into something
                reusable: a checklist, a template, an internal tool the next engagement starts from instead of
                rebuilding. Just as often, a client asking for something the system can’t do yet is a signal worth
                routing back to the core product team, not just a scope conversation to manage. Several current
                postings name this directly — Zendesk calls it “bridging the gap” between the field and the
                product roadmap, Notion asks for “reusable technical assets” and a working “feedback loop” into
                planning, and Deloitte’s posting expects deliverables like CI/CD, logging, and documentation left
                behind for whoever operates the system next, not just working code on day one.
              </p>
            </div>
            <p>
              Most of the job, in other words, happens before you write a line of code that ships — and doesn’t
              stop the moment it does. That’s the real reason FDE hiring bars look nothing like a typical SWE
              loop — starting with who even gets in the door.
            </p>
          </Section>

          <Section title="Who actually gets hired">
            <p>
              This is <strong>not</strong>, in practice, an entry-level title — despite plenty of blog advice
              framing it as “no fixed path.” Real experience floors, pulled directly from current postings:
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
            <p>Three named exceptions to that floor:</p>
            <CalloutList items={ENTRY_PATHS} />
            <p>
              The single best-predictor background across sources: an early-stage startup engineer (roughly the
              first ten hires) who has already done this job informally — talked to customers, wore every hat,
              shipped to keep the company alive. Other common entry paths: SWE, DevOps/cloud engineering, data
              engineering, ML, or a lateral move from consulting (Slalom, BCG X, IBM Consulting AI practice) or
              cloud professional services (AWS ProServe, Azure customer engineering) — both pools already carry
              deployment and customer scar tissue.
            </p>
            <p>
              If any of that describes you, the next question is what to actually go learn — the technical bar,
              unlike the hiring bar, is fairly explicit in the postings.
            </p>
          </Section>

          <Section title="Skills you’ll actually need">
            <p>
              Six categories show up again and again, roughly in this order of how often postings check for
              them.
            </p>
            <p>
              <strong>Languages:</strong> Python, in 66% of postings, plus one enterprise language — TypeScript,
              Go, or Java. Salesforce postings specifically also want Apex.
            </p>
            <p>
              <strong>Data:</strong> SQL beyond the basics — window functions, CTEs, query optimization — plus
              Spark, Airflow or dbt, and a warehouse (Snowflake, BigQuery, Databricks). Databricks postings
              weight this hardest of anyone: Scala alongside Python, and 15+ years of general big-data
              experience at the Staff level.
            </p>
            <p>
              <strong>Cloud and infra:</strong> AWS, GCP, or Azure — AWS is named specifically in 32%+ of
              postings — plus Docker, Kubernetes, Terraform, and enough VPC/IAM/secrets-management fluency to
              get through a client’s security review.
            </p>
            <p>
              <strong>Integration:</strong> REST, GraphQL, and streaming APIs, OAuth/SAML/SCIM, rate limiting
              and retries, and the unglamorous work of wiring into whatever CRM or ERP the client already runs.
            </p>
            <p>
              <strong>AI/ML — table stakes, not a differentiator:</strong> LLM app development, RAG and
              retrieval, prompt engineering, eval frameworks, and agent orchestration (LangGraph, LangChain,
              CrewAI, DSPy). Weak eval skills is a cited leading cause of final-round failure; Anthropic’s own
              posting asks directly for “production experience with LLMs including advanced prompt engineering,
              agent development, evaluation frameworks, and deployment at scale.”
            </p>
            <p>
              <strong>Testing and operating what you ship:</strong> most candidates think of this job as ending at
              deployment, but the postings don’t. CI/CD for agent and RAG pipelines, structured logging and
              tracing, versioning prompts and retrieval indexes so a bad change is reversible, and a monitoring
              habit for catching drift after launch, are named explicitly and separately from “writes clean code”
              in several current postings — this is the piece easiest to under-prepare for, since it rarely comes
              up until the case-study round starts asking “and how would you know if this broke, three months
              in?”
            </p>
            <div className={styles.insightBox}>
              <p>
                <strong>The category that actually separates candidates isn’t technical at all:</strong>{' '}
                translating a vague stakeholder ask into a working spec, discovery and scoping discipline,
                expectation management under pressure, and navigating client-side politics — IT vs. security vs.
                the business sponsor who signed the contract.
              </p>
            </div>
            <p className={styles.aside}>
              Weighting differs by company: Palantir leans on data engineering and ontology modeling, Databricks
              on data-platform plus full-stack delivery, OpenAI and Anthropic on evals, RAG, agent loops, and
              prompt versioning.
            </p>
            <p>
              That’s a lot to learn cold. Here’s specifically which parts of it this curriculum already covers —
              and which parts it deliberately doesn’t.
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
              This isn’t a standard SWE loop. Technical depth, customer-facing judgment, and reasoning through
              ambiguity are weighted roughly evenly — at places like Palantir, OpenAI, and ElevenLabs, about
              half the loop is case studies and stakeholder role-play, not coding.
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
              Timelines vary: OpenAI runs roughly 3–5 weeks, Google roughly 6–8 weeks, most candidates report
              3–6 weeks overall. The most-cited failure mode is over-indexing prep time on LeetCode instead of
              case-study and communication prep.
            </p>
            <p>
              Once you’ve cleared that, the practical question gets a lot more mundane: what do you actually
              search for, and where?
            </p>
          </Section>

          <Section title="Actually landing one">
            <p>
              Search for these titles — some are genuine variants, others are plain solutions/sales-engineering
              roles rebranded to ride the FDE hype. Read the responsibilities section, not the title; use the
              comparison table earlier as your gut check.
            </p>
            <div className={styles.chipRow}>
              {JOB_TITLES.map((title) => (
                <Chip key={title}>{title}</Chip>
              ))}
            </div>
            <p>Once you know what to search for, here’s where those postings actually live:</p>
            <CalloutList items={JOB_SOURCES} />
            <p>
              No standardized cross-company “FDE certification” exists — the role is too company-specific for a
              testable exam body. What actually helps: <strong>AWS Certified Solutions Architect</strong> (or
              AWS AI Practitioner) as a cloud-fluency baseline, paired with{' '}
              <strong>Azure AI Engineer Associate (AI-102)</strong> or AZ-104/AZ-305 for a multi-cloud profile,
              since a lot of enterprise customers run Azure or a hybrid of AWS and Azure. Platform-specific
              certs matter more than that framing suggests when the platform itself is the product — Salesforce
              postings name Administrator, Platform Developer I, and <strong>Agentforce Specialist</strong> as
              nice-to-haves; Databricks has its own equivalent platform certifications.
            </p>
            <p className={styles.aside}>
              Every source is emphatic that certs are a distant second to shipped projects and real customer
              exposure — don’t lead with certs.
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
              Bottom line: base clusters $150K–$220K broadly. Frontier-lab total comp with equity is the outlier
              headline number, not the median reality.
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
