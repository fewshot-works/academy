import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';

import {PageHeader, Section, CalloutList, StepList, SubNav, styles, type Callout, type Step} from '../_shared';

const TITLE = 'The Technical Round';

const META_DESCRIPTION =
  'What the technical round for an SRE / AI Reliability Engineer role actually tests — and why the format ' +
  'splits sharply between algorithmic coding at Google-scale companies and practical observability/debugging ' +
  'work almost everywhere else.';

const ONE_LINER =
  'This is the one round in this whole guide where the format genuinely depends on who\'s hiring. Google-style ' +
  'companies still run data-structures-and-algorithms coding screens, especially for early-career candidates. ' +
  'AI-native and mid-market companies lean instead toward debugging a broken observability pipeline, writing ' +
  'automation, or defending an SLO design out loud. Both are real — know which one you\'re walking into before ' +
  'you prep.';

type ProblemType = {kind: string; example: string};

const PROBLEM_TYPES: ProblemType[] = [
  {
    kind: 'DSA coding screen (Google-style)',
    example: 'Standard data-structures-and-algorithms problems, evaluated for correctness and complexity — most common for early-career and campus hiring, less common the more senior and AI-specific the posting gets.',
  },
  {
    kind: 'Debugging a broken observability pipeline',
    example: 'You\'re handed a dashboard or trace where a metric is missing, an alert never fired, or a trace is dropping spans — find why and fix it while narrating your reasoning.',
  },
  {
    kind: 'SLI/SLO design exercise',
    example: 'Given a service description (say, an LLM inference endpoint), propose SLIs, set an SLO, and defend the error-budget trade-off against a pushy "why not 99.99%?" follow-up.',
  },
  {
    kind: 'Incident-triage scripting',
    example: 'Write a quick script to correlate logs and traces across a handful of services to find which one is the actual source of an alert storm — the kind of tool-building the job runs on daily.',
  },
  {
    kind: 'Infra-as-code exercise',
    example: 'Debug or extend a small Terraform or Kubernetes manifest — the bar is fluency with the habit of IaC, not memorized syntax.',
  },
  {
    kind: 'Take-home build',
    example: 'A smaller number of companies replace the live round with a take-home: instrument a small service with tracing and an SLO dashboard, then write up the trade-offs.',
  },
];

const PASS_SIGNALS: Callout[] = [
  {
    title: 'Operator framing, not developer framing',
    body: '"I\'d mitigate the impact first, then investigate" reads as real operational experience. "I\'d fix the bug" — jumping straight to root cause before containing blast radius — is the single most common tell of inexperience, even when the eventual fix is correct.',
  },
  {
    title: 'Asking about blast radius before diving in',
    body: 'Who\'s affected, how badly, and is it getting worse — asked before touching anything — shows the instinct the job actually requires: contain first, understand fully second.',
  },
  {
    title: 'Distrust of a single green dashboard',
    body: 'For an AI-serving system, "latency and availability look fine" isn\'t the end of the investigation. Asking about output-quality or cost metrics on top of the traditional ones reads as understanding the job\'s actual failure surface.',
  },
  {
    title: 'Building the fix as a script or automation, not a one-off command',
    body: 'A candidate who solves the immediate problem by hand, with no thought to whether it\'ll recur, misses the entire point of the discipline — reducing toil is close to the job\'s definition.',
  },
  {
    title: 'Honest trade-off calls, said out loud',
    body: '"I\'d add retries with backoff here in a real system, but I\'ll skip it given the time" beats silently skipping it, and beats silently gold-plating a throwaway exercise too.',
  },
];

const PREP_STEPS: Step[] = [
  {
    title: 'Week 1 — find out which format you\'re actually facing',
    body: 'Ask the recruiter directly, or check recent Glassdoor/Blind reports for that specific company. Prepping DSA drills for a company that actually runs a debugging round (or the reverse) wastes the two weeks you have.',
  },
  {
    title: 'Week 1 (observability track) — rebuild fluency with a real tracing tool',
    body: 'Set up LangSmith, Langfuse, or Helicone on a small agent from this curriculum\'s Advanced Chapter 3 (Observability) and deliberately break something — a dropped span, a missing metric — then practice diagnosing it from the trace alone.',
  },
  {
    title: 'Week 2 — five incident drills, five SLO-design reps',
    body: 'Take five small "here\'s an alert, here\'s a dashboard" scenarios and practice the full loop out loud: triage, mitigate, root-cause, propose a prevention. Pair it with five reps of proposing an SLO for a hypothetical service and defending the number against pushback — this shows up in nearly every version of this round.',
  },
];

const READY_ITEMS: Callout[] = [
  {
    title: 'A real observability setup you can walk someone through',
    body: 'Deploy one of this curriculum\'s Intermediate or Advanced agent builds with real tracing wired up — LangSmith, Langfuse, or raw OpenTelemetry. Being able to open an actual trace and point at a real span beats describing what tracing would look like.',
  },
  {
    title: 'An SLO you wrote for something real, even a side project',
    body: 'Have one concrete example ready: what SLI you picked, what SLO you set, and one time the error budget actually mattered — a burn that changed a decision, even a small one.',
  },
  {
    title: 'A two-sentence version of a real production issue you diagnosed',
    body: 'Save the full story for the behavioral round, but have the short version ready — it comes up as a natural follow-up to the technical exercise itself, almost regardless of format.',
  },
];

export default function TechnicalRound(): ReactNode {
  return (
    <Layout title={TITLE} description={META_DESCRIPTION}>
      <Head>
        <meta
          name="keywords"
          content="AI SRE technical interview questions, AI reliability engineer interview prep, observability interview questions"
        />
      </Head>
      <main className={styles.page}>
        <div className="container">
          <PageHeader
            title={TITLE}
            oneLiner={ONE_LINER}
            backTo="/career-tracks/sre-reliability-engineer"
            backLabel="SRE / Reliability Engineer for AI Agents"
            meta={['45–75 minutes', 'Format varies sharply by company', 'Shared editor, whiteboard, or take-home']}
          />

          <Section title="What to expect">
            <p>
              Six problem shapes show up across current postings and interview reports. Which one you get
              depends heavily on the company — a frontier lab hiring for a generalist infrastructure org skews
              toward the first; an AI-native company hiring specifically for LLM-serving reliability skews
              toward the rest.
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
              If you\'re unsure which format a specific company runs, ask the recruiter directly — "is this round
              closer to algorithmic coding or closer to operational debugging?" is a completely normal question
              at this stage, and the answer changes how you should spend the next two weeks.
            </p>
          </Section>

          <Section title="What actually separates a pass from a fail">
            <p>
              Across both formats, interviewers consistently describe the same gap between strong and weak
              candidates — and it\'s rarely about raw technical correctness:
            </p>
            <CalloutList items={PASS_SIGNALS} />
            <div className={styles.insightBox}>
              <p>
                <strong>Most candidates fail on operational judgment, not technical knowledge.</strong> A
                2026 recruiter-sourced guide to SRE interviews put this bluntly, and it matches what shows up
                in Google\'s own published interview guidance: the hardest rounds consistently center on
                error-budget policy decisions and live production debugging under observation, not on whether
                you know the right algorithm.
              </p>
            </div>
          </Section>

          <Section title="How to prepare">
            <p>
              Two weeks is enough if you\'re already comfortable with infrastructure fundamentals. The goal
              isn\'t learning new syntax — it\'s rebuilding the specific muscle of narrating triage-and-mitigate
              reasoning under time pressure, in whichever format you\'re about to face.
            </p>
            <StepList items={PREP_STEPS} />
          </Section>

          <Section title="Two things to have ready before you walk in">
            <p>
              Beyond drilling problems, two concrete artifacts change how the whole interview reads, because
              they let the interviewer evaluate real judgment instead of a simulated forty-five minutes of it.
            </p>
            <CalloutList items={READY_ITEMS} />
            <p className={styles.aside}>
              Neither needs to be impressive at scale. A small, honestly-instrumented, actually-running thing
              beats an ambitious, half-finished one every time this comes up as a talking point.
            </p>
          </Section>

          <SubNav
            prev={{label: 'Back to the overview', to: '/career-tracks/sre-reliability-engineer'}}
            next={{label: 'Next: incident response', to: '/interview-prep/case-studies/sre-reliability-engineer'}}
          />
        </div>
      </main>
    </Layout>
  );
}
