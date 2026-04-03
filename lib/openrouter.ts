import { getOpenRouterApiKey } from './config';
import { OpenRouterResponse } from './types';

type GenerateInput = {
  userMessage: string;
  composedPrompt: string;
  apiKey?: string;
  model?: string;
};

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'qwen/qwen3.6-plus:free';

export async function generateAgentResponse({
  userMessage,
  composedPrompt,
  apiKey,
  model = DEFAULT_MODEL
}: GenerateInput): Promise<OpenRouterResponse> {
  const resolvedApiKey = apiKey || getOpenRouterApiKey();
  if (!resolvedApiKey) {
    throw new Error('Missing OpenRouter API key. Set OPENROUTER_API_KEY or provide key in chat settings.');
  }

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resolvedApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: composedPrompt },
        { role: 'user', content: userMessage }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'agent_output',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              reply: { type: 'string' },
              action: {
                type: 'string',
                enum: ['save_user_data', 'next_step', 'webhook_call', 'none']
              },
              next_step: { type: 'string' },
              data: {
                type: 'object',
                additionalProperties: { type: 'string' }
              }
            },
            required: ['reply', 'action'],
            additionalProperties: false
          }
        }
      }
    })
  });

  if (!res.ok) {
    throw new Error(`OpenRouter failed with status ${res.status}`);
  }

  const payload = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('OpenRouter returned empty content');
  }

  const parsed = JSON.parse(content) as OpenRouterResponse;
  return {
    reply: parsed.reply,
    action: parsed.action || 'none',
    next_step: parsed.next_step,
    data: parsed.data
  };
}
