import type {ReactNode} from 'react';
import {usePluginData} from '@docusaurus/useGlobalData';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';

import styles from './styles.module.css';

type RecentPost = {
  permalink: string;
  title: string;
  description?: string;
  date: string;
};

type RecentPostsData = {
  posts: RecentPost[];
};

const MIN_POSTS_TO_SHOW = 3;
const MAX_POSTS_TO_SHOW = 3;

// Hidden until there are enough posts to not look like an empty/broken
// section on launch (see homepage-redesign issue #41). Sourced from the
// custom recent-posts-plugin, since the blog plugin itself doesn't expose
// post metadata via global data.
export default function HomepageWhatsNew(): ReactNode {
  const {posts} = usePluginData('recent-posts-plugin') as RecentPostsData;

  if (!posts || posts.length < MIN_POSTS_TO_SHOW) {
    return null;
  }

  const recentPosts = posts.slice(0, MAX_POSTS_TO_SHOW);

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>What's new</p>
            <Heading as="h2" className={styles.title}>
              Fresh off the blog
            </Heading>
          </div>
          <Link className={styles.viewAll} to="/blog">
            View all posts &rarr;
          </Link>
        </div>
        <div className={styles.grid}>
          {recentPosts.map((post) => (
            <Link key={post.permalink} to={post.permalink} className={styles.card}>
              <span className={styles.cardDate}>{post.date}</span>
              <span className={styles.cardTitle}>{post.title}</span>
              {post.description && (
                <span className={styles.cardExcerpt}>{post.description}</span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
