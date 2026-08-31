import type {ReactNode} from 'react';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import OriginalDocItemContent from '@theme-original/DocItem/Content';
import LessonProgressStrip from '@site/src/components/LearningProgress/LessonProgressStrip';
import {findLessonByPermalink} from '@site/src/data/curriculum';
import type {Props} from '@theme/DocItem/Content';

export default function DocItemContent({children}: Props): ReactNode {
  const {metadata} = useDoc();
  const lesson = findLessonByPermalink(metadata.permalink);

  return (
    <>
      {lesson && <LessonProgressStrip lesson={lesson} />}
      <OriginalDocItemContent>{children}</OriginalDocItemContent>
    </>
  );
}
