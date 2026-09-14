---
sidebar_position: 10
sidebar_label: What to Build Next
description: Six project ideas that reuse the RAG, tool use, memory, evaluation, multi-agent, and approval patterns already taught in the curriculum.
---

# What to Build Next

> **Time:** ~10 minutes to choose and scope a project. **Cost:** No API charges when using Ollama and local files.

The best next project is not the one with the most features. It is the one you can finish, test, and explain. Pick one idea below, start from the closest lab, and change the data and purpose before you change the architecture.

These are project suggestions, not additional provided labs. Each one stays inside techniques you have already used in the curriculum.

## Study buddy

**Smallest build:** Put one subject's notes in the document folder from the [Foundations Q&A capstone](/docs/foundations/capstone-qa-bot). Ask the agent to retrieve a passage, write one question from it, check your answer against the passage, and remember which topics you missed during the current session.

**Reuse:** RAG over your documents from the Foundations capstone, [structured output](/docs/intermediate/prompt-patterns) for the question and answer key, and [conversation memory](/docs/intermediate/memory) for missed topics.

**Constraint:** Retrieved notes are the answer key. If the notes do not cover a question, the study buddy should say so instead of filling the gap from model memory. Keep missed topics in session memory for this version; they reset when the program exits.

**Done when:** A five-question test includes one answer your notes support, one they contradict, and one they do not cover. The program grades all three cases correctly and can name a topic you missed earlier in the same session.

## Personal reading digest

**Smallest build:** Save a few articles as plain-text files. Retrieve passages related to three interests you provide, then return a JSON digest with a title, a two-sentence summary, and the source filename for each item.

**Reuse:** The document pipeline from the [Foundations Q&A capstone](/docs/foundations/capstone-qa-bot), [better retrieval](/docs/intermediate/better-retrieval), and [structured output](/docs/intermediate/prompt-patterns).

**Constraint:** This version reads only the files you supply. It does not fetch current news or deliver messages. Summaries should identify their source file so you can check them against the original.

**Done when:** A small evaluation set has at least one relevant and one irrelevant article for each interest. The digest includes only relevant items, follows the JSON schema, and points every summary to the right file.

## Debate supervisor

**Smallest build:** Give a proposal to two specialist agents. One writes the strongest case for it, one writes the strongest case against it, and a supervisor returns both arguments plus the single disagreement that matters most.

**Reuse:** The supervisor and agent-as-tool pattern from [Multi-Agent Patterns](/docs/advanced/multi-agent-patterns) and [structured output](/docs/intermediate/prompt-patterns) for a predictable final response.

**Constraint:** The agents work from the proposal and evidence you provide. The supervisor organizes the disagreement; it does not turn a subjective choice into an objective verdict. More agents add coordination failures as well as viewpoints.

**Done when:** Three test proposals produce two distinct cases and a final response that preserves the main claim from each side. Read the outputs yourself and record where the supervisor drops or distorts an argument.

## Budget scenario checker

**Smallest build:** Read a CSV containing categories and planned amounts. Add one tool that looks up a category total and reuse the safe calculator to answer questions such as, "If I add this expense, which limit that I set would it cross?"

**Reuse:** [Tool Use](/docs/intermediate/tool-use) for the bounded calculator and execution loop, [structured output](/docs/intermediate/prompt-patterns) for the result, and [Guardrails and Safety](/docs/advanced/guardrails-and-safety) to reject unknown categories or invalid amounts.

**Constraint:** The program applies rules and limits that you supply. It should show the arithmetic and missing data, not recommend purchases, credit, investments, or other financial decisions. Keep private data local.

**Done when:** Fixed CSV fixtures prove that an expense below a limit passes, one above a limit is flagged, and a missing category produces a clear error. The displayed totals match calculations you check by hand.

## Repository issue sorter

**Smallest build:** Export a small set of repository issues to a local JSON file. Have the model return a suggested category, priority, short summary, and possible duplicate for each issue, without changing the repository.

**Reuse:** [structured output](/docs/intermediate/prompt-patterns), RAG and re-ranking from [Better Retrieval](/docs/intermediate/better-retrieval) for possible duplicates, and [evaluation](/docs/intermediate/evaluating) against labels you write.

**Constraint:** Keep the first version read-only and local. A similar title is evidence to review, not proof of a duplicate. Review suggestions yourself before applying any labels to real issues.

**Done when:** A hand-labeled fixture contains an obvious duplicate pair, two related but distinct issues, and one high-priority example. The sorter returns valid structured output and you report which labels and duplicate suggestions match your labels.

## Travel planner with approval gates

**Smallest build:** Give an agent a local file of illustrative destinations and prices, the safe calculator, and a `mock_booking` tool that only appends an itinerary item to a list. Require approval before every mock booking runs.

**Reuse:** The multi-tool agent from the [Intermediate capstone](/docs/intermediate/capstone), the pause-and-resume pattern from [Human-in-the-Loop Approval Gates](/docs/advanced-concepts/human-in-the-loop), and [conversation memory](/docs/intermediate/memory).

**Constraint:** Prices and availability are illustrative inputs, not live travel information. The booking tool must remain a mock: approval changes a local list and never contacts a real booking service.

**Done when:** One approved item appears in the final itinerary, one rejected item does not, and a changed budget causes the calculator to produce a new total without bypassing the next approval gate.

## Make one yours

Choose the project whose input data you can inspect yourself. Copy the nearest lab, get one happy path working, then write three fixed test cases: one ordinary case, one missing-data case, and one case that should be refused or paused. [Evaluating What You Built](/docs/intermediate/evaluating) gives you the pattern, but keep the expected outcomes simple enough that you can check them yourself.

Only after those cases pass should you add another tool, agent, or interface. A small project with a clear boundary and honest results shows more than a large demo you cannot explain.
