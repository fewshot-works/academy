import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'zero-to-agent',
  tagline: 'From zero to your first AI agent — free, local-first, hands-on.',
  favicon: 'img/favicon.svg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  // GitHub Pages project-site URL. Update if a custom domain is added later.
  url: 'https://fewshot-works.github.io',
  baseUrl: '/zero-to-agent/',

  organizationName: 'fewshot-works', // GitHub org/user name
  projectName: 'zero-to-agent', // GitHub repo name
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        createRedirects(existingPath: string) {
          const map: Record<string, string> = {
            '/docs/foundations/': '/docs/tier-1-foundations/',
            '/docs/intermediate/': '/docs/tier-2-intermediate/',
            '/docs/advanced/': '/docs/tier-3-advanced/',
          };
          for (const [next, old] of Object.entries(map)) {
            if (existingPath.startsWith(next)) {
              return [existingPath.replace(next, old)];
            }
          }
          return undefined;
        },
      },
    ],
  ],

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
          editUrl: 'https://github.com/fewshot-works/zero-to-agent/tree/main/site/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'zero-to-agent',
      logo: {
        alt: 'zero-to-agent logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Curriculum',
        },
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
              href: 'https://github.com/fewshot-works/zero-to-agent/tree/main/labs',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} zero-to-agent. Code under MIT, content under CC BY 4.0.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
