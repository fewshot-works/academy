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
      'A hypothetical customer hands you a vague problem and you decompose it live, 45–60 minutes — lowest pass rate, highest weight in the loop.',
    to: '/interview-prep/case-studies/forward-deployed-engineer',
  },
  {
    title: 'Applied / Agentic AI Engineer',
    description:
      'Usually called the system design round: "build an agent that does X," decomposed live under stakeholder pushback.',
    to: '/interview-prep/case-studies/applied-agentic-ai-engineer',
  },
  {
    title: 'AI Solutions Architect / Presales Engineer',
    description:
      'Often the most heavily weighted round in the loop: three full discovery-to-design walkthroughs across three industries.',
    to: '/interview-prep/case-studies/ai-solutions-architect-presales',
  },
  {
    title: 'SRE / Reliability Engineer for AI Agent Applications',
    description:
      'Google calls it NALSD; most other companies call it incident response — triage and design live against a failing system.',
    to: '/interview-prep/case-studies/sre-reliability-engineer',
  },
  {
    title: 'AI Product Manager',
    description:
      'The AI product sense round: an ambiguous prompt, scoped around a model’s unreliability instead of assumed perfection.',
    to: '/interview-prep/case-studies/ai-product-manager',
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

export default function CaseStudiesIndex(): ReactNode {
  return (
    <Layout
      title="Case Studies"
      description="The case-study / scenario round for every AI-era Career Track — usually the highest-weighted round in the loop.">
      <Head>
        <meta
          name="keywords"
          content="AI case study interview, AI system design interview, AI product sense interview, incident response interview prep"
        />
      </Head>
      <main className={styles.page}>
        <div className="container">
          <Link to="/interview-prep" className={styles.back}>
            &larr; Interview Prep
          </Link>
          <header className={styles.header}>
            <Heading as="h1">Case Studies</Heading>
            <p className={styles.intro}>
              Nearly every source agrees this is the round that decides most offers. It goes by a different name
              per role — case study, system design, incident response, product sense — but the shape is the same:
              a vague problem, live decomposition, an interviewer pushing back. Pick your role below.
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
