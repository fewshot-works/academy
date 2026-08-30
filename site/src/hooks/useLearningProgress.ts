import {useCallback, useEffect, useState} from 'react';
import {emptyLearningProgress} from '@site/src/utils/learningProgressCore';
import {
  LEARNING_PROGRESS_CHANGE_EVENT,
  LEARNING_PROGRESS_STORAGE_KEY,
  markLessonCompleted,
  markLessonIncomplete,
  readProgressSnapshot,
  recordLessonVisit,
  resetLearningProgress,
  type ProgressSnapshot,
} from '@site/src/utils/learningProgressStore';

type HydratedProgressSnapshot = ProgressSnapshot & {hydrated: boolean};

const INITIAL_SNAPSHOT: HydratedProgressSnapshot = {
  progress: emptyLearningProgress(),
  storageStatus: 'available',
  hydrated: false,
};

export function useLearningProgress() {
  const [snapshot, setSnapshot] = useState<HydratedProgressSnapshot>(INITIAL_SNAPSHOT);

  const refresh = useCallback(() => {
    setSnapshot({...readProgressSnapshot(), hydrated: true});
  }, []);

  useEffect(() => {
    refresh();

    function handleStorage(event: StorageEvent) {
      if (event.key === LEARNING_PROGRESS_STORAGE_KEY || event.key === null) {
        refresh();
      }
    }

    window.addEventListener(LEARNING_PROGRESS_CHANGE_EVENT, refresh);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(LEARNING_PROGRESS_CHANGE_EVENT, refresh);
      window.removeEventListener('storage', handleStorage);
    };
  }, [refresh]);

  return {
    ...snapshot,
    recordVisit: recordLessonVisit,
    completeLesson: markLessonCompleted,
    uncompleteLesson: markLessonIncomplete,
    resetProgress: resetLearningProgress,
  };
}
