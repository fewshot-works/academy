import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question:
      "This chapter maps to OWASP's LLM06:2025 Excessive Agency, which breaks the risk into three root causes: excessive functionality, excessive permissions, and excessive autonomy. Which one does this chapter's lab actually address?",
    options: [
      "Excessive functionality -- giving a tool capabilities it doesn't need",
      "Excessive permissions -- scoping what a tool is allowed to do based on which role is calling it",
      "Excessive autonomy -- letting a high-impact action proceed without anyone checking",
      "None of the three, RBAC is a separate OWASP category entirely",
    ],
    correctIndex: 1,
    explanation:
      "The chapter says this directly: its lab is \"squarely about the second one, scoping a tool's permissions to the role using it.\" Excessive functionality would be about send_email or issue_refund existing at all when they weren't needed; excessive autonomy would be about refunds happening with no check whatsoever. This chapter's guard is specifically a permissions check.",
  },
  {
    question:
      "Per the Auth0 article this chapter cites, what's one concrete way RBAC \"strains\" as a system of agents and roles grows more complex?",
    options: [
      "RBAC checks become too computationally slow to run in real time",
      "An agent's effective role can shift moment to moment, and once there are enough roles and resources, teams either drown in role definitions or grant one oversized role that defeats the purpose",
      "RBAC only works for human employees, never for AI agents",
      "RBAC requires a specific paid vendor product to implement at all",
    ],
    correctIndex: 1,
    explanation:
      "The chapter's ecosystem section paraphrases this exact point from Auth0's write-up: constant role-hopping either floods audit logs or pushes teams toward one oversized role that covers everything, which defeats the purpose of having roles in the first place. That's the chapter's own signal for when to look past plain RBAC toward finer-grained authorization.",
  },
  {
    question:
      "The chapter opens with an office badge-reader analogy: the same reader, same door, but two different outcomes depending on whose badge it is. What's the point of that analogy?",
    options: [
      "Physical badge systems are more secure than software permission checks",
      "The same tool and the same guard code can produce different outcomes depending on who's calling it -- the check, not the tool itself, is what decides",
      "Two people should never be able to use the same door for security reasons",
      "Badge readers are a metaphor for API keys, which this chapter's lab actually uses",
    ],
    correctIndex: 1,
    explanation:
      "The reader (the tool) never changes. What changes the outcome is what's encoded on the badge (the caller's role) -- exactly like issue_refund_guarded: same function, same code path, but support_rep and support_lead get different answers because the guard checks who's asking, not just what's being asked.",
  },
  {
    question:
      "look_up_order has no guard at all in this lab, while issue_refund_guarded checks both permission and scope. Why is that a deliberate design choice rather than something the lab forgot to add?",
    options: [
      "It's an oversight, look_up_order should have been role-gated too",
      "A read-only lookup can't change or cost anything on its own, so guarding it would add complexity without reducing real risk -- the guard effort goes where an action can actually do damage, issuing money",
      "look_up_order is guarded too, the guard just isn't printed to the console",
      "Every tool in a real system must always have a role check, regardless of what it does",
    ],
    correctIndex: 1,
    explanation:
      "This is the same instinct Chapter 3 used when it guarded send_email but not read_roadmap or read_vendor_notice: constrain the tool that can cause real, hard-to-reverse consequences, not every tool an agent touches. A lookup can be called by anyone because nothing bad can come of merely reading an order.",
  },
];
