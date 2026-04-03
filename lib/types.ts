export type AgentIntent = 'sales' | 'support';

export type AgentConfig = {
  id: string;
  name: string;
  role: string;
  systemPrompt: string;
  goals: string;
  tone: string;
  instructions: string;
  workflow: WorkflowStep[];
  intent: AgentIntent;
};

export type WorkflowStepType = 'ASK' | 'REPLY' | 'CONDITION' | 'ACTION' | 'END';

export type WorkflowStep = {
  id: string;
  type: WorkflowStepType;
  prompt?: string;
  field?: string;
  conditionField?: string;
  conditionValue?: string;
  nextStepId?: string;
  trueStepId?: string;
  falseStepId?: string;
  retryMessage?: string;
};

export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  ts: number;
};

export type UserState = {
  userId: string;
  currentStepId: string;
  intent: AgentIntent;
  data: Record<string, string>;
  memory: ChatMessage[];
};

export type OpenRouterResponse = {
  reply: string;
  action?: 'save_user_data' | 'next_step' | 'webhook_call' | 'none';
  next_step?: string;
  data?: Record<string, string>;
};

export type DebugLog = {
  id: string;
  type: 'incoming' | 'ai' | 'step' | 'system';
  message: string;
  timestamp: number;
};
