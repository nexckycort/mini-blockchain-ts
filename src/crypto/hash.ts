import { CryptoHasher } from 'bun';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function hashTransaction(value: any) {
  return new CryptoHasher('sha256').update(JSON.stringify(value)).digest('hex');
}
