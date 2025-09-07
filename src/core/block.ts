import { CryptoHasher } from 'bun';

import type { Transaction } from '../wallet/transaction';
import { calculateMerkleRoot } from './merkle';

export type BlockData = {
  idx: number;
  timestamp: number;
  data: string;
  prevHash: string;
  nonce: number;
  hash: string;
};

export class Block implements Omit<BlockData, 'data'> {
  public idx: number;
  public timestamp: number;
  public transactions: Transaction[];
  public prevHash: string;
  public nonce = 0;
  public hash: string;
  private merkleRoot: string;

  constructor(idx: number, transactions: Transaction[], prevHash: string) {
    this.idx = idx;
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
    const data = `${this.idx}${this.timestamp}${this.prevHash}${this.getMerkleRoot()}${this.nonce}`;
    return new CryptoHasher('sha256').update(data).digest('hex');
  }

  public toJSON(): BlockData {
    return {
      idx: this.idx,
      timestamp: this.timestamp,
      data: JSON.stringify(this.transactions),
      prevHash: this.prevHash,
      nonce: this.nonce,
      hash: this.hash,
    };
  }
}
