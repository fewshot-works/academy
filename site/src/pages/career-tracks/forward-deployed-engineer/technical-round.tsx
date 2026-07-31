import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';

import {PageHeader, Section, CalloutList, StepList, SubNav, styles, type Callout, type Step} from './_shared';

const TITLE = 'The Coding / Technical Round';

const META_DESCRIPTION =
  'What an FDE technical round actually tests, how to prepare for it, and the two things worth having ready before you walk in: a public GitHub history and a live agentic AI demo.';

const ONE_LINER =
  'Every source agrees on one point: this round is explicitly not LeetCode. Companies say so directly in the ' +
  'job posting and repeat it to the recruiter script. What replaces it is closer to a simulation of the job ' +
  'itself — integrating with something messy, debugging something that half-works, and building something ' +
  'small enough to finish in an hour but real enough to argue about.';

type ProblemType = {kind: string; example: string};

const PROBLEM_TYPES: ProblemType[] = [
  {
    kind: 'Messy real-world data',
    example: 'Parse a CSV or JSON export with missing fields, inconsistent types, and duplicate rows — the kind of export an actual client system produces, not a clean fixture.',
  },
  {
    kind: 'A small integration or CLI tool',
    example: 'Wrap a flaky third-party API: add retries, timeouts, and a sane error message instead of a stack trace.',
  },
  {
    kind: 'Rate limiting / backpressure',
    example: 'Build a simple rate limiter or queue that keeps a downstream system from falling over under bursty load.',
  },
  {
    kind: 'Debugging an existing snippet',
    example: 'You’re handed code with a subtle bug — off-by-one, a race condition, a silently swallowed exception — and asked to find and fix it while narrating your reasoning.',
  },
  {
    kind: 'Refactor for testability',
    example: 'Take a tangled function and pull it apart so it can actually be unit tested, without changing its behavior.',
  },
  {
    kind: 'A small RAG or agent slice',
    example: 'At AI-native companies specifically: wire up a minimal retrieval step or a single tool call, close to what Intermediate Chapters 3–5 of this curriculum build.',
  },
];

const PASS_SIGNALS: Callout[] = [
  {
    title: 'Clarifying questions before code',
    body: 'Candidates who ask “what happens with a null here?” or “should this be idempotent?” before typing are read as already thinking like someone who’ll own this in production.',
  },
  {
    title: 'Continuous narration',
    body: 'Silence for ten minutes reads as a red flag even if the final code is correct — the interviewer is grading how you think, not just what you output.',
  },
  {
    title: 'Catching your own bugs',
    body: 'Nobody expects zero bugs. Noticing one yourself, saying so, and fixing it reads far better than an interviewer having to point it out.',
  },
  {
    title: 'Clean and tested over “optimal”',
    body: 'A version with basic error handling and a couple of test cases beats a cleverer, faster version with neither. This isn’t a competitive-programming judge.',
  },
  {
    title: 'Pragmatic trade-off calls, said out loud',
    body: '“I’d cache this in a real system, but I’ll skip it here for time” is a better answer than silently skipping it — or silently over-engineering it.',
  },
];

const PREP_STEPS: Step[] = [
  {
    title: 'Week 1 — rebuild fluency with the tools you already know',
    body: 'Not algorithmic puzzles — practical fluency. Read and modify unfamiliar code quickly, write basic tests, and get comfortable narrating out loud while you type. If Python is rusty, redo a couple of labs from this curriculum’s Intermediate track from scratch, without copying.',
  },
  {
    title: 'Week 2 — five coding exercises, five SQL exercises',
    body: 'Pick five small integration-style problems from the list above and finish each in under an hour, out loud, as if someone were watching. Pair it with five SQL exercises — joins, window functions, a query against a slightly denormalized schema — since SQL beyond the basics shows up in the vast majority of FDE postings.',
  },
  {
    title: 'Rehearse the take-home format too',
    body: 'Some companies replace the live round with a take-home. Practice writing a short README explaining your trade-offs — that write-up is graded as closely as the code.',
  },
];

const READY_ITEMS: Callout[] = [
  {
    title: 'A public GitHub history, not a resume line',
    body: 'Have two or three repos an interviewer can actually open before the call — pinned, with a real README (what it does, how to run it, what you’d do differently with more time). This curriculum’s labs are already structured that way; pushing a couple of completed ones as your own is a legitimate starting point, not padding.',
  },
  {
    title: 'A live, deployed agentic AI demo — not something running on localhost',
    body: 'A URL beats a screen-share of your terminal every time. Take one of the agent builds from Intermediate Chapters 6–9 or the Advanced capstone and actually deploy it — a small FastAPI or Streamlit app on something like Render, Railway, Fly.io, or Streamlit Community Cloud is enough. Being able to say “here, try it” mid-interview is a different conversation than describing what it would do.',
  },
  {
    title: 'One story about debugging something in production',
    body: 'Not from this round specifically — save the fuller version for behavioral — but have the two-sentence version ready: what broke, how you found it, what you shipped to fix it. It comes up more than expected as a follow-up to the coding exercise itself.',
  },
];

export default function TechnicalRound(): ReactNode {
  return (
    <Layout title={TITLE} description={META_DESCRIPTION}>
      <Head>
        <meta
          name="keywords"
          content="FDE technical interview questions, forward-deployed engineer coding interview, FDE interview prep, how to prepare for FDE technical round"
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
              deliberately close to the actual job — integration, debugging, and production-quality code — not an
              abstract algorithm.
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
              round does turn out to be LeetCode-style, that’s a signal the posting borrowed the FDE title without
              the actual job behind it — worth noting as you evaluate the offer, not just the interview.
            </p>
          </Section>

          <Section title="What actually separates a pass from a fail">
            <p>
              The code quality bar is real but forgiving. What interviewers consistently flag — in both
              directions — has less to do with the final answer than with how you got there:
            </p>
            <CalloutList items={PASS_SIGNALS} />
            <div className={styles.insightBox}>
              <p>
                <strong>The most common failure mode isn’t a bad solution — it’s silence.</strong> A candidate who
                narrates a mediocre approach clearly will often score better than one who quietly writes a correct
                one. The interviewer can’t grade thinking they can’t see.
              </p>
            </div>
          </Section>

          <Section title="How to prepare">
            <p>
              Two weeks is enough if you’re already comfortable writing code; the goal isn’t to learn to code, it’s
              to rebuild the specific muscle of narrating, scoping, and shipping small under time pressure.
            </p>
            <StepList items={PREP_STEPS} />
          </Section>

          <Section title="Two things to have ready before you walk in">
            <p>
              Beyond practicing problems, two concrete artifacts change how the whole interview reads — because
              they let the interviewer evaluate real work instead of a simulated forty-five minutes of it.
            </p>
            <CalloutList items={READY_ITEMS} />
            <p className={styles.aside}>
              Neither of these needs to be impressive at scale. A small, honestly-documented, actually-running
              thing beats an ambitious, half-finished one every time this comes up as a talking point.
            </p>
          </Section>

          <SubNav
            prev={{label: 'Back to the FDE overview', to: '/career-tracks/forward-deployed-engineer'}}
            next={{label: 'Next: the case-study round', to: '/career-tracks/forward-deployed-engineer/case-studies'}}
          />
        </div>
      </main>
    </Layout>
  );
}
