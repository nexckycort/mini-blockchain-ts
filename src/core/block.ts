import { CryptoHasher } from 'bun';

export class Block {
  private index: number;
  private timestamp: number;
  private transactions: string[];
  private prevHash: string;
  private nonce = 0;
  private hash: string;

  constructor(index: number, transactions: string[], prevHash: string) {
    this.index = index;
    this.timestamp = Date.now();
    this.transactions = transactions;
    this.prevHash = prevHash;
    this.hash = this.calculateHash();
  }

  private calculateHash() {
    const datos = `${this.index}${this.timestamp}${this.transactions}${this.prevHash}${this.nonce}`;
    return new CryptoHasher('sha256').update(datos).digest('hex');
  }
}
