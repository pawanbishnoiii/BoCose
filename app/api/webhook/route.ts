import { NextRequest, NextResponse } from 'next/server';
import { decryptToken } from '@/lib/crypto';
import { defaultAgents } from '@/lib/defaults';
import { addLog } from '@/lib/logger';
import { generateAgentResponse } from '@/lib/openrouter';
import { getBotToken, getUserState, saveUserState } from '@/lib/server-store';
import { sendTelegramMessage } from '@/lib/telegram';
import { getFirstStep, getStep, missingRequiredFields, routeIntent } from '@/lib/workflow';
import { AgentConfig, UserState } from '@/lib/types';

function composeSystemPrompt(agent: AgentConfig, workflowStepId: string, userData: Record<string, string>, history: string) {
  return [
    `Role: ${agent.role}`,
    `Behavior Rules: ${agent.instructions}`,
    `Goal: ${agent.goals}`,
    `Tone: ${agent.tone}`,
    `Current Workflow Step: ${workflowStepId}`,
    `User Data: ${JSON.stringify(userData)}`,
    `Chat History: ${history}`,
    'Output valid JSON with fields: reply, action, next_step, data.'
  ].join('\n');
}

export async function POST(request: NextRequest) {
  const botId = request.nextUrl.searchParams.get('botId');
  if (!botId) {
    return NextResponse.json({ ok: false, error: 'Missing botId' }, { status: 400 });
  }

  const payload = await request.json();
  const text = payload?.message?.text as string | undefined;
  const userId = payload?.message?.from?.id?.toString() as string | undefined;
  const chatId = payload?.message?.chat?.id?.toString() as string | undefined;

  if (!text || !userId || !chatId) {
    return NextResponse.json({ ok: true });
  }

  addLog('incoming', `[${userId}] ${text}`);

  const encryptedToken = getBotToken(botId);
  if (!encryptedToken) {
    return NextResponse.json({ ok: false, error: 'Bot token not found' }, { status: 404 });
  }

  const token = decryptToken(encryptedToken);
  let state = getUserState(userId);

  if (!state) {
    const intent = routeIntent(text);
    const agent = defaultAgents.find((a) => a.intent === intent) ?? defaultAgents[0];
    state = {
      userId,
      intent,
      currentStepId: getFirstStep(agent).id,
      data: {},
      memory: []
    };
  }

  const agent = defaultAgents.find((a) => a.intent === state.intent) ?? defaultAgents[0];
  const currentStep = getStep(agent, state.currentStepId);

  if (!currentStep) {
    return NextResponse.json({ ok: false, error: 'Invalid workflow step' }, { status: 500 });
  }

  state.memory.push({ role: 'user', content: text, ts: Date.now() });
  state.memory = state.memory.slice(-20);

  let reply = '';

  if (currentStep.type === 'ASK' && currentStep.field) {
    if (!state.data[currentStep.field]) {
      state.data[currentStep.field] = text;
      state.currentStepId = currentStep.nextStepId || state.currentStepId;
      addLog('step', `Saved ${currentStep.field} for user ${userId}`);
    }
  }

  const stillMissing = missingRequiredFields(state.data);
  if (stillMissing.length > 0) {
    reply = `Please share your ${stillMissing[0]}.`;
  } else {
    const historyText = state.memory.map((m) => `${m.role}: ${m.content}`).join('\n');
    const systemPrompt = composeSystemPrompt(agent, state.currentStepId, state.data, historyText);
    const aiResult = await generateAgentResponse({ userMessage: text, composedPrompt: systemPrompt });

    reply = aiResult.reply;
    if (aiResult.data) {
      state.data = { ...state.data, ...aiResult.data };
    }
    if (aiResult.next_step) {
      state.currentStepId = aiResult.next_step;
      addLog('step', `Next step for ${userId}: ${state.currentStepId}`);
    } else if (currentStep.nextStepId) {
      state.currentStepId = currentStep.nextStepId;
    }

    addLog('ai', `[${state.intent}] ${reply}`);
  }

  state.memory.push({ role: 'assistant', content: reply, ts: Date.now() });
  state.memory = state.memory.slice(-20);
  saveUserState(state as UserState);

  await sendTelegramMessage(token, chatId, reply);

  return NextResponse.json({ ok: true });
}
