import type {TrackId} from '../data/curriculum';

export const ANALYTICS_CONSENT_STORAGE_KEY = 'fewshot-academy:analytics-consent:v1';
export const ANALYTICS_SETTINGS_HASH = '#privacy-settings';

const GOOGLE_ANALYTICS_ID = 'G-51WGH2MZ08';
const GOOGLE_ANALYTICS_SCRIPT_ID = 'fewshot-academy-google-analytics';
const GOOGLE_ANALYTICS_DISABLE_KEY = `ga-disable-${GOOGLE_ANALYTICS_ID}`;

export type AnalyticsConsent = 'granted' | 'denied';
type Gtag = (...args: unknown[]) => void;
let memoryConsent: AnalyticsConsent | null = null;

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: Gtag;
    __fewShotAnalyticsInitialized?: boolean;
  }
}

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

export function readAnalyticsConsent(): AnalyticsConsent | null {
  const storage = browserStorage();
  if (!storage) {
    return memoryConsent;
  }

  const value = storage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
  return value === 'granted' || value === 'denied' ? value : memoryConsent;
}

export function saveAnalyticsConsent(consent: AnalyticsConsent): void {
  memoryConsent = consent;
  try {
    browserStorage()?.setItem(ANALYTICS_CONSENT_STORAGE_KEY, consent);
  } catch {
    // The in-memory choice still applies for this page when storage is unavailable.
  }
}

export function hasAnalyticsConsent(): boolean {
  return readAnalyticsConsent() === 'granted';
}

function isAcademyHost(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return window.location.hostname === 'fewshotacademy.com' || window.location.hostname.endsWith('.fewshotacademy.com');
}

function setGoogleAnalyticsDisabled(disabled: boolean): void {
  (window as unknown as Record<string, unknown>)[GOOGLE_ANALYTICS_DISABLE_KEY] = disabled;
}

function pageFields(pathname: string): Record<string, string> {
  return {
    page_path: pathname,
    page_location: `${window.location.origin}${pathname}`,
    page_title: document.title,
  };
}

function ensureGtag(): Gtag {
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = window.gtag ?? ((...args: unknown[]) => window.dataLayer?.push(args));
  return window.gtag;
}

export function initializeGoogleAnalytics(): void {
  if (!hasAnalyticsConsent() || !isAcademyHost()) {
    return;
  }

  const gtag = ensureGtag();
  setGoogleAnalyticsDisabled(false);

  if (window.__fewShotAnalyticsInitialized) {
    gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
    gtag('config', GOOGLE_ANALYTICS_ID, pageFields(window.location.pathname));
    return;
  }

  window.__fewShotAnalyticsInitialized = true;
  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  gtag('consent', 'update', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  gtag('js', new Date());
  gtag('config', GOOGLE_ANALYTICS_ID, pageFields(window.location.pathname));

  if (!document.getElementById(GOOGLE_ANALYTICS_SCRIPT_ID)) {
    const script = document.createElement('script');
    script.id = GOOGLE_ANALYTICS_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`;
    document.head.appendChild(script);
  }
}

function removeGoogleAnalyticsCookies(): void {
  const cookieNames = document.cookie
    .split(';')
    .map((cookie) => cookie.split('=')[0]?.trim())
    .filter((name) => name && /^(_ga|_gid|_gat)/.test(name));

  for (const name of cookieNames) {
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
    document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.${window.location.hostname}; SameSite=Lax`;
  }
}

export function disableGoogleAnalytics(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.gtag?.('consent', 'update', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  setGoogleAnalyticsDisabled(true);
  removeGoogleAnalyticsCookies();
}

export function trackAnalyticsPageView(pathname: string): void {
  if (!hasAnalyticsConsent() || !window.__fewShotAnalyticsInitialized || typeof window.gtag !== 'function') {
    return;
  }

  window.gtag('event', 'page_view', pageFields(pathname));
}

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
  if (
    typeof window === 'undefined' ||
    !hasAnalyticsConsent() ||
    typeof window.gtag !== 'function'
  ) {
    return;
  }

  try {
    window.gtag('event', eventName, sanitizeAnalyticsProperties(eventName, properties));
  } catch {
    // Analytics must never interrupt learning or navigation.
  }
}
