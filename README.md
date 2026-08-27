# 🗣️ The Last Word — Human Approval for Irreversible Agent Actions

**WebMCP Challenge submission.** The Last Word is the trust layer for the agentic web: it pauses *irreversible* agent actions (payments, deletions, contracts, transfers) and requires a human to approve — and sign — before the agent may execute. **The agent does the work; the human has the last word.**

## Live demo
**https://the-last-word.pages.dev**

## Why WebMCP
WebMCP lets websites expose structured tools that an agent can call *inside the same browser session as the human*. That power is dangerous: an agent acting as the user can perform irreversible actions. The Last Word answers the open question at the heart of the agentic web — **"who approved this?"** — by making human approval a first-class part of the tool call.

We use the **WebMCP Declarative API**: the approval form is exposed to the agent via `toolname="notary.approve"` with `tooldescription` and per-input `toolparamtitle` / `toolparamdescription`. When the agent invokes it, the browser focuses and fills the form, and the **human must submit** to approve. Every irreversible action is recorded in an audit log with a **session-scoped ECDSA digital signature (P-256)** (who, what, when, signature).

## What people and agents can do together
- **Agent** prepares the action end-to-end: fetches the invoice, verifies the amount, fills the form.
- **The Last Word** intercepts at the irreversible step and shows a **request-vs-prepared diff** — what you asked for, side by side with what the agent prepared, with a match/mismatch check. You don't have to remember anything.
- **Human** reviews, and approves with an ECDSA signature — or rejects.
- **Audit log** records the action with a session-scoped ECDSA signature and a SHA-256 fingerprint — so an agent can never claim "I didn't approve that."

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
Built for the [WebMCP Challenge](https://openai.com/webmcp-challenge/). Demo video: https://youtu.be/<YOUR_VIDEO_ID> — *placeholder; replace with the real video ID before submission.*
