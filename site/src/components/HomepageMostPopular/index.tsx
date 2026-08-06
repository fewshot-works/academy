import {useEffect, useState} from 'react';
import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';

import styles from './styles.module.css';

type TopPage = {path: string; count: number};

function titleFromPath(path: string): string {
  const slug = path.replace(/^\/+|\/+$/g, '').split('/').pop() ?? '';
  if (!slug || slug === 'docs') {
    return 'Home';
  }
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Driven by the /api/top-pages D1 endpoint, not a hardcoded editorial list --
// hides itself if the endpoint isn't reachable (e.g. local dev without
// wrangler) instead of showing an empty or broken section.
export default function HomepageMostPopular(): ReactNode {
  const [pages, setPages] = useState<TopPage[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/top-pages?limit=3')
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: TopPage[]) => {
        if (!cancelled) {
          setPages(data);
        }
      })
      .catch(() => {
        // Endpoint not reachable (e.g. local dev) -- section stays hidden.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (pages.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className="container">
        <p className={styles.eyebrow}>Most popular right now</p>
        <Heading as="h2" className={styles.title}>
          What other learners are reading
        </Heading>
        <div className={styles.grid}>
          {pages.map((page) => (
            <Link key={page.path} to={page.path} className={styles.card}>
              <span className={styles.cardTitle}>{titleFromPath(page.path)}</span>
              <span className={styles.cardMeta}>{page.path}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
