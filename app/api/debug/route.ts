import { NextResponse } from 'next/server';
import { getLogs } from '@/lib/logger';
import { defaultAgents } from '@/lib/defaults';

export async function GET() {
  return NextResponse.json({
    logs: getLogs(),
    agents: defaultAgents.map((agent) => ({
      id: agent.id,
      name: agent.name,
      intent: agent.intent,
      stepCount: agent.workflow.length
    }))
  });
}
