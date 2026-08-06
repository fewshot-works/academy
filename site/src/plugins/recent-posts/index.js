const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const BLOG_DIR = path.join(__dirname, '..', '..', '..', 'blog');
const FRONT_MATTER_RE = /^---\n([\s\S]*?)\n---/;

function parseFrontMatter(raw) {
  const match = raw.match(FRONT_MATTER_RE);
  if (!match) {
    return {};
  }
  return yaml.load(match[1]) || {};
}

// The blog plugin doesn't expose post metadata via global data, so this
// small plugin reads the same front matter directly for the homepage
// "What's new" teaser (see homepage-redesign issue #41).
module.exports = function recentPostsPlugin() {
  return {
    name: 'recent-posts-plugin',
    async loadContent() {
      if (!fs.existsSync(BLOG_DIR)) {
        return [];
      }
      const entries = fs.readdirSync(BLOG_DIR, {withFileTypes: true});
      const posts = [];
      for (const entry of entries) {
        if (!entry.isDirectory()) {
          continue;
        }
        const folderMatch = entry.name.match(/^(\d{4}-\d{2}-\d{2})-(.+)$/);
        if (!folderMatch) {
          continue;
        }
        const [, date, folderSlug] = folderMatch;
        const indexPath = path.join(BLOG_DIR, entry.name, 'index.md');
        if (!fs.existsSync(indexPath)) {
          continue;
        }
        const frontMatter = parseFrontMatter(fs.readFileSync(indexPath, 'utf8'));
        const slug = frontMatter.slug ? frontMatter.slug.replace(/^\//, '') : folderSlug;
        posts.push({
          permalink: `/blog/${slug}`,
          title: frontMatter.title ?? folderSlug,
          description: frontMatter.description ?? '',
          date,
        });
      }
      posts.sort((a, b) => (a.date < b.date ? 1 : -1));
      return posts;
    },
    async contentLoaded({content, actions}) {
      actions.setGlobalData({posts: content});
    },
  };
};
