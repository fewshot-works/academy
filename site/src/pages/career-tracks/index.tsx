import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './styles.module.css';

type TrackItem = {
  status: string;
  title: string;
  description: string;
  to: string;
};

const TrackList: TrackItem[] = [
  {
    status: 'Live now',
    title: 'Forward-Deployed Engineer (FDE)',
    description:
      'Embedded with a customer, shipping production AI inside their org. The deepest track: full curriculum plus judgment skills the labs alone don’t teach.',
    to: '/career-tracks/forward-deployed-engineer',
  },
  {
    status: 'Guide coming soon',
    title: 'Applied / Agentic AI Engineer',
    description:
      'The core hands-on builder role: RAG systems, tool-using agents, and multi-agent orchestration.',
    to: '/career-tracks/applied-agentic-ai-engineer',
  },
  {
    status: 'Guide coming soon',
    title: 'AI Product Manager',
    description:
      'Decides what gets built, not how it’s built. A non-coding, decision-making track — approachable even with zero prior technical background.',
    to: '/career-tracks/ai-product-manager',
  },
  {
    status: 'Guide coming soon',
    title: 'SRE / Reliability Engineer for AI Agent Applications',
    description:
      'Keeps AI agents running reliably in production: observability, guardrails, and cost/latency budgets.',
    to: '/career-tracks/sre-reliability-engineer',
  },
  {
    status: 'Guide coming soon',
    title: 'AI Solutions Architect / Presales Engineer',
    description:
      'Pre-sales and consulting: demoing, proposal-writing, and requirement analysis for enterprise AI adoption.',
    to: '/career-tracks/ai-solutions-architect-presales',
  },
];

function Track({status, title, description, to}: TrackItem) {
  return (
    <Link to={to} className={styles.card}>
      <span className={styles.status}>{status}</span>
      <Heading as="h3" className={styles.cardTitle}>
        {title}
      </Heading>
      <p className={styles.cardDescription}>{description}</p>
    </Link>
  );
}

export default function CareerTracks(): ReactNode {
  return (
    <Layout
      title="Career Tracks"
      description="New AI-era job roles, explained end to end: what they are, what to learn first, how to prepare for the interview, and how much of this curriculum you need.">
      <main className={styles.page}>
        <div className="container">
          <header className={styles.header}>
            <Heading as="h1">Career Tracks</Heading>
            <p className={styles.intro}>
              Two years ago, a job title like &ldquo;Prompt Engineer&rdquo;
              didn&apos;t exist. Today, companies are inventing new roles just
              to describe what AI lets one person do &mdash; deploy a working
              agent for a customer in an afternoon, keep a fleet of AI agents
              reliable in production, or sell an enterprise on an AI rollout
              that used to take a whole team to explain.
            </p>
            <p className={styles.intro}>
              Most of these roles are variations on jobs that already exist
              &mdash; software engineer, product manager, reliability
              engineer, sales engineer &mdash; reshaped by what AI now makes
              possible. The core skills transfer; what&apos;s new is the
              AI-specific layer on top.
            </p>
            <p className={styles.intro}>
              Pick a role below to see what it actually involves: what
              you&apos;d do day to day, what to learn first, how to prepare
              for the interview, and how much of this curriculum you need
              before you&apos;re ready to apply.
            </p>
          </header>
          <div className={styles.grid}>
            {TrackList.map((props) => (
              <Track key={props.title} {...props} />
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
