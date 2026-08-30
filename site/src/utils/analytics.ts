import type {TrackId} from '../data/curriculum';

export type AnalyticsEventProperties = {
  course_start: {
    track_id: TrackId;
    source_surface: 'homepage' | 'track_overview';
  };
  lesson_complete: {
    track_id: TrackId;
    lesson_id: string;
    completion_method: 'button' | 'next_lesson';
  };
  next_lesson_click: {
    track_id: TrackId;
    lesson_id: string;
    destination_lesson_id?: string;
  };
  quiz_submit: {
    content_id: string;
  };
  lab_link_click: {
    content_id: string;
    lab_id: string;
  };
  continue_learning_click: {
    track_id: TrackId;
    lesson_id: string;
  };
  career_to_curriculum_click: {
    career_id: string;
    destination_id: string;
  };
  career_to_interview_click: {
    career_id: string;
    destination_id: string;
    interview_stage: 'technical' | 'case_study' | 'behavioral';
  };
  blog_to_lesson_click: {
    post_id: string;
    destination_id: string;
  };
  subscribe_click: {
    source_surface: 'homepage' | 'blog' | 'footer';
  };
  subscribe_success: {
    source_surface: 'homepage' | 'blog' | 'footer';
  };
};

export type AnalyticsEventName = keyof AnalyticsEventProperties;

export type AnalyticsEvent = {
  [Name in AnalyticsEventName]: {
    name: Name;
    properties: AnalyticsEventProperties[Name];
  };
}[AnalyticsEventName];

type AnalyticsValue = string | number | boolean;

const PROPERTY_ALLOWLIST = {
  course_start: ['track_id', 'source_surface'],
  lesson_complete: ['track_id', 'lesson_id', 'completion_method'],
  next_lesson_click: ['track_id', 'lesson_id', 'destination_lesson_id'],
  quiz_submit: ['content_id'],
  lab_link_click: ['content_id', 'lab_id'],
  continue_learning_click: ['track_id', 'lesson_id'],
  career_to_curriculum_click: ['career_id', 'destination_id'],
  career_to_interview_click: ['career_id', 'destination_id', 'interview_stage'],
  blog_to_lesson_click: ['post_id', 'destination_id'],
  subscribe_click: ['source_surface'],
  subscribe_success: ['source_surface'],
} as const satisfies {
  [Name in AnalyticsEventName]: readonly (keyof AnalyticsEventProperties[Name])[];
};

declare global {
  interface Window {
    gtag?: (command: 'event', eventName: string, properties?: Record<string, unknown>) => void;
  }
}

function isAnalyticsValue(value: unknown): value is AnalyticsValue {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
}

// Keep this runtime allowlist even though callers are type-checked. It prevents
// a future JavaScript caller or unsafe cast from leaking free-form values to GA4.
export function sanitizeAnalyticsProperties<Name extends AnalyticsEventName>(
  eventName: Name,
  properties: AnalyticsEventProperties[Name],
): Record<string, AnalyticsValue> {
  const input = properties as Record<string, unknown>;
  const sanitized: Record<string, AnalyticsValue> = {};

  for (const key of PROPERTY_ALLOWLIST[eventName]) {
    const value = input[key];
    if (isAnalyticsValue(value)) {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

// Events contain only stable, allowlisted IDs and categories. They never
// include quiz answers or scores, learner text, email addresses, URLs, query
// strings, or the locally stored progress object.
export function trackEngagementEvent<Name extends AnalyticsEventName>(
  eventName: Name,
  properties: AnalyticsEventProperties[Name],
): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }

  try {
    window.gtag('event', eventName, sanitizeAnalyticsProperties(eventName, properties));
  } catch {
    // Analytics must never interrupt learning or navigation.
  }
}
