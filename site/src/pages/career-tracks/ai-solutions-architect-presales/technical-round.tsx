import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';

import {PageHeader, Section, CalloutList, StepList, SubNav, styles, type Callout, type Step} from './_shared';

const TITLE = 'The Live Design / Discovery Round';

const META_DESCRIPTION =
  'What the live design and discovery round actually tests, how to prepare for it, and what to have ready before you walk in: a demo-able PoC and a handful of well-reasoned architecture decisions.';

const ONE_LINER =
  'The presales equivalent of a coding round, minus the code. You’re handed a vague customer prompt and asked ' +
  'to design out loud — architecture, trade-offs, cost — while an interviewer plays the role of a skeptical ' +
  'customer or engineering counterpart. The whiteboard, not the editor, is the shared surface here.';

type ProblemType = {kind: string; example: string};

const PROBLEM_TYPES: ProblemType[] = [
  {
    kind: 'Architecture whiteboard from a vague prompt',
    example: '“A retailer wants an AI agent that answers order-status questions from their support inbox.” You’re expected to ask scoping questions, then sketch a system — not jump straight to a diagram.',
  },
  {
    kind: 'Cost and scaling trade-offs',
    example: 'Given a rough volume (say, 50,000 tickets a month), estimate token spend, pick a model tier, and explain when you’d switch from a hosted API to something cheaper or self-hosted.',
  },
  {
    kind: 'RAG design questions',
    example: 'How would you chunk this customer’s document set? What happens when retrieval returns the wrong passage? When would you reach for a rerank step instead of just adding more context?',
  },
  {
    kind: 'Agent and tool-use design questions',
    example: 'Where does this need a single well-scoped tool call versus a multi-step agent loop? What’s your answer when the interviewer asks “what stops this agent from doing something destructive?”',
  },
  {
    kind: 'Defending a design under pushback',
    example: 'The interviewer plays a skeptical engineering counterpart: “why not just fine-tune instead of RAG here?” You’re graded on the reasoning, not on winning the argument.',
  },
];

const PASS_SIGNALS: Callout[] = [
  {
    title: 'Scoping questions before a diagram',
    body: 'Asking “what’s the data volume, and where does it live today?” before sketching anything reads as someone who’s actually run discovery calls, not someone reciting a reference architecture from memory.',
  },
  {
    title: 'Naming the trade-off, not just the answer',
    body: '“I’d use RAG over fine-tuning here because the knowledge base changes weekly and fine-tuning can’t keep up cheaply” beats a confident answer with no reasoning attached.',
  },
  {
    title: 'A cost or latency number, even a rough one',
    body: 'Interviewers consistently flag candidates who can talk architecture all day but freeze the moment someone asks “roughly what would that cost per month at this volume?” A ballpark, stated as a ballpark, is the right move.',
  },
  {
    title: 'Comfort saying “it depends” — then actually saying what it depends on',
    body: 'A flat answer with no caveats reads as inexperience. The caveat plus the deciding factor is what reads as judgment.',
  },
  {
    title: 'Recovering gracefully from pushback',
    body: 'When the interviewer challenges a choice, changing your answer because the new information genuinely changes the calculus is a stronger signal than defending the original design out of ego.',
  },
];

const PREP_STEPS: Step[] = [
  {
    title: 'Week 1 — rebuild the underlying architecture fluency',
    body: 'This round assumes you can reason about RAG pipelines, chunking, retrieval quality, and agent/tool-use design from first principles, not just recite vendor diagrams. If any of that’s rusty, redo Intermediate Chapters 1–6 of this curriculum hands-on rather than just re-reading them.',
  },
  {
    title: 'Week 2 — five scoping-to-diagram reps',
    body: 'Take five vague one-line prompts (“a bank wants an AI assistant for loan officers,” “a hospital wants to summarize intake forms”) and practice going from clarifying questions to a rough architecture in fifteen minutes, out loud, timed.',
  },
  {
    title: 'Practice the cost-estimate reflex',
    body: 'For each of those five scenarios, force yourself to say an actual number — tokens per interaction, requests per day, a rough monthly dollar figure — even if it’s wrong. The habit of estimating matters more than the precision.',
  },
];

const READY_ITEMS: Callout[] = [
  {
    title: 'A demo-able proof of concept',
    body: 'Something you can pull up and click through, not describe — a RAG search over a small document set or a simple tool-using agent, built from this curriculum’s Intermediate or Advanced labs and actually deployed somewhere reachable by URL.',
  },
  {
    title: 'Three or four well-reasoned architecture decisions',
    body: 'For your own demo, be ready to explain why you chunked the way you did, why you picked the model tier you picked, and what you’d change first at ten times the scale. Interviewers probe your own project far more than they probe a hypothetical one.',
  },
  {
    title: 'One story about a design you got wrong',
    body: 'Save the fuller version for the behavioral round, but have the two-sentence version ready here too: what you assumed, what broke the assumption, and what you’d design differently now.',
  },
];

export default function TechnicalRound(): ReactNode {
  return (
    <Layout title={TITLE} description={META_DESCRIPTION}>
      <Head>
        <meta
          name="keywords"
          content="AI solutions architect technical interview, AI presales interview questions, solution architecture interview prep"
        />
      </Head>
      <main className={styles.page}>
        <div className="container">
          <PageHeader
            title={TITLE}
            oneLiner={ONE_LINER}
            meta={['45–60 minutes', 'Whiteboard or shared doc', 'Design reasoning, not code']}
          />

          <Section title="What to expect">
            <p>
              Format varies by company, but the shape is consistent: a vague, one-line customer ask, a whiteboard
              or shared doc, and an interviewer who expects you to drive — asking questions, narrating your
              reasoning, and arriving at a defensible design, not a perfect one.
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Problem type</th>
                    <th>What it looks like</th>
                  </tr>
                </thead>
                <tbody>
                  {PROBLEM_TYPES.map((row) => (
                    <tr key={row.kind}>
                      <td>{row.kind}</td>
                      <td>{row.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={styles.aside}>
              You will not be asked to write or debug code live in this round — that’s what the case-study round
              covers, if the loop has one. This round is testing whether you can think in systems out loud, under
              a little bit of pressure, in front of someone playing a customer.
            </p>
          </Section>

          <Section title="What actually separates a pass from a fail">
            <p>
              The design doesn’t need to be the “correct” one — there usually isn’t one. What interviewers
              consistently flag, in both directions, has more to do with how you got to the design than the
              design itself:
            </p>
            <CalloutList items={PASS_SIGNALS} />
            <div className={styles.insightBox}>
              <p>
                <strong>The most common failure mode isn’t a bad design — it’s a design with no reasoning
                attached.</strong> A candidate who picks a mediocre architecture and explains why, clearly, will
                often score better than one who arrives at a good architecture with no visible reasoning. The
                interviewer can’t grade judgment they never got to see.
              </p>
            </div>
          </Section>

          <Section title="How to prepare">
            <p>
              Two weeks is enough if you’re already comfortable with RAG and agent design fundamentals; the goal
              isn’t to learn the concepts, it’s to rebuild the specific muscle of scoping and sketching under time
              pressure, out loud.
            </p>
            <StepList items={PREP_STEPS} />
          </Section>

          <Section title="Three things to have ready before you walk in">
            <p>
              Beyond practicing scenarios, a few concrete artifacts change how the whole interview reads — because
              they let the interviewer evaluate a real design instead of a hypothetical one:
            </p>
            <CalloutList items={READY_ITEMS} />
            <p className={styles.aside}>
              None of this needs to be impressive at scale. A small, honestly-reasoned, actually-running thing
              beats an ambitious, hand-wavy one every time this comes up as a talking point.
            </p>
          </Section>

          <SubNav
            prev={{label: 'Back to the overview', to: '/career-tracks/ai-solutions-architect-presales'}}
            next={{label: 'Next: the case-study round', to: '/career-tracks/ai-solutions-architect-presales/case-studies'}}
          />
        </div>
      </main>
    </Layout>
  );
}
