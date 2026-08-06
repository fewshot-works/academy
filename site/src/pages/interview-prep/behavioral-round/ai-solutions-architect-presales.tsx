import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Heading from '@theme/Heading';

import {PageHeader, Section, StepList, Dialogue, SubNav, styles, type Step, type Turn} from '../_shared';

const TITLE = 'The Behavioral Round';

const META_DESCRIPTION =
  'What the behavioral round for an AI Solutions Architect / Presales role actually probes — objection handling, value anchoring, and navigating a deal team — with four sample interviewer questions and how to structure an answer.';

const ONE_LINER =
  'Sometimes run as a straight Q&A, sometimes as a live mock customer call with the interviewer playing a ' +
  'skeptical buyer. Either way it isn’t testing whether you can recite an objection-handling framework — it’s ' +
  'testing whether you stay useful to the deal when a customer pushes back, a stakeholder disagrees with you, or ' +
  'your own account team wants something you can’t honestly promise.';

type BehavioralQuestion = {
  theme: string;
  turns: Turn[];
  guidance: string[];
};

const QUESTIONS: BehavioralQuestion[] = [
  {
    theme: 'Objection handling on price or ROI',
    turns: [
      {
        speaker: 'interviewer',
        text: '“Tell me about a time a customer pushed back hard on cost or ROI, right when a deal seemed to be going well.”',
      },
      {
        speaker: 'candidate',
        text: '“Do you want the moment-by-moment of the call itself, or more how I followed up afterward to actually close the gap?”',
      },
      {
        speaker: 'interviewer',
        text: '“Both, but start with the call — I want to hear how you handled it live.”',
      },
    ],
    guidance: [
      'Self-prompt before answering: did you actually address the underlying concern, or did you just restate the value prop louder? The gap between those two is the whole answer.',
      'Structure it as: what the objection actually was underneath the stated one (cost objections are often a disguised risk or trust objection), what you said live, and what changed after — including if the deal still slipped.',
      'Asking a scoping question first, like the candidate did above, is a legitimate move — it signals you separate the live moment from the follow-through, which is exactly what this round is probing for.',
    ],
  },
  {
    theme: 'Saying “our product doesn’t do that”',
    turns: [
      {
        speaker: 'interviewer',
        text: '“Tell me about a time a customer asked for something you knew the product genuinely couldn’t do. What did you do?”',
      },
      {
        speaker: 'candidate',
        text: '“Sure — this one’s from a PoC where the customer wanted an integration we hadn’t built yet.”',
      },
    ],
    guidance: [
      'The instinct to over-promise in the room is real and the interviewer knows it — the strongest answers name that temptation explicitly and explain why you didn’t give in to it.',
      'A good answer separates “can’t do it at all” from “can’t do it yet” and shows you gave the customer an honest, specific version of whichever one was true, instead of a vague deflection.',
      'End with what you did instead — a workaround, a roadmap conversation, or an honest no — not just the moment you said it.',
    ],
  },
  {
    theme: 'Pushing back on your own account team',
    turns: [
      {
        speaker: 'interviewer',
        text: '“Tell me about a time an AE or account exec wanted to promise something technical you weren’t comfortable committing to.”',
      },
      {
        speaker: 'candidate',
        text: '“Should I focus on how I resolved it with the AE directly, or more on how I handled it in front of the customer?”',
      },
      {
        speaker: 'interviewer',
        text: '“I care most about whether the relationship with the AE survived it.”',
      },
    ],
    guidance: [
      'This theme is the one candidates most often answer with pure conflict — resist that. The interviewer wants to see you name the AE’s incentive explicitly (a quarter to close, a number to hit) rather than treat them as simply wrong.',
      'A strong close explains how you got to a version of the commitment you could actually stand behind technically, and how you kept the AE as an ally afterward rather than someone who now routes around you.',
      'If your story ends with “I told the AE no” and nothing else, it’s incomplete — the actual skill being tested is what you offered instead.',
    ],
  },
  {
    theme: 'Navigating security, legal, and procurement at once',
    turns: [
      {
        speaker: 'interviewer',
        text: '“Tell me about a deal where security, legal, and the business sponsor all wanted different things from you at the same time.”',
      },
    ],
    guidance: [
      'Prompt yourself with the actual test here: can you name what each party actually cared about — security wanted zero data-residency risk, legal wanted a specific contract clause, the sponsor wanted the deal to close this quarter — or does your story flatten them into one generic “they had concerns”?',
      'Good answers show you translating between these parties rather than picking a side — explaining the security constraint to the sponsor in business terms, or explaining the sponsor’s timeline pressure to security without asking them to compromise on the requirement itself.',
      'If the story doesn’t have a concrete resolution — what actually got agreed to, not just “we worked it out” — swap it for one that does before the interview.',
    ],
  },
];

const STORY_BANK_STEPS: Step[] = [
  {
    title: 'A hard price or ROI objection on a live call',
    body: 'What the objection really was underneath the stated one, what you said in the room, and what changed afterward — not just “we addressed their concerns.”',
  },
  {
    title: 'A time you told a customer the product couldn’t do something',
    body: 'Whether it was a “can’t” or a “not yet,” what you offered instead, and how the relationship held up.',
  },
  {
    title: 'A time you pushed back on your own AE or account team',
    body: 'The commitment you weren’t comfortable with, what you proposed instead, and how you kept the internal relationship intact.',
  },
  {
    title: 'A PoC or demo that failed in front of the customer',
    body: 'What broke, how you handled it live, and what you changed in how you prep demos afterward.',
  },
  {
    title: 'Conflicting requirements from security, legal, and the business sponsor',
    body: 'Naming each party’s actual incentive explicitly, and what got agreed to in the end.',
  },
  {
    title: 'A deal you walked away from, or recommended walking away from',
    body: 'What made it the wrong fit, and how you communicated that internally without just killing the deal unilaterally.',
  },
  {
    title: 'A technical mistake you caught in your own proposal before the customer did',
    body: 'What tipped you off, and what you changed afterward so it wouldn’t depend on catching it by chance next time.',
  },
  {
    title: 'A first 30/60/90 day plan with a new account team',
    body: 'Useful even without a matching past story — some interviewers ask this one prospectively rather than as a “tell me about a time.”',
  },
];

function QuestionBlock({question}: {question: BehavioralQuestion}): ReactNode {
  return (
    <div className={styles.caseStudy}>
      <p className={styles.caseStudyEyebrow}>{question.theme}</p>
      <Dialogue turns={question.turns} />
      <Heading as="h4" className={styles.stepTitle} style={{marginTop: '1.25rem'}}>
        How to think about this one
      </Heading>
      <ul className={styles.guidanceList}>
        {question.guidance.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}

export default function BehavioralRound(): ReactNode {
  return (
    <Layout title={TITLE} description={META_DESCRIPTION}>
      <Head>
        <meta
          name="keywords"
          content="AI solutions architect behavioral interview, AI presales interview prep"
        />
      </Head>
      <main className={styles.page}>
        <div className="container">
          <PageHeader
            title={TITLE}
            oneLiner={ONE_LINER}
            meta={['45–60 minutes', 'Sometimes a mock customer call, sometimes straight Q&A']}
            backTo="/career-tracks/ai-solutions-architect-presales"
            backLabel="AI Solutions Architect / Presales"
          />

          <Section title="What to expect">
            <p>
              Format varies more here than in the other two rounds — some companies run a straight
              question-and-answer session, others put the interviewer in the seat of a skeptical customer and run
              a live mock call. The four themes that come up across sources: objection handling, being honest
              about product gaps, pushing back on your own account team, and navigating a deal team with competing
              incentives.
            </p>
            <p className={styles.aside}>
              If it’s run as a mock call, the interviewer is grading composure and value-anchoring under real-time
              pressure, not a rehearsed script — a slightly imperfect but genuine response reads better than a
              smooth one that sounds memorized.
            </p>
          </Section>

          <Section title="Four sample questions, and how to work through them">
            <p>
              Each one below shows how the question actually gets asked, then breaks down what it’s really
              probing and how to structure an answer — including, where it’s a legitimate move, how to ask a quick
              scoping question before you launch in.
            </p>
            {QUESTIONS.map((q) => (
              <QuestionBlock key={q.theme} question={q} />
            ))}
          </Section>

          <Section title="Build your story bank before the interview, not during it">
            <p>
              Trying to invent a good answer live is the single most common way this round goes worse than it
              needed to. Prepare six to eight stories in advance, each boiled down to sixty to ninety seconds, and
              you’ll have raw material for nearly any question this round throws at you:
            </p>
            <StepList items={STORY_BANK_STEPS} />
            <div className={styles.insightBox}>
              <p>
                <strong>Say “I,” not “the deal team.”</strong> The most common note interviewers give on an
                otherwise good behavioral answer: it described what the account team did, not what the candidate
                specifically said or proposed. Name your own action, even inside a team effort — that’s the actual
                signal this round is trying to extract.
              </p>
            </div>
          </Section>

          <Section title="If it turns into a live mock call">
            <p>
              Treat the interviewer’s objection as genuine rather than a test to be defeated — the goal isn’t to
              win the argument, it’s to demonstrate the same discovery instinct from the case-study round: ask
              what’s actually behind the pushback before responding to the surface version of it. Anchoring back
              to a concrete value point the customer already agreed to earlier in the call — “you mentioned the
              twenty minutes your team loses per ticket today” — tends to land better than introducing a new
              argument from scratch.
            </p>
          </Section>

          <SubNav
            prev={{label: 'Back: the case-study round', to: '/interview-prep/case-studies/ai-solutions-architect-presales'}}
            next={{label: 'Back to the overview', to: '/career-tracks/ai-solutions-architect-presales'}}
          />
        </div>
      </main>
    </Layout>
  );
}
