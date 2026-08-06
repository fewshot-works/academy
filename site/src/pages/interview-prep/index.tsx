import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Heading from '@theme/Heading';

import styles from './styles.module.css';

type RoundItem = {
  title: string;
  description: string;
  to: string;
};

const RoundList: RoundItem[] = [
  {
    title: 'Technical Round',
    description:
      'Coding, live design, or a data/metrics deep-dive depending on the role — but never a generic algorithm puzzle. What to expect and how to prepare, for each of the five Career Tracks.',
    to: '/interview-prep/technical-round',
  },
  {
    title: 'Case Studies',
    description:
      'The highest-weighted round almost everywhere: a vague problem, 45–60 minutes, and an interviewer playing customer, stakeholder, or incident commander while you think out loud.',
    to: '/interview-prep/case-studies',
  },
  {
    title: 'Behavioral Round',
    description:
      'Ownership, judgment under pressure, and communicating across technical and non-technical audiences — sample questions and how to structure an answer, per role.',
    to: '/interview-prep/behavioral-round',
  },
];

function Round({title, description, to}: RoundItem) {
  return (
    <Link to={to} className={styles.card}>
      <Heading as="h3" className={styles.cardTitle}>
        {title}
      </Heading>
      <p className={styles.cardDescription}>{description}</p>
    </Link>
  );
}

export default function InterviewPrep(): ReactNode {
  return (
    <Layout
      title="Interview Prep"
      description="Interview prep for AI-era job roles, organized by round: technical, case studies, and behavioral — pick a round to see how every Career Track approaches it.">
      <Head>
        <meta
          name="keywords"
          content="AI job interview prep, AI engineer interview questions, AI product manager interview, AI solutions architect interview, AI SRE interview prep"
        />
      </Head>
      <main className={styles.page}>
        <div className="container">
          <header className={styles.header}>
            <Heading as="h1">Interview Prep</Heading>
            <p className={styles.intro}>
              Every one of the five AI-era Career Tracks on this site runs candidates through the same three
              rounds, just with different content: a technical round, a case-study round, and a behavioral round.
            </p>
            <p className={styles.intro}>
              Already know which role you&apos;re targeting? The{' '}
              <Link to="/career-tracks">Career Tracks</Link> overview covers the full picture — what the job is,
              what to learn first, and how much of this curriculum you need. This section is for when you just
              want to jump straight into interview prep, for one round at a time, across every role at once.
            </p>
          </header>
          <div className={styles.grid}>
            {RoundList.map((props) => (
              <Round key={props.title} {...props} />
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
