const requiredServerEnv = ['OPENROUTER_API_KEY', 'PUBLIC_APP_URL', 'BOCOSE_TOKEN_SECRET'] as const;

type RequiredServerEnv = (typeof requiredServerEnv)[number];

function readEnv(name: RequiredServerEnv): string {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

export function getServerConfig() {
  return {
    openRouterApiKey: readEnv('OPENROUTER_API_KEY'),
    publicAppUrl: readEnv('PUBLIC_APP_URL').replace(/\/$/, ''),
    tokenSecret: readEnv('BOCOSE_TOKEN_SECRET')
  };
}
