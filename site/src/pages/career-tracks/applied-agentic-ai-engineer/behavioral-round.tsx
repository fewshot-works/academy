import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Heading from '@theme/Heading';

import {PageHeader, Section, StepList, Dialogue, SubNav, styles, type Step, type Turn} from './_shared';

const TITLE = 'The Behavioral Round';

const META_DESCRIPTION =
  'Four sample behavioral questions for an Applied / Agentic AI Engineer interview, written as a live ' +
  'interviewer/candidate exchange, plus how to build a story bank before you walk in.';

const ONE_LINER =
  'This round is where a strong technical performance can still lose an offer. The interviewer is checking ' +
  'whether you can ship under ambiguity, own a production regression honestly, and work with people who don’t ' +
  'share your technical vocabulary — all things that matter more on an agentic AI team than on most engineering ' +
  'teams, precisely because the systems themselves are less predictable.';

type BehavioralQuestion = {theme: string; turns: Turn[]; guidance: string[]};

const QUESTIONS: BehavioralQuestion[] = [
  {
    theme: 'Shipping under ambiguity',
    turns: [
      {
        speaker: 'interviewer',
        text: '“Tell me about a time you had to build something without a clear spec for how it should behave.”',
      },
      {
        speaker: 'candidate',
        text: 'We were adding a tool-use step to an internal agent, and product hadn’t decided what the agent should do if two tools returned conflicting information. Rather than guess or block on a decision, I built the simplest version — surface both results to the user with a note that they conflicted — shipped it, and used the first week of real usage to figure out whether that was actually the right call.',
      },
      {
        speaker: 'interviewer',
        text: '“Why not just wait for product to decide?”',
      },
      {
        speaker: 'candidate',
        text: 'Because we didn’t have real examples of the conflict happening yet, so any decision made in the abstract would have been a guess anyway. Shipping the honest, simple version turned the abstract question into a concrete one we could actually look at data for.',
      },
    ],
    guidance: [
      'Good answers show a bias toward a small, honest, reversible decision over waiting for permission or overbuilding for a hypothetical.',
      'Naming what you deliberately left simple or unhandled, and why, reads as judgment — not as a gap in rigor.',
      'A vague answer like “we just figured it out as a team” without your specific role in the decision is a common way this question goes wrong.',
    ],
  },
  {
    theme: 'Handling a production regression',
    turns: [
      {
        speaker: 'interviewer',
        text: '“Walk me through a time an agent or model change you shipped made something worse in production.”',
      },
      {
        speaker: 'candidate',
        text: 'I changed a retrieval step to pull more context per query, assuming more context would mean better answers. Answer quality on our eval set actually dropped, because the extra context was pushing relevant passages further from where the model tends to pay attention. I caught it because we ran the eval set before wider rollout, not after.',
      },
      {
        speaker: 'interviewer',
        text: '“What did you do once you saw the regression?”',
      },
      {
        speaker: 'candidate',
        text: 'Reverted the change immediately rather than trying to patch it live, then went back and actually looked at which examples got worse instead of which got better, since that’s where the real signal was. Turned out the fix was reordering retrieved chunks by relevance rather than raw match score, not reducing the amount of context.',
      },
    ],
    guidance: [
      'The interviewer is listening for “I had a way to catch this before it hurt users,” not just “I fixed it once it was reported.”',
      'Owning the mistake plainly — no hedging, no blaming an ambiguous spec — reads far better than a technically accurate but defensive account.',
      'A concrete detail about what you learned and changed afterward is what separates this from a generic “I fixed a bug” story.',
    ],
  },
  {
    theme: 'Deciding when not to add another agent or tool',
    turns: [
      {
        speaker: 'interviewer',
        text: '“Tell me about a time you pushed back on adding complexity to an agent system, even though it was tempting.”',
      },
      {
        speaker: 'candidate',
        text: 'A teammate wanted to split our single support agent into three specialized agents — one for triage, one for drafting, one for review — believing it would improve quality. I asked if we had evidence the single agent was actually failing on some class of task, and we didn’t, we just had an intuition. I suggested we measure the single agent against our eval set first.',
      },
      {
        speaker: 'interviewer',
        text: '“How did that land with the teammate who wanted the multi-agent version?”',
      },
      {
        speaker: 'candidate',
        text: 'They were a little frustrated at first, understandably, since they’d already sketched the architecture. But once we ran the eval and the single agent scored fine on everything except one specific ticket type, we only added a second agent for that one case, which ended up being a smaller, more defensible change than the original plan.',
      },
    ],
    guidance: [
      'This question tests whether you default to simplicity or to architecture-for-its-own-sake — agentic systems are especially prone to complexity creep that doesn’t pay for itself.',
      'A good answer shows you can disagree with a teammate’s technical instinct respectfully and resolve it with evidence rather than seniority or opinion.',
      'Watch for candidates who only have stories about adding complexity, never about resisting it — that’s a real signal on agent-heavy teams.',
    ],
  },
  {
    theme: 'Working with product or support on agent scope',
    turns: [
      {
        speaker: 'interviewer',
        text: '“Tell me about a time you had to explain to a non-technical stakeholder why an agent couldn’t do something they wanted.”',
      },
      {
        speaker: 'candidate',
        text: 'Support leadership wanted our agent to auto-approve refunds above our normal cap for “VIP” customers, judged case by case. I explained that “judged case by case” isn’t something I could turn into a reliable rule, and that a model deciding on its own who counts as VIP-worthy would be inconsistent in ways that would eventually look like favoritism or a bug.',
      },
      {
        speaker: 'interviewer',
        text: '“Did they push back?”',
      },
      {
        speaker: 'candidate',
        text: 'A bit, since from their side it sounded like a small ask. I proposed a version that actually worked: a human-reviewed flag the agent could raise for cases it thought deserved special handling, so the judgment call stayed with a person, but the agent still made the process faster instead of trying to own the decision itself.',
      },
    ],
    guidance: [
      'This checks whether you can translate a technical constraint into terms a non-technical stakeholder actually cares about, instead of just saying “that’s not possible.”',
      'Offering an alternative that solves the real underlying need is a much stronger answer than simply explaining why the original ask was a bad idea.',
      'Watch for a story that ends in a standoff rather than a resolution — the strongest answers show the working relationship staying intact afterward.',
    ],
  },
];

const STORY_BANK_STEPS: Step[] = [
  {
    title: 'Pull from real agent or RAG work, not hypotheticals',
    body: 'A lab from this curriculum you actually built, debugged, or deployed counts as real experience for this round — it doesn’t need to be from a paid job.',
  },
  {
    title: 'Write down five to seven stories before the interview, not during it',
    body: 'One story each for: shipping under ambiguity, a production regression, resisting unnecessary complexity, a disagreement with a non-technical stakeholder, and a time you were wrong about a technical call.',
  },
  {
    title: 'Structure each one as situation, action, result — in that order',
    body: 'Interviewers are trained to listen for the same three beats; a story that meanders through context for two minutes before naming your actual contribution reads as unpracticed, even if the underlying story is good.',
  },
  {
    title: 'Say “I,” not “we”',
    body: 'Interviewers need to isolate your individual contribution — a story where every sentence is “we decided” makes it impossible to tell what you actually did versus what the team did around you.',
  },
  {
    title: 'Include at least one story where you were wrong',
    body: 'A candidate whose every story ends in vindication reads as either unreflective or selectively edited. Owning a real mistake, and what changed afterward, is read as a maturity signal.',
  },
  {
    title: 'Practice the two-minute version out loud',
    body: 'A story that takes six minutes to tell buries the point. Time yourself, cut ruthlessly, and keep only the details that change how the interviewer would evaluate you.',
  },
  {
    title: 'Prepare one story about disagreeing with a teammate',
    body: 'Agent architecture decisions are opinionated and often reversible-in-hindsight — this round wants to see you can disagree on substance without it becoming personal.',
  },
  {
    title: 'Have a real answer for “what would you do differently”',
    body: 'Nearly every story gets this follow-up. An answer that’s just modest deflection reads worse than a specific, honest change you’d actually make.',
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
          content="AI engineer behavioral interview questions, applied AI engineer interview prep"
        />
      </Head>
      <main className={styles.page}>
        <div className="container">
          <PageHeader
            title={TITLE}
            oneLiner={ONE_LINER}
            meta={['30–45 minutes', 'Usually with a future manager or teammate', 'Story-based, not hypothetical']}
          />

          <Section title="What to expect">
            <p>
              This round is rarely a surprise in format — it’s the familiar “tell me about a time” structure most
              engineering interviews use. What’s specific to this role is the subject matter: shipping systems that
              behave probabilistically, owning a regression in something that’s hard to fully test in advance, and
              explaining technical limits to people who don’t think in terms of tokens, retrieval, or tool calls.
            </p>
          </Section>

          <Section title="Four sample questions, and how to read them">
            <p>
              These aren’t the exact questions you’ll be asked, but the themes underneath them show up constantly
              across companies hiring for this role:
            </p>
            {QUESTIONS.map((question) => (
              <QuestionBlock key={question.theme} question={question} />
            ))}
          </Section>

          <Section title="Build your story bank before the interview, not during it">
            <p>
              The single biggest difference between a strong and a weak behavioral round isn’t the quality of the
              underlying experience, it’s whether the stories were prepared in advance.
            </p>
            <StepList items={STORY_BANK_STEPS} />
            <div className={styles.insightBox}>
              <p>
                <strong>Say “I,” not “we.”</strong> It’s the single most common note interviewers give after this
                round — not because teamwork doesn’t matter, but because the interviewer’s job is specifically to
                figure out what you did, and a story told entirely in the first-person plural makes that
                impossible to assess.
              </p>
            </div>
          </Section>

          <Section title="When it's worth asking a clarifying question">
            <p>
              Unlike the technical or system design rounds, clarifying questions here are less about the prompt and
              more about scope: if a question is genuinely ambiguous between two different experiences you could
              draw on, it’s reasonable to ask “are you looking for something more about technical judgment, or
              more about working with a stakeholder?” A quick check like that is read as thoughtful, not as
              stalling, as long as it’s asked once and answered decisively.
            </p>
          </Section>

          <SubNav
            prev={{label: 'Back: the system design round', to: '/career-tracks/applied-agentic-ai-engineer/system-design'}}
            next={{label: 'Back to the overview', to: '/career-tracks/applied-agentic-ai-engineer'}}
          />
        </div>
      </main>
    </Layout>
  );
}
