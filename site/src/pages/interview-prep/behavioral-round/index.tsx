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
    description:
      'Client ownership, accountability under repeat failure, and communicating technically to non-technical stakeholders.',
    to: '/interview-prep/behavioral-round/forward-deployed-engineer',
  },
  {
    title: 'Applied / Agentic AI Engineer',
    description:
      'Shipping under ambiguity, owning a production regression honestly, and working across technical vocabularies.',
    to: '/interview-prep/behavioral-round/applied-agentic-ai-engineer',
  },
  {
    title: 'AI Solutions Architect / Presales Engineer',
    description:
      'Objection handling, value anchoring, and navigating a deal team with competing incentives — sometimes a live mock customer call.',
    to: '/interview-prep/behavioral-round/ai-solutions-architect-presales',
  },
  {
    title: 'SRE / Reliability Engineer for AI Agent Applications',
    description:
      'Blameless ownership of an outage, judgment calls at 3 a.m., and defending a reliability-vs-velocity trade-off out loud.',
    to: '/interview-prep/behavioral-round/sre-reliability-engineer',
  },
  {
    title: 'AI Product Manager',
    description:
      'Launching honestly with known model limitations, and knowing when a boring non-AI solution beats an AI one.',
    to: '/interview-prep/behavioral-round/ai-product-manager',
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

export default function BehavioralRoundIndex(): ReactNode {
  return (
    <Layout
      title="Behavioral Round"
      description="The behavioral round for every AI-era Career Track — sample questions and how to structure your answers.">
      <Head>
        <meta
          name="keywords"
          content="AI job behavioral interview questions, AI engineer behavioral interview, how to prepare for behavioral interview AI role"
        />
      </Head>
      <main className={styles.page}>
        <div className="container">
          <Link to="/interview-prep" className={styles.back}>
            &larr; Interview Prep
          </Link>
          <header className={styles.header}>
            <Heading as="h1">Behavioral Round</Heading>
            <p className={styles.intro}>
              The lightest-touch round on paper, and the one candidates most often under-prepare for. Pick your
              role below for sample questions and how to structure your answers.
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
