import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';

import {PageHeader, Section, CalloutList, StepList, SubNav, styles, type Callout, type Step} from './_shared';

const TITLE = 'The Coding / Technical Round';

const META_DESCRIPTION =
  'What an Applied / Agentic AI Engineer technical round actually tests, how to prepare for it, and the two ' +
  'things worth having ready before you walk in: a deployed agent demo and a clear eval story.';

const ONE_LINER =
  'Most companies hiring for this role say the same thing up front: this is not a LeetCode round. What replaces ' +
  'it is closer to the job itself — debugging an agent that half-works, wiring up a small retrieval or tool-use ' +
  'slice, or reasoning about cost and latency trade-offs out loud. The bar is real, but it is a builder’s bar, ' +
  'not a competitive-programming one.';

type ProblemType = {kind: string; example: string};

const PROBLEM_TYPES: ProblemType[] = [
  {
    kind: 'Debugging an existing agent',
    example: 'You’re handed a small agent codebase where a tool call loops forever, a prompt silently drops context, or a retry swallows an error — find it and fix it while narrating your reasoning.',
  },
  {
    kind: 'A small retrieval or tool-use slice',
    example: 'Wire up a minimal RAG step over a handful of documents, or add a single new tool to an existing agent loop — close to what Intermediate Chapters 3–6 of this curriculum build.',
  },
  {
    kind: 'Token-budget / cost-control logic',
    example: 'Given a per-request token or dollar budget, add logic that truncates context, picks a cheaper model, or degrades gracefully instead of just failing.',
  },
  {
    kind: 'Messy real-world data',
    example: 'Parse a document export, API response, or log file with missing fields and inconsistent formatting — the kind of input a production pipeline actually sees.',
  },
  {
    kind: 'Prompt or eval iteration',
    example: 'Given a prompt that fails on a few example inputs, revise it and explain how you’d know the revision actually helped, not just that it feels better.',
  },
  {
    kind: 'Take-home build',
    example: 'A handful of companies replace the live round entirely with a 2–4 hour take-home: build a small agent or RAG feature end to end and write up the trade-offs.',
  },
];

const PASS_SIGNALS: Callout[] = [
  {
    title: 'Clarifying questions before code',
    body: 'Asking “what should happen if the tool call fails?” or “is this latency-sensitive?” before typing reads as already thinking like someone who’ll own this in production.',
  },
  {
    title: 'Continuous narration',
    body: 'Silence for ten minutes reads as a red flag even if the final code is correct. The interviewer is grading how you think about agent behavior, not just what you output.',
  },
  {
    title: 'Treating non-determinism as normal, not surprising',
    body: 'Acknowledging that an LLM call might return something slightly different next time, and designing around that, is read as real experience rather than a first encounter with the problem.',
  },
  {
    title: 'Catching your own bugs',
    body: 'Nobody expects a perfect agent on the first pass. Noticing a dropped edge case yourself and fixing it reads far better than the interviewer having to point it out.',
  },
  {
    title: 'Pragmatic trade-off calls, said out loud',
    body: '“I’d add a retry with backoff here in a real system, but I’ll skip it for time” beats silently skipping it, and beats silently over-building it too.',
  },
];

const PREP_STEPS: Step[] = [
  {
    title: 'Week 1 — rebuild fluency with the tools you already know',
    body: 'Not algorithmic puzzles — practical fluency with agent loops, tool calling, and basic retrieval. If any of that is rusty, redo a couple of labs from this curriculum’s Intermediate track from scratch, without copying, narrating out loud as you go.',
  },
  {
    title: 'Week 2 — five debugging exercises, five eval exercises',
    body: 'Take five small broken agents or RAG pipelines and fix each in under an hour, out loud. Pair it with five short exercises in evaluating a prompt or agent change: precision/recall against a small labeled set, or an LLM-as-judge check, since “how do you know it worked” comes up in nearly every round.',
  },
  {
    title: 'Rehearse the take-home format too',
    body: 'Practice writing a short README explaining your trade-offs after a timed build. That write-up is often graded as closely as the code itself.',
  },
];

const READY_ITEMS: Callout[] = [
  {
    title: 'A deployed agent demo, not something running on localhost',
    body: 'A URL beats a screen-share of your terminal every time. Take one of the agent builds from Intermediate Chapters 6–9 or the Advanced capstone and actually deploy it — a small FastAPI or Streamlit app on something like Render, Railway, Fly.io, or Streamlit Community Cloud is enough. Being able to say “here, try it” mid-interview is a different conversation than describing what it would do.',
  },
  {
    title: 'A clear answer to “how did you know it worked?”',
    body: 'Have one real example ready of measuring an agent or RAG change, even something small: a before/after eval score, a handful of hand-labeled test cases, a cost or latency number that moved. This question shows up constantly and a vague “it seemed better” answer is a common reason strong coders still get passed on.',
  },
  {
    title: 'One story about debugging something in production',
    body: 'Not the fuller version, save that for behavioral, but have the two-sentence version ready: what broke, how you found it, what you shipped to fix it. It comes up more than expected as a follow-up to the coding exercise itself.',
  },
];

export default function TechnicalRound(): ReactNode {
  return (
    <Layout title={TITLE} description={META_DESCRIPTION}>
      <Head>
        <meta
          name="keywords"
          content="AI engineer technical interview questions, agentic AI engineer coding interview, RAG interview questions"
        />
      </Head>
      <main className={styles.page}>
        <div className="container">
          <PageHeader
            title={TITLE}
            oneLiner={ONE_LINER}
            meta={['45–75 minutes', 'Shared editor or take-home', 'Explicitly not LeetCode-style']}
          />

          <Section title="What to expect">
            <p>
              Format varies by company, but the shape is consistent: a shared editor with the interviewer watching
              (sometimes pairing), or a take-home with a short debrief afterward. Either way, the problem is
              deliberately close to the actual job — debugging, small builds, and reasoning about behavior that
              isn’t fully deterministic — not an abstract algorithm.
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
              You will not be asked to invert a binary tree or optimize a dynamic-programming recurrence. If a
              round does turn out to be LeetCode-style, that’s a signal the posting borrowed the title without the
              actual job behind it, worth noting as you evaluate the offer, not just the interview.
            </p>
          </Section>

          <Section title="What actually separates a pass from a fail">
            <p>
              The code quality bar is real but forgiving. What interviewers consistently flag, in both directions,
              has less to do with the final answer than with how you got there:
            </p>
            <CalloutList items={PASS_SIGNALS} />
            <div className={styles.insightBox}>
              <p>
                <strong>The most common failure mode isn’t a bad solution, it’s silence.</strong> A candidate who
                narrates a mediocre approach clearly will often score better than one who quietly writes a correct
                one. The interviewer can’t grade thinking they can’t see, and with agentic systems there’s usually
                more than one reasonable design, so the reasoning matters as much as the code.
              </p>
            </div>
          </Section>

          <Section title="How to prepare">
            <p>
              Two weeks is enough if you’re already comfortable writing code. The goal isn’t to learn to code, it’s
              to rebuild the specific muscle of narrating, scoping, and shipping a small agent or retrieval feature
              under time pressure.
            </p>
            <StepList items={PREP_STEPS} />
          </Section>

          <Section title="Two things to have ready before you walk in">
            <p>
              Beyond practicing problems, two concrete artifacts change how the whole interview reads, because they
              let the interviewer evaluate real work instead of a simulated forty-five minutes of it.
            </p>
            <CalloutList items={READY_ITEMS} />
            <p className={styles.aside}>
              Neither of these needs to be impressive at scale. A small, honestly-documented, actually-running
              thing beats an ambitious, half-finished one every time this comes up as a talking point.
            </p>
          </Section>

          <SubNav
            prev={{label: 'Back to the overview', to: '/career-tracks/applied-agentic-ai-engineer'}}
            next={{label: 'Next: the system design round', to: '/career-tracks/applied-agentic-ai-engineer/system-design'}}
          />
        </div>
      </main>
    </Layout>
  );
}
