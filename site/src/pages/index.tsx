import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import HomepageTracks from '@site/src/components/HomepageTracks';
import HomepageCareerTracks from '@site/src/components/HomepageCareerTracks';
import HomepageMostPopular from '@site/src/components/HomepageMostPopular';
import HomepageWhatsNew from '@site/src/components/HomepageWhatsNew';
import Heading from '@theme/Heading';

import styles from './index.module.css';

// Decorative topographic-contour mark: horizontal elevation lines, like the
// strata on a topo map, standing in for the "climb" the curriculum follows.
function ContourGraphic() {
  return (
    <svg
      className={styles.contour}
      viewBox="0 0 400 220"
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
        stroke="var(--ifm-color-primary)"
        strokeWidth="2.5"
        opacity="0.6"
        fill="none"
      />
    </svg>
  );
}

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div className={clsx('container', styles.heroInner)}>
        <div className={styles.heroText}>
          <p className={styles.eyebrow}>A free, open-source curriculum</p>
          <Heading as="h1" className={styles.heroTitle}>
            {siteConfig.title}
          </Heading>
          <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
          <p className={styles.heroNote}>
            Not just training — a roadmap to the AI-era job you actually
            want.{' '}
            <Link to="/career-tracks">See the career tracks &rarr;</Link>
          </p>
          <div className={styles.buttons}>
            <Link
              className="button button--primary button--lg"
              to="/docs/intro">
              Start Learning — Free →
            </Link>
          </div>
        </div>
        <div className={styles.heroArt}>
          <ContourGraphic />
        </div>
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
        <HomepageCareerTracks />
        <HomepageMostPopular />
        <HomepageWhatsNew />
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
