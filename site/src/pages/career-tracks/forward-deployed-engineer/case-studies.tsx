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

const TITLE = 'The Case-Study Round';

const META_DESCRIPTION =
  'Three full end-to-end FDE case studies — public safety, logistics, and banking — written as a live interviewer/candidate walkthrough, with architecture, decomposition, and failure modes for each.';

const ONE_LINER =
  'This is the round every source flags as the real filter: lowest pass rate of the loop, highest weight in the ' +
  'decision. A hypothetical customer hands you a vague problem, and for 45–60 minutes you think out loud while ' +
  'the interviewer plays the customer — adding constraints, pushing back, and watching how you handle not ' +
  'knowing something yet. Below is the framework, then three full walkthroughs across three different ' +
  'industries, written the way the room actually sounds.';

const FRAMEWORK_STEPS: Step[] = [
  {
    title: 'Clarify the goal before anything else',
    body: 'What does success actually look like, and for whom? “Reduce response times” and “reduce complaints about response times” are different projects with different data.',
  },
  {
    title: 'Identify stakeholders and metrics',
    body: 'Who signs off, who uses the thing daily, and what number will they be looking at in six months? The person paying for it and the person using it often want different things.',
  },
  {
    title: 'Map what already exists',
    body: 'What systems, data, and workflows are already in place? You’re almost never building on a blank slate — you’re integrating with something old, inconsistent, and load-bearing.',
  },
  {
    title: 'Decompose by risk, not by feature',
    body: 'Attack the riskiest unknown first — the thing most likely to invalidate the whole plan — instead of building the easiest, most demo-able piece first.',
  },
  {
    title: 'Propose a minimal end-to-end skeleton before hardening',
    body: 'A thin slice that runs start to finish, even if every part of it is crude, beats a polished piece that only covers a third of the problem. It’s also the fastest way to find out where you’re wrong.',
  },
];

const CASE_STUDY_TAGS = ['Public safety / government', 'Logistics / supply chain', 'Financial services / banking'];

// ---------------------------------------------------------------------------
// Case study 1 — Public safety
// ---------------------------------------------------------------------------

const CS1_TURNS: Turn[] = [
  {
    speaker: 'interviewer',
    text: '“I run IT for a mid-size city. Our council wants us to cut 911 response times, and they’ve heard AI can help. Where would you even start?”',
  },
  {
    speaker: 'candidate',
    text: 'Before I propose anything — how is “response time” actually measured today? Call answered to unit dispatched, or call answered to unit on scene?',
  },
  {
    speaker: 'interviewer',
    text: '“On scene. Council sees an average number every quarter and it’s crept up over two years.”',
  },
  {
    speaker: 'candidate',
    text: 'That number is really three numbers added together: call-taking time, dispatch decision time, and drive time. Do we know which of those three is actually driving the increase, or are we assuming it’s dispatch?',
  },
  {
    speaker: 'interviewer',
    text: '“Honestly, nobody’s broken it down like that. We just assumed dispatch, since that’s the part that feels manual.”',
  },
  {
    speaker: 'candidate',
    text: 'Then step one isn’t a model, it’s a diagnosis — pull the CAD (computer-aided dispatch) logs and split the average into those three segments by shift and district. That’s a data question, not an AI question, and it might change everything downstream. What system generates those logs, and can we get raw exports?',
  },
  {
    speaker: 'interviewer',
    text: '“We run a commercial CAD platform. IT can get exports, but there’s no live API — it’s nightly batch files, and CJIS rules restrict who can even see raw call data.”',
  },
  {
    speaker: 'candidate',
    text: 'Good to know up front — that shapes the architecture more than anything else so far. One more question before I sketch anything: if the diagnosis does point at dispatch decisions, are we talking about recommending which unit to send, or is there any appetite for the system deciding that automatically?',
  },
  {
    speaker: 'interviewer',
    text: '“Never automatically. If a wrong call gets someone hurt, a human made that call, not a vendor’s AI. That’s non-negotiable, and honestly it’s the first thing legal will ask about.”',
  },
  {
    speaker: 'candidate',
    text: 'That’s the constraint the whole design has to respect, so let me build around it rather than bolt it on after. Say the diagnosis does confirm dispatch decisions are the biggest lever. I’d propose two things, both advisory, never autonomous: a real-time suggestion at the dispatcher’s console — “Unit 12 is 90 seconds closer than Unit 7 based on current traffic” — and a slower, nightly analysis that looks for patterns across weeks of calls, like a district that’s consistently under-resourced on Friday nights, and hands that to a shift commander as a report, not an action.',
  },
  {
    speaker: 'interviewer',
    text: '“The real-time piece worries me. What happens the first time it suggests the wrong unit and a dispatcher just does what it says instead of thinking?”',
  },
  {
    speaker: 'candidate',
    text: 'That’s exactly why I wouldn’t launch it visibly on day one. First phase is shadow mode — the recommendation runs silently for a few weeks, we log how often it agrees with what the dispatcher actually chose, and we only turn on the visible suggestion once we can show the accuracy number to the department, not just to us. Trust has to be earned before the suggestion goes on screen.',
  },
  {
    speaker: 'interviewer',
    text: '“Fair. Given the six-month budget cycle we’re actually working with, what ships first?”',
  },
  {
    speaker: 'candidate',
    text: 'The diagnosis and the nightly report — no live recommendation yet. It’s lower risk, doesn’t touch a dispatcher’s live workflow, and it’s the thing most likely to show council a number moving before the next budget review. The real-time console suggestion is phase two, after shadow-mode data backs it up.',
  },
];

const CS1_PHASES: Step[] = [
  {
    title: 'Phase 0 — diagnose before building anything',
    body: 'Pull CAD exports, split average response time into call-taking / dispatch / drive-time segments by shift and district. Confirms or corrects the assumption before a line of the “real” system is built.',
  },
  {
    title: 'Phase 1 — nightly pattern report (no live system change)',
    body: 'A batch job over historical CAD data plus incident narratives (retrieval over past reports) surfaces recurring under-resourced windows and hands a report to shift commanders. Zero integration risk with live dispatch.',
  },
  {
    title: 'Phase 2 — shadow-mode recommendation agent',
    body: 'A tool-using agent combines live unit GPS, traffic conditions, and current call load to compute a suggested unit — but only logs its suggestion against the dispatcher’s actual choice. Nothing is shown yet.',
  },
  {
    title: 'Phase 3 — visible suggestion, one pilot console',
    body: 'Only after shadow-mode accuracy is proven and shared with the department does the suggestion appear on screen, on a single pilot console, with the dispatcher always making the final call.',
  },
  {
    title: 'Phase 4 — ongoing: monitor, recalibrate, then playbook it',
    body: 'Track suggestion-acceptance rate by shift and district every month, since traffic patterns and staffing shift over time; only expand from the single pilot console once accuracy holds for a full quarter. The CAD-diagnosis approach from Phase 0 gets written up as a reusable intake checklist for the next city, instead of being rediscovered from scratch.',
  },
];

const CS1_FAILURES: Callout[] = [
  {
    title: 'CAD timestamp quality',
    body: 'Legacy CAD timestamps are often manually keyed and unreliable at the minute level — the diagnosis phase can produce a misleading answer if this isn’t checked first.',
  },
  {
    title: 'The integration wall',
    body: 'Nightly batch exports and CJIS access restrictions mean the real bottleneck to shipping anything is often getting a data-sharing agreement signed, not writing the agent.',
  },
  {
    title: 'Trust collapse after one bad suggestion',
    body: 'A single visibly wrong recommendation, surfaced too early, can end dispatcher adoption for good — which is exactly why shadow mode isn’t optional here.',
  },
  {
    title: 'Political exposure',
    body: 'Any system touching life-safety decisions will get scrutinized publicly the first time an outcome goes badly, regardless of how the system is actually designed — the human-in-the-loop framing has to be real, not just a talking point.',
  },
];

// ---------------------------------------------------------------------------
// Case study 2 — Logistics
// ---------------------------------------------------------------------------

const CS2_TURNS: Turn[] = [
  {
    speaker: 'interviewer',
    text: '“I run operations at a global freight company. Every time there’s a port closure or a storm, it takes my team two full days to figure out which shipments are affected and reroute them. Can you fix that?”',
  },
  {
    speaker: 'candidate',
    text: 'Two days is a specific, useful number. Where does most of that time actually go — figuring out which shipments are affected, or deciding what to do about each one?',
  },
  {
    speaker: 'interviewer',
    text: '“Mostly the first part, honestly. Someone has to manually cross-reference the news with our shipment list in SAP.”',
  },
  {
    speaker: 'candidate',
    text: 'What does “our shipment list in SAP” mean concretely — is this SAP TM, and is there an API or RFC layer IT can expose, or is this a system people mostly interact with through the SAP GUI directly?',
  },
  {
    speaker: 'interviewer',
    text: '“SAP TM, yes. There’s an API layer but it’s locked down — getting access takes a security review that usually runs a few weeks on its own.”',
  },
  {
    speaker: 'candidate',
    text: 'Good to flag now rather than discover in week three. Once a shipment is correctly flagged as affected, who decides the new route today, and what data goes into that decision?',
  },
  {
    speaker: 'interviewer',
    text: '“A planner. They’re weighing capacity, cost, and contract terms with the carrier — a lot of that lives in their head, not in a system.”',
  },
  {
    speaker: 'candidate',
    text: 'That tells me the reroute decision itself is genuinely hard to automate well right now — the tacit knowledge problem is real. But detection is a much more tractable first target. If I built an agent that watches port-status feeds, weather alerts, and news, and cross-references them against your in-transit shipments the moment an event happens, that alone could cut most of the two days without touching the actual routing decision at all.',
  },
  {
    speaker: 'interviewer',
    text: '“That would already help a lot. But eventually I do want it to suggest a reroute, not just tell me something’s wrong.”',
  },
  {
    speaker: 'candidate',
    text: 'Makes sense as phase two — once detection is trusted, I’d add a recommendation step that pulls alternate routing and capacity options straight from SAP TM and ranks them by cost and time delta, and hands that to the planner as a suggestion, with their tacit knowledge as the final filter. I would not have it write anything back into SAP automatically at that stage.',
  },
  {
    speaker: 'interviewer',
    text: '“Why not? If the planner approves it, why not just let the system make the change?”',
  },
  {
    speaker: 'candidate',
    text: 'It can — but only after an explicit human click, and only once we’ve built confidence in the recommendation quality. A write into SAP TM moves real freight and touches real contracts; if a bug in the approval flow fires twice, that’s an expensive mistake, not a UI glitch. I’d rather add the auto-write-back as its own phase, with its own testing, once phases one and two have already proven out.',
  },
  {
    speaker: 'interviewer',
    text: '“That’s reasonable. What do I tell my boss ships in the first month?”',
  },
  {
    speaker: 'candidate',
    text: 'Detection only — an agent watching external events against your live shipment list, surfacing affected shipments in minutes instead of a manual two-day scan. No SAP writes, minimal integration surface, and it’s the piece most likely to be unblocked while the API access review is still working through security.',
  },
];

const CS2_PHASES: Step[] = [
  {
    title: 'Phase 1 — detection agent, read-only',
    body: 'Monitor port-status APIs, weather alerts, and news feeds; cross-reference against SAP TM shipment data (read-only access, easier to get approved) to flag affected shipments within minutes.',
  },
  {
    title: 'Phase 2 — reroute recommendation, human decides',
    body: 'For each flagged shipment, an agent pulls alternate capacity and cost options from SAP and ranks them, but a planner makes the final call using judgment the system doesn’t have.',
  },
  {
    title: 'Phase 3 — approved write-back into SAP',
    body: 'Only after phases 1–2 are trusted: the approved reroute is written back into SAP TM via its transactional API (BAPI/IDoc), always gated behind an explicit human approval click, fully logged.',
  },
  {
    title: 'Phase 4 — customer-notification draft',
    body: 'An agent drafts delay-notification emails for affected customers based on the approved reroute, with a human reviewing before send — not because the drafting is risky, but because the customer relationship is.',
  },
  {
    title: 'Phase 5 — ongoing: track detection quality, feed the pattern back',
    body: 'Track false-positive and missed-disruption rates on the detection agent monthly; a port-status feed that turns out to be unreliable for one carrier is exactly the kind of thing that should get flagged to the product team as a source-reliability signal, not silently worked around case by case.',
  },
];

const CS2_FAILURES: Callout[] = [
  {
    title: 'The integration wall, again',
    body: 'SAP API/RFC access almost always requires a client security review measured in weeks, not days — this is usually the actual critical path, not the agent logic.',
  },
  {
    title: 'False positives from noisy event feeds',
    body: 'News and weather feeds are noisy; an over-eager detection agent that cries wolf on shipments that were never really at risk burns trust fast.',
  },
  {
    title: 'Cost models missing contractual nuance',
    body: 'A ranked reroute suggestion that ignores an informal contract term the planner already knows about will get overridden every time, and can look like the model is “wrong” when it’s actually just incomplete.',
  },
  {
    title: 'Write-back risk',
    body: 'Any automated write into a transactional system that moves real freight needs its own testing and rollback plan — a duplicate or malformed write is an expensive class of bug, not a cosmetic one.',
  },
];

// ---------------------------------------------------------------------------
// Case study 3 — Banking
// ---------------------------------------------------------------------------

const CS3_TURNS: Turn[] = [
  {
    speaker: 'interviewer',
    text: '“I head up fraud operations at a regional bank. Our card system, our wire system, and our new-accounts system don’t talk to each other, and we think we’re missing fraud because of it. Can AI fix that?”',
  },
  {
    speaker: 'candidate',
    text: 'When you say “missing fraud” — is that based on confirmed cases you later found should have been caught, or is it more of a suspicion based on how siloed the systems are?',
  },
  {
    speaker: 'interviewer',
    text: '“Both, but we do have a handful of confirmed cases — someone opened a new account, then wired money out days later, and each system’s own rules engine saw its own piece and flagged nothing.”',
  },
  {
    speaker: 'candidate',
    text: 'That’s a concrete pattern — cross-system correlation, not a smarter single-system model. Before I propose anything: do these three systems share a common customer or account identifier today, or would linking a customer across them be its own project?',
  },
  {
    speaker: 'interviewer',
    text: '“Not cleanly. The core banking system is decades old, the card processor is a separate vendor, and matching is mostly name and SSN, which isn’t always clean data.”',
  },
  {
    speaker: 'candidate',
    text: 'Then identity resolution across those three systems is the real first problem — before any fraud model, we need a reliable way to say “this card activity and this wire and this new account are the same customer.” Get that wrong and we don’t just miss fraud, we could wrongly link two different customers, which is worse. What’s the regulatory posture here — can any part of this take automated action, like freezing an account?',
  },
  {
    speaker: 'interviewer',
    text: '“No. Anything that looks like fraud goes to a human analyst, always. And if we do file a Suspicious Activity Report, we need to be able to explain why — a black-box score won’t fly with compliance.”',
  },
  {
    speaker: 'candidate',
    text: 'That shapes the whole design — this needs to produce explainable, cited cases for a human, never an autonomous action. Here’s how I’d sequence it: first, a nightly batch job that does identity resolution across the three systems using whatever matching signal is reliable enough — shared tax ID plus fuzzy name matching, reviewed by your team before we trust it fully. Only once that linking is validated would I add a second layer.',
  },
  {
    speaker: 'interviewer',
    text: '“And that second layer is the actual fraud detection?”',
  },
  {
    speaker: 'candidate',
    text: 'Right — a cross-system pattern check, initially just rules-based, not ML, looking for sequences like new-account-then-wire-then-unusual-card-geo across the linked identity. That alone, without any AI at all, might catch cases your siloed systems structurally can’t see. Once that’s proven, I’d add a retrieval layer that pulls similar historical confirmed-fraud narratives and regulatory typologies alongside each flagged case, so the analyst sees not just a score but cited precedent — that’s what makes it explainable enough for a SAR filing.',
  },
  {
    speaker: 'interviewer',
    text: '“What if identity resolution makes a mistake and merges two real customers?”',
  },
  {
    speaker: 'candidate',
    text: 'That’s the single scariest failure mode here, which is why I wouldn’t automate any downstream action off of it. Every linked identity and every flagged case lands in an analyst’s queue as a proposal with its evidence attached — the analyst confirms both the link and the fraud call. I’d also track a false-link rate explicitly from day one, the same way we’d track false-positive rate on the fraud side, and treat a rising number there as a stop-and-fix signal, not something to tune around quietly.',
  },
  {
    speaker: 'interviewer',
    text: '“Given all that, what would you actually commit to shipping in the first quarter?”',
  },
  {
    speaker: 'candidate',
    text: 'Identity resolution plus the simple rules-based cross-system flag — no ML, no retrieval yet. It’s the smallest thing that tests the actual hypothesis: that linking these three systems surfaces fraud the siloed rules engines miss. If that doesn’t hold up, the more sophisticated agent on top of it wouldn’t be worth building anyway.',
  },
];

const CS3_PHASES: Step[] = [
  {
    title: 'Phase 1 — identity resolution, validated by hand',
    body: 'Nightly batch linking of customers across the three legacy systems using shared identifiers plus fuzzy matching, with the fraud team reviewing a sample before the linkage is trusted for anything downstream.',
  },
  {
    title: 'Phase 2 — rules-based cross-system flag, no ML yet',
    body: 'A simple, explainable rule (new account → wire out → unusual card geo, in sequence) tests whether cross-system linkage alone surfaces fraud the siloed systems miss — deliberately before adding any model complexity.',
  },
  {
    title: 'Phase 3 — retrieval-augmented case scoring',
    body: 'Once the rule-based flag proves out, a scoring agent adds nuance, retrieving similar historical fraud narratives and regulatory typologies so every flagged case reaches the analyst with cited evidence, not a bare score.',
  },
  {
    title: 'Phase 4 — move toward real-time, only once trusted',
    body: 'Batch scoring shifts toward near-real-time only after false-positive and false-link rates are proven acceptable in production over a full cycle — speed is the last thing optimized for, not the first.',
  },
  {
    title: 'Phase 5 — ongoing: track false-link rate, package the pattern',
    body: 'Review false-link and false-positive rates with the fraud team every month, since identity-resolution accuracy can drift as the underlying systems change. The identity-resolution approach itself, once proven, becomes a reusable pattern for the next client running the same three-siloed-systems problem, rather than a one-off build.',
  },
];

const CS3_FAILURES: Callout[] = [
  {
    title: 'False identity links',
    body: 'A wrongly merged identity is worse than the original blind spot — it can misattribute one customer’s activity to another. This needs its own tracked error rate from day one.',
  },
  {
    title: 'Regulatory sign-off timeline',
    body: 'Compliance and legal review for anything touching SAR filings or customer data linkage will typically take longer than the technical build — plan the project timeline around that, not around the coding effort.',
  },
  {
    title: 'The integration wall, a third time',
    body: 'Legacy core-banking access is often the hardest of the three systems to get read access to at all, let alone in anything faster than a nightly batch export.',
  },
  {
    title: 'Analyst trust and alert fatigue',
    body: 'The same precision/recall tension from evaluating any retrieval system applies here directly — too many false positives and analysts start ignoring the queue, which defeats the entire point.',
  },
];

// ---------------------------------------------------------------------------

function CaseStudy({
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
        Case study {index} &middot; {tag}
      </p>
      <Heading as="h3">{title}</Heading>
      <p className={styles.aside}>{prompt}</p>
      <Dialogue turns={turns} />
      <Heading as="h4" className={styles.stepTitle} style={{marginTop: '2rem'}}>
        The architecture that comes out of this
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

export default function CaseStudies(): ReactNode {
  return (
    <Layout title={TITLE} description={META_DESCRIPTION}>
      <Head>
        <meta
          name="keywords"
          content="FDE case study interview, forward-deployed engineer case study round, FDE customer scenario interview questions"
        />
      </Head>
      <main className={styles.page}>
        <div className="container">
          <PageHeader
            title={TITLE}
            oneLiner={ONE_LINER}
            meta={['45–60 minutes', '~40% pass rate — the lowest in the loop', '~30% weight — the highest in the loop']}
          />

          <Section title="The framework, before the scenarios">
            <p>
              Every version of this round follows the same underlying shape, no matter the industry. The
              interviewer is grading the process, not just the destination — the same five moves work whether the
              customer is a hospital, a bank, or a shipping company.
            </p>
            <StepList items={FRAMEWORK_STEPS} />
            <div className={styles.insightBox}>
              <p>
                <strong>The single most common failure mode: jumping to a solution before scoping the problem.</strong>{' '}
                Naming a tech stack — “I’d use a vector database and an agent framework” — in the first two minutes
                reads as a red flag, not a strength. Nobody has earned the right to propose an architecture yet.
              </p>
            </div>
            <div className={styles.chipRow}>
              {CASE_STUDY_TAGS.map((tag) => (
                <span key={tag} className={styles.chip}>
                  {tag}
                </span>
              ))}
            </div>
            <p className={styles.aside}>
              Three full walkthroughs follow — different industries, same underlying discipline. Read them the way
              you’d rehearse for the real thing: notice where the candidate asks a question instead of guessing.
            </p>
          </Section>

          <Section title="Three end-to-end walkthroughs">
            <CaseStudy
              index={1}
              tag="Public safety / government"
              title="Cutting 911 response times for a city government"
              prompt="“Our city council wants us to cut 911 response times. Where would you even start?”"
              turns={CS1_TURNS}
              diagram={`flowchart TD
    A["CAD dispatch logs\\n(nightly batch export)"] --> B["Diagnosis: split average\\ninto call-taking / dispatch / drive-time"]
    B --> C["Historical & incident\\ndata warehouse"]
    C --> D["Nightly pattern-analysis agent\\n(retrieval over incident narratives)"]
    D --> E["Shift-planning report"]
    E --> F["Shift commander"]
    C --> G["Shadow-mode recommendation agent\\n(tool use: live GPS + traffic + call load)"]
    G -.->|"phase 2, logged only"| H["Dispatcher console"]
    H -->|"phase 3, after trust is proven"| I["Human dispatcher decides"]`}
              phasesTitle="How this decomposes"
              phases={CS1_PHASES}
              failures={CS1_FAILURES}
            />

            <CaseStudy
              index={2}
              tag="Logistics / supply chain"
              title="Rerouting shipments around disruptions, on top of SAP"
              prompt="“Every time there’s a port closure or a storm, it takes my team two days to reroute shipments. Can you fix that?”"
              turns={CS2_TURNS}
              diagram={`flowchart TD
    A["Port-status API"] --> D["Detection agent"]
    B["Weather alerts"] --> D
    C["News feed"] --> D
    D -->|"cross-reference"| E["SAP TM shipment data\\n(read-only API)"]
    E --> F["Flagged-shipment queue"]
    F --> G["Reroute recommendation agent\\n(tool use: SAP capacity & cost lookup)"]
    G --> H["Ops planner review"]
    H -->|"approved, phase 3"| I["SAP write-back\\n(BAPI / IDoc)"]
    H --> J["Customer-notification draft agent"]
    J --> K["Human reviews & sends"]`}
              phasesTitle="How this decomposes"
              phases={CS2_PHASES}
              failures={CS2_FAILURES}
            />

            <CaseStudy
              index={3}
              tag="Financial services / banking"
              title="Catching fraud that spans three legacy systems"
              prompt="“Our card, wire, and new-accounts systems don’t talk to each other, and we think we’re missing fraud because of it.”"
              turns={CS3_TURNS}
              diagram={`flowchart TD
    A["Core banking\\n(legacy)"] --> D["Nightly identity-resolution layer"]
    B["Card processor"] --> D
    C["New-accounts system"] --> D
    D --> E["Unified customer\\nactivity view"]
    E --> F["Cross-system rules flag\\n(phase 2, no ML yet)"]
    F --> G["Retrieval-augmented scoring agent\\n(cites similar past fraud cases)"]
    G --> H["Ranked case queue\\nwith cited evidence"]
    H --> I["Fraud analyst review"]
    I -->|"confirmed / false positive"| J["Feedback loop\\nimproves future scoring"]`}
              phasesTitle="How this decomposes"
              phases={CS3_PHASES}
              failures={CS3_FAILURES}
            />
          </Section>

          <Section title="The job doesn't end when it ships">
            <p>
              All three walkthroughs above stop at the moment a system reaches production — that's deliberate for
              pacing, but it undersells the role. An FDE stays on the hook after launch: watching the thing they
              built, catching drift before the customer does, and turning what they learned into something reusable
              for the next engagement. Each case study now ends with a beat for exactly that, and it's worth being
              explicit about why here, since it's what separates "shipped a proof of concept" from "owns the
              outcome."
            </p>
            <CalloutList
              items={[
                {
                  title: 'Monitoring is your job, not just the client\'s',
                  body: 'Nobody hands you a pager, but if the shadow-mode accuracy in the 911 case study drifts after a city changes its CAD vendor, or the detection agent in the logistics case study starts missing a new class of disruption, you\'re the one who notices first — because you\'re the one who knows what "normal" looked like at launch.',
                },
                {
                  title: 'Every engagement should leave behind a reusable asset',
                  body: 'The identity-resolution pattern from the banking case study is the same pattern the next legacy-systems client will need. Writing it up as a template, a checklist, or a piece of internal tooling is quietly one of the highest-leverage things an FDE does — it\'s the difference between redoing the same discovery from scratch every time and getting faster with each customer.',
                },
                {
                  title: 'Customer friction is roadmap input, not just scope to manage',
                  body: 'When a client asks for something the current system can\'t do, that\'s not only a scope conversation — it\'s a signal worth routing back to the product or engineering team. Job postings for this role describe it directly as turning customer friction into product features, not just holding the line on scope.',
                },
              ]}
            />
          </Section>

          <SubNav
            prev={{label: 'Back: the technical round', to: '/career-tracks/forward-deployed-engineer/technical-round'}}
            next={{label: 'Next: the behavioral round', to: '/career-tracks/forward-deployed-engineer/behavioral-round'}}
          />
        </div>
      </main>
    </Layout>
  );
}
