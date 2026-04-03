import { NextRequest, NextResponse } from 'next/server';
import { getPublicAppUrl } from '@/lib/config';
import { encryptToken } from '@/lib/crypto';
import { addLog } from '@/lib/logger';
import { saveBotToken } from '@/lib/server-store';
import { setupWebhook, validateBotToken } from '@/lib/telegram';

function resolveBaseUrl(request: NextRequest) {
  const publicAppUrl = getPublicAppUrl();
  if (publicAppUrl) {
    return publicAppUrl;
  }

  const proto = request.headers.get('x-forwarded-proto') || 'https';
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  if (!host) {
    throw new Error('Unable to resolve host for webhook URL. Set PUBLIC_APP_URL env.');
  }

  return `${proto}://${host}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { token?: string };
    const token = body.token?.trim();

    if (!token || token.length < 20) {
      return NextResponse.json({ error: 'Invalid bot token format.' }, { status: 400 });
    }

    const botId = await validateBotToken(token);
    const encrypted = encryptToken(token);
    saveBotToken(botId, encrypted);

    const baseUrl = resolveBaseUrl(request);
    const webhookUrl = `${baseUrl}/api/webhook?botId=${encodeURIComponent(botId)}`;
    await setupWebhook(token, webhookUrl);

    addLog('system', `Bot ${botId} activated at ${baseUrl}`);
    return NextResponse.json({ ok: true, botId, webhookUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Activation failed';
    addLog('system', `Activation error: ${message}`);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
