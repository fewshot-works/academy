import React, {type ReactNode} from 'react';
import Content from '@theme-original/DocItem/Content';
import type ContentType from '@theme/DocItem/Content';
import type {WrapperProps} from '@docusaurus/types';
import {useDoc} from '@docusaurus/plugin-content-docs/client';

import BlogPostGiscus from '@site/src/components/BlogPostGiscus';

type Props = WrapperProps<typeof ContentType>;

// Opt-in doc comments (gh issue #97): set `comments: true` in a doc's
// front matter to render the same Giscus thread used on blog posts.
export default function ContentWrapper(props: Props): ReactNode {
  const {frontMatter} = useDoc();
  const showComments = (frontMatter as {comments?: boolean}).comments === true;

  return (
    <>
      <Content {...props} />
      {showComments && <BlogPostGiscus />}
    </>
  );
}
