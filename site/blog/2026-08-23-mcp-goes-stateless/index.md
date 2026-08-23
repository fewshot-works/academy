---
title: MCP just went stateless
description: The July 2026 MCP spec revision removes sessions and the initialize handshake entirely, deprecates three primitives, and hardens OAuth. Here's what actually changes in production.
slug: mcp-goes-stateless
authors: [mangatrai]
tags: [mcp, protocols, production, ai-agents]
image: ./social-card.png
---

MCP has carried session state since Streamable HTTP replaced the original HTTP+SSE transport in March 2025: a client calls `initialize`, the server hands back an `Mcp-Session-Id`, and every request after that is pinned to whichever server instance issued it. Sixteen months later, the [2026-07-28 spec revision](https://modelcontextprotocol.io/specification/2026-07-28/changelog) removes both the handshake and the session ID outright. MCP is now fully stateless, and the fix wasn't a workaround, it was deleting the thing that needed working around.

{/* truncate */}

## What "stateless" actually means here

Two separate changes combine to do this, and they're worth pulling apart:

**Sessions are gone ([SEP-2567](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2567)).** The `Mcp-Session-Id` header is removed from the Streamable HTTP transport, and list endpoints like `tools/list` no longer vary per connection, every client gets the same answer regardless of which server instance handled the request. If a server genuinely needs to remember something across calls, it now mints an explicit handle and hands it back as an ordinary tool argument, state the client carries, not state the server holds open.

**The handshake is gone ([SEP-2575](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2575)).** `initialize` and `notifications/initialized` are removed. Every request now self-describes: protocol version and client capabilities travel in `_meta` fields (`io.modelcontextprotocol/protocolVersion`, `io.modelcontextprotocol/clientCapabilities`) on that request alone. A version mismatch returns a plain `UnsupportedProtocolVersionError` instead of failing a multi-step negotiation. There's a new `server/discover` RPC, but it isn't a mandatory first step, clients *may* call it up front to pick a version, or use it as a compatibility probe on stdio, and servers must support it if asked.

Put together: no session store to shard, no sticky routing to configure, no "which pod has this client's handshake state" question to answer. A load balancer can send any request to any healthy instance, because there's no longer anything connection-shaped for it to have gotten wrong.

Concretely, on the wire:

```jsonc
// Before (2025-11-25 and earlier): a stateful handshake, then a pinned session
// 1. Client -> Server
{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2025-11-25", "capabilities": {}}}
// 2. Server -> Client, response carries Mcp-Session-Id: 7f3e...
// 3. Client -> Server (every later call pinned to that session)
{"jsonrpc": "2.0", "id": 2, "method": "tools/list"}
// headers: Mcp-Session-Id: 7f3e...

// After (2026-07-28): no handshake, no session, every request is self-contained
{
  "jsonrpc": "2.0", "id": 1, "method": "tools/list",
  "params": {
    "_meta": {
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientCapabilities": {}
    }
  }
}
```

That second request can land on any server instance behind the load balancer, cold, with no prior call, and get the identical answer. Most MCP clients never made you touch this layer directly, `langchain-mcp-adapters` and similar libraries handled the handshake and session header for you, which is exactly why this revision could remove both without breaking well-behaved clients on the next release: the thing being deleted was never really application code's problem to begin with, just infrastructure's.

## Three features deprecated, one transport reclassified

[SEP-2577](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2577) deprecates Sampling, Roots, and Logging. None are removed yet, deprecated features stay functional through a minimum twelve-month window before anything actually goes away, but new implementations shouldn't build on them:

| Deprecated | Migrate to |
|---|---|
| Sampling (server asks the client's model to generate text) | Call your LLM provider's API directly |
| Roots (client tells the server which directories are in scope) | Pass paths as tool parameters, resource URIs, or server config |
| Logging (`logging/setLevel`, `notifications/message`) | `stderr` on stdio, or OpenTelemetry |
| HTTP+SSE transport (soft-deprecated since 2025-03-26) | [Streamable HTTP](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http) |

Sampling is the one worth sitting with. It let a server ask the client's model for a quick completion mid-task instead of holding its own API key, an elegant idea that, per the spec's own migration note, just didn't get built out widely enough to keep. If a server needs a model, the revision's position is: give it a key and let it call a provider directly, one fewer indirection, one fewer thing only half the ecosystem ever implemented.

## The changes nobody's tweeting about

The stateless rewrite is the headline. These are the ones that will actually move your numbers:

- **Server-initiated requests are gone.** `roots/list`, `sampling/createMessage`, and `elicitation/create` used to require the server to reach back into an open client connection mid-request. The new **MRTR** (Multi Round-Trip Requests, [SEP-2322](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2322)) pattern replaces that with a result the server returns immediately: `resultType: "input_required"`, carrying what it still needs. The client answers by retrying the *original* request with that input attached, no server holding a socket open waiting on a round trip it doesn't control the timing of.
- **Caching stopped being optional.** A new `CacheableResult` interface now *requires* `ttlMs` and `cacheScope` on every result from `tools/list`, `prompts/list`, `resources/list`, and `resources/read`. That's a server saying, explicitly, how long a client can trust this without re-asking, and whether a shared proxy is allowed to cache it at all.
- **Tool order stopped being random.** `tools/list` SHOULD now return a deterministic order. Combined with list results no longer varying per connection, that's the difference between an LLM provider's prompt cache reliably hitting on your tools block and quietly missing whenever the list happens to get rebuilt in a different order.
- **OAuth got a real hardening pass, not a footnote.** Authorization servers SHOULD send an `iss` parameter per RFC 9207, and clients MUST validate it against the recorded issuer before redeeming a code. Dynamic Client Registration is deprecated in favor of Client ID Metadata Documents (it still works for authorization servers that haven't caught up). If your MCP server sits behind OAuth, this is a real review, not a changelog skim.

## Governance grew up alongside the protocol

Two process changes underpin all of this. The SEP workflow is now formal, PR-based, numbered proposals with sponsor responsibilities and status tracked through PR labels. And a real feature lifecycle now exists: Active, Deprecated, Removed, with a minimum twelve-month window in Deprecated before anything reaches Removed. Sampling isn't going away next sprint; it's going away on a published clock.

That's the same signal [A2A's steering committee and versioned 1.0 release](https://a2a-protocol.org/) sent for agent-to-agent communication earlier this year: this isn't a fast-moving experiment you build against nervously anymore, it's infrastructure with a change process. That's exactly what you want before betting production traffic on it.

## What to actually do

Nothing here breaks a well-behaved existing client today, deprecated isn't removed. But if you're standing up new MCP infrastructure: build it stateless from day one and stop provisioning session affinity you no longer need, route Sampling to a direct provider call instead, and put the OAuth `iss` validation on your list for the next review.

If I had to bet on which change shows up in a graph first, it isn't the stateless rewrite. That one saves your infra team a category of bug, real, but invisible once it's fixed. My money's on the caching triad: deterministic `tools/list` ordering plus mandatory `ttlMs`/`cacheScope` is the one that touches the token bill on every single hosted-model call, not just the deploy story. Sessions were an ops problem. Cache misses on a growing tools block are a cost problem, one that compounds with every agent you ship, and this revision is the first time the spec itself gives you the fields to fix it instead of hoping your client library gets it right.

We cover MCP's current shape, transports included, in the [MCP track](/docs/mcp/overview), most recently a new [chapter on A2A](/docs/mcp/a2a), the sibling protocol for agent-to-agent delegation that this revision explicitly stayed complementary to rather than absorbing.
