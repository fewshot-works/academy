import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type TrackItem = {
  status: string;
  title: string;
  description: ReactNode;
  to: string;
};

// Same three destinations the docs sidebar already leads to. This section
// exists so a first-time visitor sees the shape of the whole course before
// they've clicked into any of it. Status reflects what's actually written
// today: all three tracks are complete.
const TrackList: TrackItem[] = [
  {
    status: 'Live now',
    title: 'Foundations',
    description:
      'Zero prior knowledge assumed. Tokens, LLMs, prompting, embeddings, vector databases, RAG, and your first agent.',
    to: '/docs/foundations/setup',
  },
  {
    status: 'Live now',
    title: 'Intermediate',
    description:
      'Chunking, retrieval quality, tool use, memory, and your first real agent, ending in a multi-tool capstone.',
    to: '/docs/intermediate/overview',
  },
  {
    status: 'Live now',
    title: 'Advanced',
    description:
      'Multi-agent patterns, guardrails, observability, and shipping a traced, evaluated agentic RAG system.',
    to: '/docs/advanced/overview',
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

export default function HomepageTracks(): ReactNode {
  return (
    <section className={styles.tracks}>
      <div className="container">
        <Heading as="h2" className={styles.sectionHead}>
          Three tracks, each building on the last
        </Heading>
        <p className={styles.sectionSub}>
          Start with "what is a token?" and end with a working, evaluated
          agentic RAG system.
        </p>
        <div className={styles.grid}>
          {TrackList.map((props) => (
            <Track key={props.title} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
