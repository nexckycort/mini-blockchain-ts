import { loadBlockchain, saveBlock } from '../storage/storage';
import { Transaction } from '../wallet/transaction';
import { Block } from './block';

export class Blockchain {
  public chain: Block[];

  constructor() {
    this.chain = this.initializeChain();
  }

  private initializeChain() {
    const storedChain = loadBlockchain();
    return storedChain.length > 0 ? storedChain : [this.createGenesisBlock()];
  }

  private createGenesisBlock(): Block {
    const genesisTransaction = new Transaction('GENESIS', 'GENESIS', 0);
    const genesis = new Block(0, [genesisTransaction], '0');
    saveBlock(genesis.toJSON());
    return genesis;
  }

  private getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  public addBlock(transactions: Transaction[]): Block {
    for (const tx of transactions) {
      if (!tx.isValid()) {
        throw new Error('Block rejected: invalid transaction found');
      }
    }

    const newBlock = new Block(
      this.chain.length,
      transactions,
      this.getLatestBlock().hash,
    );
    this.chain.push(newBlock);
    saveBlock(newBlock.toJSON());

    return newBlock;
  }

  public isValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const curr = this.chain[i];
      const prev = this.chain[i - 1];

      if (curr.hash !== curr.calculateHash()) return false;
      if (curr.prevHash !== prev.hash) return false;
    }

    return true;
  }
}
