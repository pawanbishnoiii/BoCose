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
- Uses patched Next.js (`15.5.9`)

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
- `BOCOSE_TOKEN_SECRET` – secret used for token encryption at rest

## Optional environment variables

- `PUBLIC_APP_URL` – explicit webhook base URL (if not provided, API derives URL from request headers)

> The app intentionally does not hardcode any API key. Do not place secrets in client-side code.

## Vercel deployment checklist

1. Ensure Vercel framework preset is **Next.js**.
2. Do **not** set Output Directory to `public`.
3. Keep `vercel.json` in repo with framework set to `nextjs`.
4. Configure env vars (`OPENROUTER_API_KEY`, `BOCOSE_TOKEN_SECRET`, optional `PUBLIC_APP_URL`).
5. Deploy and activate bot token from UI.


## Quick production URL setup

For your current project, set:
- `PUBLIC_APP_URL=https://bocose.vercel.app`

Then verify:
- `https://bocose.vercel.app/api/health`

## Merge conflict note

If GitHub shows "This branch has conflicts", resolve by syncing your feature branch with `main` (see `docs/DEPLOY_AND_CONFLICT_FIX.md`).


## Advanced agent controls (ElevenLabs-style, text only)

Sandbox panel now supports:
- Runtime model input
- Runtime OpenRouter key input (for testing without server env)
- System prompt override
- Local persistence of settings + messages in IndexedDB

For production Telegram automation, set `OPENROUTER_API_KEY` in Vercel env.
