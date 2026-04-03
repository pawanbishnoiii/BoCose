# BoCose Agent (Bot Agent Cloud)

A Telegram-first, text-only AI Chat Agent Builder built with Next.js App Router and Vercel serverless APIs.

## Production highlights

- No auth: instant plug-and-play usage
- Telegram bot activation and webhook setup
- Multi-agent routing (`sales` and `support`)
- Workflow engine with ASK / REPLY / CONDITION / ACTION / END flow support
- OpenRouter integration (`qwen/qwen3.6-plus:free`) with strict JSON output contract
- Per-user memory (last 20 messages)
- Inbuilt IndexedDB persistence (agents, workflows, users, messages)
- Realtime debug panel polling and sandbox chat testing
- Uses a patched Next.js release (`15.5.9`) for security updates

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env.local` from `.env.example` and fill values.
3. Start development:
   ```bash
   npm run dev
   ```

## Required environment variables

- `OPENROUTER_API_KEY` – OpenRouter key (server-side only)
- `PUBLIC_APP_URL` – deployed app URL for Telegram webhook callback
- `BOCOSE_TOKEN_SECRET` – secret used for token encryption at rest

> The app intentionally does not hardcode any API key. Do not place secrets in client-side code.

## Deployment (Vercel)

1. Import repository in Vercel.
2. Set environment variables for Production/Preview.
3. Deploy.
4. Open app and activate Telegram bot token.
5. Confirm webhook at `/api/webhook?botId=<BOT_ID>` is set by activation API.
