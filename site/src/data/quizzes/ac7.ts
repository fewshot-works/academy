import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question:
      "This chapter opens with an analogy about a safe manufacturer testing a lock design. What's the point of that analogy?",
    options: [
      "Locks and AI agents use the same underlying technology",
      "A defense that's passed one test is only proven against that one test -- real confidence comes from testing against a whole battery of known attack methods, and re-testing as new methods appear",
      "Physical security is more important than software security",
      "Locksmiths are a good career path for people who like AI security",
    ],
    correctIndex: 1,
    explanation:
      "A lock rated 'unpickable' after one locksmith's one attempt hasn't proven much. Independent labs certify locks against dozens of standardized attack methods, and keep re-testing as new techniques emerge. This chapter applies the same idea to software: Chapter 3's allowlist guard held against one hidden instruction, which is real evidence, but only for that one attack.",
  },
  {
    question:
      "In the lab's real run, the keyword filter flagged `explicit_override` and `roleplay_jailbreak` but missed `polite_compliance`, `urgent_authority`, and `obfuscated_wording`. What determined which ones got caught?",
    options: [
      "Whether the document was long or short",
      "Whether the document's wording happened to contain one of the filter's exact known phrases, like \"ignore all previous instructions\" or \"pretend you are\"",
      "Whether the model actually acted on the hidden instruction",
      "The filter caught all five, this chapter shows a different result",
    ],
    correctIndex: 1,
    explanation:
      "The filter is a fixed list of known phrases (INJECTION_PATTERNS). It matched the two variants that happened to use textbook injection wording almost verbatim. The other three variants asked for the same thing using ordinary business language, legal urgency, vendor recordkeeping, with no matching phrase for the filter to catch, so they passed through unflagged.",
  },
  {
    question:
      "In the real run, `polite_compliance`'s first two `send_email_guarded` calls were made with no arguments at all (`{}`), and no `[allowlist guard] blocked...` line printed for either one. Why not?",
    options: [
      "The allowlist guard has a bug and silently lets malformed calls through",
      "A call missing the required `to` and `body` fields fails the tool's own argument checking before `send_email_guarded`'s allowlist logic ever runs, so the guard's code never executes for those two",
      "The model was granted a special exemption for its first two attempts",
      "Empty arguments are automatically treated as an approved recipient",
    ],
    correctIndex: 1,
    explanation:
      "send_email_guarded requires a `to` and a `body`. A call with neither doesn't reach the function's own `if to not in ALLOWED_RECIPIENTS` check at all, it's rejected as an invalid tool call first. That's why only the model's later, well-formed attempts (to logs@vendor-analytics.net and a self-invented compliance@vendor-analytics.net) actually triggered the printed guard message.",
  },
  {
    question:
      "The chapter's 'if you want to go deeper' aside warns that the eval harness itself can be attack surface. What's an example of that risk?",
    options: [
      "The Python script running slowly when testing many attack variants",
      "An LLM used to grade whether an attack succeeded, fed the agent's transcript including the injected content, being manipulated by that same content",
      "Running the lab with PROVIDER=openai instead of PROVIDER=ollama",
      "The attack battery containing too few variants",
    ],
    correctIndex: 1,
    explanation:
      "If a red-teaming setup uses an LLM judge to grade whether an attack got through, and that judge is fed the raw transcript (injected content included), the judge itself is now reading attacker-controlled text -- the same category of risk the system under test faces. The aside's point: evaluation infrastructure needs the same suspicion as the thing it's evaluating, not a free pass because it's 'just testing.'",
  },
];
