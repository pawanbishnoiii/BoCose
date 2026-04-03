import { AgentConfig, AgentIntent, WorkflowStep } from './types';

export function routeIntent(text: string): AgentIntent {
  const normalized = text.toLowerCase();
  if (/(issue|error|bug|problem|support|help)/.test(normalized)) {
    return 'support';
  }
  return 'sales';
}

export function getStep(agent: AgentConfig, stepId: string): WorkflowStep | undefined {
  return agent.workflow.find((s) => s.id === stepId);
}

export function getFirstStep(agent: AgentConfig): WorkflowStep {
  return agent.workflow[0];
}

export function missingRequiredFields(stateData: Record<string, string>) {
  const required = ['name', 'phone', 'email'];
  return required.filter((field) => !stateData[field]);
}
