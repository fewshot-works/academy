import React, {type ReactNode} from 'react';
import {PageMetadata} from '@docusaurus/theme-common';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';

export default function BlogPostPageMetadata(): ReactNode {
  const {assets, metadata} = useBlogPost();
  const {title, description, date, tags, authors, frontMatter, lastUpdatedAt} = metadata;

  const image = assets.image ?? frontMatter.image;
  const keywords = frontMatter.keywords ?? tags.map((tag) => tag.label);
  const imageAlt = `Illustration for “${title}”`;
  const socialTitle = frontMatter.title_meta ?? title;
  const modifiedTime = lastUpdatedAt
    ? new Date(lastUpdatedAt).toISOString()
    : undefined;

  return (
    <PageMetadata
      title={frontMatter.title_meta ?? title}
      description={description}
      keywords={keywords}
      image={image}>
      <meta property="og:type" content="article" />
      <meta property="article:published_time" content={date} />
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      <meta property="article:section" content="AI industry analysis" />
      <meta name="twitter:title" content={socialTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta property="og:image:alt" content={imageAlt} />}
      {image && <meta name="twitter:image:alt" content={imageAlt} />}
      {authors
        .filter((author) => author.url)
        .map((author) => (
          <meta key={author.url} property="article:author" content={author.url} />
        ))}
      {tags.map((tag) => (
        <meta key={tag.permalink} property="article:tag" content={tag.label} />
      ))}
    </PageMetadata>
  );
}
