export const TRACK_IDS = ['foundations', 'intermediate', 'advanced', 'mcp'] as const;

export type TrackId = (typeof TRACK_IDS)[number];

export type CurriculumLesson = {
  id: string;
  title: string;
  permalink: string;
  trackId: TrackId;
};

export type CurriculumTrack = {
  id: TrackId;
  title: string;
  overviewPermalink: string;
  lessons: CurriculumLesson[];
};

type LessonInput = Omit<CurriculumLesson, 'trackId'>;

function track(
  id: TrackId,
  title: string,
  overviewPermalink: string,
  lessons: LessonInput[],
): CurriculumTrack {
  return {
    id,
    title,
    overviewPermalink,
    lessons: lessons.map((lesson) => ({...lesson, trackId: id})),
  };
}

// Stable lesson IDs deliberately do not mirror file names or URLs. A title,
// source file, or route can change without invalidating saved completion.
export const CURRICULUM_TRACKS: CurriculumTrack[] = [
  track('foundations', 'Foundations', '/docs/foundations/overview', [
    {
      id: 'foundations:setup',
      title: 'Chapter 0: Set Up Your Machine',
      permalink: '/docs/foundations/setup',
    },
    {
      id: 'foundations:ai',
      title: 'Chapter 1: What Is AI, Really?',
      permalink: '/docs/foundations/what-is-ai',
    },
    {
      id: 'foundations:llm',
      title: 'Chapter 2: What Is a Large Language Model?',
      permalink: '/docs/foundations/what-is-an-llm',
    },
    {
      id: 'foundations:responsible-ai',
      title: 'Bonus: Using AI Responsibly',
      permalink: '/docs/foundations/02b-responsible-ai-use',
    },
    {
      id: 'foundations:prompting',
      title: 'Chapter 3: Prompting 101',
      permalink: '/docs/foundations/prompting-101',
    },
    {
      id: 'foundations:embeddings',
      title: 'Chapter 4: What Is an Embedding?',
      permalink: '/docs/foundations/what-is-an-embedding',
    },
    {
      id: 'foundations:vector-databases',
      title: 'Chapter 5: What Is a Vector Database, and Why?',
      permalink: '/docs/foundations/what-is-a-vector-database',
    },
    {
      id: 'foundations:rag',
      title: 'Chapter 6: What Is RAG?',
      permalink: '/docs/foundations/what-is-rag',
    },
    {
      id: 'foundations:agents',
      title: 'Chapter 7: What Is an AI Agent?',
      permalink: '/docs/foundations/what-is-an-ai-agent',
    },
    {
      id: 'foundations:capstone',
      title: 'Chapter 8: Capstone: A Q&A Bot Over Your Own Documents',
      permalink: '/docs/foundations/capstone-qa-bot',
    },
  ]),
  track('intermediate', 'Intermediate', '/docs/intermediate/overview', [
    {
      id: 'intermediate:chunking',
      title: 'Chapter 1: Chunking Strategies',
      permalink: '/docs/intermediate/chunking-strategies',
    },
    {
      id: 'intermediate:embedding-models',
      title: 'Chapter 2: Choosing an Embedding Model',
      permalink: '/docs/intermediate/choosing-embedding-model',
    },
    {
      id: 'intermediate:retrieval',
      title: 'Chapter 3: Better Retrieval',
      permalink: '/docs/intermediate/better-retrieval',
    },
    {
      id: 'intermediate:prompt-patterns',
      title: 'Chapter 4: Prompt Patterns',
      permalink: '/docs/intermediate/prompt-patterns',
    },
    {
      id: 'intermediate:tool-use',
      title: 'Chapter 5: Tool Use',
      permalink: '/docs/intermediate/tool-use',
    },
    {
      id: 'intermediate:first-agent',
      title: 'Chapter 6: Your First Agent',
      permalink: '/docs/intermediate/your-first-agent',
    },
    {
      id: 'intermediate:memory',
      title: 'Chapter 7: Memory',
      permalink: '/docs/intermediate/memory',
    },
    {
      id: 'intermediate:evaluation',
      title: 'Chapter 8: Evaluating What You Built',
      permalink: '/docs/intermediate/evaluating',
    },
    {
      id: 'intermediate:capstone',
      title: 'Chapter 9: Capstone: Multi-Tool Agent',
      permalink: '/docs/intermediate/capstone',
    },
  ]),
  track('advanced', 'Advanced', '/docs/advanced/overview', [
    {
      id: 'advanced:multi-agent',
      title: 'Chapter 1: Multi-Agent Patterns',
      permalink: '/docs/advanced/multi-agent-patterns',
    },
    {
      id: 'advanced:rag',
      title: 'Chapter 2: Advanced RAG',
      permalink: '/docs/advanced/advanced-rag',
    },
    {
      id: 'advanced:fine-tuning',
      title: 'Chapter 3: Fine-tuning vs. RAG vs. Prompting',
      permalink: '/docs/advanced/fine-tuning-vs-rag-vs-prompting',
    },
    {
      id: 'advanced:guardrails',
      title: 'Chapter 4: Guardrails and Safety',
      permalink: '/docs/advanced/guardrails-and-safety',
    },
    {
      id: 'advanced:observability',
      title: 'Chapter 5: Observability',
      permalink: '/docs/advanced/observability',
    },
    {
      id: 'advanced:production',
      title: 'Chapter 6: Production Concerns',
      permalink: '/docs/advanced/production-concerns',
    },
    {
      id: 'advanced:shipping',
      title: 'Chapter 7: Shipping It',
      permalink: '/docs/advanced/shipping-it',
    },
    {
      id: 'advanced:capstone',
      title: 'Chapter 8: Capstone: A Guarded, Traced, Evaluated Agent',
      permalink: '/docs/advanced/capstone',
    },
  ]),
  track('mcp', 'MCP', '/docs/mcp/overview', [
    {
      id: 'mcp:introduction',
      title: 'Chapter 1: What Is MCP',
      permalink: '/docs/mcp/what-is-mcp',
    },
    {
      id: 'mcp:first-server',
      title: 'Chapter 2: Building Your Own MCP Server',
      permalink: '/docs/mcp/building-your-own-mcp-server',
    },
    {
      id: 'mcp:many-servers',
      title: 'Chapter 3: One Agent, Many Servers',
      permalink: '/docs/mcp/one-agent-many-servers',
    },
    {
      id: 'mcp:transports',
      title: 'Chapter 4: Transports and Deployment',
      permalink: '/docs/mcp/transports-and-deployment',
    },
    {
      id: 'mcp:primitives',
      title: 'Chapter 5: Resources, Prompts and Sampling',
      permalink: '/docs/mcp/resources-prompts-sampling',
    },
    {
      id: 'mcp:security',
      title: 'Chapter 6: MCP Security',
      permalink: '/docs/mcp/mcp-security',
    },
    {
      id: 'mcp:a2a',
      title: 'Chapter 7: Beyond MCP: Agent2Agent (A2A)',
      permalink: '/docs/mcp/a2a',
    },
    {
      id: 'mcp:capstone',
      title: 'Chapter 8: Capstone',
      permalink: '/docs/mcp/capstone',
    },
  ]),
];

export const CURRICULUM_LESSONS = CURRICULUM_TRACKS.flatMap((item) => item.lessons);

export function findLessonById(id: string | null | undefined): CurriculumLesson | undefined {
  return id ? CURRICULUM_LESSONS.find((lesson) => lesson.id === id) : undefined;
}

export function findLessonByPermalink(
  permalink: string | null | undefined,
): CurriculumLesson | undefined {
  return permalink
    ? CURRICULUM_LESSONS.find((lesson) => lesson.permalink === permalink)
    : undefined;
}

export function findTrackById(id: TrackId): CurriculumTrack {
  const result = CURRICULUM_TRACKS.find((item) => item.id === id);
  if (!result) {
    throw new Error(`Unknown curriculum track: ${id}`);
  }
  return result;
}
