import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import {findTrackById} from '@site/src/data/curriculum';
import type {TrackId} from '@site/src/data/curriculum';
import {trackEngagementEvent} from '@site/src/utils/analytics';
import styles from './styles.module.css';

type TrackItem = {
  trackId: TrackId;
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
    trackId: 'foundations',
    status: 'Live now',
    title: 'Foundations',
    description:
      'Zero prior knowledge assumed. Tokens, LLMs, prompting, embeddings, vector databases, RAG, and your first agent.',
    to: '/docs/foundations/setup',
  },
  {
    trackId: 'intermediate',
    status: 'Live now',
    title: 'Intermediate',
    description:
      'Chunking, retrieval quality, tool use, memory, and your first real agent, ending in a multi-tool capstone.',
    to: '/docs/intermediate/overview',
  },
  {
    trackId: 'advanced',
    status: 'Live now',
    title: 'Advanced',
    description:
      'Multi-agent patterns, guardrails, observability, and shipping a traced, evaluated agentic RAG system.',
    to: '/docs/advanced/overview',
  },
];

function Track({trackId, status, title, description, to}: TrackItem) {
  function trackCourseStart() {
    const firstLesson = findTrackById(trackId).lessons[0];
    if (firstLesson?.permalink !== to) {
      return;
    }
    trackEngagementEvent('course_start', {
      track_id: trackId,
      source_surface: 'homepage',
    });
  }

  return (
    <Link to={to} className={styles.card} onClick={trackCourseStart}>
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
          One curriculum. Every role runs through it.
        </Heading>
        <p className={styles.sectionSub}>
          From "what's a token?" to a working, evaluated agent.
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
