import { hashTransaction } from '../crypto/hash';

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
}
