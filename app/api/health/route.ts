import { NextResponse } from 'next/server';

export async function GET() {
  const checks = {
    openRouter: Boolean(process.env.OPENROUTER_API_KEY),
    tokenSecret: Boolean(process.env.BOCOSE_TOKEN_SECRET),
    publicAppUrl: process.env.PUBLIC_APP_URL || null
  };

  return NextResponse.json({
    ok: checks.openRouter && checks.tokenSecret,
    checks,
    timestamp: new Date().toISOString()
  });
}
