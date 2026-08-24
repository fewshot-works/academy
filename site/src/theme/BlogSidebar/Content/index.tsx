import React, {memo, type ReactNode} from 'react';
import {useThemeConfig} from '@docusaurus/theme-common';
import {groupBlogSidebarItemsByYear} from '@docusaurus/plugin-content-blog/client';
import type {BlogSidebarItem} from '@docusaurus/plugin-content-blog';
import Heading from '@theme/Heading';
import type {Props} from '@theme/BlogSidebar/Content';

import styles from './styles.module.css';

// Items within a year are already sorted newest-first, so grouping by month
// name here just splits that run into contiguous month buckets.
function groupItemsByMonth(
  items: BlogSidebarItem[],
): [string, BlogSidebarItem[]][] {
  const groups: [string, BlogSidebarItem[]][] = [];
  items.forEach((item) => {
    const month = new Date(item.date).toLocaleDateString(undefined, {
      month: 'long',
    });
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup[0] === month) {
      lastGroup[1].push(item);
    } else {
      groups.push([month, [item]]);
    }
  });
  return groups;
}

function BlogSidebarYearGroup({
  year,
  yearGroupHeadingClassName,
  children,
}: {
  year: string;
  yearGroupHeadingClassName?: string;
  children: ReactNode;
}) {
  return (
    <div role="group">
      <Heading as="h3" className={yearGroupHeadingClassName}>
        {year}
      </Heading>
      {children}
    </div>
  );
}

function BlogSidebarMonthGroup({
  month,
  children,
}: {
  month: string;
  children: ReactNode;
}) {
  return (
    <div role="group">
      <Heading as="h4" className={styles.monthGroupHeading}>
        {month}
      </Heading>
      {children}
    </div>
  );
}

function BlogSidebarContent({
  items,
  yearGroupHeadingClassName,
  ListComponent,
}: Props): ReactNode {
  const themeConfig = useThemeConfig();
  if (themeConfig.blog.sidebar.groupByYear) {
    const itemsByYear = groupBlogSidebarItemsByYear(items);
    return (
      <>
        {itemsByYear.map(([year, yearItems]) => (
          <BlogSidebarYearGroup
            key={year}
            year={year}
            yearGroupHeadingClassName={yearGroupHeadingClassName}>
            {groupItemsByMonth(yearItems).map(([month, monthItems], index) => (
              <BlogSidebarMonthGroup key={`${month}-${index}`} month={month}>
                <ListComponent items={monthItems} />
              </BlogSidebarMonthGroup>
            ))}
          </BlogSidebarYearGroup>
        ))}
      </>
    );
  } else {
    return <ListComponent items={items} />;
  }
}

export default memo(BlogSidebarContent);
