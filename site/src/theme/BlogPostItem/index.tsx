import type {ReactNode} from 'react';
import BlogPostItem from '@theme-original/BlogPostItem';
import type BlogPostItemType from '@theme/BlogPostItem';
import type {WrapperProps} from '@docusaurus/types';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';

import styles from './styles.module.css';

type Props = WrapperProps<typeof BlogPostItemType>;

// Docusaurus doesn't render the front-matter `image` in the blog list by
// default (see gh issue #42) -- this reuses the per-post social-card image
// as a small list thumbnail instead of a separate asset.
export default function BlogPostItemWrapper(props: Props): ReactNode {
  const {assets, frontMatter, isBlogPostPage} = useBlogPost();
  const image = assets.image ?? frontMatter.image;

  if (isBlogPostPage || !image) {
    return <BlogPostItem {...props} />;
  }

  return (
    <div className={styles.itemWithThumbnail}>
      <img src={image} alt="" className={styles.thumbnail} loading="lazy" />
      <div className={styles.itemBody}>
        <BlogPostItem {...props} />
      </div>
    </div>
  );
}
