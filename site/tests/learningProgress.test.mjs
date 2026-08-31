import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTrackProgress,
  emptyLearningProgress,
  findResumeLesson,
  hasLearningProgress,
  parseLearningProgress,
  setLessonCompletion,
  visitLesson,
} from '../src/utils/learningProgressCore.ts';
import {
  CURRICULUM_LESSONS,
  CURRICULUM_TRACKS,
  isFinalTrackLesson,
} from '../src/data/curriculum.ts';

const fixtureLessons = [
  {id: 'foundations:one', trackId: 'foundations'},
  {id: 'foundations:two', trackId: 'foundations'},
  {id: 'intermediate:one', trackId: 'intermediate'},
];

test('the curriculum registry uses unique stable IDs and routes', () => {
  assert.equal(CURRICULUM_LESSONS.length, 35);
  assert.equal(new Set(CURRICULUM_LESSONS.map((lesson) => lesson.id)).size, 35);
  assert.equal(new Set(CURRICULUM_LESSONS.map((lesson) => lesson.permalink)).size, 35);
  assert.deepEqual(
    CURRICULUM_TRACKS.map((track) => [track.id, track.lessons.length]),
    [
      ['foundations', 10],
      ['intermediate', 9],
      ['advanced', 8],
      ['mcp', 8],
    ],
  );
});

test('only the final capstone in each track receives manual completion', () => {
  const manualLessons = CURRICULUM_LESSONS.filter(isFinalTrackLesson);

  assert.deepEqual(
    manualLessons.map((lesson) => lesson.id),
    [
      'foundations:capstone',
      'intermediate:capstone',
      'advanced:capstone',
      'mcp:capstone',
    ],
  );
});

test('missing, malformed, and incompatible saved data starts safely', () => {
  assert.deepEqual(parseLearningProgress(null), emptyLearningProgress());
  assert.deepEqual(parseLearningProgress('{not json'), emptyLearningProgress());
  assert.deepEqual(
    parseLearningProgress(JSON.stringify({version: 2, completedLessonIds: []})),
    emptyLearningProgress(),
  );
});

test('valid saved data is normalized without losing stable IDs', () => {
  assert.deepEqual(
    parseLearningProgress(
      JSON.stringify({
        version: 1,
        completedLessonIds: ['foundations:one', 'foundations:one'],
        lastVisitedLessonId: 'foundations:two',
      }),
    ),
    {
      version: 1,
      completedLessonIds: ['foundations:one'],
      lastVisitedLessonId: 'foundations:two',
    },
  );
});

test('visiting saves a resume point without increasing completion', () => {
  const visited = visitLesson(emptyLearningProgress(), 'foundations:two');
  assert.equal(visited.lastVisitedLessonId, 'foundations:two');
  assert.equal(calculateTrackProgress(visited, fixtureLessons.slice(0, 2)).completed, 0);
  assert.equal(findResumeLesson(visited, fixtureLessons)?.id, 'foundations:two');
});

test('completion advances resume to the next unfinished lesson', () => {
  let progress = visitLesson(emptyLearningProgress(), 'foundations:one');
  progress = setLessonCompletion(progress, 'foundations:one', true);

  assert.equal(findResumeLesson(progress, fixtureLessons)?.id, 'foundations:two');
  assert.deepEqual(calculateTrackProgress(progress, fixtureLessons.slice(0, 2)), {
    completed: 1,
    total: 2,
    percentage: 50,
    isComplete: false,
  });
});

test('resume wraps to an earlier unfinished lesson and stops at full completion', () => {
  let progress = visitLesson(emptyLearningProgress(), 'intermediate:one');
  progress = setLessonCompletion(progress, 'intermediate:one', true);
  assert.equal(findResumeLesson(progress, fixtureLessons)?.id, 'foundations:one');

  for (const lesson of fixtureLessons) {
    progress = setLessonCompletion(progress, lesson.id, true);
  }
  assert.equal(findResumeLesson(progress, fixtureLessons), undefined);
});

test('unknown removed lessons are ignored and newly added lessons enter the total', () => {
  const stored = parseLearningProgress(
    JSON.stringify({
      version: 1,
      completedLessonIds: ['foundations:one', 'removed:lesson'],
      lastVisitedLessonId: 'removed:lesson',
    }),
  );
  const expandedLessons = [
    ...fixtureLessons.slice(0, 2),
    {id: 'foundations:new', trackId: 'foundations'},
  ];

  assert.equal(hasLearningProgress(stored, expandedLessons), true);
  assert.deepEqual(calculateTrackProgress(stored, expandedLessons), {
    completed: 1,
    total: 3,
    percentage: 33,
    isComplete: false,
  });
  assert.equal(findResumeLesson(stored, expandedLessons)?.id, 'foundations:two');
});
