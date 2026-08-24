import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import BlogSidebar from '@theme/BlogSidebar';

import type {Props} from '@theme/BlogLayout';

import styles from './styles.module.css';

export default function BlogLayout(props: Props): ReactNode {
  const {sidebar, toc, children, ...layoutProps} = props;
  const hasSidebar = sidebar && sidebar.items.length > 0;

  return (
    <Layout {...layoutProps}>
      <div className={clsx(styles.blogContainer, 'margin-vert--lg')}>
        <div className="row">
          <BlogSidebar sidebar={sidebar} />
          {/* Plain "col" (no col--N) grows to fill whatever space the fixed-
              width sidebar and toc columns leave behind, rather than being
              capped at a hardcoded fraction of the row. */}
          <main
            className={clsx('col', styles.main, {
              'col--9 col--offset-1': !hasSidebar,
            })}>
            {children}
          </main>
          {toc && <div className={clsx('col', 'col--2', styles.toc)}>{toc}</div>}
        </div>
      </div>
    </Layout>
  );
}
