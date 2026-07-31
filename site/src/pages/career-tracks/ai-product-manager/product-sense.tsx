import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Heading from '@theme/Heading';

import {
  PageHeader,
  Section,
  StepList,
  CalloutList,
  Dialogue,
  Diagram,
  SubNav,
  styles,
  type Step,
  type Callout,
  type Turn,
} from './_shared';

const TITLE = 'The AI Product Sense Round';

const META_DESCRIPTION =
  'Three full AI product sense walkthroughs for an AI Product Manager interview — a keyword-search feature ' +
  'someone wants to bolt AI onto, an ambiguous growth case, and a hallucination/trust scenario — written as a ' +
  'live interviewer/candidate exchange, plus the framework every version of this round shares.';

const ONE_LINER =
  'Nearly every top AI company runs some version of this round, and it’s the one traditional PM prep doesn’t ' +
  'cover. It looks like classic product sense — an ambiguous prompt, a whiteboard, forty-five minutes — but the ' +
  'evaluation criteria are different: does AI actually belong here, can you scope around a model’s unreliability ' +
  'instead of assuming perfection, and do you know what to do when the model is confidently wrong. Below is the ' +
  'framework, then three full scenarios, written the way the room actually sounds.';

const FRAMEWORK_STEPS: Step[] = [
  {
    title: 'Push back on the premise before designing anything',
    body: 'The most common trap in this round is a stakeholder who’s already decided AI is the answer. Asking “what problem are we actually solving, and does it need AI” before sketching a solution is the single clearest signal of real product sense, not a failure to be decisive.',
  },
  {
    title: 'Anchor on a real user problem before a model capability',
    body: '“We have this model, what can we build with it” is backwards. Naming the specific user pain first, then asking whether AI is the right tool for that pain, is what separates product thinking from feature thinking.',
  },
  {
    title: 'Design for visible, correctable AI — not silent authority',
    body: 'An AI feature that states an answer with no way to see where it came from or fix it when it’s wrong will erode trust the first time it’s confidently incorrect. Sources, confidence signals, and an edit path aren’t polish — they’re core to the design.',
  },
  {
    title: 'Define success metrics before declaring the feature done',
    body: 'A north-star metric plus at least one guardrail metric (a quality or trust signal, not just usage) has to exist before the feature ships, not be backfilled after a stakeholder asks how it’s doing.',
  },
  {
    title: 'Name the failure mode and the fallback',
    body: 'Every AI feature will sometimes be wrong. Saying out loud what wrong looks like for this specific feature, and what the product does when it happens, is what makes an answer feel shipped rather than theoretical.',
  },
];

const SCENARIO_TAGS = ['Bolt-on AI trap', 'Ambiguous growth case', 'Hallucination & trust'];

// ---------------------------------------------------------------------------
// Scenario 1 — Stakeholder wants AI bolted onto something that already works
// ---------------------------------------------------------------------------

const S1_TURNS: Turn[] = [
  {
    speaker: 'interviewer',
    text: '“Our internal docs search works fine — it’s keyword search, people find what they need. But leadership wants to add an AI chat assistant to it because ‘everyone’s doing AI search now.’ You’re the PM. Go.”',
  },
  {
    speaker: 'candidate',
    text: 'Before I design anything — what’s actually broken about the current search, from the user’s side? “People find what they need” sounds like the feature is already working, so I want to know what problem leadership thinks this solves.',
  },
  {
    speaker: 'interviewer',
    text: '“Nothing measurable. It’s mostly a competitive-optics thing — they saw a competitor announce AI search.”',
  },
  {
    speaker: 'candidate',
    text: 'Then I’d say that directly, not just design around it: shipping an AI feature with no user problem behind it risks real cost — hallucinated answers, added latency, added maintenance — for zero measurable benefit. If there is a real gap, though, keyword search does have a known weak spot: it fails on questions phrased differently than the doc’s wording. I’d want to check support tickets or search logs for “no results” or reformulated-query patterns before assuming that’s actually happening here.',
  },
  {
    speaker: 'interviewer',
    text: '“Say the logs do show that — about 15% of searches get reformulated two or three times before someone finds the doc, or gives up.”',
  },
  {
    speaker: 'candidate',
    text: 'That’s a real, measurable problem — semantic mismatch between how people ask and how docs are written — and it’s exactly what a retrieval-augmented system is good at, more than a full open-ended chat assistant is. I’d scope this narrower than “add an AI chat assistant”: start with better retrieval — embeddings-based semantic search layered on top of keyword search — before adding a generative answer on top.',
  },
  {
    speaker: 'interviewer',
    text: '“Why not just go straight to the full chat assistant leadership actually asked for?”',
  },
  {
    speaker: 'candidate',
    text: 'Because a generative answer on top of docs introduces a new failure mode that doesn’t exist today: a wrong, confidently-stated answer, versus today’s worst case, which is just no results. I’d ship the retrieval improvement first, measure whether the reformulation rate actually drops, and only add a generated answer — with visible source citations and an easy way to jump to the original doc — once retrieval is solid enough that the generated layer isn’t compounding a search problem with a trust problem.',
  },
  {
    speaker: 'interviewer',
    text: '“How do you know if this was worth it?”',
  },
  {
    speaker: 'candidate',
    text: 'Primary metric: the reformulation/no-result rate, the number we already know is broken — it should drop meaningfully. Guardrail metric, once the generated layer ships: a spot-checked or eval-set-measured hallucination rate on real queries, because a lower reformulation rate achieved by giving people a confident wrong answer instead of no answer isn’t actually a win.',
  },
];

const S1_PHASES: Step[] = [
  {
    title: 'Question the premise — is there a real problem, or just competitive optics?',
    body: 'Naming that “everyone’s doing AI” isn’t a user problem, before designing anything, is the first and most important move in this scenario.',
  },
  {
    title: 'Find the actual data — search logs, not assumption',
    body: 'Checking reformulation and no-result rates turns a vague stakeholder ask into a real, measurable problem worth solving — or confirms there isn’t one.',
  },
  {
    title: 'Scope to the smallest AI that solves the real problem',
    body: 'Semantic retrieval solves the actual gap (phrasing mismatch) without the added risk of a full generative chat assistant — right-sizing the solution to the problem, not the hype.',
  },
  {
    title: 'Sequence the riskier layer after the safer one is proven',
    body: 'Shipping retrieval improvements first, then adding generation with citations once retrieval is solid, avoids compounding a search problem with a trust problem.',
  },
  {
    title: 'Define the metric pair before calling it done',
    body: 'A primary metric (reformulation rate) paired with a guardrail metric (hallucination rate) prevents declaring victory on a number that hides a worse user experience.',
  },
];

const S1_FAILURES: Callout[] = [
  {
    title: 'Designing the chat assistant leadership asked for, without questioning it',
    body: 'Taking “add AI chat” at face value and going straight to feature design is the exact trap this scenario is built to test — it reads as feature-order-taking, not product judgment.',
  },
  {
    title: 'Confirming the problem exists, then jumping straight to the riskiest solution',
    body: 'Even once the reformulation problem is confirmed, going straight to a full generative assistant over a narrower retrieval fix misses the sequencing that limits risk.',
  },
  {
    title: 'Treating a lower reformulation rate as success on its own',
    body: 'A generated answer can “solve” reformulation by confidently answering wrong — without a paired quality or hallucination metric, that would look like a win and actually be a regression in trust.',
  },
];

// ---------------------------------------------------------------------------
// Scenario 2 — Ambiguous growth case
// ---------------------------------------------------------------------------

const S2_TURNS: Turn[] = [
  {
    speaker: 'interviewer',
    text: '“You’re a PM on an AI image-generation product with about a million weekly active users. You have three engineers for the next quarter. How would you double usage?”',
  },
  {
    speaker: 'candidate',
    text: 'Before picking a lever — is “usage” sessions, images generated, or unique weekly users? Those point at different problems, and doubling any one of them with three engineers in a quarter means picking one lever hard, not spreading thin across several.',
  },
  {
    speaker: 'interviewer',
    text: '“Let’s say weekly active users specifically — growing the user base, not just engagement from existing ones.”',
  },
  {
    speaker: 'candidate',
    text: 'Then I’d want to know where users are dropping off today — is it acquisition (people never trying it), activation (they try it once and don’t come back), or retention (they used it for a while and stopped)? With three engineers, I can’t attack all three, so I’d want funnel data before committing.',
  },
  {
    speaker: 'interviewer',
    text: '“Activation is the weak point — about 60% of new users generate one image and never return.”',
  },
  {
    speaker: 'candidate',
    text: 'That’s a strong, specific signal to work from. My hypothesis: the first generation isn’t landing well enough to create a reason to come back — either the output quality on a first, unguided prompt is weak, or the person doesn’t know how to get a better result and assumes the product can’t do what they wanted. I’d want to see a sample of first-session prompts and outputs before picking a fix.',
  },
  {
    speaker: 'interviewer',
    text: '“Say that’s roughly right — first-time prompts tend to be vague, and the output often doesn’t match what the person actually wanted.”',
  },
  {
    speaker: 'candidate',
    text: 'With three engineers, I’d put most of the effort into a guided first-generation flow — a short, structured prompt-building step for new users instead of a blank text box, so the first result is more likely to land. I’d pair that with a lightweight “not what you wanted? try this” refinement affordance right after the first image, since a second successful attempt in the same session is a much cheaper way to save a user than hoping they come back tomorrow.',
  },
  {
    speaker: 'interviewer',
    text: '“What do you explicitly decide not to do, given only three engineers?”',
  },
  {
    speaker: 'candidate',
    text: 'I’d explicitly not touch acquisition channels or retention/re-engagement campaigns this quarter — both are real levers, but splitting three engineers across all three funnel stages means shipping nothing well. I’d also skip any model-quality fine-tuning work, since the data points at a UX and expectation-setting problem in the first session, not a raw output-quality problem.',
  },
  {
    speaker: 'interviewer',
    text: '“How do you know in a quarter whether this actually worked, versus just feeling productive?”',
  },
  {
    speaker: 'candidate',
    text: 'Primary metric: second-session return rate for new users specifically — did the guided flow and refinement affordance actually convert more first-time users into a second session. I’d also track first-session generation count as a leading indicator, since it should move faster than the return-rate metric and tell me within weeks whether I’m on the right track, not just at the end of the quarter.',
  },
];

const S2_PHASES: Step[] = [
  {
    title: 'Disambiguate the metric before proposing anything',
    body: 'Sessions, images generated, and unique users are different problems — naming which one “usage” means, and refusing to guess, is the first real move in an intentionally ambiguous case.',
  },
  {
    title: 'Find the specific funnel stage that’s actually broken',
    body: 'Asking for acquisition/activation/retention data before picking a lever turns a vague growth prompt into a concrete, resourceable problem — a 60% one-and-done rate is a very different fix than a slow acquisition funnel.',
  },
  {
    title: 'Form a specific hypothesis before designing the fix',
    body: 'Naming “vague first prompts produce mismatched output” as the likely cause, and asking to confirm it with real session data, avoids designing a solution to an assumed problem.',
  },
  {
    title: 'Scope the fix to what three engineers can actually ship well',
    body: 'A guided first-generation flow plus an in-session refinement affordance is sized to the team; naming what’s explicitly out of scope (acquisition, retention, model fine-tuning) shows resourcing judgment, not just ambition.',
  },
  {
    title: 'Pick a metric pair that shows progress before quarter-end',
    body: 'A leading indicator (first-session generation count) alongside the real outcome metric (second-session return rate) means the team isn’t flying blind for three months waiting on one lagging number.',
  },
];

const S2_FAILURES: Callout[] = [
  {
    title: 'Proposing a grab-bag of tactics across the whole funnel',
    body: 'Listing five plausible growth ideas — better onboarding, a referral program, model quality improvements, marketing — without picking one and defending the trade-off is the clearest sign of un-scoped thinking in this round.',
  },
  {
    title: 'Skipping straight to a solution without asking for funnel data',
    body: 'Designing a fix for “low engagement” in the abstract, without asking where users actually drop off, means the fix could easily target the wrong stage entirely.',
  },
  {
    title: 'Ignoring the three-engineer constraint',
    body: 'Proposing a roadmap that would obviously take a much larger team, without acknowledging the resourcing limit at all, reads as not taking the constraint seriously — a core part of what this case is testing.',
  },
];

// ---------------------------------------------------------------------------
// Scenario 3 — Hallucination / trust scenario
// ---------------------------------------------------------------------------

const S3_TURNS: Turn[] = [
  {
    speaker: 'interviewer',
    text: '“We shipped an AI assistant inside our banking app that answers questions like ‘what’s my balance’ or ‘did my paycheck deposit yet.’ A user reports the assistant confidently told them their balance was $400 higher than it actually was. What do you do?”',
  },
  {
    speaker: 'candidate',
    text: 'First: is this assistant generating the answer from a model’s general reasoning, or is it grounded in a live pull from the actual account data? That changes whether this is a hallucination in the classic sense or a data-freshness or retrieval bug.',
  },
  {
    speaker: 'interviewer',
    text: '“It’s meant to be grounded — it’s supposed to query the account balance API and report the real number. But it phrased the answer in natural language, and this time the number was wrong.”',
  },
  {
    speaker: 'candidate',
    text: 'For a financial balance, that’s about as high-stakes as this gets — a wrong number stated with full confidence can cause real harm, like someone overdrafting because they trusted the assistant. Immediate step: I’d want to know how many other users got a wrong balance in the same window, so I know if this is one bad response or a systemic issue with the retrieval or API integration.',
  },
  {
    speaker: 'interviewer',
    text: '“Turns out about 2% of balance queries in the past 24 hours returned a stale or incorrect number, tied to a caching bug.”',
  },
  {
    speaker: 'candidate',
    text: 'That’s a real incident, not a one-off. Immediate mitigation: I’d push to disable natural-language balance answers right now and fall back to a direct link to the actual account page, until the caching bug is fixed and re-verified — for something this sensitive, a slower but definitely-correct experience beats a fast but sometimes-wrong one.',
  },
  {
    speaker: 'interviewer',
    text: '“Longer term, how do you redesign this so it doesn’t happen again, or so it’s less damaging when it does?”',
  },
  {
    speaker: 'candidate',
    text: 'A few layers. First, for account-specific numeric facts like balance, I’d always show the raw number pulled directly from the API alongside — or instead of — a generated sentence, so there’s a source the user can trust independent of the model’s phrasing. Second, I’d add a confidence or freshness signal — “as of 2 minutes ago” — so staleness is visible instead of silent. Third, for anything above a set risk threshold — balance, transfers, anything with a dollar amount — I’d bias toward showing the number, not narrating it, since narration is exactly where a caching or formatting bug can silently introduce an error the raw display wouldn’t.',
  },
  {
    speaker: 'interviewer',
    text: '“What hallucination or error rate would you consider acceptable for a feature like this going forward, and how would you enforce it?”',
  },
  {
    speaker: 'candidate',
    text: 'For anything touching an actual account number, I’d target as close to zero as realistically achievable — this isn’t a case for “mostly right is fine,” because the cost of one wrong answer is asymmetric with the cost of the assistant being slightly less convenient. Concretely, I’d set an alerting threshold — even 0.1% of balance queries disagreeing with a direct API check — that pages someone automatically, rather than waiting for a user complaint to be the detection mechanism.',
  },
];

const S3_PHASES: Step[] = [
  {
    title: 'Classify the failure — hallucination vs. grounding/data bug',
    body: 'Confirming the assistant is supposed to be grounded in real data changes this from “the model made something up” to “the retrieval or caching layer served a wrong number” — a different root cause with a different fix.',
  },
  {
    title: 'Check blast radius before anything else',
    body: 'For a financial feature, knowing how many users got a wrong number in the same window is the difference between a one-off and an active incident needing an immediate mitigation.',
  },
  {
    title: 'Mitigate toward the safer, verifiable path',
    body: 'Falling back to a direct link to the real account page — slower but correct — is the right trade for a high-stakes numeric fact, until the underlying bug is fixed and re-verified.',
  },
  {
    title: 'Redesign for visibility over narration',
    body: 'Showing the raw number with a freshness signal, instead of only a generated sentence, gives the user an independent way to trust the answer and makes staleness visible instead of silent.',
  },
  {
    title: 'Commit to a specific, enforced error-rate threshold',
    body: 'Naming a concrete number — not “as low as possible” — and an automated alert tied to it turns trust into something measured and enforced, not just hoped for.',
  },
];

const S3_FAILURES: Callout[] = [
  {
    title: 'Treating this as a one-off bad response instead of checking for a pattern',
    body: 'Apologizing to the one user and moving on, without checking whether this is systemic, risks leaving an active incident live and affecting more users while it’s being treated as resolved.',
  },
  {
    title: 'Proposing “make the model better” as the whole fix',
    body: 'For a grounded numeric fact like account balance, the fix belongs in the retrieval and display layer, not in trying to prompt or fine-tune the model into being more careful — that’s solving the wrong layer of the problem.',
  },
  {
    title: 'Staying vague on the acceptable error rate',
    body: '“As low as possible” or “we’ll monitor it” doesn’t answer the question. For a high-stakes numeric fact, refusing to commit to a specific threshold and an enforcement mechanism reads as avoiding the hard part of the question.',
  },
];

// ---------------------------------------------------------------------------

function Scenario({
  index,
  tag,
  title,
  prompt,
  turns,
  diagram,
  phasesTitle,
  phases,
  failures,
}: {
  index: number;
  tag: string;
  title: string;
  prompt: string;
  turns: Turn[];
  diagram: string;
  phasesTitle: string;
  phases: Step[];
  failures: Callout[];
}): ReactNode {
  return (
    <div className={styles.caseStudy}>
      <p className={styles.caseStudyEyebrow}>
        Scenario {index} &middot; {tag}
      </p>
      <Heading as="h3">{title}</Heading>
      <p className={styles.aside}>{prompt}</p>
      <Dialogue turns={turns} />
      <Heading as="h4" className={styles.stepTitle} style={{marginTop: '2rem'}}>
        How this decomposes
      </Heading>
      <Diagram value={diagram} />
      <Heading as="h4" className={styles.stepTitle} style={{marginTop: '1.5rem'}}>
        {phasesTitle}
      </Heading>
      <StepList items={phases} />
      <Heading as="h4" className={styles.stepTitle} style={{marginTop: '1.5rem'}}>
        Where this could fall apart
      </Heading>
      <CalloutList items={failures} />
    </div>
  );
}

export default function ProductSense(): ReactNode {
  return (
    <Layout title={TITLE} description={META_DESCRIPTION}>
      <Head>
        <meta
          name="keywords"
          content="AI product sense interview, AI PM product sense round, product sense interview questions"
        />
      </Head>
      <main className={styles.page}>
        <div className="container">
          <PageHeader
            title={TITLE}
            oneLiner={ONE_LINER}
            meta={['45–60 minutes', 'Runs at nearly every top AI company', 'Whiteboard or shared doc, case-style']}
          />

          <Section title="The framework, before the scenarios">
            <p>
              Every version of this round follows the same underlying shape, no matter the specific prompt. The
              interviewer is grading how you reason about whether and how to use AI, not just whether you land on
              a plausible-sounding feature idea.
            </p>
            <StepList items={FRAMEWORK_STEPS} />
            <div className={styles.insightBox}>
              <p>
                <strong>The single most common failure mode: designing the AI feature the interviewer describes, instead of questioning it first.</strong>{' '}
                Multiple interview guides describe planted “AI for AI’s sake” prompts specifically to see whether
                a candidate pushes back — going straight to a solution is the most common way candidates miss
                this round entirely.
              </p>
            </div>
            <div className={styles.chipRow}>
              {SCENARIO_TAGS.map((tag) => (
                <span key={tag} className={styles.chip}>
                  {tag}
                </span>
              ))}
            </div>
            <p className={styles.aside}>
              These three scenarios are illustrative training material, written to match the failure modes named
              across real postings and industry sources — not transcripts of an actual interview at a named
              company. Read them the way you’d rehearse for the real thing.
            </p>
          </Section>

          <Section title="Three end-to-end walkthroughs">
            <Scenario
              index={1}
              tag="Bolt-on AI trap"
              title="A stakeholder wants AI chat added to a keyword search that already works"
              prompt="“Our internal docs search works fine, but leadership wants to add an AI chat assistant because ‘everyone’s doing AI search now.’ You’re the PM. Go.”"
              turns={S1_TURNS}
              diagram={`flowchart TD
    A["Stakeholder: add AI chat\\nto working search"] --> B{"Is there a real\\nuser problem?"}
    B -->|"check logs"| C["15% of searches\\nreformulated 2-3x"]
    C --> D["Real problem: phrasing\\nmismatch, not chat"]
    D --> E["Scope narrow: semantic\\nretrieval first"]
    E --> F["Ship + measure:\\nreformulation rate"]
    F --> G["Only then add generated\\nanswer + citations"]
    G --> H["Guardrail metric:\\nhallucination rate"]`}
              phasesTitle="How this decomposes"
              phases={S1_PHASES}
              failures={S1_FAILURES}
            />

            <Scenario
              index={2}
              tag="Ambiguous growth case"
              title="Double weekly active users on an AI image tool with three engineers, one quarter"
              prompt="“You’re a PM on an AI image-generation product with about a million weekly active users. You have three engineers for the next quarter. How would you double usage?”"
              turns={S2_TURNS}
              diagram={`flowchart TD
    A["Double 'usage' —\\nwhich metric?"] --> B["Confirmed: weekly\\nactive users"]
    B --> C{"Which funnel stage\\nis broken?"}
    C -->|"data"| D["60% one-and-done\\nafter first image"]
    D --> E["Hypothesis: vague first\\nprompts, mismatched output"]
    E --> F["Scope to 3 engineers:\\nguided first-gen flow"]
    F --> G["+ in-session refinement\\naffordance"]
    G --> H["Explicitly skip: acquisition,\\nretention, fine-tuning"]
    H --> I["Metrics: 2nd-session return\\n+ leading indicator"]`}
              phasesTitle="How this decomposes"
              phases={S2_PHASES}
              failures={S2_FAILURES}
            />

            <Scenario
              index={3}
              tag="Hallucination & trust"
              title="A banking AI assistant confidently states the wrong account balance"
              prompt="“Our AI assistant told a user their balance was $400 higher than it actually was. What do you do?”"
              turns={S3_TURNS}
              diagram={`flowchart TD
    A["User reports wrong\\nbalance stated confidently"] --> B{"Hallucination or\\ngrounding/data bug?"}
    B -->|"meant to be grounded"| C["Check blast radius:\\nhow many users affected"]
    C --> D["2% of queries wrong,\\ncaching bug"]
    D --> E["Mitigate: disable NL answer,\\nfall back to direct link"]
    E --> F["Redesign: show raw number\\n+ freshness signal"]
    F --> G["Bias to display over\\nnarration for high-risk facts"]
    G --> H["Commit to error threshold\\n+ automated alert"]`}
              phasesTitle="How this decomposes"
              phases={S3_PHASES}
              failures={S3_FAILURES}
            />
          </Section>

          <SubNav
            prev={{label: 'Back: the technical round', to: '/career-tracks/ai-product-manager/technical-round'}}
            next={{label: 'Next: the behavioral round', to: '/career-tracks/ai-product-manager/behavioral-round'}}
          />
        </div>
      </main>
    </Layout>
  );
}
