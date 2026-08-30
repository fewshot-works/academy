---
sidebar_position: 1
description: What MCP is, what you'll build across this track, and how it builds on the tool-calling agents from Intermediate and Advanced.
---

import TrackProgress from '@site/src/components/LearningProgress/TrackProgress';

# MCP Overview

<TrackProgress trackId="mcp" />

> **Before you start:** this track assumes you've built a tool-calling agent already —
> Intermediate's [Tool Use](../intermediate/05-tool-use.md) and
> [Your First Agent](../intermediate/06-your-first-agent.md) chapters are the minimum. If those
> are unfamiliar, start there first.

> **Spec version:** this track teaches MCP as of the
> [2026-07-28 spec revision](https://modelcontextprotocol.io/specification/2026-07-28/changelog),
> the biggest overhaul since MCP launched. The protocol is now fully stateless, Sampling, Roots,
> and Logging are officially deprecated, and the older HTTP+SSE transport is deprecated in favor
> of Streamable HTTP, which is the only transport this track ever teaches.

## Where you're picking up

Every agent you've built so far calls hand-wired tools: a `calculator` function you wrote, a
`search_documents` function you wrote, a Wikipedia wrapper you wrote. Each one lives inside that
one agent's code. If you wanted the same tool in a different agent, or a different project, you'd
copy the function over and wire it in again by hand.

That works fine for one agent with a few tools. It stops working the moment you want to share a
tool across projects, or plug your agent into someone else's tools without reading their source
code first.

## What's different now

MCP (Model Context Protocol) is a standard way for an agent to talk to a tool server it didn't
write. Instead of every agent needing its own custom adapter for every tool, an MCP server exposes
its tools once, over a standard interface, and any MCP-speaking agent can connect to it, list what
it offers, and call it, no custom glue code required.

That standardization changes a few things you haven't dealt with yet: an agent can now be wired to
several tool servers at once instead of one hardcoded tool list; a server can run locally or
somewhere else entirely, over different transports; and because the tools an agent calls might now
come from someone else's server, trusting what that server tells you becomes a real security
question, not a hypothetical one.

## What you'll be able to do by the end

By the end of this track, you'll connect an agent to an existing public MCP server, build and
serve your own tool as an MCP server, wire one agent to more than one server at a time, deploy a
server over both local and remote transports, use MCP primitives beyond tools (resources and
prompts), harden a multi-server agent against a malicious or poisoned tool description, and
delegate a task to a remote agent over A2A, the sibling protocol for agent-to-agent instead of
agent-to-tool communication. The capstone puts the MCP side of it together: one agent, your own
MCP server and a public one, guardrails, and a Streamlit UI on top.

## Chapters ahead

1. **What Is MCP** — the host/client/server architecture, and why it's "one plug instead of a
   dozen adapters." *Lab: connect an agent to an off-the-shelf MCP server.*
2. **Building Your Own MCP Server** — wrap a tool as an MCP server with the official Python SDK.
   *Lab: build and connect to your own server. Bonus: same server, no-code, in Langflow.*
3. **One Agent, Many Servers** — MCP clients and tool routing across servers. *Lab: wire an agent
   to two or more MCP servers at once. Bonus: Langflow as the client.*
4. **Transports & Deployment** — stdio vs. HTTP/SSE, local vs. remote servers. *Lab: swap a local
   stdio server for a remote HTTP one.*
5. **Resources, Prompts & Sampling** — the MCP primitives beyond tools. *Lab: expose a resource
   and a prompt template.*
6. **MCP Security** — untrusted tool output, allowlisting, and supply-chain risk. *Lab: harden the
   Chapter 3 multi-server agent against a poisoned tool description.*
7. **Beyond MCP: Agent2Agent (A2A)** — the sibling protocol for agent-to-agent instead of
   agent-to-tool communication, and where it fits next to MCP. *Lab: discover two remote agents by
   their Agent Cards and delegate a question to the right one.*
8. **Capstone** — one agent, your own server and a public one, guardrails, and a Streamlit UI.

## What's next

Chapter 1 starts with the architecture itself: what a host, a client, and a server actually are in
MCP terms, and why that split is what makes "connect to someone else's tools without reading their
code" possible in the first place.
