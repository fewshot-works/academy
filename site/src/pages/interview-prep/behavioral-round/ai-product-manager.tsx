import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Heading from '@theme/Heading';

import {PageHeader, Section, StepList, Dialogue, SubNav, styles, type Step, type Turn} from '../_shared';

const TITLE = 'The Behavioral / Stakeholder Round';

const META_DESCRIPTION =
  'Four sample behavioral questions for an AI Product Manager interview, written as a live interviewer/' +
  'candidate exchange, plus how to build a story bank before you walk in — including the single most ' +
  'differentiating answer this round tests for.';

const ONE_LINER =
  'Some companies call this the stakeholder round, others fold it into an onsite loop with your future manager, ' +
  'but the substance is consistent: can you launch honestly with known model limitations, work productively with ' +
  'data scientists when the model is inconsistent, and — the single most telling question in this round — have ' +
  'you ever killed an AI idea because a boring, non-AI solution was actually better. None of it is about ' +
  'technical depth; the technical and product-sense rounds already covered that.';

type BehavioralQuestion = {theme: string; turns: Turn[]; guidance: string[]};

const QUESTIONS: BehavioralQuestion[] = [
  {
    theme: 'Launching with known model limitations',
    turns: [
      {
        speaker: 'interviewer',
        text: '"Tell me about a time you had to decide whether to launch an AI feature even though you knew it wouldn\'t be perfect."',
      },
      {
        speaker: 'candidate',
        text: 'We built a feature that auto-drafted customer support replies. Our eval set showed about a 6% rate of factually wrong drafts — not dangerous, but wrong enough that shipping it as fully automated would have hurt trust. Leadership wanted to launch on the original date regardless.',
      },
      {
        speaker: 'interviewer',
        text: '"What did you actually do?"',
      },
      {
        speaker: 'candidate',
        text: 'I didn\'t argue for delaying the launch — I argued for changing what shipped. We launched on schedule, but as a draft-and-review flow instead of fully automated: the agent always saw the AI draft before it went to the customer. That let us ship the real value — faster replies — on time, without exposing customers directly to a 6% error rate we hadn\'t solved yet.',
      },
    ],
    guidance: [
      'The interviewer wants to hear a specific, measured limitation (a real number, not "it wasn\'t perfect") and a specific mitigation, not a decision to simply wait until the model was flawless — that decision rarely gets made in this field.',
      'Reframing the launch itself — automation level, review step, scope — instead of just the timeline shows product judgment, not just risk awareness.',
      'Watch for candidates who either shipped something known to be unsafe, or refused to ship anything short of perfect — both read as missing the actual skill being tested: shipping responsibly under real uncertainty.',
    ],
  },
  {
    theme: 'Working with inconsistent model predictions',
    turns: [
      {
        speaker: 'interviewer',
        text: '"Tell me about a time a model\'s output was inconsistent or unreliable in a way that affected your roadmap, and how you worked with your data science or ML team on it."',
      },
      {
        speaker: 'candidate',
        text: 'We had a document-classification model that was 94% accurate in offline eval, but the errors weren\'t evenly distributed — it was much worse on one document type that happened to be high-value for a specific customer segment. The data science team\'s instinct was to report the overall accuracy number as the health metric.',
      },
      {
        speaker: 'interviewer',
        text: '"How did you push on that without it turning into a fight over whose metric was right?"',
      },
      {
        speaker: 'candidate',
        text: 'I brought the segmented breakdown, not just an objection — accuracy by document type, weighted by how much that type mattered to revenue-relevant customers. That reframed the conversation from "is 94% good" to "is 94% good for the segment that actually matters," which is a question the data science team was well-equipped to help solve once it was framed that way. We ended up prioritizing a targeted fine-tune on that one document type instead of chasing overall accuracy further.',
      },
    ],
    guidance: [
      'This is one of the most commonly named friction points in real AI PM postings — the gap between an aggregate model metric and what a specific user or segment actually experiences. A strong answer shows fluency in reading past the headline number.',
      'Bringing a segmented breakdown, not just an intuition that something felt off, is the tell of a PM who can actually partner with a data science team rather than just relay complaints to them.',
      'A story that ends in the PM overruling the data scientists on a purely technical call undersells the skill — the goal is a shared framing that lets both sides do their part.',
    ],
  },
  {
    theme: 'Killing an AI idea',
    turns: [
      {
        speaker: 'interviewer',
        text: '"Tell me about a time you decided not to build something with AI, even though there was pressure to use it."',
      },
      {
        speaker: 'candidate',
        text: 'A stakeholder wanted an AI-generated weekly summary email for account managers, pulling from CRM activity. It sounded impressive in a roadmap review. But when I actually mapped the user need, account managers mostly wanted three specific numbers — open opportunities, at-risk accounts, and overdue follow-ups — surfaced quickly, not a paragraph explaining them.',
      },
      {
        speaker: 'interviewer',
        text: '"So what did you build instead, and how did that conversation go?"',
      },
      {
        speaker: 'candidate',
        text: 'A simple rules-based dashboard with those three numbers, no model involved, shipped in about a third of the time a generative summary would have taken, with zero risk of a wrong number being stated confidently in a paragraph. The stakeholder pushed back initially — it felt like a step down from the AI pitch — but adoption ended up higher than any of our AI features that quarter, because it was faster and more trustworthy for exactly what people needed.',
      },
    ],
    guidance: [
      'This is close to the single most differentiating question in this round. Interviewers are explicitly listening for a candidate who can recognize when AI adds latency, cost, and risk without adding real value — not just candidates who can list AI feature ideas.',
      'A concrete alternative that actually shipped, not just "we decided not to do it," is what makes this a real story instead of a safe platitude.',
      'Watch for candidates who can\'t produce this story at all — in a field where every roadmap review has pressure to add AI somewhere, never having pushed back is itself a signal worth probing.',
    ],
  },
  {
    theme: 'Explaining hallucination to a non-technical stakeholder',
    turns: [
      {
        speaker: 'interviewer',
        text: '"Tell me about a time you had to explain a model\'s failure — like a hallucination — to a stakeholder who wasn\'t technical, in a way that didn\'t either overwhelm them or oversimplify the risk."',
      },
      {
        speaker: 'candidate',
        text: 'Our AI assistant gave a customer a wrong return-policy detail, and the account exec who escalated it wanted to know "how do we make sure the AI stops lying." I didn\'t start with the technical mechanism — I started by reframing "lying" as "the model can state something confidently without actually knowing it\'s true, the same way a person might misremember a policy instead of checking it."',
      },
      {
        speaker: 'interviewer',
        text: '"Where did the conversation go from there?"',
      },
      {
        speaker: 'candidate',
        text: 'From that framing, the fix made sense without needing technical detail: instead of trying to make the model never misremember, we changed the design so it always checks the actual policy document before answering instead of answering from memory, and shows the source. I gave the exec a concrete number too — our target was under 1% of policy answers being wrong, measured weekly — so "stop lying" became a specific, trackable commitment instead of an open-ended promise.',
      },
    ],
    guidance: [
      'An analogy that makes the failure mode intuitive — without either dumbing it down to "the AI is broken" or drowning the stakeholder in model internals — is exactly the translation skill this question tests.',
      'Turning a vague stakeholder demand ("stop lying") into a specific, measurable commitment shows the candidate can manage expectations, not just explain a concept.',
      'A story that ends in blaming the stakeholder for not understanding AI, rather than adapting the explanation, is a clear miss on this round.',
    ],
  },
];

const STORY_BANK_STEPS: Step[] = [
  {
    title: 'Pull from real product work, even a small or unshipped feature',
    body: 'A feature from a side project, a past role, or something built using this curriculum\'s labs all count. The interviewer cares about the reasoning pattern, not whether the product was widely used.',
  },
  {
    title: 'Write down one story for each of the four themes above, before the interview',
    body: 'Launching with known limitations, bridging a data-science disagreement, killing an AI idea, and explaining a failure to a non-technical stakeholder — these four show up, in some form, across nearly every AI PM loop.',
  },
  {
    title: 'Prepare the killed-AI-idea story specifically, even if it\'s uncomfortable',
    body: 'Of the four, this is the one candidates most often don\'t have ready, because it feels like admitting AI wasn\'t the answer. Having one — a real case where you chose a simpler, non-AI solution — is one of the most differentiating things you can bring into this round.',
  },
  {
    title: 'Structure each one as situation, action, result',
    body: 'Interviewers are trained to listen for these three beats specifically; burying your actual decision under two minutes of context reads as unpracticed even when the underlying story is strong.',
  },
  {
    title: 'Say "I," not "we"',
    body: 'The interviewer needs to isolate your individual judgment call from the team\'s — a story told entirely in "we decided" makes that impossible to assess.',
  },
  {
    title: 'Practice the ninety-second version out loud',
    body: 'Especially for the hallucination-explanation story — a full explanation that takes five minutes to narrate buries the actual translation skill the interviewer is listening for.',
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
          content="AI PM behavioral interview questions, AI product manager interview prep"
        />
      </Head>
      <main className={styles.page}>
        <div className="container">
          <PageHeader
            title={TITLE}
            oneLiner={ONE_LINER}
            meta={['30–45 minutes', 'Often with your future manager', 'Story-based, not hypothetical']}
            backTo="/career-tracks/ai-product-manager"
            backLabel="AI Product Manager"
          />

          <Section title="What to expect">
            <p>
              The familiar "tell me about a time" structure, applied to AI-specific product judgment
              specifically: how you handle known limitations at launch, how you work across the PM/data-science
              boundary, whether you can hold the line against unnecessary AI, and how you translate model
              behavior for people who don\'t think in model terms.
            </p>
          </Section>

          <Section title="Four sample questions, and how to read them">
            <p>
              These aren\'t the exact questions you\'ll be asked, but the four themes underneath them show up
              constantly across companies hiring for this role — from published AI PM interview guides to
              hiring-manager accounts of what actually gets asked:
            </p>
            {QUESTIONS.map((question) => (
              <QuestionBlock key={question.theme} question={question} />
            ))}
          </Section>

          <Section title="Build your story bank before the interview, not during it">
            <p>
              The single biggest difference between a strong and a weak behavioral round isn\'t the quality of
              the underlying experience, it\'s whether the stories were prepared in advance.
            </p>
            <StepList items={STORY_BANK_STEPS} />
            <div className={styles.insightBox}>
              <p>
                <strong>Have a killed-AI-idea story ready — it\'s the one most candidates skip.</strong> Across
                the sources consulted for this guide, the ability to recognize when AI is the wrong tool, and
                say so, comes up repeatedly as the trait that separates a hireable AI PM from someone who just
                likes AI. If you don\'t have one yet, it\'s worth deliberately looking for the opportunity before
                you need it in an interview.
              </p>
            </div>
          </Section>

          <SubNav
            prev={{label: 'Back: the AI product sense round', to: '/interview-prep/case-studies/ai-product-manager'}}
            next={{label: 'Back to the overview', to: '/career-tracks/ai-product-manager'}}
          />
        </div>
      </main>
    </Layout>
  );
}
