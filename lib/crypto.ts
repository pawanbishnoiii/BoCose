import crypto from 'crypto';

const SECRET = process.env.BOCOSE_TOKEN_SECRET || 'dev-token-secret-change-in-prod';

export function encryptToken(token: string): string {
  const iv = crypto.randomBytes(16);
  const key = crypto.createHash('sha256').update(SECRET).digest();
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const encrypted = Buffer.concat([cipher.update(token, 'utf8'), cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decryptToken(payload: string): string {
  const [ivHex, encryptedHex] = payload.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const key = crypto.createHash('sha256').update(SECRET).digest();
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf8');
}
