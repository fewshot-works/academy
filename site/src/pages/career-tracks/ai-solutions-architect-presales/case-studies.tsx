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
  'Three full end-to-end discovery-to-design case studies for the AI Solutions Architect / Presales track — retail support, insurance claims, and field service — written as a live interviewer/candidate walkthrough.';

const ONE_LINER =
  'Often the most heavily weighted round in the loop. A hypothetical customer hands you a vague problem and, for ' +
  '45–60 minutes, you run the conversation you’d actually run on a real discovery call — asking questions, ' +
  'scoping a PoC, and defending a design — while the interviewer plays the customer, an objection, or both. ' +
  'Below is the framework, then three full walkthroughs across three industries, written the way the room ' +
  'actually sounds.';

const FRAMEWORK_STEPS: Step[] = [
  {
    title: 'Confirm the pain point and how it’s measured today',
    body: '“Reduce support costs” and “reduce first-response time” are different projects with different data. Get the actual number the customer is looking at before proposing anything.',
  },
  {
    title: 'Identify every stakeholder in the room, not just the one talking',
    body: 'The technical buyer, the economic buyer, and security/procurement often want different things and show up at different points in the deal — naming them early avoids a design that stalls in someone else’s review.',
  },
  {
    title: 'Map what already exists',
    body: 'What systems hold the data, how do people work today, and what’s the actual integration surface? You’re almost never proposing a blank slate.',
  },
  {
    title: 'Scope the PoC by risk and by what’s demo-able in the timeline, not by the whole vision',
    body: 'The full production system is not the PoC. Pick the thinnest slice that tests the riskiest assumption and can genuinely be shown working.',
  },
  {
    title: 'Be explicit about what’s automated and what stays human-approved',
    body: 'Naming exactly where a human stays in the loop — and why — is usually what turns a skeptical security reviewer into a sponsor.',
  },
];

const CASE_STUDY_TAGS = ['Retail / e-commerce support', 'Insurance / claims operations', 'Manufacturing / field service'];

// ---------------------------------------------------------------------------
// Case study 1 — Retail support
// ---------------------------------------------------------------------------

const CS1_TURNS: Turn[] = [
  {
    speaker: 'interviewer',
    text: '“I run customer support for a mid-size online retailer. About 40% of our 50,000 monthly tickets are ‘where is my order.’ We’ve heard AI can answer these automatically — can you show us how?”',
  },
  {
    speaker: 'candidate',
    text: 'Before I sketch anything — where does order and shipping data actually live today, and what system are your reps working in when they answer one of these tickets?',
  },
  {
    speaker: 'interviewer',
    text: '“Tickets come in through Zendesk. Order data is in Shopify, and shipping status comes from our 3PL’s own tracking system, which doesn’t always agree with Shopify.”',
  },
  {
    speaker: 'candidate',
    text: 'Good to know now — that disagreement between two data sources is exactly the kind of thing that turns into a bad AI answer if we build past it. When the two sources conflict today, which one does a human rep trust?',
  },
  {
    speaker: 'interviewer',
    text: '“The 3PL, usually — Shopify’s status can lag by a day.”',
  },
  {
    speaker: 'candidate',
    text: 'Then the agent should follow the same rule, not average the two or guess. One more question before I propose scope: should this agent ever be allowed to issue a refund or a replacement, or only answer status questions?',
  },
  {
    speaker: 'interviewer',
    text: '“Absolutely not refunds automatically — that’s a hard line from finance. Status and tracking info only, at least to start.”',
  },
  {
    speaker: 'candidate',
    text: 'That’s the constraint I’d design around rather than bolt on later. I’d propose a read-only agent: it classifies an incoming ticket, and if it’s a status question, it calls a lookup tool against the 3PL tracking API — falling back to Shopify only if the 3PL has no record yet — and drafts a reply. No write access to either system at all in this phase.',
  },
  {
    speaker: 'interviewer',
    text: '“Drafts a reply — so a human still sends it?”',
  },
  {
    speaker: 'candidate',
    text: 'For the PoC, yes. The draft goes into the Zendesk queue as a suggested response a rep approves with one click, the same shadow-to-live pattern you’d want for anything customer-facing — you get to see the agent’s accuracy on real tickets before anything goes out under your brand’s name without a human glancing at it first.',
  },
  {
    speaker: 'interviewer',
    text: '“Fair. What would a two-week proof of concept actually show us?”',
  },
  {
    speaker: 'candidate',
    text: 'I’d pull a sample of a few hundred real, closed order-status tickets, run the agent against them offline, and measure two things against your own historical replies: how often it would have given a correct answer, and how often it correctly recognized it didn’t know and should hand off to a human instead of guessing. That second number matters as much as the first.',
  },
  {
    speaker: 'interviewer',
    text: '“And if it looks good, what changes for the live pilot?”',
  },
  {
    speaker: 'candidate',
    text: 'The pilot moves from offline replay to the live Zendesk queue, still draft-and-approve, on a subset of your support team so you can watch adoption, not just accuracy. Auto-send only becomes a conversation once you’ve seen weeks of reps approving drafts basically unedited.',
  },
];

const CS1_PHASES: Step[] = [
  {
    title: 'Phase 0 — offline replay against historical tickets',
    body: 'Run the classification-and-lookup agent against a sample of already-closed order-status tickets, scoring accuracy and “knows when it doesn’t know” against the rep’s actual historical reply — before touching a live queue.',
  },
  {
    title: 'Phase 1 — draft-and-approve pilot, read-only',
    body: 'The agent classifies incoming Zendesk tickets, calls a read-only 3PL/Shopify lookup tool, and drafts a reply that a rep approves with one click. No write access, no auto-send.',
  },
  {
    title: 'Phase 2 — auto-send for high-confidence cases only',
    body: 'Once weeks of pilot data show reps approving drafts nearly unedited, low-ambiguity status replies (e.g., “delivered” or “in transit, on schedule”) move to auto-send; anything the agent flags as low-confidence still queues for a human.',
  },
  {
    title: 'Phase 3 — expand ticket categories',
    body: 'Only after status questions are proven does the same pattern extend to adjacent categories like return-eligibility lookups — still read-only, still no financial actions.',
  },
  {
    title: 'Phase 4 — ongoing: track deflection and correction rate',
    body: 'Track ticket deflection rate and rep-correction rate monthly; a rising correction rate on a specific ticket type is the signal to pull that category back into draft-only before trust erodes.',
  },
];

const CS1_FAILURES: Callout[] = [
  {
    title: 'Conflicting source-of-truth data',
    body: 'Shopify and the 3PL disagreeing on status is the single most likely source of a visibly wrong answer — the tie-breaking rule has to be explicit and match what a human rep would actually trust.',
  },
  {
    title: 'Overconfident “I don’t know”',
    body: 'An agent that guesses instead of escalating is worse than one that escalates too often — early tuning should bias toward handoff, then loosen as accuracy is proven.',
  },
  {
    title: 'Brand-voice mismatch',
    body: 'A technically correct reply written in the wrong tone can generate its own complaints — the draft prompt needs real examples of the brand’s actual reply style, not a generic customer-service tone.',
  },
  {
    title: 'Scope creep toward refunds',
    body: 'The moment the pilot looks good, the natural next ask is “can it also issue the refund?” — worth having a ready answer for why that’s a distinct, higher-risk phase with its own review, not a small extension.',
  },
];

// ---------------------------------------------------------------------------
// Case study 2 — Insurance claims
// ---------------------------------------------------------------------------

const CS2_TURNS: Turn[] = [
  {
    speaker: 'interviewer',
    text: '“I run claims operations at a regional insurer. Our call-center reps have to dig through 40-page policy PDFs to answer coverage questions, and they get it wrong more often than I’d like. Can you build us a search tool?”',
  },
  {
    speaker: 'candidate',
    text: 'When a rep gets it wrong today, is that mostly them not finding the right clause in time, or finding a clause and misreading it?',
  },
  {
    speaker: 'interviewer',
    text: '“Mostly not finding it in time — call’s already five minutes in and they’re still scrolling a PDF.”',
  },
  {
    speaker: 'candidate',
    text: 'That’s a retrieval problem more than a comprehension one, which is a good sign for what we can fix quickly. Where do these policy documents actually live, and how do they change over time — are they versioned by effective date?',
  },
  {
    speaker: 'interviewer',
    text: '“They’re in SharePoint, and yes, each policy has an effective-date version. Some of the older ones are scanned images, not real PDFs, though.”',
  },
  {
    speaker: 'candidate',
    text: 'Good to flag now — the scanned ones need an OCR step before anything else works, and I’d want to know roughly what fraction of your active policy library that is before committing to a PoC timeline. Before I propose an architecture: is this tool only for reps, or could an answer ever go straight to a customer?',
  },
  {
    speaker: 'interviewer',
    text: '“Reps only, for now. If we ever gave a customer a wrong coverage answer directly, that’s a real liability problem for us.”',
  },
  {
    speaker: 'candidate',
    text: 'That constraint actually makes the design easier to trust: every answer this tool gives can show the rep the exact clause and page it came from, and the rep is always the one who says it out loud to the customer. I’d propose a RAG pipeline — chunk each policy by section and clause, tag each chunk with its policy version and effective date, and when a rep asks a question, retrieve the relevant clauses and show them alongside a drafted answer, never the answer alone.',
  },
  {
    speaker: 'interviewer',
    text: '“How do we know it’s actually getting the right clause, and not just something that sounds plausible?”',
  },
  {
    speaker: 'candidate',
    text: 'That’s exactly why I wouldn’t launch this on gut feel. Before any live pilot, I’d want your claims SMEs to hand-label a few dozen realistic questions with the correct clause each one should retrieve, and we’d measure the pipeline against that set before a rep ever sees it — the same precision-and-recall discipline you’d use to evaluate any search system, not just an AI one.',
  },
  {
    speaker: 'interviewer',
    text: '“And if the eval looks good — what’s the actual pilot?”',
  },
  {
    speaker: 'candidate',
    text: 'One line of business to start — say, auto policies in a single state, since coverage language is more standardized there than home — rolled out to a handful of reps, with every answer showing its cited clause. I’d explicitly leave home and commercial lines out of scope for the pilot; broader coverage is a phase-two conversation once the eval holds up on the narrower slice.',
  },
];

const CS2_PHASES: Step[] = [
  {
    title: 'Phase 0 — SME-labeled eval set, before any pilot',
    body: 'Claims SMEs hand-label several dozen realistic coverage questions with the correct source clause; this becomes the yardstick the retrieval pipeline is measured against before a rep sees it live.',
  },
  {
    title: 'Phase 1 — ingestion pipeline for one line of business',
    body: 'OCR the scanned policies, chunk by section/clause, tag each chunk with policy version and effective date, and index into a vector store — scoped to a single line of business and state to start.',
  },
  {
    title: 'Phase 2 — cited-answer pilot with a handful of reps',
    body: 'Reps ask a question in natural language; the tool retrieves and shows the relevant clause plus a drafted answer, always with the source citation visible — the rep, not the tool, speaks to the customer.',
  },
  {
    title: 'Phase 3 — expand lines of business',
    body: 'Only after the eval score and rep feedback hold up on the narrow slice does the same pipeline extend to additional lines of business, each with its own SME-labeled eval set rather than assuming the first one generalizes.',
  },
  {
    title: 'Phase 4 — ongoing: re-index on policy updates, track retrieval accuracy',
    body: 'Policies change on renewal cycles — the ingestion pipeline needs to catch new versions automatically, and retrieval accuracy against the eval set should be re-checked whenever a policy template changes materially.',
  },
];

const CS2_FAILURES: Callout[] = [
  {
    title: 'OCR quality on scanned policies',
    body: 'Older scanned documents can silently produce garbled text after OCR, which then gets chunked and indexed as-is — worth spot-checking OCR output on a sample before trusting the pipeline on those documents at all.',
  },
  {
    title: 'Stale policy versions in the index',
    body: 'A rep citing a clause from a superseded policy version is arguably worse than not finding an answer at all — version and effective-date metadata has to be correct, not just present.',
  },
  {
    title: 'Rep over-trust in the drafted answer',
    body: 'Even with a citation shown, reps can start reading past the source clause and just trusting the draft — periodic spot-audits of rep answers against the cited source catches this before it becomes a habit.',
  },
  {
    title: 'Regulatory and legal review timeline',
    body: 'Anything touching how coverage decisions get communicated tends to need a compliance sign-off that runs longer than the technical build — worth flagging as a project-timeline risk, not a technical one.',
  },
];

// ---------------------------------------------------------------------------
// Case study 3 — Manufacturing field service
// ---------------------------------------------------------------------------

const CS3_TURNS: Turn[] = [
  {
    speaker: 'interviewer',
    text: '“I run field service for an industrial equipment manufacturer. Our technicians burn twenty minutes on-site flipping through PDF manuals to find a torque spec or a wiring diagram. We have a trade show in six weeks — can you get us a demo?”',
  },
  {
    speaker: 'candidate',
    text: 'Six weeks is workable for a scoped demo, but I want to make sure we scope the right thing. What’s connectivity actually like at the job sites your technicians work — reliable cellular, or are some sites dead zones?',
  },
  {
    speaker: 'interviewer',
    text: '“Mostly fine, but a meaningful chunk of our sites are in rural areas with no signal at all.”',
  },
  {
    speaker: 'candidate',
    text: 'That changes the architecture more than anything else so far — a pure cloud-lookup tool would just fail at exactly the sites where it matters most. What device are technicians actually carrying, and could it hold a local cache?',
  },
  {
    speaker: 'interviewer',
    text: '“Rugged tablets, yes, with decent local storage.”',
  },
  {
    speaker: 'candidate',
    text: 'Then I’d propose a hybrid: manuals for the specific equipment on a technician’s dispatch schedule get synced to the tablet before they leave for the site, so lookups work offline, with a cloud RAG fallback for anything outside that pre-synced set when they do have signal. For the trade-show demo specifically, is there one equipment line you’d want to showcase, or does it need to cover your full catalog?',
  },
  {
    speaker: 'interviewer',
    text: '“One line would be fine for the demo — our new industrial pump series, actually.”',
  },
  {
    speaker: 'candidate',
    text: 'That’s the right scope for six weeks — a hero demo on one equipment line, running fully offline on the tablet, showing a technician asking a question in plain language and getting the exact torque spec or diagram with a page reference. I’d be direct with your team, though: a polished trade-show demo on one product line is not the same as a production rollout across your full catalog, and I don’t want that distinction to get lost after the show goes well.',
  },
  {
    speaker: 'interviewer',
    text: '“Understood — what would it take to go from that demo to something real?”',
  },
  {
    speaker: 'candidate',
    text: 'A pilot with a small group of technicians, maybe ten, using it on real service calls for a few weeks, with feedback captured on where the answer was wrong or missing — and a real content-refresh pipeline, since your manuals presumably get revised as products change, and a stale cached manual on a tablet is a safety problem, not just an inconvenience.',
  },
  {
    speaker: 'interviewer',
    text: '“Our IP team will also ask — these manuals are proprietary. How do we make sure they’re not exposed?”',
  },
  {
    speaker: 'candidate',
    text: 'Good to raise now rather than after the pilot — the vector index and the on-device cache both need to be encrypted at rest, access scoped to authenticated technician devices only, and I’d want that written into the architecture doc before the pilot starts, not retrofitted after your security team asks.',
  },
];

const CS3_PHASES: Step[] = [
  {
    title: 'Phase 1 — hero demo, one equipment line, offline-capable',
    body: 'Chunk and embed manuals for a single product line, cache them fully on a rugged tablet, and demo a technician asking a plain-language question and getting a cited answer with no network connection required.',
  },
  {
    title: 'Phase 2 — small pilot with real technicians',
    body: 'Roll out to roughly ten technicians on real service calls for several weeks, capturing structured feedback on wrong or missing answers rather than just informal impressions.',
  },
  {
    title: 'Phase 3 — content-refresh pipeline',
    body: 'Build the ingestion pipeline that picks up revised manuals automatically and re-syncs the on-device cache, since a stale cached spec is a safety risk in this domain, not just a UX gap.',
  },
  {
    title: 'Phase 4 — expand catalog coverage',
    body: 'Only after the pilot and refresh pipeline are proven does the same pattern extend to additional equipment lines, prioritized by which lines generate the most field-service calls.',
  },
  {
    title: 'Phase 5 — ongoing: encryption and access review, usage tracking',
    body: 'Revisit the encryption-at-rest and device-access design as the pilot scales past ten technicians, and track which queries the offline cache misses most often — those are the manuals to prioritize adding to the next sync.',
  },
];

const CS3_FAILURES: Callout[] = [
  {
    title: 'Demo-to-production gap',
    body: 'A hand-picked hero demo on one product line under ideal conditions can create expectations a broader rollout can’t immediately meet — setting that expectation explicitly, up front, avoids a credibility hit later.',
  },
  {
    title: 'Stale offline cache',
    body: 'A technician working from an outdated cached spec after a manual revision is a safety issue in this domain — the refresh pipeline isn’t a nice-to-have, it’s a prerequisite for anything past the demo stage.',
  },
  {
    title: 'IP exposure on-device',
    body: 'Proprietary manuals cached locally on a field tablet are a real security surface — encryption and device-scoped access need to be part of the architecture from the start, not a follow-up request.',
  },
  {
    title: 'Connectivity assumptions baked in early',
    body: 'A cloud-only design proposed before asking about field connectivity would have failed at exactly the sites where the tool matters most — this is the single question in the whole case study that reshapes everything downstream.',
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
          content="AI presales case study interview, solutions architect case study round, enterprise AI demo interview questions"
        />
      </Head>
      <main className={styles.page}>
        <div className="container">
          <PageHeader
            title={TITLE}
            oneLiner={ONE_LINER}
            meta={['45–60 minutes', 'Often the most heavily weighted round in the loop']}
          />

          <Section title="The framework, before the scenarios">
            <p>
              Every version of this round follows the same underlying shape, no matter the industry. The
              interviewer is grading the process, not just the destination — the same five moves work whether the
              customer is a retailer, an insurer, or a manufacturer.
            </p>
            <StepList items={FRAMEWORK_STEPS} />
            <div className={styles.insightBox}>
              <p>
                <strong>The single most common failure mode: naming a tech stack before scoping the problem.</strong>{' '}
                Saying “I’d use a vector database and an agent” in the first two minutes reads as a red flag, not a
                strength. Nobody has earned the right to propose an architecture yet.
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
              tag="Retail / e-commerce support"
              title="Automating order-status replies for an e-commerce support team"
              prompt="“About 40% of our 50,000 monthly tickets are ‘where is my order.’ Can you show us how AI would answer these automatically?”"
              turns={CS1_TURNS}
              diagram={`flowchart TD
    A["Zendesk ticket"] --> B["Classification agent\\n(is this an order-status question?)"]
    B --> C["Order-lookup tool\\n(3PL tracking API, fallback: Shopify)"]
    C --> D["Drafted reply"]
    D --> E["Rep approves\\n(phase 1, one click)"]
    E -->|"high-confidence cases, phase 2"| F["Auto-send"]
    D -->|"low confidence"| G["Human handles from scratch"]`}
              phasesTitle="How this decomposes"
              phases={CS1_PHASES}
              failures={CS1_FAILURES}
            />

            <CaseStudy
              index={2}
              tag="Insurance / claims operations"
              title="Cited policy search for a regional insurer’s claims call center"
              prompt="“Our reps dig through 40-page policy PDFs mid-call and get coverage questions wrong. Can you build us a search tool?”"
              turns={CS2_TURNS}
              diagram={`flowchart TD
    A["SharePoint policy PDFs\\n(some scanned images)"] --> B["OCR + chunking pipeline\\n(by clause, tagged with version/effective date)"]
    B --> C["Vector index\\n(one line of business, phase 1)"]
    D["Rep question"] --> E["Retrieval"]
    C --> E
    E --> F["Drafted answer + cited clause"]
    F --> G["Rep reads clause, speaks to customer"]
    H["SME-labeled eval set"] -.->|"phase 0, before pilot"| E`}
              phasesTitle="How this decomposes"
              phases={CS2_PHASES}
              failures={CS2_FAILURES}
            />

            <CaseStudy
              index={3}
              tag="Manufacturing / field service"
              title="An offline-capable manual assistant for field technicians"
              prompt="“Our technicians burn twenty minutes on-site flipping through PDF manuals. We have a trade show in six weeks — can you get us a demo?”"
              turns={CS3_TURNS}
              diagram={`flowchart TD
    A["Equipment manuals\\n(one product line, phase 1)"] --> B["Chunking + embedding pipeline"]
    B --> C["Vector index (cloud)"]
    B --> D["On-device cache\\n(synced before dispatch)"]
    E["Technician tablet query"] --> D
    D -->|"offline hit"| F["Cited answer, no network needed"]
    D -->|"cache miss, signal available"| C
    C --> F
    G["Content-refresh pipeline\\n(phase 3)"] --> A`}
              phasesTitle="How this decomposes"
              phases={CS3_PHASES}
              failures={CS3_FAILURES}
            />
          </Section>

          <Section title="The deal doesn’t end at the demo">
            <p>
              All three walkthroughs above stop at the moment a PoC gets approved — that’s deliberate for pacing,
              but it undersells the role. In most organizations the SA or presales engineer stays involved well
              past the signature: supporting the delivery team through the pilot, defending the design when a
              production integration surfaces something the demo didn’t, and carrying what was learned into the
              next deal instead of starting cold every time.
            </p>
            <CalloutList
              items={[
                {
                  title: 'A demo that worked isn’t the same as a design that scales',
                  body: 'The trade-show hero demo in the field-service case study is intentionally narrow — one product line, ideal conditions. Part of the job is being the one who says so out loud, before a customer’s expectations run ahead of what’s actually been proven.',
                },
                {
                  title: 'Handoff to delivery is still your problem',
                  body: 'If the team that builds the production system wasn’t in the discovery calls, the SA is often the only person who remembers why a design decision was made a particular way — writing that reasoning down, not just the diagram, is what makes the handoff actually work.',
                },
                {
                  title: 'Every deal should leave behind a reusable pattern',
                  body: 'The offline-cache-plus-cloud-fallback pattern from the field-service case study is exactly what the next customer with spotty connectivity will need. Packaging it as a reusable reference architecture is quietly one of the highest-leverage things a presales engineer does over time.',
                },
              ]}
            />
          </Section>

          <SubNav
            prev={{label: 'Back: the live design round', to: '/career-tracks/ai-solutions-architect-presales/technical-round'}}
            next={{label: 'Next: the behavioral round', to: '/career-tracks/ai-solutions-architect-presales/behavioral-round'}}
          />
        </div>
      </main>
    </Layout>
  );
}
