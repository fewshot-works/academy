import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import Mermaid from '@theme/Mermaid';

import styles from './interview.module.css';

export {styles};

export function PageHeader({
  title,
  oneLiner,
  meta,
}: {
  title: string;
  oneLiner: string;
  meta: string[];
}): ReactNode {
  return (
    <header className={styles.hero}>
      <Link to="/career-tracks/forward-deployed-engineer" className={styles.back}>
        &larr; Forward-Deployed Engineer
      </Link>
      <Heading as="h1">{title}</Heading>
      <p className={styles.oneLiner}>{oneLiner}</p>
      <div className={styles.metaRow}>
        {meta.map((m) => (
          <span key={m} className={styles.metaChip}>
            {m}
          </span>
        ))}
      </div>
    </header>
  );
}

export function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
}): ReactNode {
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

export type Callout = {title: string; body: ReactNode};

export function CalloutList({items}: {items: Callout[]}): ReactNode {
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

export type Step = {title: string; body: ReactNode};

export function StepList({items}: {items: Step[]}): ReactNode {
  return (
    <ol className={styles.steps}>
      {items.map((step, i) => (
        <li key={step.title} className={styles.step}>
          <span className={styles.stepIndex}>{i + 1}</span>
          <div>
            <Heading as="h4" className={styles.stepTitle}>
              {step.title}
            </Heading>
            <p>{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Chip({children}: {children: ReactNode}): ReactNode {
  return <span className={styles.chip}>{children}</span>;
}

export type Turn = {speaker: 'interviewer' | 'candidate'; text: ReactNode};

export function Dialogue({turns}: {turns: Turn[]}): ReactNode {
  return (
    <div className={styles.dialogue}>
      {turns.map((turn, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={i} className={styles.turn}>
          <span className={`${styles.speaker} ${styles[turn.speaker]}`}>
            {turn.speaker === 'interviewer' ? 'Interviewer' : 'Candidate'}
          </span>
          <p className={styles.turnBody}>{turn.text}</p>
        </div>
      ))}
    </div>
  );
}

export function Diagram({value}: {value: string}): ReactNode {
  return (
    <div className={styles.diagramWrap}>
      <Mermaid value={value} />
    </div>
  );
}

export function SubNav({
  prev,
  next,
}: {
  prev?: {label: string; to: string};
  next?: {label: string; to: string};
}): ReactNode {
  return (
    <div className={styles.subNav}>
      {prev ? (
        <Link className="button button--secondary" to={prev.to}>
          &larr; {prev.label}
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link className="button button--primary" to={next.to}>
          {next.label} &rarr;
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
}
