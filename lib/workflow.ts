import { AgentConfig, AgentIntent, UserState, WorkflowStep } from './types';

export function routeIntent(text: string): AgentIntent {
  const normalized = text.toLowerCase();
  if (/(issue|error|bug|problem|support|help|refund|ticket)/.test(normalized)) {
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

export function isStepComplete(step: WorkflowStep, data: Record<string, string>) {
  if (step.type !== 'ASK' || !step.field) return false;
  return Boolean(data[step.field]);
}

export function validateField(value: string, validator: WorkflowStep['validator']) {
  if (!validator || validator === 'non_empty') {
    return value.trim().length > 0;
  }

  if (validator === 'email') {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  if (validator === 'phone') {
    return /^\+?[0-9\-\s]{8,15}$/.test(value);
  }

  return true;
}

export function advancePastCompletedSteps(agent: AgentConfig, state: UserState) {
  let cursor = state.currentStepId;

  for (let i = 0; i < agent.workflow.length; i += 1) {
    const step = getStep(agent, cursor);
    if (!step) break;

    if (step.type === 'ASK' && isStepComplete(step, state.data) && step.nextStepId) {
      cursor = step.nextStepId;
      continue;
    }

    if (step.type === 'CONDITION') {
      const fieldValue = state.data[step.conditionField || ''];
      cursor = fieldValue === step.conditionValue ? step.trueStepId || cursor : step.falseStepId || cursor;
      continue;
    }

    break;
  }

  state.currentStepId = cursor;
  return state;
}
