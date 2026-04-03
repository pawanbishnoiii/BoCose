'use client';

import { useEffect, useState } from 'react';
import { DebugLog } from '@/lib/types';

export function DebugPanel() {
  const [logs, setLogs] = useState<DebugLog[]>([]);

  useEffect(() => {
    const readLogs = async () => {
      const res = await fetch('/api/debug');
      const payload = (await res.json()) as { logs: DebugLog[] };
      setLogs(payload.logs || []);
    };

    void readLogs();
    const timer = window.setInterval(readLogs, 3000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="glass-panel p-6">
      <h2 className="text-lg font-semibold">🧪 Debug Panel</h2>
      <div className="mt-4 max-h-64 space-y-2 overflow-auto text-xs">
        {logs.map((log) => (
          <div key={log.id} className="rounded-lg border border-white/10 bg-slate-900/60 p-2">
            <p className="text-cyan-200">[{log.type}] {new Date(log.timestamp).toLocaleTimeString()}</p>
            <p className="text-slate-200">{log.message}</p>
          </div>
        ))}
        {logs.length === 0 ? <p className="text-slate-400">No logs yet.</p> : null}
      </div>
    </section>
  );
}
