function readEnv(name: string, required = true): string | undefined {
  const value = process.env[name];
  if (required && (!value || value.trim().length === 0)) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

export function getTokenSecret() {
  return readEnv('BOCOSE_TOKEN_SECRET') as string;
}

export function getPublicAppUrl() {
  return readEnv('PUBLIC_APP_URL', false)?.replace(/\/$/, '');
}

export function getOpenRouterApiKey() {
  return readEnv('OPENROUTER_API_KEY', false);
}

export function getOpenRouterModel() {
  return readEnv('OPENROUTER_MODEL', false) || 'qwen/qwen3.6-plus:free';
}
