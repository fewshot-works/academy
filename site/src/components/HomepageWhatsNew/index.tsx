import type {ReactNode} from 'react';
import {usePluginData} from '@docusaurus/useGlobalData';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import {launches} from '@site/src/data/launches';

import styles from './styles.module.css';

type FeedItem = {
  permalink: string;
  title: string;
  description?: string;
  date: string;
  kind: 'post' | 'launch';
};

type RecentPostsData = {
  posts: Array<Omit<FeedItem, 'kind'>>;
};

const MIN_ITEMS_TO_SHOW = 3;
const MAX_ITEMS_TO_SHOW = 3;

// Hidden until there are enough items to not look like an empty/broken
// section on launch (see homepage-redesign issue #41). Merges blog posts
// (from the custom recent-posts-plugin, since the blog plugin itself doesn't
// expose post metadata via global data) with curated curriculum launches
// (site/src/data/launches.ts) into one date-sorted feed.
export default function HomepageWhatsNew(): ReactNode {
  const {posts} = usePluginData('recent-posts-plugin') as RecentPostsData;

  const items: FeedItem[] = [
    ...(posts ?? []).map((post) => ({...post, kind: 'post' as const})),
    ...launches.map((launch) => ({...launch, kind: 'launch' as const})),
  ].sort((a, b) => (a.date < b.date ? 1 : -1));

  if (items.length < MIN_ITEMS_TO_SHOW) {
    return null;
  }

  const recentItems = items.slice(0, MAX_ITEMS_TO_SHOW);

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>What's new</p>
            <Heading as="h2" className={styles.title}>
              Latest from Few-Shot Academy
            </Heading>
          </div>
          <Link className={styles.viewAll} to="/blog">
            View all posts &rarr;
          </Link>
        </div>
        <div className={styles.grid}>
          {recentItems.map((item) => (
            <Link key={item.permalink} to={item.permalink} className={styles.card}>
              <span className={styles.cardDate}>
                {item.kind === 'launch' ? 'New' : item.date}
              </span>
              <span className={styles.cardTitle}>{item.title}</span>
              {item.description && (
                <span className={styles.cardExcerpt}>{item.description}</span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
