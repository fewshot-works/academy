import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Heading from '@theme/Heading';

import {PageHeader, Section, StepList, Dialogue, SubNav, styles, type Step, type Turn} from './_shared';

const TITLE = 'The Behavioral Round';

const META_DESCRIPTION =
  'What the FDE behavioral round actually probes, four sample interviewer questions with guidance on structuring your answer, and how to build a reusable story bank before you walk in.';

const ONE_LINER =
  'The lightest-touch round of the loop, and the one candidates most often under-prepare for because it feels ' +
  'like “just talking.” It isn’t testing whether you have good stories — everyone does — it’s testing whether ' +
  'you can tell them with your own specific contribution front and center, under a little bit of follow-up ' +
  'pressure.';

type BehavioralQuestion = {
  theme: string;
  turns: Turn[];
  guidance: string[];
};

const QUESTIONS: BehavioralQuestion[] = [
  {
    theme: 'Client ownership',
    turns: [
      {
        speaker: 'interviewer',
        text: '“Tell me about a time a customer asked for something you knew wasn’t the right call. What did you do?”',
      },
      {
        speaker: 'candidate',
        text: '“Do you want me to focus on a technical disagreement specifically, or is a process or scope disagreement also useful here?”',
      },
      {
        speaker: 'interviewer',
        text: '“Either works — I’m more interested in how you handled the conversation than the specific topic.”',
      },
    ],
    guidance: [
      'Self-prompt before answering: what did you actually do differently from just complying or just refusing? That gap is the whole answer.',
      'Structure it as: the ask, why it concerned you, the specific alternative you proposed and how you framed it for a non-technical stakeholder, and what actually happened — including if they still said no and you built it anyway.',
      'Asking a scoping question first, like the candidate did above, is a legitimate move here — it shows you clarify before you launch into a story, the same instinct the case-study round is testing for.',
    ],
  },
  {
    theme: 'Accountability under repeat failure',
    turns: [
      {
        speaker: 'interviewer',
        text: '“Tell me about a deployment that went badly — not a small bug, something that really didn’t work.”',
      },
      {
        speaker: 'candidate',
        text: '“Sure — this one’s from a production integration that failed silently for a few days before we caught it.”',
      },
    ],
    guidance: [
      'The word “repeat” in this theme is deliberate — interviewers are listening for whether you’d still be standing (and still trusted) after the second or third failure with the same customer, not just the first.',
      'Lead with what broke and how you found out, spend the least time on the technical root cause, and the most time on what you told the customer, when, and what changed in your own process afterward.',
      'Avoid a story that ends at “and we fixed it.” The strongest version ends at “and here’s what I changed so it structurally couldn’t happen the same way twice.”',
    ],
  },
  {
    theme: 'Communicating technically to non-technical stakeholders',
    turns: [
      {
        speaker: 'interviewer',
        text: '“Walk me through a time you had to explain a technical limitation to someone without a technical background — and it actually landed.”',
      },
    ],
    guidance: [
      'Prompt yourself with the actual test here: can you repeat the explanation you gave, in the room, using the same plain words — not a cleaned-up version you’d only ever say to another engineer?',
      'Good answers name the stakeholder’s actual incentive (a deadline, a budget, a board update) and connect the technical limitation to that incentive directly, instead of explaining the technology for its own sake.',
      'If the story doesn’t have a real business consequence attached, it’s not this story — swap it for one that does before the interview, not during it.',
    ],
  },
  {
    theme: 'Navigating internal client politics',
    turns: [
      {
        speaker: 'interviewer',
        text: '“Tell me about a time IT, security, and the business sponsor on the client side all wanted different things from you at once.”',
      },
      {
        speaker: 'candidate',
        text: '“Should I focus on how I resolved the immediate conflict, or more on how I kept all three relationships intact afterward?”',
      },
      {
        speaker: 'interviewer',
        text: '“Both, if you can — but I care more about the relationships surviving it.”',
      },
    ],
    guidance: [
      'This theme is the one candidates most often answer with a purely technical resolution — resist that. The interviewer wants to see you name the competing incentives explicitly (security wants zero risk, the sponsor wants a launch date, IT wants to not own new maintenance) rather than pretend the tension wasn’t political.',
      'A strong close names what you did to keep the losing side of the decision on your side afterward — that’s the actual FDE skill being probed, not conflict resolution in the abstract.',
    ],
  },
];

const STORY_BANK_STEPS: Step[] = [
  {
    title: 'A deployment or delivery that went badly',
    body: 'What broke, how you found out, what you told the customer, and what changed in your process afterward — not just “we fixed it.”',
  },
  {
    title: 'A time you disagreed with a customer’s technical decision',
    body: 'The alternative you proposed, how you framed it for a non-technical audience, and what happened whether or not they took it.',
  },
  {
    title: 'A decision that got reversed after you’d already built on it',
    body: 'How much work was already in flight, how you handled the sunk cost conversation, and what you carried forward from the discarded work if anything.',
  },
  {
    title: 'Explaining a technical limitation that actually landed',
    body: 'One where you can repeat, word for word, the plain-language version you actually used — not a cleaned-up retelling.',
  },
  {
    title: 'Conflicting priorities between IT, security, and the business sponsor',
    body: 'Naming the competing incentives explicitly, and what you did to keep the losing side’s relationship intact.',
  },
  {
    title: 'A time you had to say no to a customer request',
    body: 'What made it a “no” instead of a “not yet,” and how you kept the relationship from souring over it.',
  },
  {
    title: 'A mistake you caught yourself, before anyone else did',
    body: 'What tipped you off, and what you changed afterward so it wouldn’t depend on catching it by chance next time.',
  },
  {
    title: 'A first 30/60/90 day plan with a new customer',
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
          content="FDE behavioral interview questions, forward-deployed engineer behavioral round, how to prepare for FDE interview"
        />
      </Head>
      <main className={styles.page}>
        <div className="container">
          <PageHeader
            title={TITLE}
            oneLiner={ONE_LINER}
            meta={['45–60 minutes', 'Sometimes standalone, sometimes folded into another round']}
          />

          <Section title="What to expect">
            <p>
              Format is looser than the other two rounds — sometimes a dedicated interviewer, sometimes ten
              minutes tacked onto the end of the case-study round once the interviewer already has a working
              picture of you. The four themes that come up across sources: client ownership, accountability under
              repeat failure, communicating technically to non-technical stakeholders, and navigating internal
              client politics.
            </p>
            <p className={styles.aside}>
              Unlike the case-study round, there’s no framework to perform here — the entire round is testing
              whether your stories are real, specific, and told with your own contribution in focus.
            </p>
          </Section>

          <Section title="Four sample questions, and how to work through them">
            <p>
              Each one below shows how the question actually gets asked, then breaks down what it’s really
              probing and how to structure an answer — including, where it’s a legitimate move, how to ask a
              quick clarifying question before you launch in.
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
                <strong>Say “I,” not “we.”</strong> The most common note interviewers give on an otherwise good
                behavioral answer: it described what the team did, not what the candidate specifically did. Name
                your own action, even inside a team effort — that’s the actual signal this round is trying to
                extract.
              </p>
            </div>
          </Section>

          <Section title="When it’s worth asking a clarifying question">
            <p>
              Sparingly, and only when it genuinely narrows the story you’d tell — “do you want the technical
              side of this or the relationship side?” is useful; “can you define what you mean by ownership?” is
              not, and reads as stalling. Most of the time, the better move is picking your strongest matching
              story and stating your interpretation of the question out loud as you start — “I’ll take this as
              asking about a time I had to push back on a client, since that’s the clearest example I have” —
              which gets you the same clarity without spending the interviewer’s patience on it.
            </p>
          </Section>

          <SubNav
            prev={{label: 'Back: the case-study round', to: '/career-tracks/forward-deployed-engineer/case-studies'}}
            next={{label: 'Back to the FDE overview', to: '/career-tracks/forward-deployed-engineer'}}
          />
        </div>
      </main>
    </Layout>
  );
}
