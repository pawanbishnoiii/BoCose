import { AgentConfig } from './types';

export const defaultSalesWorkflow = [
  { id: 'ask_name', type: 'ASK', prompt: 'Aapka naam kya hai?', field: 'name', nextStepId: 'ask_email' },
  { id: 'ask_email', type: 'ASK', prompt: 'Aapka email kya hai?', field: 'email', nextStepId: 'ai_reply' },
  { id: 'ai_reply', type: 'REPLY', nextStepId: 'end' },
  { id: 'end', type: 'END' }
] as const;

export const defaultSupportWorkflow = [
  { id: 'ask_issue', type: 'ASK', prompt: 'Please describe your issue in one line.', field: 'issue', nextStepId: 'ai_reply' },
  { id: 'ai_reply', type: 'REPLY', nextStepId: 'end' },
  { id: 'end', type: 'END' }
] as const;

export const defaultAgents: AgentConfig[] = [
  {
    id: 'sales-agent',
    name: 'Sales Agent',
    role: 'Product consultant for inbound leads',
    systemPrompt: 'You are a sales agent.',
    goals: 'Collect user requirements and suggest products succinctly.',
    tone: 'Professional, concise, friendly',
    instructions: 'Ask one question at a time. Confirm before ending.',
    workflow: [...defaultSalesWorkflow],
    intent: 'sales'
  },
  {
    id: 'support-agent',
    name: 'Support Agent',
    role: 'Support triage specialist',
    systemPrompt: 'You are a support specialist.',
    goals: 'Understand the issue, collect context, propose next action.',
    tone: 'Calm, practical, empathetic',
    instructions: 'Never fabricate fixes. Escalate when unsure.',
    workflow: [...defaultSupportWorkflow],
    intent: 'support'
  }
];
