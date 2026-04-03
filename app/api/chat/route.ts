import { NextRequest, NextResponse } from 'next/server';
import { addLog } from '@/lib/logger';
import { generateAgentResponse } from '@/lib/openrouter';
import { getAgentByIntent } from '@/lib/server-store';
import { routeIntent } from '@/lib/workflow';

export async function POST(request: NextRequest) {
  try {
    const {
      message,
      userData = {},
      history = [],
      currentStep = 'sandbox',
      model,
      systemPromptOverride,
      apiKey
    } = (await request.json()) as {
      message: string;
      userData: Record<string, string>;
      history: Array<{ role: string; content: string }>;
      currentStep?: string;
      model?: string;
      systemPromptOverride?: string;
      apiKey?: string;
    };

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const intent = routeIntent(message);
    const agent = getAgentByIntent(intent);
    if (!agent) {
      return NextResponse.json({ error: 'No agent configured' }, { status: 500 });
    }

    const prompt = [
      `Role definition: ${agent.role}`,
      `Behavior rules: ${agent.instructions}`,
      `Goal: ${agent.goals}`,
      `Tone: ${agent.tone}`,
      `Workflow step: ${currentStep}`,
      `Workflow: ${JSON.stringify(agent.workflow)}`,
      `User data: ${JSON.stringify(userData)}`,
      `Chat history: ${JSON.stringify(history.slice(-20))}`,
      `System prompt override: ${systemPromptOverride || 'none'}`,
      'Return strict JSON keys: reply, action, next_step, data.'
    ].join('\n');

    const output = await generateAgentResponse({
      userMessage: message,
      composedPrompt: prompt,
      model,
      apiKey
    });

    addLog('ai', `Sandbox chat output (${intent}): ${output.reply}`);
    return NextResponse.json(output);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Chat failed';
    addLog('system', `Chat error: ${message}`);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
