import {useEffect, useId, type ReactNode} from 'react';
import Heading from '@theme/Heading';
import {findTrackById, type CurriculumLesson} from '@site/src/data/curriculum';
import {useLearningProgress} from '@site/src/hooks/useLearningProgress';
import {trackLearningEvent} from '@site/src/utils/analytics';
import styles from './styles.module.css';

export default function LessonCompletion({lesson}: {lesson: CurriculumLesson}): ReactNode {
  const headingId = useId();
  const {
    progress,
    storageStatus,
    hydrated,
    recordVisit,
    completeLesson,
    uncompleteLesson,
  } = useLearningProgress();
  const track = findTrackById(lesson.trackId);
  const isCompleted = progress.completedLessonIds.includes(lesson.id);

  useEffect(() => {
    recordVisit(lesson.id);
  }, [lesson.id, recordVisit]);

  if (!hydrated) {
    return null;
  }

  function complete() {
    const result = completeLesson(lesson.id);
    if (result.changed) {
      trackLearningEvent('lesson_complete', {
        track_id: lesson.trackId,
        lesson_id: lesson.id,
        completion_method: 'button',
      });
    }
  }

  function markIncomplete() {
    uncompleteLesson(lesson.id);
  }

  return (
    <section className={styles.lessonControl} aria-labelledby={headingId}>
      <div>
        <span className={styles.eyebrow}>{track.title} progress</span>
        <Heading as="h2" id={headingId} className={styles.lessonHeading}>
          {isCompleted ? 'Lesson complete' : 'Finished this lesson?'}
        </Heading>
        <p className={styles.lessonCopy}>
          {isCompleted
            ? 'This lesson now counts toward your track progress.'
            : 'Mark it complete now, or use Next below to complete it automatically.'}
        </p>
        {storageStatus === 'unavailable' && (
          <p className={styles.storageWarning} role="status">
            This browser blocked local storage. Your progress will last only for this tab.
          </p>
        )}
      </div>
      <button
        type="button"
        className={isCompleted ? styles.secondaryButton : styles.primaryButton}
        aria-pressed={isCompleted}
        onClick={isCompleted ? markIncomplete : complete}>
        {isCompleted ? 'Mark incomplete' : 'Mark complete'}
      </button>
    </section>
  );
}
