import { NextRequest, NextResponse } from 'next/server';
import { defaultAgents } from '@/lib/defaults';
import { generateAgentResponse } from '@/lib/openrouter';
import { addLog } from '@/lib/logger';
import { missingRequiredFields, routeIntent } from '@/lib/workflow';

export async function POST(request: NextRequest) {
  try {
    const { message, userData = {}, history = [] } = (await request.json()) as {
      message: string;
      userData: Record<string, string>;
      history: Array<{ role: string; content: string }>;
    };

    const intent = routeIntent(message);
    const agent = defaultAgents.find((a) => a.intent === intent) ?? defaultAgents[0];
    const missing = missingRequiredFields(userData);

    if (missing.length > 0) {
      return NextResponse.json({
        reply: `Please share your ${missing[0]}.`,
        action: 'save_user_data',
        next_step: 'collect_missing'
      });
    }

    const prompt = [
      `Role: ${agent.role}`,
      `System Prompt: ${agent.systemPrompt}`,
      `Goals: ${agent.goals}`,
      `Tone: ${agent.tone}`,
      `Instructions: ${agent.instructions}`,
      `Workflow: ${JSON.stringify(agent.workflow)}`,
      `User Data: ${JSON.stringify(userData)}`,
      `Chat History: ${JSON.stringify(history.slice(-20))}`
    ].join('\n');

    const output = await generateAgentResponse({ userMessage: message, composedPrompt: prompt });
    addLog('ai', `Sandbox chat output: ${output.reply}`);

    return NextResponse.json(output);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Chat failed';
    addLog('system', `Chat error: ${message}`);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
