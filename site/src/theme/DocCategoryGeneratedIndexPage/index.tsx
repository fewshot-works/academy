import type {ReactNode} from 'react';
import {PageMetadata} from '@docusaurus/theme-common';
import {useCurrentSidebarCategory} from '@docusaurus/plugin-content-docs/client';
import useBaseUrl from '@docusaurus/useBaseUrl';
import DocCardList from '@theme/DocCardList';
import DocPaginator from '@theme/DocPaginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import Heading from '@theme/Heading';
import TrackProgress from '@site/src/components/LearningProgress/TrackProgress';
import type {TrackId} from '@site/src/data/curriculum';
import type {Props} from '@theme/DocCategoryGeneratedIndexPage';
import styles from './styles.module.css';

const TRACK_BY_CATEGORY_TITLE: Partial<Record<string, TrackId>> = {
  Foundations: 'foundations',
  Intermediate: 'intermediate',
  Advanced: 'advanced',
  MCP: 'mcp',
};

function Metadata({categoryGeneratedIndex}: Props): ReactNode {
  return (
    <PageMetadata
      title={categoryGeneratedIndex.title}
      description={categoryGeneratedIndex.description}
      keywords={categoryGeneratedIndex.keywords}
      image={useBaseUrl(categoryGeneratedIndex.image)}
    />
  );
}

function Content({categoryGeneratedIndex}: Props): ReactNode {
  const category = useCurrentSidebarCategory();
  const trackId = TRACK_BY_CATEGORY_TITLE[categoryGeneratedIndex.title];

  return (
    <div className={styles.generatedIndexPage}>
      <DocVersionBanner />
      <DocBreadcrumbs />
      <DocVersionBadge />
      <header>
        <Heading as="h1" className={styles.title}>
          {categoryGeneratedIndex.title}
        </Heading>
        {categoryGeneratedIndex.description && <p>{categoryGeneratedIndex.description}</p>}
      </header>
      {trackId && <TrackProgress trackId={trackId} />}
      <article className="margin-top--lg">
        <DocCardList items={category.items} className={styles.list} />
      </article>
      <footer className="margin-top--md">
        <DocPaginator
          previous={categoryGeneratedIndex.navigation.previous}
          next={categoryGeneratedIndex.navigation.next}
        />
      </footer>
    </div>
  );
}

export default function DocCategoryGeneratedIndexPage(props: Props): ReactNode {
  return (
    <>
      <Metadata {...props} />
      <Content {...props} />
    </>
  );
}
