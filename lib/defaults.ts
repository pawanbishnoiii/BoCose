import { AgentConfig } from './types';

export const defaultAgents: AgentConfig[] = [
  {
    id: 'sales-agent',
    name: 'Sales Agent',
    role: 'Product consultant for inbound leads',
    systemPrompt: 'You are a sales assistant focused on structured qualification.',
    goals: 'Collect user requirements and suggest the best product options.',
    tone: 'Professional, concise, friendly',
    instructions: 'Ask one question at a time. Stay factual. Follow workflow strictly.',
    intent: 'sales',
    workflow: [
      { id: 'ask_name', type: 'ASK', field: 'name', validator: 'non_empty', prompt: 'Aapka naam kya hai?', nextStepId: 'ask_phone' },
      { id: 'ask_phone', type: 'ASK', field: 'phone', validator: 'phone', prompt: 'Aapka phone number share kariye.', retryMessage: 'Valid phone number dijiye.', nextStepId: 'ask_email' },
      { id: 'ask_email', type: 'ASK', field: 'email', validator: 'email', prompt: 'Aapka email address share kariye.', retryMessage: 'Valid email dijiye.', nextStepId: 'proposal_reply' },
      { id: 'proposal_reply', type: 'REPLY', nextStepId: 'end' },
      { id: 'end', type: 'END' }
    ]
  },
  {
    id: 'support-agent',
    name: 'Support Agent',
    role: 'Support triage specialist',
    systemPrompt: 'You are a support specialist focused on accurate triage.',
    goals: 'Capture issue context and provide actionable next steps.',
    tone: 'Calm, practical, empathetic',
    instructions: 'Do not hallucinate fixes. Escalate when uncertain.',
    intent: 'support',
    workflow: [
      { id: 'ask_name', type: 'ASK', field: 'name', validator: 'non_empty', prompt: 'Please share your name.', nextStepId: 'ask_email' },
      { id: 'ask_email', type: 'ASK', field: 'email', validator: 'email', prompt: 'Please share your email.', nextStepId: 'ask_issue' },
      { id: 'ask_issue', type: 'ASK', field: 'issue', validator: 'non_empty', prompt: 'Please describe your issue in one line.', nextStepId: 'issue_summary' },
      { id: 'issue_summary', type: 'REPLY', nextStepId: 'end' },
      { id: 'end', type: 'END' }
    ]
  }
];
