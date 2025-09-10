import type { MiningConfig } from '../config/mining';
import { DEFAULT_MINING_CONFIG } from '../config/mining';
import { loadBlockchain, saveBlock } from '../storage/storage';
import { Transaction } from '../wallet/transaction';
import { Block } from './block';

export class Blockchain {
  public chain: Block[];
  private miningConfig: MiningConfig;

  constructor(miningConfig: MiningConfig = DEFAULT_MINING_CONFIG) {
    this.miningConfig = miningConfig;
    this.chain = this.initializeChain();
  }

  private initializeChain() {
    const storedChain = loadBlockchain();

    if (storedChain.length > 0) {
      this.chain = storedChain;
      if (this.isValid()) {
        return storedChain;
      } else {
        console.error('Blockchain corrupta en disco, creando genesis...');
        return [this.createGenesisBlock()];
      }
    }

    return [this.createGenesisBlock()];
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

    const miningSuccess = newBlock.mine(this.miningConfig);
    if (!miningSuccess) {
      throw new Error(
        `Failed to mine block ${newBlock.idx} with difficulty ${this.miningConfig.difficulty}`,
      );
    }

    this.chain.push(newBlock);
    saveBlock(newBlock.toJSON());

    return newBlock;
  }

  public mineBlock(transactions: Transaction[]): Block {
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

    const miningSuccess = newBlock.mine(this.miningConfig);
    if (!miningSuccess) {
      throw new Error(
        `Failed to mine block ${newBlock.idx} with difficulty ${this.miningConfig.difficulty}`,
      );
    }

    return newBlock;
  }

  public addMinedBlock(block: Block): void {
    if (!block.isHashValidForDifficulty(this.miningConfig.difficulty)) {
      throw new Error(
        `Block ${block.idx} does not meet difficulty requirement`,
      );
    }

    if (block.prevHash !== this.getLatestBlock().hash) {
      throw new Error(`Block ${block.idx} has invalid previous hash`);
    }

    if (block.idx !== this.chain.length) {
      throw new Error(`Block ${block.idx} has invalid index`);
    }

    for (const tx of block.transactions) {
      if (!tx.isValid()) {
        throw new Error(`Block ${block.idx} contains invalid transaction`);
      }
    }

    this.chain.push(block);
    saveBlock(block.toJSON());
  }

  public isValid(): boolean {
    if (this.chain.length === 0) return false;

    const genesis = this.chain[0];
    if (genesis.hash !== genesis.calculateHash()) return false;

    for (let i = 1; i < this.chain.length; i++) {
      const curr = this.chain[i];
      const prev = this.chain[i - 1];

      if (curr.hash !== curr.calculateHash()) return false;
      if (curr.prevHash !== prev.hash) return false;
    }

    return true;
  }
}
