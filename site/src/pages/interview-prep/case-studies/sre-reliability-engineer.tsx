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
} from '../_shared';

const TITLE = 'Incident Response / Operational System Design';

const META_DESCRIPTION =
  'Three full incident-response walkthroughs for an SRE / AI Reliability Engineer interview — silent quality ' +
  'drift, a runaway agent loop, and a regional accelerator failover — written as a live interviewer/candidate ' +
  'exchange, plus the framework every version of this round shares.';

const ONE_LINER =
  'Google calls this NALSD; other companies just call it the incident-response or operational-design round. ' +
  'Whatever the name, it\'s the round every source agrees decides most offers: you\'re handed a system and a ' +
  'failure, and for 45–60 minutes you triage, mitigate, and design around it live, while the interviewer plays ' +
  'the paging system and keeps adding pressure. Below is the framework, then three full scenarios, written the ' +
  'way the room actually sounds.';

const FRAMEWORK_STEPS: Step[] = [
  {
    title: 'Establish blast radius before touching anything',
    body: 'Who\'s affected, how badly, and is it getting worse right now? Naming this first — before proposing a single fix — is the clearest signal of real incident-command experience.',
  },
  {
    title: 'Mitigate before you fully understand root cause',
    body: 'A rollback, a feature flag, or a rate limit that stops the bleeding now is worth more than an elegant fix discovered twenty minutes from now. Root-causing happens after the bleeding stops, not instead of stopping it.',
  },
  {
    title: 'Form parallel hypotheses, not one guess at a time',
    body: 'Naming two or three plausible causes and how you\'d check each — rather than committing to the first idea and chasing it serially — mirrors how real incident investigation actually works under time pressure.',
  },
  {
    title: 'Say what you\'d monitor to know it\'s actually fixed',
    body: 'A mitigation that isn\'t confirmed by a metric moving back into range is a guess, not a fix. Naming the specific signal you\'d watch is what separates "I think that\'s it" from "I can see that\'s it."',
  },
  {
    title: 'Close with the prevention, not just the patch',
    body: 'What guardrail, alert, or design change stops this exact failure from recurring? The interviewer is grading whether you think in systems, not just in incidents.',
  },
];

const SCENARIO_TAGS = ['Silent quality drift', 'Runaway agent loop', 'Regional accelerator failover'];

// ---------------------------------------------------------------------------
// Scenario 1 — Silent quality drift, no alerts fired
// ---------------------------------------------------------------------------

const S1_TURNS: Turn[] = [
  {
    speaker: 'interviewer',
    text: '"Our internal RAG assistant\'s answer quality dropped hard over the weekend. Every dashboard is green — no error spike, no latency spike. A team lead noticed Monday morning because people started complaining in Slack. Walk me through it."',
  },
  {
    speaker: 'candidate',
    text: 'First question: do we have any quality signal at all being tracked continuously — an eval score, a thumbs-up/down rate — or is "everything\'s green" purely availability and latency?',
  },
  {
    speaker: 'interviewer',
    text: '"Purely availability and latency. There\'s no automated quality signal in production today."',
  },
  {
    speaker: 'candidate',
    text: 'Then that\'s actually the headline finding, not a side note — this system has no way to detect this class of failure automatically, which is why it took a human noticing complaints instead of a page. Before I even look for root cause, I\'d want to know: did anything change over the weekend — a deploy, a data refresh, an underlying model version, a vendor-side change?',
  },
  {
    speaker: 'interviewer',
    text: '"Nothing on our side shipped. But it\'s possible the embedding model we call through an API got silently updated by the provider."',
  },
  {
    speaker: 'candidate',
    text: 'That\'s exactly the kind of failure that wouldn\'t show up in our dashboards at all — a provider-side model swap can shift embedding space just enough that retrieval quality degrades without any error being thrown. I\'d pull a sample of this week\'s actual queries and run them back through our eval set from before the weekend, comparing retrieval relevance scores, not just spot-checking a few by hand.',
  },
  {
    speaker: 'interviewer',
    text: '"Say that confirms it — the embeddings shifted. What do you do right now, today, before you\'ve even fully confirmed it?"',
  },
  {
    speaker: 'candidate',
    text: 'I\'d pin the embedding model to an explicit version if the provider supports it, rather than tracking "latest," and re-embed our corpus against that pinned version as the immediate mitigation. If pinning isn\'t possible with this vendor, I\'d fail over to a self-hosted or alternate embedding model we control, even if it\'s a downgrade in some other dimension, since a known-quantity system beats an unpredictable one.',
  },
  {
    speaker: 'interviewer',
    text: '"How do you confirm it\'s actually fixed, not just that you did something reasonable?"',
  },
  {
    speaker: 'candidate',
    text: 'Re-run the same eval set against the pinned or alternate embedding model and confirm the relevance scores are back in range before declaring it resolved — not just "this feels better," an actual number moving back to where it was.',
  },
  {
    speaker: 'interviewer',
    text: '"And the prevention — what stops this exact thing from happening again silently?"',
  },
  {
    speaker: 'candidate',
    text: 'Two changes: pin every third-party model dependency to an explicit version instead of "latest," and add a continuous quality signal in production — even something as lightweight as running a small canary eval set against live traffic daily and alerting on a score drop. Right now this system genuinely can\'t detect its own most damaging failure mode, and that\'s the actual gap, not just this one incident.',
  },
];

const S1_PHASES: Step[] = [
  {
    title: 'Detect — recognize the monitoring gap itself',
    body: 'The first real finding isn\'t the root cause, it\'s that no continuous quality signal exists in production — which is why a human, not an alert, caught this.',
  },
  {
    title: 'Investigate — check what changed, including outside your own deploys',
    body: 'With no internal change to point to, the hypothesis has to widen to third-party dependencies — an unpinned embedding model updated upstream is a classic version of this failure.',
  },
  {
    title: 'Mitigate — pin the dependency or fail over, today',
    body: 'Pinning to an explicit model version, or failing over to a controlled alternative, stops the bleeding immediately without waiting for full confirmation.',
  },
  {
    title: 'Confirm — an eval score, not a feeling',
    body: 'Re-running the same eval set against the fix and watching the relevance score return to range is what turns "probably fixed" into "confirmed fixed."',
  },
  {
    title: 'Prevent — pin every third-party model dependency, add a canary eval',
    body: 'The systemic fix is broader than this one incident: version-pin dependencies, and add a lightweight continuous quality signal so the next drift of this kind pages someone instead of waiting for a complaint.',
  },
];

const S1_FAILURES: Callout[] = [
  {
    title: 'Trusting a green availability dashboard as proof nothing is wrong',
    body: 'Latency and uptime are necessary signals, not sufficient ones, for an AI system. Treating them as the whole picture is the single most common way this exact failure mode goes undetected.',
  },
  {
    title: 'Root-causing before mitigating',
    body: 'Spending the first twenty minutes trying to fully understand why the embeddings shifted, instead of pinning or failing over immediately, leaves the system degraded longer than necessary.',
  },
  {
    title: 'Declaring victory without a number',
    body: 'Fixing the pin and assuming it worked, without re-running an eval to confirm relevance scores actually recovered, risks closing an incident that isn\'t actually resolved.',
  },
  {
    title: 'Treating this as a one-off instead of a systemic gap',
    body: 'Fixing this one embedding-version issue without adding a continuous quality signal means the next silent drift — for a different reason — goes undetected exactly the same way.',
  },
];

// ---------------------------------------------------------------------------
// Scenario 2 — Runaway agent loop, cost anomaly
// ---------------------------------------------------------------------------

const S2_TURNS: Turn[] = [
  {
    speaker: 'interviewer',
    text: '"Finance just flagged that our agent platform\'s API spend was 40x normal overnight. No user complaints, no downtime. What do you do first?"',
  },
  {
    speaker: 'interviewer',
    text: '(follow-up, immediately) "And to be clear — this is happening right now, still running."',
  },
  {
    speaker: 'candidate',
    text: 'If it\'s still active, step one is stopping the bleeding, not investigating — I\'d want an immediate way to identify which agent sessions or API keys are driving the spend spike, even roughly, and kill or rate-limit those specifically rather than pausing the whole platform if I can avoid it.',
  },
  {
    speaker: 'interviewer',
    text: '"You can see it\'s concentrated in a handful of sessions from one customer\'s workspace. What next?"',
  },
  {
    speaker: 'candidate',
    text: 'I\'d hard-stop those specific sessions immediately — kill the process or revoke the session token, whichever is faster — and only then start looking at what those sessions were actually doing. My working hypothesis, given the shape of this, is a tool-call loop: something is causing the agent to call a tool, get a result, and call it again indefinitely without ever reaching a stopping condition.',
  },
  {
    speaker: 'interviewer',
    text: '"Confirmed — it\'s a loop. The agent kept calling a search tool, getting an empty result, and retrying with a near-identical query each time. How does something like that ship in the first place?"',
  },
  {
    speaker: 'candidate',
    text: 'Almost certainly because there was no hard iteration cap on the agent loop, and no logic distinguishing "retry with a new approach" from "retry with essentially the same input." The model itself has no built-in sense of "I\'ve tried this already" unless the system explicitly tracks and enforces it.',
  },
  {
    speaker: 'interviewer',
    text: '"What\'s the actual guardrail you\'d put in, concretely?"',
  },
  {
    speaker: 'candidate',
    text: 'Two layers, not one. First, a hard cap on tool calls per agent turn and per session — a deterministic circuit breaker outside the model\'s control, the same way a rules engine sits outside an agent\'s reasoning for a high-stakes action. Second, a cost-anomaly monitor that compares live spend against a rolling baseline per session or per customer, and pages someone — or auto-throttles — well before it reaches 40x, not after finance notices the invoice.',
  },
  {
    speaker: 'interviewer',
    text: '"Why not just tell the model in the system prompt not to loop?"',
  },
  {
    speaker: 'candidate',
    text: 'Because a prompt is an instruction, not an enforcement mechanism — under enough conversational pressure or a strange enough input, the model can still end up looping anyway. The same principle as any guardrail: it has to live in code the model doesn\'t control, not in a request you\'re hoping it follows.',
  },
  {
    speaker: 'interviewer',
    text: '"What do you tell the customer, and what do you tell finance?"',
  },
  {
    speaker: 'candidate',
    text: 'Finance gets a clear timeline and the actual fix, not just an apology — a hard cap and a real-time cost-anomaly alert, so this specific failure mode is now bounded by design, not by luck. The customer gets an honest explanation and, depending on the contract, likely a credit for the anomalous usage, since it was clearly a platform bug and not something they did.',
  },
];

const S2_PHASES: Step[] = [
  {
    title: 'Contain — kill the specific runaway sessions first',
    body: 'With spend actively accumulating, stopping the identified sessions comes before any investigation — a targeted kill, not a platform-wide pause, if the blast radius is already known.',
  },
  {
    title: 'Diagnose — confirm the loop and its stopping-condition gap',
    body: 'The root cause is a missing hard stop: the agent had no enforced limit on retrying a tool call, and no logic to detect it was repeating an identical failed attempt.',
  },
  {
    title: 'Mitigate structurally — a deterministic circuit breaker',
    body: 'A hard cap on tool calls per turn and per session, enforced in code outside the model\'s control — not a prompt instruction the model could still ignore under pressure.',
  },
  {
    title: 'Add detection — a real-time cost-anomaly monitor',
    body: 'A rolling spend baseline per session or customer, with paging or auto-throttling well before a 40x spike, so the next version of this failure is caught in minutes, not by an overnight finance report.',
  },
  {
    title: 'Close the loop with both stakeholders',
    body: 'Finance gets the concrete structural fix, not just a fixed bill this once; the affected customer gets an honest account and, likely, a credit, since the failure was the platform\'s, not theirs.',
  },
];

const S2_FAILURES: Callout[] = [
  {
    title: 'Investigating before containing an active, ongoing cost bleed',
    body: 'Spending the first ten minutes reading logs while the loop is still running and still spending money is the clearest way to fail this round — contain first, always, when the incident is still active.',
  },
  {
    title: 'Putting the guardrail in the prompt instead of in code',
    body: '"Don\'t loop" as an instruction to the model is not an enforcement mechanism. The fix has to be a deterministic check the model cannot reason its way around.',
  },
  {
    title: 'Fixing the symptom (this one loop) without adding detection',
    body: 'Patching this specific tool-call pattern without a general cost-anomaly monitor means the next distinct runaway pattern goes just as unnoticed until the next invoice.',
  },
  {
    title: 'Treating the platform-wide pause as the default move',
    body: 'Pausing everything is sometimes right, but jumping there by default when the blast radius is already known and narrow is unnecessarily disruptive — precision beats a blunt kill switch when you can afford precision.',
  },
];

// ---------------------------------------------------------------------------
// Scenario 3 — Regional accelerator failover, latency spike
// ---------------------------------------------------------------------------

const S3_TURNS: Turn[] = [
  {
    speaker: 'interviewer',
    text: '"One of our GPU regions just went unhealthy and traffic failed over automatically. Inference latency for everyone jumped 10x, including customers who were never on the affected region. On-call, go."',
  },
  {
    speaker: 'candidate',
    text: 'First: is the failover itself still in progress, or did it already complete and we\'re now stuck with degraded performance on the remaining regions? That changes whether the priority is "let the failover finish" or "the current steady state is broken."',
  },
  {
    speaker: 'interviewer',
    text: '"Failover completed two minutes ago. This is the new steady state, and it\'s bad."',
  },
  {
    speaker: 'candidate',
    text: 'Then the working hypothesis is that the remaining regions are now oversubscribed — they absorbed the failed-over traffic without the accelerator capacity to actually serve it at normal latency. I\'d confirm that by checking GPU utilization and queue depth on the healthy regions specifically, not just overall latency.',
  },
  {
    speaker: 'interviewer',
    text: '"Confirmed — the healthy regions are pegged near 100% utilization. What do you do?"',
  },
  {
    speaker: 'candidate',
    text: 'Immediate mitigation, in order of speed: first, shed non-critical load if any exists — batch or lower-priority inference traffic gets deprioritized or queued, freeing capacity for latency-sensitive requests. Second, if we have any capacity headroom elsewhere, even a slower or more expensive region, route overflow there rather than leaving everyone on the oversubscribed regions.',
  },
  {
    speaker: 'interviewer',
    text: '"There\'s no spare capacity anywhere else right now. Everything\'s already near max."',
  },
  {
    speaker: 'candidate',
    text: 'Then the honest move is graceful degradation over silent failure — if there\'s a way to serve a smaller or cheaper model variant for lower-priority traffic while capacity is constrained, that\'s better than uniformly slow responses for everyone. I\'d also want visibility into whether this is truly a capacity ceiling or whether the failed region is recoverable soon, since "wait it out" might genuinely be the fastest real fix if recovery is imminent.',
  },
  {
    speaker: 'interviewer',
    text: '"Turns out the failed region will be back in about 20 minutes. Does that change your answer?"',
  },
  {
    speaker: 'candidate',
    text: 'It changes the priority, not the actions — I\'d still shed non-critical load and consider degrading gracefully for 20 minutes rather than doing nothing and hoping customers don\'t notice, but I wouldn\'t invest in a heavier structural fix for what\'s genuinely a temporary, self-resolving window. I\'d confirm the region actually recovers on schedule and traffic rebalances cleanly before declaring this over.',
  },
  {
    speaker: 'interviewer',
    text: '"What\'s the actual prevention here — this can\'t be the plan every time a region goes down?"',
  },
  {
    speaker: 'candidate',
    text: 'The real gap is that failover moved traffic without checking whether the destination regions actually had headroom to absorb it — that\'s a capacity-aware failover problem, not just a health-check problem. I\'d push for failover logic that accounts for current utilization on the target regions, not just "is it up," plus enough standing headroom margin across regions that a single-region failure doesn\'t automatically oversubscribe whatever\'s left.',
  },
];

const S3_PHASES: Step[] = [
  {
    title: 'Orient — confirm the failover already completed',
    body: 'The first question determines the whole shape of the response: an in-progress failover and a completed-but-broken steady state call for different actions.',
  },
  {
    title: 'Diagnose — confirm oversubscription, not a new unrelated fault',
    body: 'Checking GPU utilization and queue depth on the healthy regions specifically confirms the hypothesis before committing to a fix built on a guess.',
  },
  {
    title: 'Mitigate — shed non-critical load, then route to any spare capacity',
    body: 'Deprioritizing lower-priority traffic and routing overflow to any available headroom are the fastest levers, tried in order of speed and disruption.',
  },
  {
    title: 'Degrade gracefully when no capacity exists anywhere',
    body: 'Serving a smaller model variant for lower-priority traffic, rather than uniformly slow responses for everyone, is the honest move when there\'s genuinely no more capacity to find.',
  },
  {
    title: 'Prevent — capacity-aware failover, and standing headroom margin',
    body: 'The systemic fix is failover logic that checks destination-region headroom before routing traffic there, plus enough standing margin that one region\'s failure doesn\'t automatically overload what\'s left.',
  },
];

const S3_FAILURES: Callout[] = [
  {
    title: 'Assuming the failover itself is the problem to fix',
    body: 'The failover did its job — moved traffic away from an unhealthy region. The actual problem is that the destination had no headroom, a distinct issue that needs its own diagnosis.',
  },
  {
    title: 'Doing nothing while waiting out a "temporary" failure',
    body: 'Even a 20-minute self-resolving window is 20 minutes of degraded service for real users — shedding load or degrading gracefully during that window is still the right call, not just waiting.',
  },
  {
    title: 'Treating uniform slowness as an acceptable degradation strategy',
    body: 'Letting every request get equally slow, instead of deliberately deprioritizing lower-priority traffic, wastes the one lever that could keep latency-sensitive requests healthy.',
  },
  {
    title: 'Fixing this specific event without addressing capacity-aware failover',
    body: 'Recovering from this one incident without changing the failover logic itself means the exact same oversubscription happens the next time any region has a problem.',
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
        How the incident actually decomposes
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

export default function IncidentResponse(): ReactNode {
  return (
    <Layout title={TITLE} description={META_DESCRIPTION}>
      <Head>
        <meta
          name="keywords"
          content="AI incident response interview, SRE incident response case study, AI agent outage interview questions"
        />
      </Head>
      <main className={styles.page}>
        <div className="container">
          <PageHeader
            title={TITLE}
            oneLiner={ONE_LINER}
            backTo="/career-tracks/sre-reliability-engineer"
            backLabel="SRE / Reliability Engineer for AI Agents"
            meta={['45–60 minutes', 'Highest weight in the loop', 'Google calls it NALSD']}
          />

          <Section title="The framework, before the scenarios">
            <p>
              Every version of this round follows the same underlying shape, no matter the specific failure.
              The interviewer is grading the process — contain, diagnose, confirm, prevent — not just whether
              you land on the right root cause.
            </p>
            <StepList items={FRAMEWORK_STEPS} />
            <div className={styles.insightBox}>
              <p>
                <strong>The single most common failure mode: root-causing before containing.</strong> An
                elegant diagnosis delivered while the incident is still actively getting worse reads as a red
                flag, not technical depth. Stop the bleeding first; you can be curious about why afterward.
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
              These three scenarios are illustrative training material, written to match the failure modes
              named across real postings and industry sources — not transcripts of an actual incident at a
              named company. Read them the way you\'d rehearse for the real thing.
            </p>
          </Section>

          <Section title="Three end-to-end walkthroughs">
            <Scenario
              index={1}
              tag="Silent quality drift"
              title="An assistant\'s answer quality drops all weekend, with every dashboard green"
              prompt={'"Our internal RAG assistant\'s answer quality dropped hard over the weekend. Every dashboard is green. A team lead noticed Monday because of Slack complaints."'}
              turns={S1_TURNS}
              diagram={`flowchart TD
    A["Weekend: answer quality drops"] --> B{"Any automated\\nquality signal?"}
    B -->|"no"| C["Gap itself is the finding"]
    C --> D["Check for upstream change\\n(deploy, data, vendor model)"]
    D --> E["Provider silently updated\\nembedding model"]
    E --> F["Re-run eval set against\\ncurrent vs. prior embeddings"]
    F --> G["Mitigate: pin model version\\nor fail over to controlled alt"]
    G --> H["Confirm: eval score\\nback in range"]
    H --> I["Prevent: version-pin all\\nthird-party deps + canary eval"]`}
              phasesTitle="How this decomposes"
              phases={S1_PHASES}
              failures={S1_FAILURES}
            />

            <Scenario
              index={2}
              tag="Runaway agent loop"
              title="A tool-call loop burns 40x normal API spend overnight"
              prompt={'"Finance flagged API spend at 40x normal overnight. No downtime, no user complaints. It\'s still running."'}
              turns={S2_TURNS}
              diagram={`flowchart TD
    A["Cost anomaly flagged\\n(still active)"] --> B["Identify specific\\nsessions/keys responsible"]
    B --> C["Hard-stop those sessions\\nimmediately"]
    C --> D["Diagnose: tool-call loop,\\nno stopping condition"]
    D --> E["Root cause: no hard\\niteration cap enforced"]
    E --> F["Mitigate: deterministic\\ncircuit breaker in code"]
    E --> G["Add: real-time cost-anomaly\\nmonitor + auto-throttle"]
    F --> H["Confirm: spend back\\nto baseline"]
    H --> I["Report to finance +\\ncustomer credit"]`}
              phasesTitle="How this decomposes"
              phases={S2_PHASES}
              failures={S2_FAILURES}
            />

            <Scenario
              index={3}
              tag="Regional accelerator failover"
              title="A completed failover leaves every region oversubscribed"
              prompt={'"One GPU region went unhealthy and traffic failed over automatically. Inference latency jumped 10x for everyone, including customers never on the affected region."'}
              turns={S3_TURNS}
              diagram={`flowchart TD
    A["Region unhealthy,\\nfailover completes"] --> B["Check: in-progress\\nor new steady state?"]
    B -->|"completed"| C["Check GPU utilization\\non healthy regions"]
    C --> D["Confirmed: oversubscribed,\\nnear 100% utilization"]
    D --> E["Mitigate: shed non-critical\\nload first"]
    D --> F["Route overflow to any\\nspare capacity"]
    E --> G{"Any capacity\\nanywhere?"}
    F --> G
    G -->|"no"| H["Degrade gracefully:\\nsmaller model for low-pri traffic"]
    G -->|"region recovers soon"| I["Ride out window,\\nstill shed load"]
    H --> J["Prevent: capacity-aware\\nfailover + standing headroom"]
    I --> J`}
              phasesTitle="How this decomposes"
              phases={S3_PHASES}
              failures={S3_FAILURES}
            />
          </Section>

          <SubNav
            prev={{label: 'Back: the technical round', to: '/interview-prep/technical-round/sre-reliability-engineer'}}
            next={{label: 'Next: the behavioral round', to: '/interview-prep/behavioral-round/sre-reliability-engineer'}}
          />
        </div>
      </main>
    </Layout>
  );
}
