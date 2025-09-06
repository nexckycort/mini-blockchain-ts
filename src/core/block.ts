import { CryptoHasher } from 'bun';
import { calculateMerkleRoot } from './merkle';

export class Block {
  private index: number;
  private timestamp: number;
  public transactions: string[];
  public prevHash: string;
  private nonce = 0;
  public hash: string;

  constructor(index: number, transactions: string[], prevHash: string) {
    this.index = index;
    this.timestamp = Date.now();
    this.transactions = transactions;
    this.prevHash = prevHash;
    this.hash = this.calculateHash();
  }

  private getMerkleRoot() {
    return calculateMerkleRoot(this.transactions);
  }

  public calculateHash() {
    const datos = `${this.index}${this.timestamp}${this.prevHash}${this.getMerkleRoot()}${this.nonce}`;
    return new CryptoHasher('sha256').update(datos).digest('hex');
  }
}
