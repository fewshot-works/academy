import {useEffect, useState, type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageTracks from '@site/src/components/HomepageTracks';
import HomepageMostPopular from '@site/src/components/HomepageMostPopular';
import HomepageWhatsNew from '@site/src/components/HomepageWhatsNew';
import Heading from '@theme/Heading';

import styles from './index.module.css';

type IconProps = {className?: string};

function CompassIcon({className}: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M14.6 9.4 10.6 10.6 9.4 14.6 13.4 13.4Z" />
    </svg>
  );
}

function WrenchIcon({className}: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true">
      <path d="M14.7 6.3a4 4 0 0 0-5.4 4.6L4 16.2V20h3.8l5.3-5.3a4 4 0 0 0 4.6-5.4l-2.6 2.6-2-2Z" />
    </svg>
  );
}

function GridIcon({className}: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true">
      <rect x="4" y="4" width="6.5" height="6.5" rx="1" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1" />
    </svg>
  );
}

function PulseIcon({className}: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true">
      <path d="M3 12h4l2-7 4 14 2-7h6" />
    </svg>
  );
}

function PresentIcon({className}: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true">
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M7 12.5 10 9.5 13 11.5 17 7" />
      <path d="M9 20h6M12 16v4" />
    </svg>
  );
}

// Decorative topographic-contour mark: horizontal elevation lines, like the
// strata on a topo map, standing in for the "climb" the curriculum follows.
function ContourGraphic({className}: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 220"
      preserveAspectRatio="none"
      aria-hidden="true"
      role="presentation">
      <path
        d="M-20,180 C 80,140 140,200 230,150 C 300,115 340,150 420,110"
        stroke="var(--zta-contour)"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M-20,140 C 90,95 150,160 240,110 C 310,75 350,110 420,70"
        stroke="var(--zta-contour)"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M-20,100 C 100,55 160,120 250,70 C 320,35 355,70 420,35"
        stroke="var(--zta-contour)"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M-20,60 C 110,20 170,80 260,35 C 325,3 360,35 420,5"
        stroke="var(--zta-accent)"
        strokeWidth="2.5"
        opacity="0.55"
        fill="none"
      />
    </svg>
  );
}

type RoleItem = {
  title: string;
  blurb: string;
  to: string;
  icon: ReactNode;
};

// Real per-role blurbs, trimmed from each career-track page's own META_DESCRIPTION —
// nothing here is invented copy.
const SecondaryRoles: RoleItem[] = [
  {
    title: 'Applied / Agentic AI Engineer',
    blurb:
      'Building RAG pipelines and tool-using agents on top of foundation models, shipped into production.',
    to: '/career-tracks/applied-agentic-ai-engineer',
    icon: <WrenchIcon />,
  },
  {
    title: 'AI Product Manager',
    blurb:
      'What the job actually is, real compensation data, and how to prepare for the interview.',
    to: '/career-tracks/ai-product-manager',
    icon: <GridIcon />,
  },
  {
    title: 'SRE / Reliability Engineer for AI Agents',
    blurb:
      'Keeps AI agents running reliably in production: observability, guardrails, cost and latency budgets.',
    to: '/career-tracks/sre-reliability-engineer',
    icon: <PulseIcon />,
  },
  {
    title: 'AI Solutions Architect / Presales',
    blurb:
      'Demoing, proposal-writing, and requirement analysis for enterprise AI adoption.',
    to: '/career-tracks/ai-solutions-architect-presales',
    icon: <PresentIcon />,
  },
];

// The FDE spotlight plus "All career tracks →" already cover the full set,
// so the row below only needs a taste of the rest — pick 3 of 4 at random
// per visit rather than cramming all four into a grid that wraps unevenly.
function pickThreeRoles(): RoleItem[] {
  const shuffled = [...SecondaryRoles];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, 3);
}

function RoleRow({title, blurb, to, icon}: RoleItem) {
  return (
    <Link to={to} className={styles.roleRow} aria-label={`${title}: ${blurb}`}>
      <span className={styles.roleIcon}>{icon}</span>
      <span className={styles.roleRowTitle}>{title}</span>
      <span className={styles.roleRowArrow} aria-hidden="true">
        →
      </span>
    </Link>
  );
}

function HomepageHeader() {
  // Start with a fixed slice so server and first client render match, then
  // shuffle after mount — avoids a hydration mismatch from server-random.
  const [roles, setRoles] = useState<RoleItem[]>(SecondaryRoles.slice(0, 3));

  useEffect(() => {
    setRoles(pickThreeRoles());
  }, []);

  return (
    <header className={styles.heroBanner}>
      <ContourGraphic className={styles.heroBg} />
      <div className={clsx('container', styles.heroInner)}>
        <Heading as="h1" className={styles.heroTitle}>
          Pick the AI-era job you're aiming for.
        </Heading>
        <p className={styles.heroSubtitle}>
          Five roles, each mapped chapter-by-chapter to a free curriculum you
          run on your own laptop.
        </p>

        <Link
          to="/career-tracks/forward-deployed-engineer"
          className={styles.spotlight}>
          <span className={styles.spotlightIcon}>
            <CompassIcon />
          </span>
          <span className={styles.spotlightMain}>
            <Heading as="h2" className={styles.spotlightTitle}>
              Forward-Deployed Engineer
            </Heading>
            <p className={styles.spotlightBlurb}>
              Embedded with a customer, decomposing a vague problem live and
              shipping production AI inside their org.
            </p>
          </span>
          <span className={styles.spotlightCta}>
            See the FDE path <span aria-hidden="true">→</span>
          </span>
        </Link>

        <ul className={styles.roleList}>
          {roles.map((role) => (
            <li key={role.title}>
              <RoleRow {...role} />
            </li>
          ))}
        </ul>

        <p className={styles.metaStrip}>
          <span className={styles.metaChip}>Free forever</span>
          <span className={styles.metaChip}>Runs on your laptop</span>
          <span className={styles.metaChip}>No signup</span>
        </p>

        <p className={styles.secondaryLinks}>
          <Link to="/career-tracks">All career tracks →</Link>
          <span aria-hidden="true">·</span>
          <Link to="/docs/intro">
            Not sure yet? Start with the curriculum →
          </Link>
        </p>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="A free, open-source, chapter-wise curriculum for LLMs, Vector Databases, RAG, and Agents — from zero to your first AI agent, running entirely on your own laptop.">
      <HomepageHeader />
      <main>
        <HomepageTracks />
        <HomepageMostPopular />
        <HomepageWhatsNew />
      </main>
    </Layout>
  );
}
