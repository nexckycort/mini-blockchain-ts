import { randomUUIDv7 } from 'bun';
import { ec as EC } from 'elliptic';

import { hashTransaction } from '../crypto/hash';

const ec = new EC('secp256k1');

export type TransactionData = {
  id: string;
  from: string;
  to: string;
  amount: number;
};

export class Transaction implements TransactionData {
  public id: string;
  public from: string;
  public to: string;
  public amount: number;
  public signature: string | null;

  constructor(from: string, to: string, amount: number) {
    this.id = randomUUIDv7();
    this.from = from;
    this.to = to;
    this.amount = amount;
    this.signature = null;
  }

  static fromData(data: {
    from: string;
    to: string;
    amount: number;
    signature: string;
  }): Transaction {
    const tx = new Transaction(data.from, data.to, data.amount);
    tx.signature = data.signature;
    return tx;
  }

  public hash(): string {
    return hashTransaction({
      id: this.id,
      from: this.from,
      to: this.to,
      amount: this.amount,
    });
  }

  public isValid(): boolean {
    if (this.from === 'GENESIS') return true;
    if (!this.signature) return false;

    const txHash = this.hash();
    const key = ec.keyFromPublic(this.from, 'hex');
    return key.verify(txHash, this.signature);
  }
}
