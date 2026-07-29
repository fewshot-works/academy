import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';

import styles from './styles.module.css';

type RoleItem = {title: string; to: string};

const ROLES: RoleItem[] = [
  {title: 'Forward-Deployed Engineer', to: '/career-tracks/forward-deployed-engineer'},
  {title: 'Applied / Agentic AI Engineer', to: '/career-tracks/applied-agentic-ai-engineer'},
  {title: 'AI Product Manager', to: '/career-tracks/ai-product-manager'},
  {title: 'SRE for AI Agent Applications', to: '/career-tracks/sre-reliability-engineer'},
  {title: 'AI Solutions Architect / Presales', to: '/career-tracks/ai-solutions-architect-presales'},
];

export default function HomepageCareerTracks(): ReactNode {
  return (
    <section className={styles.band}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Learning toward a specific job?</p>
          <Heading as="h2" className={styles.title}>
            Five AI-era roles, mapped chapter by chapter
          </Heading>
          <p className={styles.subtitle}>
            Same curriculum, organized around the job instead of the syllabus &mdash; what
            each role actually does, what to learn first, and how to prep for the interview.
          </p>
        </div>
        <div className={styles.rolesSide}>
          <div className={styles.roleChips}>
            {ROLES.map((role) => (
              <Link key={role.to} to={role.to} className={styles.roleChip}>
                {role.title}
              </Link>
            ))}
          </div>
          <Link className="button button--outline button--primary" to="/career-tracks">
            Explore career tracks &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
