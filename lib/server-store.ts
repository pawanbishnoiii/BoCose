import { defaultAgents } from './defaults';
import { AgentConfig, UserState } from './types';

const botTokens = new Map<string, string>();
const userStates = new Map<string, UserState>();
const agents = new Map<string, AgentConfig>(defaultAgents.map((a) => [a.id, a]));

function stateKey(botId: string, userId: string) {
  return `${botId}:${userId}`;
}

export function saveBotToken(botId: string, encryptedToken: string) {
  botTokens.set(botId, encryptedToken);
}

export function getBotToken(botId: string) {
  return botTokens.get(botId);
}

export function getAgents() {
  return [...agents.values()];
}

export function getAgentByIntent(intent: AgentConfig['intent']) {
  return [...agents.values()].find((agent) => agent.intent === intent);
}

export function upsertAgent(agent: AgentConfig) {
  agents.set(agent.id, agent);
}

export function getUserState(botId: string, userId: string): UserState | undefined {
  return userStates.get(stateKey(botId, userId));
}

export function saveUserState(state: UserState) {
  userStates.set(stateKey(state.botId, state.userId), state);
}
