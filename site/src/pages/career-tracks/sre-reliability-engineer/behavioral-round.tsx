import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Heading from '@theme/Heading';

import {PageHeader, Section, StepList, Dialogue, SubNav, styles, type Step, type Turn} from './_shared';

const TITLE = 'The Behavioral Round';

const META_DESCRIPTION =
  'Four sample behavioral questions for an SRE / AI Reliability Engineer interview, written as a live ' +
  'interviewer/candidate exchange, plus how to build a story bank before you walk in.';

const ONE_LINER =
  'Google calls part of this “Googleyness,” other companies fold it into the incident-response round, but the ' +
  'substance is the same everywhere: can you own an outage blamelessly, bridge between research/ML engineers and ' +
  'infra, make a sound call under 3 a.m. pressure, and defend a reliability-vs-velocity trade-off out loud. ' +
  'None of it is about your technical depth — the technical rounds already covered that.';

type BehavioralQuestion = {theme: string; turns: Turn[]; guidance: string[]};

const QUESTIONS: BehavioralQuestion[] = [
  {
    theme: 'Owning an outage — the blameless postmortem',
    turns: [
      {
        speaker: 'interviewer',
        text: '“Tell me about a time you caused, or were closely involved in, a production incident. What happened?”',
      },
      {
        speaker: 'candidate',
        text: 'I pushed a config change to raise the batch size on an inference service, expecting better throughput. Instead it pushed memory usage over the limit under peak load and the service started getting OOM-killed intermittently for about forty minutes before I connected the change to the symptom.',
      },
      {
        speaker: 'interviewer',
        text: '“Walk me through what you did once you realized it was your change.”',
      },
      {
        speaker: 'candidate',
        text: 'Rolled it back immediately, confirmed the OOM kills stopped, and then wrote the postmortem myself rather than waiting to be asked. I named the actual gap plainly — I hadn’t load-tested the new batch size against peak, not average, traffic — and the follow-up was adding a load test at realistic peak volume to the deploy checklist, not just “be more careful next time.”',
      },
    ],
    guidance: [
      'The interviewer wants to hear you name the mistake plainly, with no hedging or blaming the review process for not catching it — self-caught and self-owned reads far stronger than “someone else flagged it.”',
      'A postmortem that ends in a specific process or tooling change, not just a vague “I’ll be more careful,” is what separates a real blameless-postmortem instinct from a scripted apology.',
      'Watch for candidates who can’t name a real incident at all — in an operations-heavy role, that’s a bigger red flag than admitting to one.',
    ],
  },
  {
    theme: 'Bridging ML/research engineers and infra',
    turns: [
      {
        speaker: 'interviewer',
        text: '“Tell me about a time you had to work with a research or ML engineer who didn’t think about reliability the way you did.”',
      },
      {
        speaker: 'candidate',
        text: 'A research engineer wanted to ship a new prompt-chaining approach straight to production because it scored better on their offline eval. I pointed out it made three sequential model calls per request instead of one, which would roughly triple our latency and API cost at current traffic — numbers they hadn’t actually looked at, since their eval only measured answer quality.',
      },
      {
        speaker: 'interviewer',
        text: '“How did you get from disagreement to an actual resolution?”',
      },
      {
        speaker: 'candidate',
        text: 'I didn’t frame it as “no” — I ran the latency and cost numbers myself and brought them back with a proposal: ship it behind a flag to 5% of traffic first, watch the actual production latency and cost, and use that data to decide on wider rollout instead of arguing from intuition on either side. It shipped two weeks later, to everyone, once the numbers came back acceptable.',
      },
    ],
    guidance: [
      'This is close to the most commonly named skill gap in real AI-SRE postings — the ability to translate between people optimizing for model quality and people optimizing for uptime and cost. A strong answer shows you speaking both languages, not picking a side.',
      'Bringing data instead of just asserting operational concern is the tell of someone who’ll actually be effective in this bridging role.',
      'A story that ends in the research engineer simply deferring to you, with no negotiation, undersells the actual skill being tested — the goal is a resolution both sides bought into.',
    ],
  },
  {
    theme: 'On-call judgment at 3 a.m.',
    turns: [
      {
        speaker: 'interviewer',
        text: '“Tell me about a time you were paged for something and had to decide, in the moment, whether it was actually serious enough to wake someone else up.”',
      },
      {
        speaker: 'candidate',
        text: 'I got paged for elevated error rates on an agent service around 2 a.m. My first move was checking whether the error rate was actually affecting real user traffic or just a batch job that runs overnight and is expected to have some retryable failures — it turned out to be the batch job, already self-recovering.',
      },
      {
        speaker: 'interviewer',
        text: '“So you didn’t escalate. What would have made you escalate instead?”',
      },
      {
        speaker: 'candidate',
        text: 'If the errors had been on the customer-facing path, or if the batch job’s self-recovery hadn’t kicked in within its normal window, I’d have paged the service owner without hesitating, even at that hour — the cost of waking someone up unnecessarily is a bad night’s sleep, the cost of not escalating a real customer-facing issue is much higher, and that asymmetry is what I default to when I’m unsure.',
      },
    ],
    guidance: [
      'The interviewer is checking for a real triage framework, not just “I used my judgment” — naming the specific signal that would have flipped the decision (customer-facing vs. not, self-recovering vs. not) is what makes this answer credible.',
      'A story where every page gets escalated regardless of severity is as much a red flag as one where nothing ever does — the round is testing calibration, not caution alone.',
      'Naming the asymmetry between the cost of a false escalation and the cost of a missed one shows the actual operating principle behind the decision, not just the outcome of one specific night.',
    ],
  },
  {
    theme: 'Reliability vs. velocity — defending an error-budget call',
    turns: [
      {
        speaker: 'interviewer',
        text: '“Tell me about a time you pushed back on shipping something because it would burn too much of your error budget, even though the team wanted to ship.”',
      },
      {
        speaker: 'candidate',
        text: 'Product wanted to launch a new agent feature during a week our latency SLO was already close to breach from an unrelated infra migration. I flagged that shipping on top of an already-strained budget meant we’d likely breach the SLO within days, and that our own error-budget policy said a breach should pause non-critical launches until we recovered.',
      },
      {
        speaker: 'interviewer',
        text: '“Product pushed back — how did you handle that?”',
      },
      {
        speaker: 'candidate',
        text: 'I didn’t just cite the policy and stop there — I proposed a one-week delay tied to a specific, measurable recovery condition, rather than an open-ended “not now.” That gave product a concrete date instead of an indefinite blocker, and made it clear the policy wasn’t me being cautious for its own sake, it was the thing the whole org had already agreed to.',
      },
    ],
    guidance: [
      'A strong answer treats the error-budget policy as the actual decision-maker, not personal risk aversion — citing a policy the org already agreed to is a very different signal than “I just felt nervous about it.”',
      'Offering a concrete, measurable path back to “yes” — not just a blanket “no” — is what shows this was a negotiation grounded in data, not a standoff.',
      'Watch for candidates who’ve only ever been on the side pushing to ship, never the side holding the line — this round specifically wants evidence you can hold an unpopular position when the data supports it.',
    ],
  },
];

const STORY_BANK_STEPS: Step[] = [
  {
    title: 'Pull from real operational work, even from a side project',
    body: 'An incident from a lab in this curriculum you actually instrumented, or a real production issue from any past role — even non-AI — counts. The interviewer cares about the reasoning pattern, not whether the system was famous.',
  },
  {
    title: 'Write down one story for each of the four themes above, before the interview',
    body: 'Owning an outage, bridging a cross-functional disagreement, an on-call judgment call, and a reliability-vs-velocity trade-off — these four show up, in some form, across nearly every SRE-style loop.',
  },
  {
    title: 'Structure each one as situation, action, result',
    body: 'Interviewers are trained to listen for these three beats specifically; burying your actual contribution under two minutes of context reads as unpracticed even when the underlying story is strong.',
  },
  {
    title: 'Say “I,” not “we”',
    body: 'The interviewer needs to isolate your individual judgment call from the team’s — a story told entirely in “we decided” makes that impossible to assess.',
  },
  {
    title: 'Include the mistake, not just the save',
    body: 'A candidate whose every on-call story ends in a clean heroic fix, with no misjudged page or a fix that didn’t work the first time, reads as edited rather than experienced.',
  },
  {
    title: 'Practice the two-minute version out loud',
    body: 'Especially for the outage story — a postmortem that takes six minutes to narrate buries the point the interviewer is actually listening for.',
  },
];

function QuestionBlock({question}: {question: BehavioralQuestion}): ReactNode {
  return (
    <div className={styles.caseStudy}>
      <p className={styles.caseStudyEyebrow}>{question.theme}</p>
      <Dialogue turns={question.turns} />
      <Heading as="h4" className={styles.stepTitle} style={{marginTop: '1.5rem'}}>
        How to think about this one
      </Heading>
      <ul className={styles.guidanceList}>
        {question.guidance.map((point) => (
          <li key={point}>{point}</li>
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
          content="SRE behavioral interview questions, AI reliability engineer interview prep"
        />
      </Head>
      <main className={styles.page}>
        <div className="container">
          <PageHeader
            title={TITLE}
            oneLiner={ONE_LINER}
            meta={['30–45 minutes', 'Often with your future manager', 'Story-based, not hypothetical']}
          />

          <Section title="What to expect">
            <p>
              The familiar “tell me about a time” structure, applied to operational judgment specifically:
              how you handle failure, how you work across the ML/infra boundary, how you decide under
              time pressure, and how you defend a reliability position against velocity pressure.
            </p>
          </Section>

          <Section title="Four sample questions, and how to read them">
            <p>
              These aren’t the exact questions you’ll be asked, but the four themes underneath them show
              up constantly across companies hiring for this role — from Google’s published interview
              guidance to smaller AI-native teams:
            </p>
            {QUESTIONS.map((question) => (
              <QuestionBlock key={question.theme} question={question} />
            ))}
          </Section>

          <Section title="Build your story bank before the interview, not during it">
            <p>
              The single biggest difference between a strong and a weak behavioral round isn’t the quality
              of the underlying experience, it’s whether the stories were prepared in advance.
            </p>
            <StepList items={STORY_BANK_STEPS} />
            <div className={styles.insightBox}>
              <p>
                <strong>Have a real outage story ready, even a small one.</strong> Across every source
                consulted for this guide, the single most consistent theme in this round is a genuine
                incident you owned end to end — not a hypothetical, not one you merely observed. If you
                don’t have one yet, the interview subpages in this guide are designed to help you build
                one deliberately before you need it.
              </p>
            </div>
          </Section>

          <SubNav
            prev={{label: 'Back: incident response', to: '/career-tracks/sre-reliability-engineer/incident-response'}}
            next={{label: 'Back to the overview', to: '/career-tracks/sre-reliability-engineer'}}
          />
        </div>
      </main>
    </Layout>
  );
}
