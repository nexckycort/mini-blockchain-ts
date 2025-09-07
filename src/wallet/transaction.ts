import { ec as EC } from 'elliptic';

import { hashTransaction } from '../crypto/hash';

const ec = new EC('secp256k1');

export class Transaction {
  public from: string;
  public to: string;
  public amount: number;
  public signature: string | null;

  constructor(from: string, to: string, amount: number) {
    this.from = from;
    this.to = to;
    this.amount = amount;
    this.signature = null;
  }

  public hash(): string {
    return hashTransaction({
      from: this.from,
      to: this.to,
      amount: this.amount,
    });
  }

  public isValid():boolean {
    if (this.from === 'GENESIS') return true;
    if (!this.signature) return false;

    const txHash = this.hash();
    const key = ec.keyFromPublic(this.from, 'hex');
    return key.verify(txHash, this.signature);
  }
}
