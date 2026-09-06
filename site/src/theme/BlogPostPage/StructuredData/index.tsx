import React, {type ReactNode} from 'react';
import Head from '@docusaurus/Head';
import {
  useBlogPost,
  useBlogPostStructuredData,
} from '@docusaurus/plugin-content-blog/client';

export default function BlogPostStructuredData(): ReactNode {
  const structuredData = useBlogPostStructuredData();
  const {
    metadata: {frontMatter, tags},
  } = useBlogPost();
  const keywords = frontMatter.keywords ?? tags.map((tag) => tag.label);

  return (
    <Head>
      <script type="application/ld+json">
        {JSON.stringify({
          ...structuredData,
          keywords,
          inLanguage: 'en',
          publisher: {'@id': 'https://fewshotacademy.com/#organization'},
        })}
      </script>
    </Head>
  );
}
