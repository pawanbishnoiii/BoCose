import { NextRequest, NextResponse } from 'next/server';
import { getServerConfig } from '@/lib/config';
import { encryptToken } from '@/lib/crypto';
import { addLog } from '@/lib/logger';
import { saveBotToken } from '@/lib/server-store';
import { setupWebhook, validateBotToken } from '@/lib/telegram';

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

    const { publicAppUrl } = getServerConfig();
    const webhookUrl = `${publicAppUrl}/api/webhook?botId=${encodeURIComponent(botId)}`;
    await setupWebhook(token, webhookUrl);

    addLog('system', `Bot ${botId} activated`);
    return NextResponse.json({ ok: true, botId, webhookUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Activation failed';
    addLog('system', `Activation error: ${message}`);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
