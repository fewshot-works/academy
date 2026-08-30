import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import {CURRICULUM_TRACKS, findLessonByPermalink} from '@site/src/data/curriculum';
import {markLessonCompleted} from '@site/src/utils/learningProgressStore';
import {trackEngagementEvent} from '@site/src/utils/analytics';

export default function DocItemPaginator(): ReactNode {
  const {metadata} = useDoc();
  const lesson = findLessonByPermalink(metadata.permalink);
  const nextLesson = findLessonByPermalink(metadata.next?.permalink);
  const overviewTrack = CURRICULUM_TRACKS.find(
    (track) => track.overviewPermalink === metadata.permalink,
  );

  function handleNextClick() {
    if (overviewTrack && nextLesson?.trackId === overviewTrack.id) {
      trackEngagementEvent('course_start', {
        track_id: overviewTrack.id,
        source_surface: 'track_overview',
      });
      return;
    }

    if (!lesson) {
      return;
    }

    const result = markLessonCompleted(lesson.id);
    if (result.changed) {
      trackEngagementEvent('lesson_complete', {
        track_id: lesson.trackId,
        lesson_id: lesson.id,
        completion_method: 'next_lesson',
      });
    }
    trackEngagementEvent('next_lesson_click', {
      track_id: lesson.trackId,
      lesson_id: lesson.id,
      destination_lesson_id: nextLesson?.id,
    });
  }

  return (
    <nav
      className="docusaurus-mt-lg pagination-nav"
      aria-label={translate({
        id: 'theme.docs.paginator.navAriaLabel',
        message: 'Docs pages',
        description: 'The ARIA label for the docs pagination',
      })}>
      {metadata.previous && (
        <Link
          className={clsx('pagination-nav__link', 'pagination-nav__link--prev')}
          to={metadata.previous.permalink}>
          <div className="pagination-nav__sublabel">
            <Translate
              id="theme.docs.paginator.previous"
              description="The label used to navigate to the previous doc">
              Previous
            </Translate>
          </div>
          <div className="pagination-nav__label">{metadata.previous.title}</div>
        </Link>
      )}
      {metadata.next && (
        <Link
          className={clsx('pagination-nav__link', 'pagination-nav__link--next')}
          to={metadata.next.permalink}
          onClick={handleNextClick}>
          <div className="pagination-nav__sublabel">
            <Translate
              id="theme.docs.paginator.next"
              description="The label used to navigate to the next doc">
              Next
            </Translate>
          </div>
          <div className="pagination-nav__label">{metadata.next.title}</div>
        </Link>
      )}
    </nav>
  );
}
