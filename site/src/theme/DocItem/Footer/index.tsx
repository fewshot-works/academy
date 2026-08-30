import type {ReactNode} from 'react';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import OriginalDocItemFooter from '@theme-original/DocItem/Footer';
import LessonCompletion from '@site/src/components/LearningProgress/LessonCompletion';
import {findLessonByPermalink} from '@site/src/data/curriculum';

export default function DocItemFooter(): ReactNode {
  const {metadata} = useDoc();
  const lesson = findLessonByPermalink(metadata.permalink);

  return (
    <>
      {lesson && <LessonCompletion lesson={lesson} />}
      <OriginalDocItemFooter />
    </>
  );
}
