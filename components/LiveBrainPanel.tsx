'use client';

import { motion } from 'framer-motion';

type Props = {
  status: string;
  step: string;
};

export function LiveBrainPanel({ status, step }: Props) {
  return (
    <section className="glass-panel p-6">
      <h2 className="text-lg font-semibold">🧠 Live Agent Brain</h2>
      <div className="mt-4 space-y-3">
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 p-3 text-sm"
        >
          AI thinking state: {status}
        </motion.div>
        <p className="text-sm text-slate-300">Current workflow step: {step}</p>
      </div>
    </section>
  );
}
