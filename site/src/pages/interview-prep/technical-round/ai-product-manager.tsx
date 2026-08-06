import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';

import {PageHeader, Section, CalloutList, StepList, SubNav, styles, type Callout, type Step} from '../_shared';

const TITLE = 'The Technical / Evaluation Round';

const META_DESCRIPTION =
  'What the technical or evaluation round for an AI Product Manager role actually tests — SQL fluency, ' +
  'offline vs. online evaluation, build-vs-buy judgment, and defending a hallucination-rate threshold — with ' +
  'the specific pass signals interviewers describe looking for.';

const ONE_LINER =
  'This isn\'t a coding interview — nobody expects you to write production code. But it\'s not a soft-skills ' +
  'round either. You\'ll be handed a dataset, a metrics question, or a build-vs-buy decision and asked to reason ' +
  'through it with real technical fluency: read a SQL query, tell offline eval apart from online eval, and name ' +
  'a specific number when asked how much hallucination is too much. Vague answers are the single biggest way ' +
  'candidates lose this round.';

type ProblemType = {kind: string; example: string};

const PROBLEM_TYPES: ProblemType[] = [
  {
    kind: 'SQL & data-analysis exercise',
    example: 'Read or lightly write a SQL query against a sample events table, then interpret what it shows — "feature usage is up 20% week over week, is that good?" tests whether you reach for a denominator, not whether you can write a join from memory.',
  },
  {
    kind: 'Offline vs. online evaluation discussion',
    example: 'Given a model change, you\'re asked how you\'d evaluate it before shipping (offline: eval sets, golden answers, precision/recall) versus after shipping (online: A/B test, live user metrics, guardrail monitoring) — and why you need both.',
  },
  {
    kind: 'Metrics definition case',
    example: 'Pick the north-star metric and 2–3 guardrail metrics for an AI feature (say, an AI search assistant) — and defend why a metric like "messages sent" is a vanity number if it isn\'t paired with a quality or task-completion signal.',
  },
  {
    kind: 'Build-vs-buy / fine-tune-vs-RAG-vs-prompt decision',
    example: 'Given a product requirement, decide whether to solve it with prompt engineering, RAG, fine-tuning, or a third-party API — and defend the trade-off in cost, latency, and control against a skeptical follow-up.',
  },
  {
    kind: 'Audit AI-generated code or output',
    example: 'Some companies now hand candidates AI-generated code or an AI-drafted spec and ask them to find what\'s wrong with it — testing the increasingly common expectation that a PM can sanity-check AI output, not just describe it.',
  },
  {
    kind: 'Defend a hallucination-rate threshold',
    example: '"What hallucination rate is acceptable for this feature, and what happens above it?" — a direct test of whether you\'ll commit to a real number and a real fallback plan, instead of saying "as low as possible."',
  },
];

const PASS_SIGNALS: Callout[] = [
  {
    title: 'Names outcome metrics, not activity metrics',
    body: '"Messages sent" or "sessions per week" going up means nothing on its own — a strong answer immediately asks what task the user was trying to complete and whether they completed it, then pairs the activity number with that.',
  },
  {
    title: 'Keeps offline and online evaluation straight',
    body: 'Confusing "we ran it against our eval set" with "we know it works in production" is one of the fastest tells of someone who hasn\'t actually shipped an AI feature. Both are needed, and they answer different questions.',
  },
  {
    title: 'Says "I don\'t know, I\'d check with the ML team" instead of bluffing',
    body: 'Interviewers explicitly watch for candidates who fabricate technical confidence they don\'t have. A precise "here\'s what I know, here\'s what I\'d confirm with an engineer" reads as more credible than a guess dressed up as certainty.',
  },
  {
    title: 'Names a specific hallucination threshold and a fallback',
    body: '"As low as possible" is not an answer. "Under 2% on our eval set for this use case, and above that we fall back to showing sources instead of a direct answer" is — a number plus a plan for what happens when the number is missed.',
  },
  {
    title: 'Comfortable enough with SQL to self-serve a basic question',
    body: 'You don\'t need to write a complex query from scratch, but flinching at a simple SELECT/GROUP BY, or being unable to say what a JOIN does, undercuts credibility fast in a role that increasingly expects some data self-sufficiency.',
  },
];

const PREP_STEPS: Step[] = [
  {
    title: 'Week 1 — drill the "how did you measure that" follow-up',
    body: 'For every metric you plan to cite anywhere in the loop — in this round or the behavioral round — practice a follow-up chain three levels deep: how did you measure it, what was the baseline, how do you know the change caused it. This single habit is what separates a real answer from a rehearsed one.',
  },
  {
    title: 'Week 1 — rebuild SQL fluency',
    body: 'Work through this curriculum\'s Intermediate Chapter 8 (Evaluating What You Built), which covers precision@k/recall@k against a hand-labeled eval set — it doubles as SQL and evaluation-metrics practice in one exercise, and gives you a real, defensible example to cite in the interview itself.',
  },
  {
    title: 'Week 2 — five build-vs-buy reps',
    body: 'Take five different product requirements (a support chatbot, a code-review assistant, a document summarizer, a search feature, a data-extraction tool) and force yourself to pick prompt-only, RAG, fine-tuning, or a third-party API for each, then defend it out loud against "why not just fine-tune?"',
  },
  {
    title: 'Week 2 — write a one-page hallucination policy',
    body: 'Pick a hypothetical AI feature and write down: the acceptable hallucination rate, how you\'d measure it, and what the product does above that threshold (refuse, show sources, escalate to a human). Having done this once for real makes the live version of the question dramatically easier.',
  },
];

const READY_ITEMS: Callout[] = [
  {
    title: 'A real eval set you built, not a hypothetical one',
    body: 'This curriculum\'s Intermediate Chapter 8 walks through building a hand-labeled eval set and scoring retrieval with precision@k/recall@k — bring the actual numbers you got, not a description of what an eval set would look like.',
  },
  {
    title: 'A defensible build-vs-buy decision from something you actually built',
    body: 'One real example — even a small side project — where you chose prompt engineering over RAG, or RAG over fine-tuning, and can explain the trade-off in cost, latency, and maintenance, beats five hypothetical ones described in the abstract.',
  },
];

export default function TechnicalRound(): ReactNode {
  return (
    <Layout title={TITLE} description={META_DESCRIPTION}>
      <Head>
        <meta
          name="keywords"
          content="AI PM technical interview questions, AI product manager evaluation round, AI PM interview prep"
        />
      </Head>
      <main className={styles.page}>
        <div className="container">
          <PageHeader
            title={TITLE}
            oneLiner={ONE_LINER}
            meta={['45–60 minutes', 'No production coding expected', 'Shared doc, whiteboard, or take-home']}
            backTo="/career-tracks/ai-product-manager"
            backLabel="AI Product Manager"
          />

          <Section title="What to expect">
            <p>
              Six problem shapes show up across current postings and interview reports. Earlier-stage and
              AI-native companies lean harder on live discussion and case-style reasoning; larger companies are
              more likely to formalize part of this as a take-home.
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
              If you\'re unsure how technical a specific company\'s round runs, ask the recruiter — "is this closer
              to a data/metrics discussion or a hands-on exercise?" is a normal question at this stage, and the
              answer changes how you spend the next two weeks.
            </p>
          </Section>

          <Section title="What actually separates a pass from a fail">
            <p>
              Across sources — from AI PM interview guides to hiring-manager write-ups — the same gap between
              strong and weak candidates shows up repeatedly, and it\'s rarely about technical depth alone:
            </p>
            <CalloutList items={PASS_SIGNALS} />
            <div className={styles.insightBox}>
              <p>
                <strong>Vagueness is the most common failure, not lack of technical knowledge.</strong> A
                candidate who commits to a specific hallucination threshold and a specific fallback plan — even
                if an interviewer pushes back on the exact number — reads as more hireable than one who stays
                safely abstract to avoid being wrong.
              </p>
            </div>
          </Section>

          <Section title="How to prepare">
            <p>
              Two weeks is enough if you already have some data fluency. The goal isn\'t learning to code — it\'s
              rebuilding the specific habit of committing to a number and a plan under a skeptical follow-up,
              instead of retreating into generalities.
            </p>
            <StepList items={PREP_STEPS} />
          </Section>

          <Section title="Two things to have ready before you walk in">
            <p>
              Beyond drilling problems, two concrete artifacts change how the whole round reads, because they
              let the interviewer evaluate real judgment instead of a simulated forty-five minutes of it.
            </p>
            <CalloutList items={READY_ITEMS} />
            <p className={styles.aside}>
              Neither needs to be polished or impressive at scale. A small, honestly-measured, actually-built
              thing beats an ambitious, hypothetical one every time this comes up as a talking point.
            </p>
          </Section>

          <SubNav
            prev={{label: 'Back to the overview', to: '/career-tracks/ai-product-manager'}}
            next={{label: 'Next: the AI product sense round', to: '/interview-prep/case-studies/ai-product-manager'}}
          />
        </div>
      </main>
    </Layout>
  );
}
