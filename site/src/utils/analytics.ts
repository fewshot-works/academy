import type {TrackId} from '@site/src/data/curriculum';

type LearningEventName =
  | 'lesson_complete'
  | 'next_lesson_click'
  | 'continue_learning_click';

type LearningEventProperties = {
  track_id: TrackId;
  lesson_id: string;
  completion_method?: 'button' | 'next_lesson';
  destination_lesson_id?: string;
};

declare global {
  interface Window {
    gtag?: (command: 'event', eventName: string, properties?: Record<string, unknown>) => void;
  }
}

// Engagement telemetry contains stable curriculum IDs only. It never includes
// quiz answers, scores, learner text, email addresses, or the stored progress object.
export function trackLearningEvent(
  eventName: LearningEventName,
  properties: LearningEventProperties,
): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }

  try {
    window.gtag('event', eventName, properties);
  } catch {
    // Analytics must never interrupt learning or navigation.
  }
}
