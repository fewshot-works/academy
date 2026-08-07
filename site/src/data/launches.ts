// Curated curriculum-launch entries (new tracks, new chapters) for the
// homepage "What's new" feed, merged with blog posts in HomepageWhatsNew.
// Not archived anywhere else -- these are homepage callouts, not a changelog.
export type Launch = {
  permalink: string;
  title: string;
  description?: string;
  date: string;
};

export const launches: Launch[] = [
  {
    permalink: '/docs/mcp/overview',
    title: 'MCP track is live',
    description:
      '8 hands-on chapters on connecting to MCP servers, building your own, and hardening agents against ones you don’t trust.',
    date: '2026-08-07',
  },
];
