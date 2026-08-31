import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ANALYTICS_CONSENT_STORAGE_KEY,
  disableGoogleAnalytics,
  initializeGoogleAnalytics,
  saveAnalyticsConsent,
  sanitizeAnalyticsProperties,
  trackEngagementEvent,
} from '../src/utils/analytics.ts';
import {
  classifyEngagementLink,
  getDocsContentId,
} from '../src/utils/analyticsLinks.ts';
import {CURRICULUM_TRACKS} from '../src/data/curriculum.ts';

const SITE_ORIGIN = 'https://fewshotacademy.com';

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
    clear: () => values.clear(),
    key: (index) => [...values.keys()][index] ?? null,
    get length() {
      return values.size;
    },
  };
}

test('the runtime allowlist removes unexpected and sensitive properties', () => {
  const properties = sanitizeAnalyticsProperties('quiz_submit', {
    content_id: 'ch1',
    score: 4,
    answer: 'learner text',
    email: 'learner@example.com',
  });

  assert.deepEqual(properties, {content_id: 'ch1'});
});

test('tracking requires consent, sends one sanitized GA4 event, and tolerates unavailable analytics', () => {
  const calls = [];
  const localStorage = memoryStorage();
  globalThis.window = {
    localStorage,
    gtag: (...args) => calls.push(args),
  };

  trackEngagementEvent('quiz_submit', {content_id: 'ch1'});
  assert.deepEqual(calls, []);

  localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, 'granted');
  trackEngagementEvent('lesson_complete', {
    track_id: 'foundations',
    lesson_id: 'foundations:ai',
    completion_method: 'next_lesson',
  });

  assert.deepEqual(calls, [
    [
      'event',
      'lesson_complete',
      {
        track_id: 'foundations',
        lesson_id: 'foundations:ai',
        completion_method: 'next_lesson',
      },
    ],
  ]);

  localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, 'denied');
  trackEngagementEvent('quiz_submit', {content_id: 'ch1'});
  assert.equal(calls.length, 1);

  delete globalThis.window.gtag;
  assert.doesNotThrow(() =>
    trackEngagementEvent('quiz_submit', {content_id: 'ch1'}),
  );
  delete globalThis.window;
});

test('Basic Consent Mode does not create a Google tag before permission', () => {
  const localStorage = memoryStorage();
  const appendedScripts = [];
  const document = {
    title: 'Privacy test',
    cookie: '',
    head: {appendChild: (script) => appendedScripts.push(script)},
    createElement: () => ({id: '', async: false, src: ''}),
    getElementById: () => null,
  };
  globalThis.window = {
    localStorage,
    location: {
      hostname: 'fewshotacademy.com',
      origin: 'https://fewshotacademy.com',
      pathname: '/docs/foundations',
    },
  };
  globalThis.document = document;

  initializeGoogleAnalytics();
  assert.equal(appendedScripts.length, 0);
  assert.equal(globalThis.window.gtag, undefined);

  saveAnalyticsConsent('granted');
  initializeGoogleAnalytics();
  assert.equal(appendedScripts.length, 1);
  assert.equal(appendedScripts[0].src, 'https://www.googletagmanager.com/gtag/js?id=G-51WGH2MZ08');
  assert.deepEqual(globalThis.window.dataLayer.slice(0, 2), [
    [
      'consent',
      'default',
      {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      },
    ],
    [
      'consent',
      'update',
      {
        analytics_storage: 'granted',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      },
    ],
  ]);

  saveAnalyticsConsent('denied');
  document.cookie = '_ga=client-id; _ga_51WGH2MZ08=session-id';
  disableGoogleAnalytics();
  assert.equal(globalThis.window['ga-disable-G-51WGH2MZ08'], true);
  assert.equal(globalThis.window.dataLayer.at(-1)[2].analytics_storage, 'denied');
  assert.match(document.cookie, /Max-Age=0/);

  delete globalThis.document;
  delete globalThis.window;
});

test('curriculum and reference docs receive stable content IDs', () => {
  assert.equal(
    getDocsContentId('/docs/foundations/what-is-ai/', CURRICULUM_TRACKS),
    'foundations:ai',
  );
  assert.equal(
    getDocsContentId(
      '/docs/advanced-concepts/agent-security',
      CURRICULUM_TRACKS,
    ),
    'docs:advanced-concepts:agent-security',
  );
  assert.equal(getDocsContentId('/career-tracks', CURRICULUM_TRACKS), undefined);
});

test('official lab links are classified without sending the URL', () => {
  const events = classifyEngagementLink({
    sourcePath: '/docs/intermediate/chunking-strategies',
    destinationHref:
      'https://github.com/fewshot-works/academy/tree/main/labs/intermediate/01-chunking-strategies?tab=readme',
    siteOrigin: SITE_ORIGIN,
    curriculumTracks: CURRICULUM_TRACKS,
  });

  assert.deepEqual(events, [
    {
      name: 'lab_link_click',
      properties: {
        content_id: 'intermediate:chunking',
        lab_id: 'intermediate:01-chunking-strategies',
      },
    },
  ]);
  assert.equal(JSON.stringify(events).includes('github.com'), false);
  assert.equal(JSON.stringify(events).includes('tab=readme'), false);
});

test('career links distinguish curriculum and interview journeys', () => {
  assert.deepEqual(
    classifyEngagementLink({
      sourcePath: '/career-tracks/applied-agentic-ai-engineer',
      destinationHref: '/docs/intermediate/your-first-agent?ref=career',
      siteOrigin: SITE_ORIGIN,
      curriculumTracks: CURRICULUM_TRACKS,
    }),
    [
      {
        name: 'career_to_curriculum_click',
        properties: {
          career_id: 'applied-agentic-ai-engineer',
          destination_id: 'intermediate:first-agent',
        },
      },
    ],
  );

  assert.deepEqual(
    classifyEngagementLink({
      sourcePath: '/career-tracks/applied-agentic-ai-engineer',
      destinationHref:
        '/interview-prep/case-studies/applied-agentic-ai-engineer',
      siteOrigin: SITE_ORIGIN,
      curriculumTracks: CURRICULUM_TRACKS,
    }),
    [
      {
        name: 'career_to_interview_click',
        properties: {
          career_id: 'applied-agentic-ai-engineer',
          destination_id:
            'interview:case_study:applied-agentic-ai-engineer',
          interview_stage: 'case_study',
        },
      },
    ],
  );
});

test('blog-to-lesson tracking uses post and destination IDs only', () => {
  const events = classifyEngagementLink({
    sourcePath: '/blog/mcp-goes-stateless',
    destinationHref: '/docs/mcp/mcp-security#authorization',
    siteOrigin: SITE_ORIGIN,
    curriculumTracks: CURRICULUM_TRACKS,
  });

  assert.deepEqual(events, [
    {
      name: 'blog_to_lesson_click',
      properties: {
        post_id: 'blog:mcp-goes-stateless',
        destination_id: 'mcp:security',
      },
    },
  ]);
  assert.equal(JSON.stringify(events).includes('authorization'), false);
});

test('unrelated, malformed, and external links do not create journey events', () => {
  assert.deepEqual(
    classifyEngagementLink({
      sourcePath: '/career-tracks',
      destinationHref: '/docs/foundations/setup',
      siteOrigin: SITE_ORIGIN,
      curriculumTracks: CURRICULUM_TRACKS,
    }),
    [],
  );
  assert.deepEqual(
    classifyEngagementLink({
      sourcePath: '/blog/archive',
      destinationHref: '/docs/foundations/setup',
      siteOrigin: SITE_ORIGIN,
      curriculumTracks: CURRICULUM_TRACKS,
    }),
    [],
  );
  assert.deepEqual(
    classifyEngagementLink({
      sourcePath: '/docs/foundations/setup',
      destinationHref: 'https://example.com/labs/fake',
      siteOrigin: SITE_ORIGIN,
      curriculumTracks: CURRICULUM_TRACKS,
    }),
    [],
  );
  assert.deepEqual(
    classifyEngagementLink({
      sourcePath: '/docs/foundations/setup',
      destinationHref: 'https://%',
      siteOrigin: SITE_ORIGIN,
      curriculumTracks: CURRICULUM_TRACKS,
    }),
    [],
  );
});
