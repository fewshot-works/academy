import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: 'The chapter\'s history note credits a 2022 "ReAct" paper, a project called AutoGPT going viral in 2023, and Meta\'s "Toolformer." What did Toolformer show, per the chapter?',
    options: [
      'That agents require an entirely new kind of model architecture',
      'That a model could learn on its own when and how to call a tool',
      'That AutoGPT was based on flawed research',
      "That the ReAct pattern doesn't actually work in practice",
    ],
    correctIndex: 1,
    explanation: 'The chapter states this directly: Toolformer showed "a model could learn on its own when and how to call a tool."',
  },
  {
    question: 'The "Agents aren\'t magic" section says production systems add guardrails "for exactly this." What specific failure modes is it referring to?',
    options: [
      'The agent running too slowly for users to tolerate',
      "The agent calling the wrong tool, misreading a tool's result, or getting stuck looping without ever deciding it has enough",
      'The agent costing too much money per API call',
      'The agent refusing to use any tools at all',
    ],
    correctIndex: 1,
    explanation: "The chapter lists these exact failure modes right before mentioning production guardrails like loop limits and human-approval rules.",
  },
  {
    question: "In the chapter's Langflow bonus, the \"Simple Agent\" template needs no swapping, unlike Chapter 6's RAG template. Why?",
    options: [
      "Because Langflow doesn't support agents at all",
      'Because it already comes with a calculator tool and a URL-fetching tool wired straight into an Agent component',
      'Because agent templates never require an LLM to be configured',
      'Because the Simple Agent template has no chat interface',
    ],
    correctIndex: 1,
    explanation: 'The chapter notes this template "already comes with a calculator tool and a URL-fetching tool wired straight into an Agent component," unlike Chapter 6\'s template.',
  },
];
