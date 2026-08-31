import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {findTrackById, type CurriculumLesson} from '@site/src/data/curriculum';
import {useLearningProgress} from '@site/src/hooks/useLearningProgress';
import {calculateTrackProgress} from '@site/src/utils/learningProgressCore';
import styles from './styles.module.css';

export default function LessonProgressStrip({
  lesson,
}: {
  lesson: CurriculumLesson;
}): ReactNode {
  const {progress, hydrated} = useLearningProgress();
  const track = findTrackById(lesson.trackId);
  const summary = calculateTrackProgress(progress, track.lessons);

  return (
    <aside className={styles.lessonProgressStrip} aria-label={`${track.title} course progress`}>
      <div className={styles.lessonProgressSummary}>
        <span className={styles.lessonProgressTrack}>{track.title}</span>
        <span className={styles.lessonProgressCount}>
          {hydrated ? `${summary.completed} of ${summary.total} complete` : 'Loading progress...'}
        </span>
      </div>
      <div className={styles.lessonProgressDetails}>
        <div
          className={styles.lessonProgressBar}
          role="progressbar"
          aria-label={`${track.title} lessons completed`}
          aria-valuemin={0}
          aria-valuemax={summary.total}
          aria-valuenow={hydrated ? summary.completed : 0}
          aria-busy={!hydrated}>
          <span style={{width: `${hydrated ? summary.percentage : 0}%`}} />
        </div>
        <Link
          className={styles.lessonProgressLink}
          to={track.overviewPermalink}
          aria-label={`View overview: ${track.title} course`}>
          View overview
        </Link>
      </div>
    </aside>
  );
}
