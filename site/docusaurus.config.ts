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
        },
      },
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
        {
          title: 'Get in touch',
          items: [
            {
              label: 'Contact us',
              href: 'https://docs.google.com/forms/d/e/1FAIpQLSeM7Q-VVE6zoJoMQgq4-B4wagm4c9UCKfNFyCmsnsqDA_C_Rg/viewform',
            },
            {
              label: 'Give feedback',
              href: 'https://docs.google.com/forms/d/e/1FAIpQLSeK059EZXmPf5NK7c3AR63DDJb5cG7lEr-IA-Gdgh0GYJmGqw/viewform',
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
