import { DebugLog } from './types';

const logs: DebugLog[] = [];

export function addLog(type: DebugLog['type'], message: string) {
  logs.unshift({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    message,
    timestamp: Date.now()
  });

  if (logs.length > 200) {
    logs.length = 200;
  }
}

export function getLogs() {
  return logs.slice(0, 100);
}
