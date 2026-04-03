'use client';

import { FormEvent, useEffect, useState } from 'react';
import { saveMessage } from '@/lib/indexeddb';

type ChatItem = { role: 'user' | 'assistant'; content: string };

const DEFAULT_MODEL = 'qwen/qwen3.6-plus:free';

export function TestChatPanel() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<ChatItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [systemPrompt, setSystemPrompt] = useState('You are a concise assistant.');
  const [runtimeApiKey, setRuntimeApiKey] = useState('');

  useEffect(() => {
    setModel(localStorage.getItem('bocose_model') || DEFAULT_MODEL);
    setSystemPrompt(localStorage.getItem('bocose_system_prompt') || 'You are a concise assistant.');
    setRuntimeApiKey(localStorage.getItem('bocose_runtime_openrouter_key') || '');
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    const nextHistory = [...history, { role: 'user' as const, content: userMessage }];
    setHistory(nextHistory);
    await saveMessage('user', userMessage);

    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history,
          model,
          systemPromptOverride: systemPrompt,
          apiKey: runtimeApiKey || undefined
        })
      });
      const payload = (await res.json()) as { reply?: string; error?: string };
      const responseText = payload.reply || payload.error || 'No response.';
      setHistory((prev) => [...prev, { role: 'assistant', content: responseText }]);
      await saveMessage('assistant', responseText);
      setInput('');
    } finally {
      setIsLoading(false);
    }
  };

  const persistSettings = () => {
    localStorage.setItem('bocose_model', model);
    localStorage.setItem('bocose_system_prompt', systemPrompt);
    localStorage.setItem('bocose_runtime_openrouter_key', runtimeApiKey);
  };

  return (
    <section className="glass-panel p-6">
      <h2 className="text-lg font-semibold">⚡ Test Chat Sandbox</h2>

      <div className="mt-3 grid gap-2 md:grid-cols-2">
        <input
          value={model}
          onChange={(event) => setModel(event.target.value)}
          className="rounded-xl border border-white/10 bg-slate-900/70 p-2 text-xs"
          placeholder="Model (e.g. qwen/qwen3.6-plus:free)"
        />
        <input
          value={runtimeApiKey}
          onChange={(event) => setRuntimeApiKey(event.target.value)}
          className="rounded-xl border border-white/10 bg-slate-900/70 p-2 text-xs"
          placeholder="Runtime OpenRouter key (optional)"
          type="password"
        />
      </div>
      <textarea
        value={systemPrompt}
        onChange={(event) => setSystemPrompt(event.target.value)}
        className="mt-2 min-h-20 w-full rounded-xl border border-white/10 bg-slate-900/70 p-2 text-xs"
        placeholder="System prompt override"
      />
      <button onClick={persistSettings} className="mt-2 rounded-lg border border-cyan-400/30 px-3 py-1 text-xs text-cyan-200">
        Save Agent Settings
      </button>

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
