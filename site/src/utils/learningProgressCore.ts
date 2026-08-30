export const LEARNING_PROGRESS_SCHEMA_VERSION = 1 as const;

export type LearningProgress = {
  version: typeof LEARNING_PROGRESS_SCHEMA_VERSION;
  completedLessonIds: string[];
  lastVisitedLessonId: string | null;
};

export type ProgressLesson = {
  id: string;
  trackId: string;
};

export function emptyLearningProgress(): LearningProgress {
  return {
    version: LEARNING_PROGRESS_SCHEMA_VERSION,
    completedLessonIds: [],
    lastVisitedLessonId: null,
  };
}

export function parseLearningProgress(serialized: string | null): LearningProgress {
  if (!serialized) {
    return emptyLearningProgress();
  }

  try {
    const value: unknown = JSON.parse(serialized);
    if (!value || typeof value !== 'object') {
      return emptyLearningProgress();
    }

    const candidate = value as Record<string, unknown>;
    if (
      candidate.version !== LEARNING_PROGRESS_SCHEMA_VERSION ||
      !Array.isArray(candidate.completedLessonIds) ||
      !candidate.completedLessonIds.every((id) => typeof id === 'string') ||
      !(
        candidate.lastVisitedLessonId === null ||
        typeof candidate.lastVisitedLessonId === 'string'
      )
    ) {
      return emptyLearningProgress();
    }

    return {
      version: LEARNING_PROGRESS_SCHEMA_VERSION,
      completedLessonIds: [...new Set(candidate.completedLessonIds)],
      lastVisitedLessonId: candidate.lastVisitedLessonId,
    };
  } catch {
    return emptyLearningProgress();
  }
}

export function visitLesson(progress: LearningProgress, lessonId: string): LearningProgress {
  if (progress.lastVisitedLessonId === lessonId) {
    return progress;
  }
  return {...progress, lastVisitedLessonId: lessonId};
}

export function setLessonCompletion(
  progress: LearningProgress,
  lessonId: string,
  completed: boolean,
): LearningProgress {
  const completedIds = new Set(progress.completedLessonIds);
  const wasCompleted = completedIds.has(lessonId);
  if (wasCompleted === completed) {
    return progress;
  }

  if (completed) {
    completedIds.add(lessonId);
  } else {
    completedIds.delete(lessonId);
  }

  return {...progress, completedLessonIds: [...completedIds]};
}

export function recognizedCompletedLessonIds(
  progress: LearningProgress,
  lessons: ProgressLesson[],
): Set<string> {
  const knownIds = new Set(lessons.map((lesson) => lesson.id));
  return new Set(progress.completedLessonIds.filter((id) => knownIds.has(id)));
}

export function hasLearningProgress(
  progress: LearningProgress,
  lessons: ProgressLesson[],
): boolean {
  const knownIds = new Set(lessons.map((lesson) => lesson.id));
  return (
    progress.completedLessonIds.some((id) => knownIds.has(id)) ||
    (progress.lastVisitedLessonId !== null && knownIds.has(progress.lastVisitedLessonId))
  );
}

export function findResumeLesson<T extends ProgressLesson>(
  progress: LearningProgress,
  lessons: T[],
): T | undefined {
  if (!hasLearningProgress(progress, lessons)) {
    return undefined;
  }

  const completedIds = recognizedCompletedLessonIds(progress, lessons);
  const lastVisitedIndex = lessons.findIndex(
    (lesson) => lesson.id === progress.lastVisitedLessonId,
  );

  if (lastVisitedIndex >= 0 && !completedIds.has(lessons[lastVisitedIndex].id)) {
    return lessons[lastVisitedIndex];
  }

  const searchStart = lastVisitedIndex >= 0 ? lastVisitedIndex + 1 : 0;
  for (let offset = 0; offset < lessons.length; offset += 1) {
    const lesson = lessons[(searchStart + offset) % lessons.length];
    if (!completedIds.has(lesson.id)) {
      return lesson;
    }
  }

  return undefined;
}

export function calculateTrackProgress(
  progress: LearningProgress,
  lessons: ProgressLesson[],
): {completed: number; total: number; percentage: number; isComplete: boolean} {
  const completed = recognizedCompletedLessonIds(progress, lessons).size;
  const total = lessons.length;
  return {
    completed,
    total,
    percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
    isComplete: total > 0 && completed === total,
  };
}
