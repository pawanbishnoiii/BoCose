'use client';

import { useEffect, useState } from 'react';
import { defaultAgents } from '@/lib/defaults';
import { AgentConfig } from '@/lib/types';
import { seedAgents } from '@/lib/indexeddb';

export function AgentBuilderPanel() {
  const [agents, setAgents] = useState<AgentConfig[]>(defaultAgents);

  useEffect(() => {
    void seedAgents(defaultAgents);
  }, []);

  return (
    <section className="glass-panel p-6">
      <h2 className="mb-4 text-lg font-semibold">AI Agent Builder</h2>
      <div className="space-y-3">
        {agents.map((agent) => (
          <article key={agent.id} className="rounded-xl border border-white/10 bg-slate-900/50 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{agent.name}</h3>
              <span className="rounded-full bg-violet-500/20 px-2 py-1 text-xs">{agent.intent}</span>
            </div>
            <p className="mt-2 text-sm text-slate-300">{agent.role}</p>
            <p className="mt-2 text-xs text-slate-400">Workflow steps: {agent.workflow.length}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
