# Deploy + Merge Conflict Fix Guide

## 1) Secrets (do NOT commit)
Set these in **Vercel Project Settings → Environment Variables**:

- `OPENROUTER_API_KEY`
- `BOCOSE_TOKEN_SECRET`
- `PUBLIC_APP_URL` = `https://bocose.vercel.app` (recommended)

## 2) Why your PR is blocked
Your screenshot shows **merge conflicts**. This is a Git branch sync issue, not a runtime app bug.

## 3) Resolve conflicts from CLI
Run these locally:

```bash
git fetch origin
git checkout <your-feature-branch>
git merge origin/main
# resolve conflicts in listed files
git add .
git commit -m "Resolve merge conflicts with main"
git push
```

Alternative (clean history):

```bash
git fetch origin
git checkout <your-feature-branch>
git rebase origin/main
# resolve conflicts, then:
git add .
git rebase --continue
git push --force-with-lease
```

## 4) Post-deploy checks
- `GET /api/health` should return `ok: true`.
- Activate bot from UI using token input.
- Ensure Telegram webhook is set to:
  - `https://bocose.vercel.app/api/webhook?botId=<BOT_ID>`


## 5) If UI shows "Missing required env: OPENROUTER_API_KEY"
That means your Vercel environment variable is missing for server-side routes (`/api/chat`, `/api/webhook`).
Add `OPENROUTER_API_KEY` in Vercel project settings and redeploy.
