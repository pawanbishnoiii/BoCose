import crypto from 'crypto';
import { getTokenSecret } from './config';

function getKey() {
  const tokenSecret = getTokenSecret();
  return crypto.createHash('sha256').update(tokenSecret).digest();
}

export function encryptToken(token: string): string {
  const iv = crypto.randomBytes(16);
  const key = getKey();
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const encrypted = Buffer.concat([cipher.update(token, 'utf8'), cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decryptToken(payload: string): string {
  const [ivHex, encryptedHex] = payload.split(':');
  if (!ivHex || !encryptedHex) {
    throw new Error('Invalid encrypted token payload');
  }

  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const key = getKey();
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf8');
}
