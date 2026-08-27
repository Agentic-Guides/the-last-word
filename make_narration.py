#!/usr/bin/env python3
"""Generate The Last Word demo narration MP3s using edge-tts."""
import asyncio, edge_tts, os

VOICE = "en-US-AriaNeural"
OUT = os.path.join(os.path.dirname(__file__), "video")
os.makedirs(OUT, exist_ok=True)

PARTS = {
    "01_intro": "Meet The Last Word. The trust layer for the agentic web. When AI agents act on your behalf, some actions are irreversible. The Last Word keeps a human in control.",
    "02_prepare": "You tell your agent to pay an invoice. The agent fetches it, verifies the amount, and fills the form.",
    "03_approval": "But at the irreversible step, The Last Word pauses. It shows you what you asked for, side by side with what the agent prepared. The amount matches. The payee matches. You don't have to remember anything. The agent did the work, but only you have the last word.",
    "04_audit": "You approve. The action runs. An audit log records who approved what, and when, with a real signature hash.",
    "05_reject": "If something looks wrong, you reject it. The agent is blocked. Nothing happens. The agent does the work, and the human has the last word.",
    "06_outro": "The Last Word. Because when agents act on your behalf, someone must be in control. Thank you to OpenAI, Cloudflare, Vercel, Shopify, Google Chrome, Render, and Netlify for making this challenge possible.",
}

async def main():
    for name, text in PARTS.items():
        path = os.path.join(OUT, f"{name}.mp3")
        tts = edge_tts.Communicate(text, VOICE)
        await tts.save(path)
        print(f"OK {name}.mp3 ({os.path.getsize(path)} bytes)")

asyncio.run(main())
