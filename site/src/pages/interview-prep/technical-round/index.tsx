import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Heading from '@theme/Heading';

import styles from '../styles.module.css';

type RoleItem = {
  title: string;
  description: string;
  to: string;
};

const RoleList: RoleItem[] = [
  {
    title: 'Forward-Deployed Engineer (FDE)',
    description: 'Integration design, debugging, and production-quality code — explicitly not LeetCode-style.',
    to: '/interview-prep/technical-round/forward-deployed-engineer',
  },
  {
    title: 'Applied / Agentic AI Engineer',
    description:
      'Debugging a half-working agent, wiring up a small retrieval or tool-use slice, and reasoning about cost and latency trade-offs out loud.',
    to: '/interview-prep/technical-round/applied-agentic-ai-engineer',
  },
  {
    title: 'AI Solutions Architect / Presales Engineer',
    description: 'A whiteboard design round — architecture, trade-offs, and cost, with no code involved.',
    to: '/interview-prep/technical-round/ai-solutions-architect-presales',
  },
  {
    title: 'SRE / Reliability Engineer for AI Agent Applications',
    description:
      'Format depends on who is hiring: classic data-structures screens at some companies, debugging an observability pipeline or defending an SLO design at others.',
    to: '/interview-prep/technical-round/sre-reliability-engineer',
  },
  {
    title: 'AI Product Manager',
    description:
      'Not a coding round — a metrics, eval, and build-vs-buy reasoning round that tests real technical fluency.',
    to: '/interview-prep/technical-round/ai-product-manager',
  },
];

function Role({title, description, to}: RoleItem) {
  return (
    <Link to={to} className={styles.card}>
      <Heading as="h3" className={styles.cardTitle}>
        {title}
      </Heading>
      <p className={styles.cardDescription}>{description}</p>
    </Link>
  );
}

export default function TechnicalRoundIndex(): ReactNode {
  return (
    <Layout
      title="Technical Round"
      description="What the technical round looks like for every AI-era Career Track, and how to prepare for each.">
      <Head>
        <meta
          name="keywords"
          content="AI technical interview questions, AI engineer coding interview, how to prepare for AI technical round"
        />
      </Head>
      <main className={styles.page}>
        <div className="container">
          <Link to="/interview-prep" className={styles.back}>
            &larr; Interview Prep
          </Link>
          <header className={styles.header}>
            <Heading as="h1">Technical Round</Heading>
            <p className={styles.intro}>
              Every role runs some version of a technical round, but what it actually tests varies a lot — pick
              your role below.
            </p>
          </header>
          <div className={styles.grid}>
            {RoleList.map((props) => (
              <Role key={props.title} {...props} />
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
