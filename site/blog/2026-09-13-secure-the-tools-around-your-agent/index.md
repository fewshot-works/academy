---
title: Agent security starts before the first prompt
description: Tool allowlists help when a model makes a bad decision. They cannot stop startup hooks or an exposed gateway from acting outside the model, so those paths need their own boundaries.
slug: secure-the-tools-around-your-agent
authors: [mangatrai]
tags: [security, ai-agents, infrastructure, ai-gateways]
image: ./social-card.png
---

An agent can cause damage before the model makes its first decision.

On September 1, 2026, Manifold described coding agents that invoked Git while gathering workspace context, allowing repository-local Git configuration to run a program on the host. Some affected agents performed that work before a user typed a prompt or approved workspace trust.

In [Manifold's GitSpawn research](https://www.manifold.security/blog/ai-coding-agents-git-hijack), the relevant path was a repository received as files, with a `.git` directory inside a ZIP archive. Git read repository-local configuration while the agent gathered context. An ordinary Git clone, fetch, or pull does **not** transfer repository-local `.git/config` from the remote.

The model did not choose a harmful tool call. The runtime acted while preparing to use the model. That is why an agent review needs three boundaries: the runtime that starts processes, the gateway that holds credentials and routes requests, and the tool that makes a sensitive change.

{/* truncate */}

:::tip[TL;DR]
An agent has security boundaries before, around, and inside the model loop. Isolate startup and workspace discovery, authenticate and constrain the gateway that holds provider keys, and validate sensitive tool arguments with deterministic checks and approvals. Tool allowlists help with model-requested actions, but they cannot secure a startup hook or an exposed gateway. Map one real job's authority, test a boundary, and fix the gap before granting more access.
:::

## Workspace trust has to include startup

Imagine a coding agent opening a project so it can answer a simple question about a failing test. Before the chat box is useful, the application may inspect the working tree, run Git to learn the branch and status, index files, load extensions, and collect credentials for the model gateway. None of that is a model-requested tool call. It is still code acting with the authority of the agent process.

Manifold reported eight findings across seven coding agents. Some affected paths ran before authentication or workspace approval. At publication, some issues had been patched; Manifold said four findings remained unpatched and withheld details for those paths.

For the coding agent in this example, I would make the startup contract explicit. It may read the checked-out project files. It may not inherit production cloud credentials, reach arbitrary internet hosts, or start programs named by workspace configuration. Opening an unfamiliar workspace happens in a reduced-permission environment. If the product asks for workspace trust before executing code, discovery and indexing need to honor the same boundary. Keeping production credentials out of its environment and filesystem limits what a missed startup hook can expose.

This is not a replacement for prompt-injection defenses. It covers authority that exists before the model is asked to reason.

## The gateway is also outside the model loop

The same coding agent may send its prompts through a gateway. That gateway can hold provider keys, route requests, apply guardrails, and reach internal services. It is a useful policy point, but it is also a privileged service. Its authentication, administration, credentials, and network reach are security decisions made outside the model's visible tool loop.

Wiz's [September 9 LiteLLM research](https://www.wiz.io/blog/off-guard-breaking-litellm-from-authentication-bypass-to-cloud-compromise) gives that distinction some weight. In a February 2026 scan of 3,074 publicly exposed instances, Wiz found that 9.6% either accepted the default master key or required no authentication. That is a combined figure, not a claim that 9.6% used the default key, and it does not describe private deployments.

Wiz also reported an MCP authentication bypass, CVE-2026-59822, and a separate post-authentication code-execution issue in custom-code guardrails, CVE-2026-59821. The researchers wrote that the custom-code guardrail registration path lacked protections present in the test endpoint. Patches were available when Wiz published. A gateway deserves the same careful boundary design as any other service that holds keys and reaches sensitive systems.

For this agent, the gateway should reject a request without a valid credential before it routes anything. Its service identity should have only the provider access and internal destinations the task needs. Administrative and custom-code features should be limited to the small group that operates them. Keeping a gateway private, patching it with an owner and response window, and logging administrative changes are ordinary infrastructure controls. They matter here because a compromise could act without asking the model to call a tool.

## Keep the last boundary at the tool

Now return to the coding agent after it has started safely and reached an authenticated gateway. The model examines a failing test and proposes a sensitive action: deploy a fix to the production environment.

That decision still needs a tool boundary. The deployment service can require an approved environment, a change identifier, and a human approval. The model can propose the action, but deterministic code decides whether the request fits the authority granted to this task. A model instruction such as “deploy it now” cannot substitute for those checks.

This is where tool allowlists and argument validation belong. They are strong controls for actions the model requests: writing outside an approved filesystem root, querying a restricted database schema, sending to an unapproved recipient, or deploying to an environment that needs review. They do not secure Git startup or gateway authentication because those events happen on different paths.

## Review one agent you run

Follow one sensitive job from startup to its most consequential action. For the illustrative coding agent, the map might look like this:

| Component | Capability | Credential or network reach | Enforcing control |
| --- | --- | --- | --- |
| Workspace runtime | Read and index project files | Gateway access token; no provider or production cloud keys; gateway and approved dependency endpoints only | Isolated workspace, restricted subprocesses, outbound allowlist |
| Model gateway | Route model requests and apply policy | Scoped provider credential; approved internal services | Authentication that fails closed, private exposure, patched release, least-privilege service identity |
| Deployment tool | Request a production deployment | Deployment API for the approved environment | Environment allowlist, change ID, human approval |

The point is to name the authority each component actually has, then attach a control that can enforce it. A local learning project may need far less isolation than an unattended agent with production access.

One boundary test makes the map real. Send the gateway the same request the coding agent would make, but omit its gateway credential. The expected result is an authentication rejection before routing, with no provider request and no internal service access. A successful model response or evidence in downstream routing logs that the request was forwarded is a failure. Record the rejection and check downstream logs; an error message alone does not show whether the request was forwarded.

The [Agent Security lesson](/docs/advanced-concepts/agent-security) demonstrates the tool-call side with an indirect prompt-injection lab. [AI Gateways](/docs/advanced-concepts/ai-gateways) explains the application-owned routing boundary.

Record expected and actual results for one boundary test, then fix one gap before giving the agent more authority.
