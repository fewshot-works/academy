import test from 'node:test';
import assert from 'node:assert/strict';
import {
  sanitizeAnalyticsProperties,
  trackEngagementEvent,
} from '../src/utils/analytics.ts';
import {
  classifyEngagementLink,
  getDocsContentId,
} from '../src/utils/analyticsLinks.ts';
import {CURRICULUM_TRACKS} from '../src/data/curriculum.ts';

const SITE_ORIGIN = 'https://fewshotacademy.com';

test('the runtime allowlist removes unexpected and sensitive properties', () => {
  const properties = sanitizeAnalyticsProperties('quiz_submit', {
    content_id: 'ch1',
    score: 4,
    answer: 'learner text',
    email: 'learner@example.com',
  });

  assert.deepEqual(properties, {content_id: 'ch1'});
});

test('tracking sends one sanitized GA4 event and tolerates unavailable analytics', () => {
  const calls = [];
  globalThis.window = {
    gtag: (...args) => calls.push(args),
  };

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

  delete globalThis.window.gtag;
  assert.doesNotThrow(() =>
    trackEngagementEvent('quiz_submit', {content_id: 'ch1'}),
  );
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
