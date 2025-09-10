import { ec as EC } from 'elliptic';

import type { Transaction } from './transaction';

const ec = new EC('secp256k1');

export class Wallet {
  #privateKey: string;
  public publicKey: string;

  constructor() {
    this.#privateKey = this.generatePrivateKey();
    this.publicKey = this.derivePublicKey(this.#privateKey);
  }

  private generatePrivateKey(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join(
      '',
    );
  }

  private derivePublicKey(privateKey: string): string {
    const key = ec.keyFromPrivate(privateKey);
    return key.getPublic(true, 'hex');
  }

  public signTransaction(transaction: Transaction): string {
    const txHash = transaction.hash();
    const key = ec.keyFromPrivate(this.#privateKey);
    const signature = key.sign(txHash, 'hex');
    transaction.signature = signature.toDER('hex');
    return transaction.signature;
  }

  public static verifySignature(transaction: Transaction): boolean {
    if (!transaction.signature) return false;
    if (transaction.from === 'GENESIS') return true;

    const txHash = transaction.hash();
    const signatureHex = transaction.signature;
    const key = ec.keyFromPublic(transaction.from, 'hex');
    return key.verify(txHash, signatureHex);
  }
}
