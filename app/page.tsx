'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AgentBuilderPanel } from '@/components/AgentBuilderPanel';
import { BotActivationPanel } from '@/components/BotActivationPanel';
import { ConversationGraph } from '@/components/ConversationGraph';
import { DebugPanel } from '@/components/DebugPanel';
import { LiveBrainPanel } from '@/components/LiveBrainPanel';
import { TestChatPanel } from '@/components/TestChatPanel';

export default function HomePage() {
  const state = useMemo(() => ({ status: 'Listening', step: 'ask_name' }), []);

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-6 md:p-10">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8"
      >
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">BoCose Agent (Bot Agent Cloud)</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300 md:text-base">
          Telegram-first, text-only AI chat agent platform powered by OpenRouter. Build agents, configure workflows,
          go live instantly with webhook automation.
        </p>
      </motion.header>

      <section className="grid gap-6 lg:grid-cols-2">
        <BotActivationPanel />
        <LiveBrainPanel status={state.status} step={state.step} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <AgentBuilderPanel />
        <ConversationGraph />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <TestChatPanel />
        <DebugPanel />
      </section>
    </main>
  );
}
