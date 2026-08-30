import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import {
  CURRICULUM_LESSONS,
  findTrackById,
} from '@site/src/data/curriculum';
import {useLearningProgress} from '@site/src/hooks/useLearningProgress';
import {
  calculateTrackProgress,
  findResumeLesson,
  hasLearningProgress,
} from '@site/src/utils/learningProgressCore';
import {trackLearningEvent} from '@site/src/utils/analytics';
import styles from './styles.module.css';

export default function HomepageContinueLearning(): ReactNode {
  const {progress, hydrated} = useLearningProgress();
  if (!hydrated || !hasLearningProgress(progress, CURRICULUM_LESSONS)) {
    return null;
  }

  const lesson = findResumeLesson(progress, CURRICULUM_LESSONS);
  if (!lesson) {
    return (
      <section className={styles.continueSection} aria-labelledby="curriculum-complete-heading">
        <div className="container">
          <div className={styles.continueCard}>
            <div>
              <span className={styles.eyebrow}>Your progress</span>
              <Heading as="h2" id="curriculum-complete-heading" className={styles.continueHeading}>
                All courses complete
              </Heading>
              <p className={styles.continueCopy}>
                You completed all {CURRICULUM_LESSONS.length} curriculum lessons in this browser.
              </p>
            </div>
            <Link className={styles.secondaryLink} to="/docs/intro">
              Review the curriculum <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const track = findTrackById(lesson.trackId);
  const summary = calculateTrackProgress(progress, track.lessons);

  function trackContinueClick() {
    if (!lesson) {
      return;
    }
    trackLearningEvent('continue_learning_click', {
      track_id: lesson.trackId,
      lesson_id: lesson.id,
    });
  }

  return (
    <section className={styles.continueSection} aria-labelledby="continue-learning-heading">
      <div className="container">
        <div className={styles.continueCard}>
          <div>
            <span className={styles.eyebrow}>Welcome back</span>
            <Heading as="h2" id="continue-learning-heading" className={styles.continueHeading}>
              Continue learning
            </Heading>
            <p className={styles.continueLesson}>{lesson.title}</p>
            <p className={styles.continueCopy}>
              {track.title}: {summary.completed} of {summary.total} lessons complete
            </p>
          </div>
          <Link className={styles.primaryLink} to={lesson.permalink} onClick={trackContinueClick}>
            Continue <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
