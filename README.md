# ⚖️ Notary — Human Approval for Irreversible Agent Actions

**WebMCP Challenge submission.** Notary is the trust layer for the agentic web: it pauses *irreversible* agent actions (payments, deletions, contracts, transfers) and requires a human to approve — and sign — before the agent may execute.

## Live demo
**https://webmcp-notary.pages.dev**

## Why WebMCP
WebMCP lets websites expose structured tools that an agent can call *inside the same browser session as the human*. That power is dangerous: an agent acting as the user can perform irreversible actions. Notary answers the open question at the heart of the agentic web — **"who approved this?"** — by making human approval a first-class part of the tool call.

We use the **WebMCP Declarative API**: the approval form is exposed to the agent via `toolname="notary.approve"`. When the agent invokes it, the browser focuses and fills the form, and the **human must submit** to approve. Every irreversible action is recorded in an immutable-style audit log (who, what, when, approval hash).

## What people and agents can do together
- **Agent** prepares the action end-to-end: fetches the invoice, verifies the amount, fills the form.
- **Notary** intercepts at the irreversible step and shows a clear, human-readable summary (amount, payee, warning).
- **Human** reviews, edits if needed, and approves with a signature.
- **Audit log** records the action with a hash — so an agent can never claim "I didn't approve that."

This was difficult or impossible before WebMCP: previously an agent acted on your behalf in the dark, and you had no clean, standard way to gate a single irreversible action *inside the same context the agent operates in*.

## Features
- ✅ Human approval gate for irreversible actions (payments, deletes, transfers)
- ✅ WebMCP Declarative API (`toolname`, `toolautosubmit`, `respondWith`) — no custom integration needed
- ✅ Immutable-style audit log with approval hash
- ✅ Reject path — the agent is blocked if the human says no
- ✅ Static HTML + JS, zero dependencies, deployable to any static host (Cloudflare Pages)

## Run locally
```
python -m http.server 8080
# open http://localhost:8080
```

## Test
```
npm install jsdom
node test.js
# ALL NOTARY TESTS PASSED — human approval gate works.
```

## License
MIT

## WebMCP Challenge
Built for the [WebMCP Challenge](https://openai.com/webmcp-challenge/). Demo video: https://youtu.be/<YOUR_VIDEO_ID>
