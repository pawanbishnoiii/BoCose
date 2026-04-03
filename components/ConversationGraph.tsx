'use client';

export function ConversationGraph() {
  const nodes = [
    { id: 'start', x: 40, y: 40, label: 'Start' },
    { id: 'ask_name', x: 200, y: 40, label: 'ASK: Name' },
    { id: 'ask_email', x: 360, y: 40, label: 'ASK: Email' },
    { id: 'reply', x: 520, y: 40, label: 'REPLY' },
    { id: 'end', x: 680, y: 40, label: 'END' }
  ];

  return (
    <section className="glass-panel p-6">
      <h2 className="text-lg font-semibold">🔄 Conversation Graph</h2>
      <svg viewBox="0 0 740 120" className="mt-4 w-full rounded-xl bg-slate-900/60 p-2">
        {nodes.map((node, index) => (
          <g key={node.id}>
            {index < nodes.length - 1 ? (
              <line
                x1={node.x + 90}
                y1={node.y + 20}
                x2={nodes[index + 1].x}
                y2={nodes[index + 1].y + 20}
                stroke="rgba(56,189,248,0.7)"
                strokeWidth="2"
              />
            ) : null}
            <rect x={node.x} y={node.y} width="90" height="40" rx="8" fill="rgba(15, 23, 42, 0.9)" stroke="rgba(255,255,255,0.2)" />
            <text x={node.x + 45} y={node.y + 25} fill="white" fontSize="10" textAnchor="middle">
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </section>
  );
}
