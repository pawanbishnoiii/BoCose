'use client';

import { FormEvent, useState } from 'react';

type ChatItem = { role: 'user' | 'assistant'; content: string };

export function TestChatPanel() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<ChatItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;

    const nextHistory = [...history, { role: 'user' as const, content: input }];
    setHistory(nextHistory);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, history })
      });
      const payload = (await res.json()) as { reply?: string; error?: string };
      setHistory((prev) => [...prev, { role: 'assistant', content: payload.reply || payload.error || 'No response.' }]);
      setInput('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="glass-panel p-6">
      <h2 className="text-lg font-semibold">⚡ Test Chat Sandbox</h2>
      <div className="mt-4 max-h-60 space-y-2 overflow-auto rounded-xl border border-white/10 bg-slate-900/60 p-3 text-sm">
        {history.map((item, index) => (
          <p key={`${item.role}-${index}`} className={item.role === 'assistant' ? 'text-cyan-200' : 'text-slate-100'}>
            <strong>{item.role === 'assistant' ? 'Agent' : 'You'}:</strong> {item.content}
          </p>
        ))}
      </div>
      <form onSubmit={submit} className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="flex-1 rounded-xl border border-white/10 bg-slate-900/70 p-2"
          placeholder="Type message..."
        />
        <button className="rounded-xl bg-violet-500 px-3 py-2 text-sm font-medium text-white" disabled={isLoading}>
          {isLoading ? '...' : 'Send'}
        </button>
      </form>
    </section>
  );
}
