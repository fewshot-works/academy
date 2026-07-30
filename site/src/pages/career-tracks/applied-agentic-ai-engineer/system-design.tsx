import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
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

const TITLE = 'The System Design Round';

const META_DESCRIPTION =
  'Three full end-to-end Applied / Agentic AI Engineer system design case studies — customer support, internal ' +
  'RAG, and a multi-agent coding assistant — written as a live interviewer/candidate walkthrough, with ' +
  'architecture, phased rollout, and failure modes for each.';

const ONE_LINER =
  'Both Anthropic and Sierra call this round system design, and it is the round that decides most offers: a ' +
  'hypothetical product asks for “an agent that does X,” and for 45–60 minutes you think out loud while the ' +
  'interviewer plays the stakeholder, adding constraints and pushing on where it breaks. Below is the framework, ' +
  'then three full walkthroughs, written the way the room actually sounds.';

const FRAMEWORK_STEPS: Step[] = [
  {
    title: 'Scope what the agent can actually do before anything else',
    body: 'What actions is it allowed to take, and which ones require a human? “Answer questions” and “take actions on a customer’s account” are different systems with completely different risk profiles.',
  },
  {
    title: 'Design the guardrail layer before the intelligence layer',
    body: 'What can this agent never do, no matter what a prompt or a user says? Naming the hard boundaries first keeps the rest of the design honest instead of retrofitted.',
  },
  {
    title: 'Map the data and tools it actually needs',
    body: 'What does it need to read, and what does it need to call? You’re almost never starting from a blank slate — you’re integrating with a knowledge base, a ticketing system, or an internal API that already has its own quirks.',
  },
  {
    title: 'Design for evaluation from the start, not as an afterthought',
    body: 'How will you know it’s working, and how will you know when a change made it worse? An agent you can’t measure is an agent you can’t safely improve.',
  },
  {
    title: 'Propose a phased rollout, not a big-bang launch',
    body: 'Shadow mode, then a narrow pilot, then a wider rollout, each gated on evidence from the previous phase. It’s also the fastest way to find out where the design was wrong before it’s expensive to fix.',
  },
];

const CASE_STUDY_TAGS = ['Customer support agent', 'Internal RAG assistant', 'Multi-agent coding assistant'];

// ---------------------------------------------------------------------------
// Case study 1 — Customer support agent
// ---------------------------------------------------------------------------

const CS1_TURNS: Turn[] = [
  {
    speaker: 'interviewer',
    text: '“We’re a subscription company. Support gets buried in refund requests and plan-change questions. We want an agent that can just handle it. Where would you start?”',
  },
  {
    speaker: 'candidate',
    text: 'Before anything else — when you say “handle it,” do you mean answer questions about refunds and plans, or actually issue refunds and change plans?',
  },
  {
    speaker: 'interviewer',
    text: '“Both, eventually. Right now a human does both, and it’s slow.”',
  },
  {
    speaker: 'candidate',
    text: 'Those are very different risk levels, so I’d want to split them from the start. Answering questions accurately is one problem. Actually issuing a refund or changing billing is a different one, because a mistake there costs real money and touches a customer’s trust directly. What does the refund policy actually look like — is it a fixed rule, or does it involve judgment calls?',
  },
  {
    speaker: 'interviewer',
    text: '“Mostly rules — refund within 14 days, no questions asked. Outside that window it needs a human’s judgment call.”',
  },
  {
    speaker: 'candidate',
    text: 'That’s a clean line to design around. I’d let the agent handle the in-policy case end to end, and hand anything outside the window straight to a human, no attempt to be clever about it. What tools or systems would the agent actually need access to — a billing API, a CRM, something else?',
  },
  {
    speaker: 'interviewer',
    text: '“A billing API that can issue refunds and change plans, and a CRM with the customer’s history. Both have real write access — this isn’t just a read-only lookup tool.”',
  },
  {
    speaker: 'candidate',
    text: 'Given that a tool call here can move real money, I want a hard guardrail layer that sits between the agent’s reasoning and those write calls, not just a prompt asking it to be careful. Concretely: a rules engine checks eligibility — is this within 14 days, has this customer already gotten a refund this month — before the refund tool is even callable, regardless of what the agent’s reasoning concluded.',
  },
  {
    speaker: 'interviewer',
    text: '“What if the agent gets talked into it? Customers will absolutely try to convince it they qualify when they don’t.”',
  },
  {
    speaker: 'candidate',
    text: 'That’s exactly why the eligibility check can’t live in the prompt. It has to be a deterministic check in code, outside the model’s control entirely, so no amount of clever phrasing from a customer changes the answer. The agent can be as persuadable as it wants in conversation; the tool it calls simply won’t execute if the rule fails.',
  },
  {
    speaker: 'interviewer',
    text: '“Okay. And plan changes?”',
  },
  {
    speaker: 'candidate',
    text: 'Same shape, different rule set — some plan changes are free, some involve proration or a contract term, and I’d expect the proration math to be genuinely fiddly. First phase, I’d actually keep plan changes as agent-drafts-the-change, human-confirms, since the failure mode of a wrong proration is messier to unwind than a straightforward refund.',
  },
  {
    speaker: 'interviewer',
    text: '“What ships first, given we want something live in six weeks?”',
  },
  {
    speaker: 'candidate',
    text: 'The in-policy refund flow only, in shadow mode for the first week or two — the agent proposes the action, a human clicks confirm, and we log how often the agent’s proposal matches what a human would have done. Once that agreement rate is high and we’ve seen a real week of production traffic, we flip refunds to fully automated within the 14-day rule. Plan changes stay human-confirmed a while longer, since the rules are messier and the blast radius of a mistake is larger.',
  },
];

const CS1_PHASES: Step[] = [
  {
    title: 'Phase 0 — retrieval-only support agent',
    body: 'The agent answers questions about policy, billing, and account status using retrieval over docs and CRM data. No write tools yet, so the failure mode is a wrong answer, not a wrong action.',
  },
  {
    title: 'Phase 1 — shadow-mode refund proposal',
    body: 'A deterministic eligibility check (14-day rule, refund frequency cap) gates whether the refund tool is even callable. The agent proposes an action, a human confirms, and agreement rate is logged before anything is automated.',
  },
  {
    title: 'Phase 2 — automated in-policy refunds',
    body: 'Once shadow-mode agreement is high and proven over real traffic, in-policy refunds execute automatically. Anything outside the rule (past the window, repeat refund) routes straight to a human, no agent attempt.',
  },
  {
    title: 'Phase 3 — human-confirmed plan changes',
    body: 'Plan-change proration is fiddlier and higher-blast-radius than a refund, so the agent drafts the change and a human confirms for longer before this path is considered for automation too.',
  },
];

const CS1_FAILURES: Callout[] = [
  {
    title: 'Guardrails living in the prompt instead of in code',
    body: 'A persuasive customer can talk a model into believing an exception is warranted. Eligibility has to be a deterministic check the model can’t reason its way around, not an instruction it’s asked to follow.',
  },
  {
    title: 'Treating all actions as equally risky',
    body: 'Lumping refunds and plan changes into one “automate it” bucket ignores that a wrong proration is far messier to unwind than a straightforward refund — they deserve different rollout speeds.',
  },
  {
    title: 'Skipping shadow mode to hit a launch date',
    body: 'Automating a money-moving action on day one, without first measuring how often the agent would have agreed with a human, removes the one signal that tells you whether it’s actually safe.',
  },
  {
    title: 'No fallback path when the agent is unsure',
    body: 'Without an explicit “hand this to a human” exit, an agent under pressure to resolve everything will sometimes force an answer instead of admitting it doesn’t know, which is worse than a slower correct one.',
  },
];

// ---------------------------------------------------------------------------
// Case study 2 — Internal RAG knowledge assistant
// ---------------------------------------------------------------------------

const CS2_TURNS: Turn[] = [
  {
    speaker: 'interviewer',
    text: '“Our engineers waste hours searching Confluence, Slack, and old Jira tickets for answers that already exist somewhere. We want an internal assistant that just knows the answer. How would you build it?”',
  },
  {
    speaker: 'candidate',
    text: 'Before the retrieval design, one question that changes everything: do all of those sources have the same access permissions, or does some of that content vary by team or seniority?',
  },
  {
    speaker: 'interviewer',
    text: '“It varies a lot, actually. Some Confluence spaces are restricted, some Slack channels are private, and there are Jira tickets with customer PII in them that only certain people should see.”',
  },
  {
    speaker: 'candidate',
    text: 'Then permission-aware retrieval isn’t a nice-to-have here, it’s the central design constraint — a wrong answer is annoying, but leaking a restricted document through the assistant is a much bigger problem, and one that’s easy to introduce accidentally with a naive vector index. How is access actually controlled today across these three systems — is there a common identity or permission model?',
  },
  {
    speaker: 'interviewer',
    text: '“All three use the same SSO identity, but the permission checks live separately in each system’s own access control.”',
  },
  {
    speaker: 'candidate',
    text: 'That’s workable, but it means the retrieval layer can’t just embed everything into one flat index and hope for the best — at query time, I’d need to filter results down to only what this specific user is actually allowed to see, checked against each source’s real permission model, not a cached snapshot that could go stale. What’s the actual query pattern going to look like — a chat interface, something in Slack, an IDE plugin?”',
  },
  {
    speaker: 'interviewer',
    text: '“Probably a Slack bot to start, since that’s where people already ask each other questions.”',
  },
  {
    speaker: 'candidate',
    text: 'Good, that also gives a natural place to collect feedback — a thumbs up or down on each answer is a cheap way to start building an eval set instead of guessing whether the assistant is any good. Given the permission complexity, I’d actually start with the least sensitive source first rather than trying to do all three sources at once.',
  },
  {
    speaker: 'interviewer',
    text: '“Which one’s that?”',
  },
  {
    speaker: 'candidate',
    text: 'Confluence is the most structured and probably the easiest to reason about permission-wise. I’d ship retrieval over public and semi-restricted Confluence spaces first, with the permission filter proven out at that smaller scale, before adding Slack history and Jira, which both have messier structure and more sensitive content mixed in.',
  },
  {
    speaker: 'interviewer',
    text: '“What happens if it gives someone a wrong answer instead of no answer?”',
  },
  {
    speaker: 'candidate',
    text: 'That’s the other reason I want an eval set early — I’d rather the assistant say “I couldn’t find a confident answer” than hallucinate something plausible-sounding from a stale doc. I’d set an explicit confidence threshold based on retrieval score, and below that threshold it says so and links what it did find, rather than guessing.',
  },
  {
    speaker: 'interviewer',
    text: '“Given a one-quarter timeline, what actually ships?”',
  },
  {
    speaker: 'candidate',
    text: 'A Slack bot answering questions over Confluence only, permission-filtered per user, with a thumbs up/down feedback loop building an eval set from day one. Slack and Jira ingestion, plus any Jira PII handling, is phase two, once the permission model and the eval process are both proven at smaller scale.',
  },
];

const CS2_PHASES: Step[] = [
  {
    title: 'Phase 1 — Confluence-only retrieval, permission-filtered',
    body: 'The lowest-sensitivity, most structured source ships first, with per-user permission filtering checked against real access control at query time, not a cached snapshot.',
  },
  {
    title: 'Phase 2 — feedback loop becomes an eval set',
    body: 'Thumbs up/down on every answer, from day one, gets collected into a small hand-labeled set so retrieval and answer quality can be measured, not guessed at, before more sources are added.',
  },
  {
    title: 'Phase 3 — add Slack and Jira, permission model first',
    body: 'Each new source is added only after its own permission-filtering is verified in isolation — Jira in particular needs an explicit pass for PII-containing tickets before ingestion, not after a leak is reported.',
  },
  {
    title: 'Phase 4 — confidence threshold tuning and IDE integration',
    body: 'Once the eval set is large enough to trust, the confidence threshold for “I don’t know” gets tuned against it, and the assistant expands beyond Slack into an IDE plugin or similar surface.',
  },
];

const CS2_FAILURES: Callout[] = [
  {
    title: 'Permission leakage through a flat vector index',
    body: 'Embedding everything into one index without query-time access filtering is the single most damaging mistake here — it turns a helpful assistant into a data-exfiltration path for restricted content.',
  },
  {
    title: 'Stale permission snapshots',
    body: 'Caching who-can-see-what at ingestion time instead of checking it at query time means a permission revoked yesterday can still leak through today.',
  },
  {
    title: 'Confident hallucination over honest uncertainty',
    body: 'An assistant that always produces a fluent-sounding answer, even from thin or stale retrieval, erodes trust faster than one that sometimes says it doesn’t know.',
  },
  {
    title: 'No eval set before scaling sources',
    body: 'Adding Slack and Jira before Confluence retrieval quality is actually measured means any regression from the added complexity is invisible until users start complaining.',
  },
];

// ---------------------------------------------------------------------------
// Case study 3 — Multi-agent coding assistant under a token budget
// ---------------------------------------------------------------------------

const CS3_TURNS: Turn[] = [
  {
    speaker: 'interviewer',
    text: '“We want a coding assistant that can plan a feature, write the code, and review it, using separate agents for each step. But we have a hard per-request cost cap from finance. Design it.”',
  },
  {
    speaker: 'candidate',
    text: 'Before I split anything into multiple agents — what’s driving the multi-agent idea specifically? A single agent with a good loop and the right tools can go pretty far, and every extra agent is extra token spend, which matters a lot given the cap you just mentioned.',
  },
  {
    speaker: 'interviewer',
    text: '“Fair pushback. We assumed separate planner, coder, and reviewer agents would each do their one job better than one agent doing all three.”',
  },
  {
    speaker: 'candidate',
    text: 'That can be true, but it’s worth testing rather than assuming, especially under a token budget. I’d actually start with a single agent doing plan-then-code-then-self-review as one loop, and use that as the baseline both for quality and for cost. Multi-agent only earns its complexity if it measurably beats that baseline on the same eval set.',
  },
  {
    speaker: 'interviewer',
    text: '“Say the baseline isn’t good enough and we do need to split it. How do you keep it inside the budget?”',
  },
  {
    speaker: 'candidate',
    text: 'First, I’d put a shared token budget tracker across the whole request, not a separate budget per agent — otherwise three agents each assuming they have the full budget blows through the cap immediately. Every agent call decrements from one shared counter, and any agent can check how much is left before deciding how much context to pull in.',
  },
  {
    speaker: 'interviewer',
    text: '“What happens when the budget actually runs low mid-task?”',
  },
  {
    speaker: 'candidate',
    text: 'That’s the part I’d design for explicitly rather than let happen by accident. Graceful degradation — if the reviewer agent is running low on budget, it falls back to a cheaper, faster model instead of skipping review entirely, or it reviews only the diff instead of the full file. The system should degrade in a controlled way, not just fail or blow the budget.',
  },
  {
    speaker: 'interviewer',
    text: '“What about a task that just needs more tokens than the cap allows, no matter what you do?”',
  },
  {
    speaker: 'candidate',
    text: 'Then I’d rather the system say so early and clearly — “this task is estimated to exceed budget, here’s a partial plan” — than silently produce a truncated, half-finished result and present it as complete. I’d build a rough cost estimate at the planning stage, before the coder agent starts, so we catch that case before spending most of the budget getting there.',
  },
  {
    speaker: 'interviewer',
    text: '“How do the agents actually hand off work to each other without wasting tokens re-explaining context?”',
  },
  {
    speaker: 'candidate',
    text: 'I’d pass a structured summary between agents rather than the full conversation history — the planner hands the coder a concrete spec, not a transcript of how it arrived there. That’s both cheaper and, honestly, usually produces a cleaner handoff than dumping raw context and hoping the next agent extracts the right part.',
  },
  {
    speaker: 'interviewer',
    text: '“Given all that, what ships first?”',
  },
  {
    speaker: 'candidate',
    text: 'The single-agent plan-code-review baseline, measured against a small eval set of real tickets, with the shared token tracker built in from day one even before any multi-agent split. If the baseline’s quality genuinely falls short on some class of task, I’d split just that piece into a second agent, rather than committing to a three-agent architecture up front on an assumption.',
  },
];

const CS3_PHASES: Step[] = [
  {
    title: 'Phase 1 — single-agent baseline with a shared token tracker',
    body: 'One agent handles plan, code, and self-review as a loop, with a shared token budget counter built in from the start, and its quality measured against a small eval set of real tickets.',
  },
  {
    title: 'Phase 2 — split only where the baseline measurably falls short',
    body: 'A second agent (for example, a dedicated reviewer) is introduced only for a task class where the baseline’s eval score is genuinely worse, not as a default architectural choice.',
  },
  {
    title: 'Phase 3 — graceful degradation under budget pressure',
    body: 'When the shared budget runs low mid-task, agents degrade in a controlled way — cheaper model, narrower scope — instead of silently exceeding the cap or failing outright.',
  },
  {
    title: 'Phase 4 — upfront cost estimation at the planning stage',
    body: 'Before the coder agent starts, a rough token estimate flags tasks likely to exceed budget, so the system can say so early instead of producing a silently truncated result.',
  },
];

const CS3_FAILURES: Callout[] = [
  {
    title: 'Splitting into multiple agents before testing a single-agent baseline',
    body: 'Multi-agent architectures add real token and latency cost. Without a baseline to compare against, there’s no way to know whether the split actually improved anything.',
  },
  {
    title: 'Per-agent budgets instead of one shared tracker',
    body: 'If each agent assumes it has the full budget, three agents can each independently blow through what was meant to be one shared cap.',
  },
  {
    title: 'Failing hard instead of degrading gracefully',
    body: 'A task that simply errors out when the budget runs low is worse than one that finishes with a cheaper model or a narrower scope and says so clearly.',
  },
  {
    title: 'Passing full conversation history between agents',
    body: 'Re-sending raw context at every handoff is an easy way to quietly multiply token spend across a multi-agent pipeline — a structured summary is usually cheaper and clearer.',
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

export default function SystemDesign(): ReactNode {
  return (
    <Layout title={TITLE} description={META_DESCRIPTION}>
      <main className={styles.page}>
        <div className="container">
          <PageHeader
            title={TITLE}
            oneLiner={ONE_LINER}
            meta={['45–60 minutes', 'Highest weight in the loop', 'The round that actually decides most offers']}
          />

          <Section title="The framework, before the scenarios">
            <p>
              Every version of this round follows the same underlying shape, no matter the product. The
              interviewer is grading the process, not just the destination — the same five moves work whether the
              product is a support bot, an internal tool, or a coding assistant.
            </p>
            <StepList items={FRAMEWORK_STEPS} />
            <div className={styles.insightBox}>
              <p>
                <strong>The single most common failure mode: naming an architecture before scoping the risk.</strong>{' '}
                Jumping to “I’d use a multi-agent setup with a vector database” in the first two minutes reads as a
                red flag, not a strength. Nobody has earned the right to propose an architecture yet.
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
              Three full walkthroughs follow — different products, same underlying discipline. Read them the way
              you’d rehearse for the real thing: notice where the candidate asks a question instead of guessing.
            </p>
          </Section>

          <Section title="Three end-to-end walkthroughs">
            <CaseStudy
              index={1}
              tag="Customer support agent"
              title="An agent that handles refunds and plan changes"
              prompt="“Support gets buried in refund requests and plan-change questions. We want an agent that can just handle it.”"
              turns={CS1_TURNS}
              diagram={`flowchart TD
    A["Customer message"] --> B["Support agent\\n(retrieval over docs + CRM)"]
    B --> C{"In-policy?\\n(deterministic rule check,\\noutside model control)"}
    C -->|"yes"| D["Refund tool call"]
    C -->|"no"| E["Route to human"]
    D --> F["Shadow mode: log agreement\\nwith human choice"]
    F -->|"phase 2, proven"| G["Automated execution"]
    B --> H["Plan-change draft"]
    H --> I["Human confirms"]
    I -->|"approved"| J["Billing API write"]`}
              phasesTitle="How this decomposes"
              phases={CS1_PHASES}
              failures={CS1_FAILURES}
            />

            <CaseStudy
              index={2}
              tag="Internal RAG assistant"
              title="A permission-aware knowledge assistant over Confluence, Slack, and Jira"
              prompt="“Engineers waste hours searching Confluence, Slack, and Jira for answers that already exist. Build an assistant that just knows.”"
              turns={CS2_TURNS}
              diagram={`flowchart TD
    A["Confluence"] --> D["Ingestion + embedding"]
    B["Slack history\\n(phase 3)"] --> D
    C["Jira tickets\\n(phase 3, PII review)"] --> D
    D --> E["Vector index"]
    F["User query via Slack bot"] --> G["Retrieval"]
    G --> E
    G --> H["Query-time permission filter\\n(checked against live access control)"]
    H --> I{"Confidence above\\nthreshold?"}
    I -->|"yes"| J["Answer with citations"]
    I -->|"no"| K["\\"I don't know\\" + links"]
    J --> L["Thumbs up/down feedback"]
    L --> M["Hand-labeled eval set"]`}
              phasesTitle="How this decomposes"
              phases={CS2_PHASES}
              failures={CS2_FAILURES}
            />

            <CaseStudy
              index={3}
              tag="Multi-agent coding assistant"
              title="A plan-code-review pipeline under a hard token budget"
              prompt="“We want a coding assistant with separate planner, coder, and reviewer agents, but we have a hard per-request cost cap.”"
              turns={CS3_TURNS}
              diagram={`flowchart TD
    A["Ticket / feature request"] --> B["Single-agent baseline\\n(plan + code + self-review)"]
    B --> C["Eval against real tickets"]
    C -->|"quality gap found"| D["Split only that step\\ninto a second agent"]
    D --> E["Shared token budget tracker"]
    E --> F["Planner agent"]
    E --> G["Coder agent"]
    E --> H["Reviewer agent"]
    F -->|"structured spec,\\nnot full transcript"| G
    G -->|"diff"| H
    E -->|"budget running low"| I["Graceful degradation\\n(cheaper model / narrower scope)"]`}
              phasesTitle="How this decomposes"
              phases={CS3_PHASES}
              failures={CS3_FAILURES}
            />
          </Section>

          <SubNav
            prev={{label: 'Back: the technical round', to: '/career-tracks/applied-agentic-ai-engineer/technical-round'}}
            next={{label: 'Next: the behavioral round', to: '/career-tracks/applied-agentic-ai-engineer/behavioral-round'}}
          />
        </div>
      </main>
    </Layout>
  );
}
