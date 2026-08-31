import {
  emptyLearningProgress,
  parseLearningProgress,
  setLessonCompletion,
  visitLesson,
  type LearningProgress,
} from './learningProgressCore';

export const LEARNING_PROGRESS_STORAGE_KEY = 'fewshot-academy:learning-progress:v1';
export const LEARNING_PROGRESS_CHANGE_EVENT = 'fewshot-academy:learning-progress-change';

export type ProgressStorageStatus = 'available' | 'unavailable';

export type ProgressSnapshot = {
  progress: LearningProgress;
  storageStatus: ProgressStorageStatus;
};

let memoryFallback = emptyLearningProgress();

function browserStorage(): Storage | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

export function readProgressSnapshot(): ProgressSnapshot {
  const storage = browserStorage();
  if (!storage) {
    return {progress: memoryFallback, storageStatus: 'unavailable'};
  }

  try {
    const progress = parseLearningProgress(storage.getItem(LEARNING_PROGRESS_STORAGE_KEY));
    memoryFallback = progress;
    return {progress, storageStatus: 'available'};
  } catch {
    return {progress: memoryFallback, storageStatus: 'unavailable'};
  }
}

function announceProgressChange(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(LEARNING_PROGRESS_CHANGE_EVENT));
  }
}

function writeProgress(progress: LearningProgress): ProgressStorageStatus {
  memoryFallback = progress;
  const storage = browserStorage();
  let storageStatus: ProgressStorageStatus = 'unavailable';

  if (storage) {
    try {
      storage.setItem(LEARNING_PROGRESS_STORAGE_KEY, JSON.stringify(progress));
      storageStatus = 'available';
    } catch {
      storageStatus = 'unavailable';
    }
  }

  announceProgressChange();
  return storageStatus;
}

function mutateProgress(
  update: (progress: LearningProgress) => LearningProgress,
): {changed: boolean; storageStatus: ProgressStorageStatus} {
  const current = readProgressSnapshot().progress;
  const next = update(current);
  if (next === current) {
    return {changed: false, storageStatus: readProgressSnapshot().storageStatus};
  }
  return {changed: true, storageStatus: writeProgress(next)};
}

export function recordLessonVisit(lessonId: string): void {
  mutateProgress((progress) => visitLesson(progress, lessonId));
}

export function markLessonCompleted(
  lessonId: string,
): {changed: boolean; storageStatus: ProgressStorageStatus} {
  return mutateProgress((progress) => setLessonCompletion(progress, lessonId, true));
}

export function markLessonIncomplete(
  lessonId: string,
): {changed: boolean; storageStatus: ProgressStorageStatus} {
  return mutateProgress((progress) => setLessonCompletion(progress, lessonId, false));
}

export function resetLearningProgress(): ProgressStorageStatus {
  memoryFallback = emptyLearningProgress();
  const storage = browserStorage();
  let storageStatus: ProgressStorageStatus = 'unavailable';

  if (storage) {
    try {
      storage.removeItem(LEARNING_PROGRESS_STORAGE_KEY);
      storageStatus = 'available';
    } catch {
      storageStatus = 'unavailable';
    }
  }

  announceProgressChange();
  return storageStatus;
}
