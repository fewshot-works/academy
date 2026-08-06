import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';

import styles from './styles.module.css';

type TrackSlug =
  | 'forward-deployed-engineer'
  | 'applied-agentic-ai-engineer'
  | 'ai-solutions-architect-presales'
  | 'sre-reliability-engineer'
  | 'ai-product-manager';

type Track = {slug: TrackSlug; label: string};

const TRACKS: Track[] = [
  {slug: 'forward-deployed-engineer', label: 'Forward-Deployed Engineer'},
  {slug: 'applied-agentic-ai-engineer', label: 'Applied / Agentic AI Engineer'},
  {slug: 'ai-solutions-architect-presales', label: 'AI Solutions Architect / Presales'},
  {slug: 'sre-reliability-engineer', label: 'SRE / Reliability Engineer'},
  {slug: 'ai-product-manager', label: 'AI Product Manager'},
];

type RelatedPost = {title: string; to: string};

// Curated (not algorithmic) -- each track links to the 2 seed posts whose
// subject matter is most relevant to that role, per homepage-redesign issue #41.
const RELATED_POSTS: Record<TrackSlug, RelatedPost[]> = {
  'forward-deployed-engineer': [
    {title: 'Why "Memory" Just Became a First-Class Agent Feature', to: '/blog/agent-memory-first-class'},
    {title: 'What Actually Goes Wrong When Agents Go Rogue', to: '/blog/rogue-agent-incidents-guardrails'},
  ],
  'applied-agentic-ai-engineer': [
    {title: 'Why "Memory" Just Became a First-Class Agent Feature', to: '/blog/agent-memory-first-class'},
    {title: 'The OWASP MCP Top 10, Explained for Builders', to: '/blog/owasp-mcp-top-10'},
  ],
  'ai-solutions-architect-presales': [
    {title: 'What the EU AI Act Actually Requires, Chapter by Chapter', to: '/blog/eu-ai-act-obligations'},
    {title: 'The OWASP MCP Top 10, Explained for Builders', to: '/blog/owasp-mcp-top-10'},
  ],
  'sre-reliability-engineer': [
    {title: 'What Actually Goes Wrong When Agents Go Rogue', to: '/blog/rogue-agent-incidents-guardrails'},
    {title: 'The OWASP MCP Top 10, Explained for Builders', to: '/blog/owasp-mcp-top-10'},
  ],
  'ai-product-manager': [
    {title: 'What the EU AI Act Actually Requires, Chapter by Chapter', to: '/blog/eu-ai-act-obligations'},
    {title: 'What Actually Goes Wrong When Agents Go Rogue', to: '/blog/rogue-agent-incidents-guardrails'},
  ],
};

export default function CareerTrackSidebar({currentSlug}: {currentSlug: TrackSlug}): ReactNode {
  const otherTracks = TRACKS.filter((track) => track.slug !== currentSlug);
  const relatedPosts = RELATED_POSTS[currentSlug];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sticky}>
        <Link className="button button--primary button--block" to="/docs/foundations/setup">
          Start Learning Free &rarr;
        </Link>

        {relatedPosts.length > 0 && (
          <div className={styles.block}>
            <p className={styles.blockTitle}>Related reading</p>
            <ul className={styles.postList}>
              {relatedPosts.map((post) => (
                <li key={post.to}>
                  <Link to={post.to}>{post.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.block}>
          <p className={styles.blockTitle}>Other career tracks</p>
          <ul className={styles.trackList}>
            {otherTracks.map((track) => (
              <li key={track.slug}>
                <Link to={`/career-tracks/${track.slug}`}>{track.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
