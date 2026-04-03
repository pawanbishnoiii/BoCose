'use client';

import { useState } from 'react';

export function BotActivationPanel() {
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const activateBot = async () => {
    setIsLoading(true);
    setStatus('Activating...');
    try {
      const response = await fetch('/api/activate-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      const payload = (await response.json()) as { botId?: string; error?: string };

      if (!response.ok) {
        setStatus(payload.error || 'Failed to activate bot.');
        return;
      }

      localStorage.setItem('bocose_bot_token', token);
      localStorage.setItem('bocose_bot_id', payload.botId || '');
      setStatus(`Bot activated (ID: ${payload.botId})`);
      setToken('');
    } catch {
      setStatus('Network error while activating bot.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="glass-panel p-6 space-y-4">
      <h2 className="text-lg font-semibold">Telegram Bot System</h2>
      <label className="block text-sm text-slate-300">Enter Bot Token</label>
      <input
        type="password"
        value={token}
        onChange={(event) => setToken(event.target.value)}
        className="w-full rounded-xl border border-white/10 bg-slate-900/70 p-3 text-sm outline-none focus:border-cyan-400"
        placeholder="123456:AA...."
      />
      <button
        onClick={activateBot}
        disabled={isLoading || token.length < 20}
        className="rounded-xl bg-cyan-500 px-4 py-2 font-medium text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? 'Activating...' : 'Activate Bot'}
      </button>
      {status ? <p className="text-xs text-cyan-200">{status}</p> : null}
    </section>
  );
}
