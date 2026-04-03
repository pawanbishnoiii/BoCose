# BoCose Agent (Bot Agent Cloud)

A Telegram-first, text-only AI Chat Agent Builder built with Next.js App Router and Vercel serverless APIs.

## Features

- No auth: instant plug-and-play usage
- Telegram bot activation and webhook setup
- Multi-agent routing (sales/support)
- Workflow engine (ASK, REPLY, CONDITION, ACTION, END model)
- OpenRouter integration (`qwen/qwen3.6-plus:free`)
- Memory per Telegram user (last 20 turns)
- Inbuilt IndexedDB persistence (agents, workflows, users, messages)
- Real-time debug panel + sandbox chat tester

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

## Deployment

Deploy directly on Vercel. Add environment variables in Vercel project settings.
