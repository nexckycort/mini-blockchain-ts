import { CryptoHasher } from 'bun';

import type { Transaction } from '../wallet/transaction';
import { calculateMerkleRoot } from './merkle';

export class Block {
  private index: number;
  private timestamp: number;
  public transactions: Transaction[];
  public prevHash: string;
  private nonce = 0;
  public hash: string;
  private merkleRoot: string;

  constructor(index: number, transactions: Transaction[], prevHash: string) {
    this.index = index;
    this.timestamp = Date.now();
    this.transactions = transactions;
    this.prevHash = prevHash;
    this.merkleRoot = this.getMerkleRoot();
    this.hash = this.calculateHash();
  }

  private getMerkleRoot() {
    return calculateMerkleRoot(this.transactions);
  }

  public calculateHash() {
    const data = `${this.index}${this.timestamp}${this.prevHash}${this.getMerkleRoot()}${this.nonce}`;
    return new CryptoHasher('sha256').update(data).digest('hex');
  }
}
