import {useId, useState, type ReactNode} from 'react';
import Heading from '@theme/Heading';
import {CURRICULUM_LESSONS, findTrackById, type TrackId} from '@site/src/data/curriculum';
import {useLearningProgress} from '@site/src/hooks/useLearningProgress';
import {
  calculateTrackProgress,
  hasLearningProgress,
} from '@site/src/utils/learningProgressCore';
import styles from './styles.module.css';

export default function TrackProgress({trackId}: {trackId: TrackId}): ReactNode {
  const headingId = useId();
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const {progress, storageStatus, hydrated, resetProgress} = useLearningProgress();
  const track = findTrackById(trackId);

  if (!hydrated) {
    return (
      <section className={styles.trackProgress} aria-busy="true">
        <span className={styles.eyebrow}>Course progress</span>
        <p className={styles.loading}>Loading progress saved in this browser...</p>
      </section>
    );
  }

  const summary = calculateTrackProgress(progress, track.lessons);
  const hasAnyProgress = hasLearningProgress(progress, CURRICULUM_LESSONS);

  function deleteProgress() {
    const result = resetProgress();
    setConfirmingReset(false);
    setResetMessage(
      result === 'available'
        ? 'Course progress deleted from this browser.'
        : 'Progress for this tab was reset.',
    );
  }

  return (
    <section className={styles.trackProgress} aria-labelledby={headingId}>
      <div className={styles.trackHeader}>
        <div>
          <span className={styles.eyebrow}>Course progress</span>
          <Heading as="h2" id={headingId} className={styles.trackHeading}>
            {summary.isComplete
              ? `${track.title} complete`
              : `${summary.completed} of ${summary.total} lessons complete`}
          </Heading>
        </div>
        <strong className={styles.percentage}>{summary.percentage}%</strong>
      </div>
      <div
        className={styles.progressBar}
        role="progressbar"
        aria-label={`${track.title} course progress`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={summary.percentage}>
        <span style={{width: `${summary.percentage}%`}} />
      </div>
      <div className={styles.storageRow}>
        <p>
          {storageStatus === 'available'
            ? 'Saved only in this browser. No account or server storage.'
            : 'Local storage is blocked. Progress lasts only for this tab.'}
        </p>
        {hasAnyProgress && !confirmingReset && (
          <button type="button" className={styles.textButton} onClick={() => setConfirmingReset(true)}>
            Delete course progress
          </button>
        )}
      </div>
      {confirmingReset && (
        <div className={styles.resetConfirmation} role="group" aria-label="Confirm progress deletion">
          <p>
            Delete completion and Continue learning data for every course? Saved quiz answers will
            stay.
          </p>
          <div className={styles.resetActions}>
            <button type="button" className={styles.dangerButton} onClick={deleteProgress}>
              Delete progress
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => setConfirmingReset(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
      <p className={styles.srStatus} role="status" aria-live="polite">
        {resetMessage}
      </p>
    </section>
  );
}
