import type {CurriculumTrack} from '../data/curriculum';
import type {AnalyticsEvent} from './analytics';

const CAREER_IDS = new Set([
  'forward-deployed-engineer',
  'applied-agentic-ai-engineer',
  'ai-solutions-architect-presales',
  'sre-reliability-engineer',
  'ai-product-manager',
]);

const INTERVIEW_STAGES = {
  'technical-round': 'technical',
  'case-studies': 'case_study',
  'behavioral-round': 'behavioral',
} as const;

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

function getCareerId(pathname: string): string | undefined {
  const match = normalizePath(pathname).match(/^\/career-tracks\/([^/]+)$/);
  const candidate = match?.[1];
  return candidate && CAREER_IDS.has(candidate) ? candidate : undefined;
}

function getPostId(pathname: string): string | undefined {
  const match = normalizePath(pathname).match(/^\/blog\/([^/]+)$/);
  const slug = match?.[1];
  if (!slug || slug === 'archive' || slug === 'tags') {
    return undefined;
  }
  return `blog:${slug}`;
}

export function getDocsContentId(
  pathname: string,
  curriculumTracks: CurriculumTrack[],
): string | undefined {
  const normalized = normalizePath(pathname);
  const lesson = curriculumTracks
    .flatMap((track) => track.lessons)
    .find((item) => item.permalink === normalized);
  if (lesson) {
    return lesson.id;
  }

  const overview = curriculumTracks.find(
    (track) => track.overviewPermalink === normalized,
  );
  if (overview) {
    return `${overview.id}:overview`;
  }

  const match = normalized.match(/^\/docs\/([^?#]+)$/);
  if (!match) {
    return undefined;
  }
  return `docs:${match[1].replaceAll('/', ':')}`;
}

function getOfficialLabId(destination: URL): string | undefined {
  if (destination.hostname !== 'github.com') {
    return undefined;
  }

  const match = destination.pathname.match(
    /^\/fewshot-works\/academy\/(?:tree|blob)\/main\/labs(?:\/([^?#]+))?$/,
  );
  if (!match) {
    return undefined;
  }

  return match[1] ? match[1].replaceAll('/', ':') : 'all-labs';
}

function getInterviewDestination(pathname: string):
  | {destinationId: string; stage: 'technical' | 'case_study' | 'behavioral'}
  | undefined {
  const match = normalizePath(pathname).match(
    /^\/interview-prep\/([^/]+)\/([^/]+)$/,
  );
  if (!match) {
    return undefined;
  }

  const stage = INTERVIEW_STAGES[match[1] as keyof typeof INTERVIEW_STAGES];
  const careerId = match[2];
  if (!stage || !CAREER_IDS.has(careerId)) {
    return undefined;
  }

  return {
    destinationId: `interview:${stage}:${careerId}`,
    stage,
  };
}

export function classifyEngagementLink({
  sourcePath,
  destinationHref,
  siteOrigin,
  curriculumTracks,
}: {
  sourcePath: string;
  destinationHref: string;
  siteOrigin: string;
  curriculumTracks: CurriculumTrack[];
}): AnalyticsEvent[] {
  let destination: URL;
  try {
    destination = new URL(destinationHref, siteOrigin);
  } catch {
    return [];
  }

  const events: AnalyticsEvent[] = [];
  const sourceContentId = getDocsContentId(sourcePath, curriculumTracks);
  const labId = getOfficialLabId(destination);

  if (sourceContentId && labId) {
    events.push({
      name: 'lab_link_click',
      properties: {content_id: sourceContentId, lab_id: labId},
    });
  }

  if (destination.origin !== siteOrigin) {
    return events;
  }

  const careerId = getCareerId(sourcePath);
  const destinationContentId = getDocsContentId(
    destination.pathname,
    curriculumTracks,
  );
  if (careerId && destinationContentId) {
    events.push({
      name: 'career_to_curriculum_click',
      properties: {
        career_id: careerId,
        destination_id: destinationContentId,
      },
    });
  }

  const interviewDestination = getInterviewDestination(destination.pathname);
  if (careerId && interviewDestination) {
    events.push({
      name: 'career_to_interview_click',
      properties: {
        career_id: careerId,
        destination_id: interviewDestination.destinationId,
        interview_stage: interviewDestination.stage,
      },
    });
  }

  const postId = getPostId(sourcePath);
  if (postId && destinationContentId) {
    events.push({
      name: 'blog_to_lesson_click',
      properties: {
        post_id: postId,
        destination_id: destinationContentId,
      },
    });
  }

  return events;
}
