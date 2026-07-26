import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Zero to Agent, One Coherent Arc',
    description: (
      <>
        Start with "what is a token?" and end with a working, evaluated
        agentic RAG system — three tracks, each building on the last.
      </>
    ),
  },
  {
    title: 'Free and Local-First',
    description: (
      <>
        Every Foundations/Intermediate lab runs with a free local Ollama model and a local
        ChromaDB — no credit card, no cloud account, no server required.
      </>
    ),
  },
  {
    title: 'Hands-On at Every Step',
    description: (
      <>
        Every lesson links to runnable Python code you execute on your own
        machine — not just video, not just theory.
      </>
    ),
  },
];

function Feature({title, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4', styles.feature)}>
      <Heading as="h3">{title}</Heading>
      <p>{description}</p>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
