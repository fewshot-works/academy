import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question:
      "Chapter 4 covered direct prompt injection. This chapter covers the indirect kind. What's the defining difference between the two, in terms of where the malicious text comes from?",
    options: [
      "Indirect injection only happens with local, open-weight models",
      "Direct injection is text the user types straight into the chat; indirect injection arrives as the output of a tool call the agent makes while doing an ordinary task, so there's no suspicious user message to scan at all",
      "There's no real difference, both are stopped by the exact same keyword filter",
      "Indirect injection requires the attacker to already have access to the target's email account",
    ],
    correctIndex: 1,
    explanation:
      "Chapter 4's INJECTION_PATTERNS has a user message to scan, because the attacker is the user. This chapter's attacker never talks to the agent at all, they plant the instruction somewhere the agent is going to read anyway (a document, an email, a search result), and it arrives as tool output instead of user input.",
  },
  {
    question:
      "The chapter compares its recipient-allowlist fix to a well-known security principle rather than to a detection technique. Which principle?",
    options: [
      "Zero-trust networking, verifying every request regardless of source",
      "Least privilege: running something with the fewest permissions it actually needs, instead of trying to guess every bad thing it might attempt with more",
      "Defense in depth, stacking as many unrelated filters as possible",
      "Air-gapping, physically disconnecting the system from any network",
    ],
    correctIndex: 1,
    explanation:
      "The chapter says it directly: constraining send_email to a small set of known-safe addresses is \"the same instinct as running a process with the fewest permissions it actually needs, rather than trying to guess every bad thing it might try to do with more.\" The model can be fully convinced the email is necessary; the tool's permissions don't care.",
  },
  {
    question:
      "In part two's real run, the guard's log shows it blocking two different addresses (vendor@coffeevendors.com once, logs@vendor-analytics.net twice), not the same address three times. What does that reveal about how the guard decides what to block?",
    options: [
      "It means the guard failed on its first two attempts before finally working",
      "It means two separate hidden instructions were planted in the vendor notice",
      "The guard never needs to know or recognize which address is \"the attacker's\" -- it checks every recipient the tool is called with against the same fixed list, regardless of which specific address the model tries",
      "It means the model was testing the guard's source code for a bypass",
    ],
    correctIndex: 2,
    explanation:
      "The guard doesn't reason about intent or track \"suspicious\" addresses. It asks the same narrow question every single call: is this recipient on the list? That's why it caught a different address just as easily as a repeated one, the check doesn't depend on having seen that specific address before.",
  },
  {
    question:
      "The chapter calls a detector like Meta's Prompt Guard a \"smoke alarm\" rather than a full defense. Why?",
    options: [
      "Because Prompt Guard is unreliable enough that it shouldn't be used at all",
      "Because a text classifier can be evaded by wording it hasn't seen, so it's a useful early-warning layer, not a substitute for a capability guard that constrains what the tool can actually do",
      "Because Prompt Guard was designed to detect literal fires, not prompt injection",
      "Because smoke alarms and allowlists solve completely unrelated problems",
    ],
    correctIndex: 1,
    explanation:
      "A smoke alarm can warn you before real damage, but it doesn't stop a fire on its own; you still want a locked door. Same logic here: a classifier adds a layer of detection, but it complements a capability guard like this chapter's allowlist, it doesn't replace it, because any classifier can eventually be evaded by new phrasing.",
  },
];
