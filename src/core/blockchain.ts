import { Block } from './block';

export class Blockchain {
  public chain: Block[];

  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  private createGenesisBlock() {
    return new Block(0, ['Genesis block'], '0');
  }

  private getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  public addBlock(transactions: string[]) {
    const newBlock = new Block(
      this.chain.length,
      transactions,
      this.getLatestBlock().hash,
    );
    this.chain.push(newBlock);
    return newBlock;
  }

  public isValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const curr = this.chain[i];
      const prev = this.chain[i - 1];

      if (curr.hash !== curr.calculateHash()) return false;
      if (curr.prevHash !== prev.hash) return false;
    }

    return true;
  }
}
