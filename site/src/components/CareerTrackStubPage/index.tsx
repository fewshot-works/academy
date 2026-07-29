import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './styles.module.css';

type Props = {
  title: string;
  oneLiner: string;
};

export default function CareerTrackStubPage({title, oneLiner}: Props): ReactNode {
  return (
    <Layout title={title} description={oneLiner}>
      <main className={styles.page}>
        <div className="container">
          <Link to="/career-tracks" className={styles.back}>
            &larr; Career Tracks
          </Link>
          <Heading as="h1">{title}</Heading>
          <p className={styles.oneLiner}>{oneLiner}</p>
          <p className={styles.notice}>
            Full guide coming soon: what this role involves day to day,
            prerequisites, how to prepare for the interview, how much of
            this curriculum you need, job title variations to search for,
            where to find these jobs, and relevant certifications.
          </p>
        </div>
      </main>
    </Layout>
  );
}
