const TELEGRAM_API = 'https://api.telegram.org';

export async function validateBotToken(token: string) {
  const res = await fetch(`${TELEGRAM_API}/bot${token}/getMe`, { method: 'GET' });
  if (!res.ok) {
    throw new Error('Unable to validate token via Telegram API');
  }

  const payload = (await res.json()) as { ok: boolean; result?: { id: number }; description?: string };
  if (!payload.ok || !payload.result) {
    throw new Error(payload.description || 'Invalid Telegram token');
  }

  return payload.result.id.toString();
}

export async function setupWebhook(token: string, webhookUrl: string) {
  const res = await fetch(`${TELEGRAM_API}/bot${token}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: webhookUrl })
  });

  if (!res.ok) {
    throw new Error('Unable to setup Telegram webhook');
  }

  const payload = (await res.json()) as { ok: boolean; description?: string };
  if (!payload.ok) {
    throw new Error(payload.description || 'Webhook setup failed');
  }
}

export async function sendTelegramMessage(token: string, chatId: string, text: string) {
  await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text })
  });
}
