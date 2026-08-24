import path from 'node:path';
import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

type NavDropdownItem = {label: string; to: string};

// Navbar dropdowns are static config, so as a section (Advanced Concepts
// especially, since it's an unbounded cookbook) grows past `max` items, this
// keeps only the `max` most-recently-added ones visible and adds a "View
// all" link to the section's landing page instead of letting the dropdown
// scroll forever. Reorder the `items` array as new chapters ship — the most
// recent one goes last.
function capDropdown(overviewTo: string, items: NavDropdownItem[], max = 5): NavDropdownItem[] {
  const overview: NavDropdownItem = {label: 'Overview', to: overviewTo};
  const visible = items.length > max ? items.slice(-max) : items;
  const result = [overview, ...visible];
  if (items.length > max) {
    result.push({label: 'View all →', to: overviewTo});
  }
  return result;
}

const config: Config = {
  title: 'Few-Shot Academy',
  tagline: 'From zero to your first AI agent — free, local-first, hands-on.',
  favicon: 'img/favicon.svg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
    // Rspack (pulled in by v4 prep) panics on the dev server's module graph --
    // stay on webpack until that's fixed upstream.
    faster: false,
  },

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  url: 'https://fewshotacademy.com',
  baseUrl: '/',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  headTags: [
    {
      tagName: 'script',
      attributes: {type: 'application/ld+json'},
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: 'Few-Shot Academy',
        description:
          'A free, open-source, chapter-wise curriculum for Generative AI, LLMs, Vector Databases, RAG, and Agents — from zero prior AI knowledge to a working, evaluated agentic RAG system. Every lesson is hands-on and runs locally for free via Ollama.',
        url: 'https://fewshotacademy.com/',
        isAccessibleForFree: true,
        provider: {
          '@type': 'Organization',
          name: 'Few-Shot Academy',
          url: 'https://fewshotacademy.com/',
        },
      }),
    },
  ],

  plugins: [path.resolve(__dirname, 'src/plugins/recent-posts')],

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/fewshot-works/academy/tree/main/site/',
        },
        blog: {
          blogTitle: 'Few-Shot Academy Blog',
          blogDescription:
            'Timely takes on what’s happening in AI — new model releases, agent incidents, security advisories, and regulation — tied back to the curriculum chapters that explain the fundamentals.',
          showReadingTime: true,
          blogSidebarCount: 'ALL',
          feedOptions: {
            type: ['rss', 'atom'],
            copyright: `Copyright © ${new Date().getFullYear()} Few-Shot Academy.`,
          },
          editUrl: 'https://github.com/fewshot-works/academy/tree/main/site/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        gtag: {
          trackingID: 'G-51WGH2MZ08',
          anonymizeIP: true,
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/academy-social-card.png',
    metadata: [
      {
        name: 'description',
        content:
          'A free, open-source, hands-on curriculum for Generative AI: LLMs, embeddings, vector databases, RAG, and AI agents. Start from zero prior AI knowledge, run every lab locally for free with Ollama.',
      },
      {
        name: 'keywords',
        content:
          'generative AI course, learn generative AI, GenAI training, free LLM course, RAG tutorial, AI agents tutorial, vector database tutorial, learn AI for beginners',
      },
    ],
    announcementBar: {
      id: 'mcp-track-launch',
      content:
        '🎉 New: the <a href="/docs/mcp/overview">MCP track</a> is live — 8 hands-on chapters on building, connecting, and securing MCP servers and agents.',
      backgroundColor: '#1f5d4c',
      textColor: '#f6f4ef',
      isCloseable: true,
    },
    colorMode: {
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        // Expanding one top-level category (e.g. Intermediate) auto-collapses
        // any other expanded sibling, so the sidebar doesn't grow unbounded.
        autoCollapseCategories: true,
      },
    },
    mermaid: {
      // Mermaid computes derived shades internally (khroma), so it needs real
      // hex values, not CSS var() refs — and Docusaurus shares one
      // `themeVariables` set across light/dark, so these are picked to read
      // clearly against both the warm-stone light bg and near-black dark bg:
      // a pine/amber "card" look, matching Basecamp, same in either mode.
      theme: {light: 'base', dark: 'base'},
      options: {
        themeVariables: {
          primaryColor: '#eae6da',
          primaryTextColor: '#1c2622',
          primaryBorderColor: '#1f5d4c',
          lineColor: '#c17c3a',
          secondaryColor: '#eae6da',
          tertiaryColor: '#ffffff',
          background: '#f6f4ef',
          mainBkg: '#eae6da',
          nodeBorder: '#1f5d4c',
          clusterBkg: '#ffffff',
          clusterBorder: '#ddd8cb',
          edgeLabelBackground: '#eae6da',
          textColor: '#1c2622',
          arrowheadColor: '#c17c3a',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
          // xychart-beta falls back to primaryColor for bar fill, which is
          // #eae6da here — nearly invisible against the #f6f4ef card behind
          // it. Give bars their own solid, high-contrast color instead.
          xyChart: {
            backgroundColor: '#f6f4ef',
            titleColor: '#1c2622',
            xAxisLabelColor: '#1c2622',
            xAxisTitleColor: '#1c2622',
            xAxisTickColor: '#1c2622',
            xAxisLineColor: '#1c2622',
            yAxisLabelColor: '#1c2622',
            yAxisTitleColor: '#1c2622',
            yAxisTickColor: '#1c2622',
            yAxisLineColor: '#1c2622',
            plotColorPalette: '#1f5d4c',
          },
        },
      },
    },
    navbar: {
      title: 'Few-Shot Academy',
      logo: {
        alt: 'Few-Shot Academy logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'dropdown',
          position: 'left',
          label: 'Learn',
          items: capDropdown('/docs/intro', [
            {label: 'Foundations', to: '/docs/foundations/overview'},
            {label: 'Intermediate', to: '/docs/intermediate/overview'},
            {label: 'Advanced', to: '/docs/advanced/overview'},
            {label: 'MCP', to: '/docs/mcp/overview'},
          ]),
        },
        {
          type: 'dropdown',
          position: 'left',
          label: 'Advanced Concepts',
          items: capDropdown('/docs/advanced-concepts/overview', [
            {label: 'Prompt Engineering', to: '/docs/advanced-concepts/prompt-engineering'},
            {label: 'Token & Cost Management', to: '/docs/advanced-concepts/token-cost-management'},
            {label: 'Agent Security', to: '/docs/advanced-concepts/agent-security'},
            {label: 'Human-in-the-Loop', to: '/docs/advanced-concepts/human-in-the-loop'},
            {label: 'RBAC', to: '/docs/advanced-concepts/rbac'},
            {label: 'Chaos Engineering', to: '/docs/advanced-concepts/chaos-engineering'},
          ]),
        },
        {
          type: 'dropdown',
          position: 'left',
          label: 'Career Tracks',
          items: capDropdown('/career-tracks', [
            {
              label: 'Forward-Deployed Engineer (FDE)',
              to: '/career-tracks/forward-deployed-engineer',
            },
            {
              label: 'Applied / Agentic AI Engineer',
              to: '/career-tracks/applied-agentic-ai-engineer',
            },
            {
              label: 'AI Solutions Architect / Presales Engineer',
              to: '/career-tracks/ai-solutions-architect-presales',
            },
            {
              label: 'SRE / Reliability Engineer for AI Agent Applications',
              to: '/career-tracks/sre-reliability-engineer',
            },
            {label: 'AI Product Manager', to: '/career-tracks/ai-product-manager'},
          ]),
        },
        {
          type: 'dropdown',
          position: 'left',
          label: 'Interview Prep',
          items: capDropdown('/interview-prep', [
            {label: 'Technical Round', to: '/interview-prep/technical-round'},
            {label: 'Case Studies', to: '/interview-prep/case-studies'},
            {label: 'Behavioral Round', to: '/interview-prep/behavioral-round'},
          ]),
        },
        {to: '/blog', label: 'Blog', position: 'left'},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Project',
          items: [
            {
              label: 'Hands-on labs',
              href: 'https://github.com/fewshot-works/academy/tree/main/labs',
            },
            {
              label: 'Disclaimer',
              to: '/disclaimer',
            },
          ],
        },
        {
          title: 'Get in touch',
          items: [
            {
              label: 'Contact Us / Share Feedback',
              to: '/contact',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Few-Shot Academy. Code under MIT, content under CC BY 4.0. Written with AI assistance, reviewed by a human.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
