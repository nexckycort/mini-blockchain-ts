import { CryptoHasher } from 'bun';

import { DEFAULT_MINING_CONFIG, isHashValid } from '../config/mining';
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
  public hash: string = '';
  private merkleRoot: string;

  constructor(
    idx: number,
    transactions: Transaction[],
    prevHash: string,
    mined = false,
  ) {
    this.idx = idx;
    this.timestamp = Date.now();
    this.transactions = transactions;
    this.prevHash = prevHash;
    this.merkleRoot = this.getMerkleRoot();

    this.hash = this.calculateHash();
    if (mined) {
      this.mine();
    }
  }

  private getMerkleRoot() {
    return calculateMerkleRoot(this.transactions);
  }

  public calculateHash() {
    const data = `${this.idx}${this.timestamp}${this.prevHash}${this.getMerkleRoot()}${this.nonce}`;
    return new CryptoHasher('sha256').update(data).digest('hex');
  }

  public mine(config = DEFAULT_MINING_CONFIG): boolean {
    const startTime = Date.now();
    const target = '0'.repeat(config.difficulty);

    console.log(
      `🔨 Mining block ${this.idx} with difficulty ${config.difficulty} (target: ${target}...)`,
    );

    for (let nonce = 0; nonce <= config.maxNonce; nonce++) {
      this.nonce = nonce;
      this.hash = this.calculateHash();

      if (isHashValid(this.hash, config.difficulty)) {
        const miningTime = Date.now() - startTime;
        console.log(`✅ Block ${this.idx} mined! Hash: ${this.hash}`);
        console.log(`⏱️  Mining time: ${miningTime}ms, Nonce: ${this.nonce}`);
        return true;
      }

      if (nonce % 10000 === 0 && nonce > 0) {
        console.log(`⏳ Tried ${nonce} nonces... Current hash: ${this.hash}`);
      }
    }

    console.log(
      `❌ Failed to mine block ${this.idx} after ${config.maxNonce} attempts`,
    );
    return false;
  }

  public isHashValidForDifficulty(difficulty: number): boolean {
    return isHashValid(this.hash, difficulty);
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
