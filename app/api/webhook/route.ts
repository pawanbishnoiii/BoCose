import { NextRequest, NextResponse } from 'next/server';
import { decryptToken } from '@/lib/crypto';
import { addLog } from '@/lib/logger';
import { generateAgentResponse } from '@/lib/openrouter';
import { getAgentByIntent, getBotToken, getUserState, saveUserState } from '@/lib/server-store';
import { sendTelegramMessage } from '@/lib/telegram';
import { AgentConfig, TelegramIncomingUpdate, UserState, WorkflowStep } from '@/lib/types';
import { advancePastCompletedSteps, getFirstStep, getStep, routeIntent, validateField } from '@/lib/workflow';

function composeSystemPrompt(agent: AgentConfig, step: WorkflowStep, userData: Record<string, string>, history: string) {
  return [
    `Agent Name: ${agent.name}`,
    `Role definition: ${agent.role}`,
    `Behavior rules: ${agent.instructions}`,
    `Goal: ${agent.goals}`,
    `Tone: ${agent.tone}`,
    `Workflow step: ${step.id} (${step.type})`,
    `User data: ${JSON.stringify(userData)}`,
    `Chat history: ${history}`,
    'Important: follow workflow strictly, ask only relevant next question, keep concise.',
    'Return strict JSON keys: reply, action, next_step, data.'
  ].join('\n');
}

function createState(botId: string, userId: string, text: string): UserState {
  const intent = routeIntent(text);
  const agent = getAgentByIntent(intent);
  if (!agent) {
    throw new Error(`No agent found for intent: ${intent}`);
  }

  return {
    id: `${botId}:${userId}`,
    botId,
    userId,
    intent,
    currentStepId: getFirstStep(agent).id,
    data: {},
    memory: [],
    updatedAt: Date.now()
  };
}

export async function POST(request: NextRequest) {
  const botId = request.nextUrl.searchParams.get('botId');
  if (!botId) {
    return NextResponse.json({ ok: false, error: 'Missing botId' }, { status: 400 });
  }

  const payload = (await request.json()) as TelegramIncomingUpdate;
  const text = payload?.message?.text?.trim();
  const userId = payload?.message?.from?.id?.toString();
  const chatId = payload?.message?.chat?.id?.toString();

  if (!text || !userId || !chatId) {
    return NextResponse.json({ ok: true });
  }

  addLog('incoming', `[bot:${botId} user:${userId}] ${text}`);

  const encryptedToken = getBotToken(botId);
  if (!encryptedToken) {
    addLog('system', `Webhook called before activation for bot ${botId}`);
    return NextResponse.json({ ok: false, error: 'Bot token not found' }, { status: 404 });
  }

  const token = decryptToken(encryptedToken);
  const state = getUserState(botId, userId) ?? createState(botId, userId, text);
  const agent = getAgentByIntent(state.intent);
  if (!agent) {
    return NextResponse.json({ ok: false, error: 'Agent not configured' }, { status: 500 });
  }

  state.memory.push({ role: 'user', content: text, ts: Date.now() });
  state.memory = state.memory.slice(-20);

  advancePastCompletedSteps(agent, state);
  let currentStep = getStep(agent, state.currentStepId);
  if (!currentStep) {
    currentStep = getFirstStep(agent);
    state.currentStepId = currentStep.id;
  }

  let reply = currentStep.prompt || 'Let us continue.';

  if (currentStep.type === 'ASK' && currentStep.field) {
    const alreadySet = state.data[currentStep.field];
    if (!alreadySet) {
      const valid = validateField(text, currentStep.validator);
      if (!valid) {
        reply = currentStep.retryMessage || currentStep.prompt || 'Please provide a valid response.';
      } else {
        state.data[currentStep.field] = text;
        state.currentStepId = currentStep.nextStepId || state.currentStepId;
        addLog('step', `Stored ${currentStep.field}; next=${state.currentStepId}`);
      }
    } else {
      state.currentStepId = currentStep.nextStepId || state.currentStepId;
    }
  }

  currentStep = getStep(agent, state.currentStepId) ?? currentStep;
  if (currentStep.type === 'REPLY' || currentStep.type === 'ACTION' || currentStep.type === 'CONDITION') {
    const historyText = state.memory.map((m) => `${m.role}: ${m.content}`).join('\n');
    const systemPrompt = composeSystemPrompt(agent, currentStep, state.data, historyText);
    const ai = await generateAgentResponse({ userMessage: text, composedPrompt: systemPrompt });

    reply = ai.reply;
    if (ai.data) {
      state.data = { ...state.data, ...ai.data };
    }

    if (ai.next_step) {
      state.currentStepId = ai.next_step;
    } else if (currentStep.nextStepId) {
      state.currentStepId = currentStep.nextStepId;
    }

    addLog('ai', `[${state.intent}] ${reply}`);
  }

  if (currentStep.type === 'END') {
    reply = 'Thank you. Your workflow is complete.';
  }

  state.memory.push({ role: 'assistant', content: reply, ts: Date.now() });
  state.memory = state.memory.slice(-20);
  state.updatedAt = Date.now();
  saveUserState(state);

  await sendTelegramMessage(token, chatId, reply);
  return NextResponse.json({ ok: true });
}
