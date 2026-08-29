# 🗣️ The Last Word — Human Approval for Irreversible Agent Actions

**WebMCP Challenge submission.** The Last Word is the trust layer for the agentic web: it pauses *irreversible* agent actions (payments, deletions, contracts, transfers) and requires a human to approve — and sign — before the agent may execute. **The agent does the work; the human has the last word.**

## How an agent uses it

An agent discovers and calls The Last Word's tools entirely through the WebMCP Declarative API — no custom integration needed:

1. **Discover** — the agent reads `llms.txt` (or `.well-known/mcp.json`) and finds two tools: `notary.approve` (payments) and `notary.delete` (data deletion), each with a `tooldescription` and per-input `toolparamtitle` / `toolparamdescription`.
2. **Invoke** — the agent fills the form (amount + payee, or target) and submits. The browser focuses the form and the tool call is **held open** via `respondWith()`.
3. **Human decides** — the human reviews the request-vs-prepared diff and clicks **Approve & Sign** (ECDSA P-256) or **Reject**. The held tool call resolves with the human's decision.
4. **Audit** — every step is recorded in a tamper-evident hash-chain ledger with a SHA-256 fingerprint and ECDSA signature.

This is the human-in-the-loop gate made first-class in WebMCP: the agent does the work, but the irreversible step cannot complete without a human's signed approval.

## Live demo
**https://the-last-word.pages.dev**

## Why WebMCP
WebMCP lets websites expose structured tools that an agent can call *inside the same browser session as the human*. That power is dangerous: an agent acting as the user can perform irreversible actions. The Last Word answers the open question at the heart of the agentic web — **"who approved this?"** — by making human approval a first-class part of the tool call.

We use the **WebMCP Declarative API**: the approval form is exposed to the agent via `toolname="notary.approve"` with `tooldescription` and per-input `toolparamtitle` / `toolparamdescription`. When the agent invokes it, the browser focuses and fills the form, and the **human must submit** to approve. Every irreversible action is recorded in an audit log with a **session-scoped ECDSA digital signature (P-256)** (who, what, when, signature).

## What people and agents can do together
- **Agent** prepares the action end-to-end: fetches the invoice, verifies the amount, fills the form — or locates the data to delete and confirms the scope.
- **The Last Word** intercepts at the irreversible step and shows a **request-vs-prepared diff** — what you asked for, side by side with what the agent prepared, with a match/mismatch check. You don't have to remember anything.
- **Human** reviews, and approves with an ECDSA signature — or rejects.
- **Audit log** records the action with a session-scoped ECDSA signature and a SHA-256 fingerprint — so an agent can never claim "I didn't approve that."

Two irreversible use cases are demonstrated: **payments** (`notary.approve`) and **data deletion** (`notary.delete`). Both pause at the gate until a human signs off.

This was difficult or impossible before WebMCP: previously an agent acted on your behalf in the dark, and you had no clean, standard way to gate a single irreversible action *inside the same context the agent operates in*.

## Features
- ✅ Human approval gate for irreversible actions (payments, deletes, transfers)
- ✅ **Request-vs-prepared diff** — no memory required, match/mismatch highlighted
- ✅ **Session-scoped ECDSA digital signature** (P-256, Web Crypto API) + SHA-256 fingerprint
- ✅ Human-friendly agent log ("Amount checked: matches what you asked")
- ✅ WebMCP Declarative API (`toolname`, `tooldescription`, `toolparamtitle`, `toolparamdescription`)
- ✅ Reject path — the agent is blocked if the human says no
- ✅ Static HTML + JS, zero dependencies, deployable to any static host (Cloudflare Pages)

> **Note on the signature:** the ECDSA key pair is generated per browser session and is **not persistent**. The signature is a *demonstration* of a human approval gate, not a durable notarization certificate. For production, the signing key would live in a managed key vault.

## Run locally
```
python -m http.server 8080
# open http://localhost:8080
```

## Test
```
npm install jsdom
node test.js
# ALL LAST WORD TESTS PASSED — ECDSA signature + diff display + human approval + retry all work.
```

## License
MIT

## WebMCP Challenge
Built for the [WebMCP Challenge](https://openai.com/webmcp-challenge/). Demo video: **https://youtu.be/yBcImWjoLhM**
