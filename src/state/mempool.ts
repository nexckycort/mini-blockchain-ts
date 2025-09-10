import type { Transaction } from '../wallet/transaction';

class Mempool {
  private transactions: Transaction[] = [];

  addTransaction(tx: Transaction) {
    if (this.transactions.find((t) => t.id === tx.id)) {
      throw new Error('Transaction already exists');
    }
    this.transactions.push(tx);
  }

  getTransactions(): Transaction[] {
    return this.transactions;
  }

  clearTransactions() {
    this.transactions = [];
  }
}

export const mempool = new Mempool();
