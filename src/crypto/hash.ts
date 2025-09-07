import { CryptoHasher } from 'bun';

import type { TransactionData } from '../wallet/transaction';

export function hashTransaction(value: TransactionData) {
  return new CryptoHasher('sha256').update(JSON.stringify(value)).digest('hex');
}

export function hash(value: string) {
  return new CryptoHasher('sha256').update(value).digest('hex');
}
