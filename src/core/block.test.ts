import { describe, expect, it } from 'bun:test';

import type { Transaction } from '../wallet/transaction';
import { Block } from './block';

const createMockTransaction = (
  from: string,
  to: string,
  amount: number,
): Transaction =>
  ({
    from,
    to,
    amount,
    signature: `mock_signature_${Math.random().toString(36).substring(7)}`,
    isValid: () => true,
  }) as any;

describe('Block', () => {
  describe('Block Creation', () => {
    it('should create a block with correct properties', () => {
      const transactions = [
        createMockTransaction('alice', 'bob', 50),
        createMockTransaction('bob', 'charlie', 25),
      ];
      const prevHash = '00abc123';
      const block = new Block(1, transactions, prevHash);

      expect(block.idx).toBe(1);
      expect(block.prevHash).toBe(prevHash);
      expect(block.transactions).toEqual(transactions);
      expect(block.nonce).toBe(0);
      expect(typeof block.timestamp).toBe('number');
      expect(typeof block.hash).toBe('string');
      expect(block.hash.length).toBe(64);
    });

    it('should create genesis block (index 0)', () => {
      const genesisTransaction = createMockTransaction('GENESIS', 'GENESIS', 0);
      const block = new Block(0, [genesisTransaction], '0');

      expect(block.idx).toBe(0);
      expect(block.prevHash).toBe('0');
      expect(block.transactions.length).toBe(1);
      expect(block.transactions[0].from).toBe('GENESIS');
    });

    it('should have different timestamps for blocks created at different times', async () => {
      const tx = createMockTransaction('alice', 'bob', 10);
      const block1 = new Block(1, [tx], 'prev1');

      await new Promise((resolve) => setTimeout(resolve, 1));

      const block2 = new Block(2, [tx], 'prev2');

      expect(block2.timestamp).toBeGreaterThan(block1.timestamp);
    });
  });

  describe('Hash Calculation', () => {
    /* it('should calculate consistent hash for same block data', () => {
      const transactions = [createMockTransaction('alice', 'bob', 100)];
      const block1 = new Block(1, transactions, 'prev_hash');
      const block2 = new Block(1, transactions, 'prev_hash');

      // Set same timestamp to ensure identical hash
      block2.timestamp = block1.timestamp;

      expect(block1.calculateHash()).toBe(block2.calculateHash());
    }); */

    it('should produce different hashes for different block data', () => {
      const transactions1 = [createMockTransaction('alice', 'bob', 100)];
      const transactions2 = [createMockTransaction('alice', 'charlie', 100)];
      const block1 = new Block(1, transactions1, 'prev_hash');
      const block2 = new Block(1, transactions2, 'prev_hash');

      expect(block1.hash).not.toBe(block2.hash);
    });

    it('should produce different hashes for different previous hash', () => {
      const transactions = [createMockTransaction('alice', 'bob', 100)];
      const block1 = new Block(1, transactions, 'prev_hash_1');
      const block2 = new Block(1, transactions, 'prev_hash_2');

      block2.timestamp = block1.timestamp;

      expect(block1.hash).not.toBe(block2.hash);
    });

    it('should produce different hashes for different index', () => {
      const transactions = [createMockTransaction('alice', 'bob', 100)];
      const block1 = new Block(1, transactions, 'prev_hash');
      const block2 = new Block(2, transactions, 'prev_hash');

      block2.timestamp = block1.timestamp;

      expect(block1.hash).not.toBe(block2.hash);
    });

    it('should recalculate hash when nonce changes', () => {
      const transactions = [createMockTransaction('alice', 'bob', 100)];
      const block = new Block(1, transactions, 'prev_hash');

      const originalHash = block.hash;
      block.nonce = 1;
      const newHash = block.calculateHash();

      expect(newHash).not.toBe(originalHash);
    });
  });

  describe('Merkle Root Integration', () => {
    it('should calculate different hashes for different transaction sets', () => {
      const transactions1 = [
        createMockTransaction('alice', 'bob', 50),
        createMockTransaction('bob', 'charlie', 25),
      ];
      const transactions2 = [
        createMockTransaction('alice', 'bob', 50),
        createMockTransaction('bob', 'dave', 25),
      ];

      const block1 = new Block(1, transactions1, 'prev_hash');
      const block2 = new Block(1, transactions2, 'prev_hash');

      block2.timestamp = block1.timestamp;

      expect(block1.hash).not.toBe(block2.hash);
    });

    it('should detect transaction tampering through hash changes', () => {
      const transactions = [createMockTransaction('alice', 'bob', 100)];
      const block = new Block(1, transactions, 'prev_hash');

      const originalHash = block.hash;

      block.transactions[0].amount = 1000;
      const newHash = block.calculateHash();

      expect(newHash).not.toBe(originalHash);
    });
  });

  describe('JSON Serialization', () => {
    it('should serialize to JSON correctly', () => {
      const transactions = [
        createMockTransaction('alice', 'bob', 50),
        createMockTransaction('bob', 'charlie', 25),
      ];
      const block = new Block(1, transactions, 'prev_hash');
      const json = block.toJSON();
      console.log(json);

      expect(json).toHaveProperty('idx', 1);
      expect(json).toHaveProperty('timestamp', block.timestamp);
      expect(json).toHaveProperty('data');
      expect(json).toHaveProperty('prevHash', 'prev_hash');
      expect(json).toHaveProperty('nonce', 0);
      expect(json).toHaveProperty('hash', block.hash);
    });

    it('should serialize empty transaction list', () => {
      const block = new Block(0, [], '0');
      const json = block.toJSON();

      const parsedTransactions = JSON.parse(json.data);
      expect(parsedTransactions).toEqual([]);
    });

    it('should serialize single transaction', () => {
      const transaction = createMockTransaction('alice', 'bob', 100);
      const block = new Block(1, [transaction], 'prev_hash');
      const json = block.toJSON();

      const parsedTransactions = JSON.parse(json.data);
      expect(parsedTransactions).toHaveLength(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty transactions array', () => {
      const block = new Block(1, [], 'prev_hash');

      expect(block.transactions).toEqual([]);
      expect(typeof block.hash).toBe('string');
      expect(block.hash.length).toBe(64);
    });

    it('should handle very large transaction amounts', () => {
      const largeTransaction = createMockTransaction(
        'alice',
        'bob',
        Number.MAX_SAFE_INTEGER,
      );
      const block = new Block(1, [largeTransaction], 'prev_hash');

      expect(block.transactions[0].amount).toBe(Number.MAX_SAFE_INTEGER);
      expect(typeof block.hash).toBe('string');
    });

    it('should handle special characters in addresses', () => {
      const specialTransaction = createMockTransaction(
        'alice@domain.com',
        'bob#123',
        50,
      );
      const block = new Block(1, [specialTransaction], 'prev_hash');

      expect(block.transactions[0].from).toBe('alice@domain.com');
      expect(block.transactions[0].to).toBe('bob#123');
      expect(typeof block.hash).toBe('string');
    });

    it('should handle very long previous hash', () => {
      const longPrevHash = 'a'.repeat(1000);
      const transaction = createMockTransaction('alice', 'bob', 100);
      const block = new Block(1, [transaction], longPrevHash);

      expect(block.prevHash).toBe(longPrevHash);
      expect(typeof block.hash).toBe('string');
    });
  });

  describe('Block Integrity', () => {
    it('should maintain hash consistency after creation', () => {
      const transactions = [createMockTransaction('alice', 'bob', 100)];
      const block = new Block(1, transactions, 'prev_hash');

      const initialHash = block.hash;
      const recalculatedHash = block.calculateHash();

      expect(recalculatedHash).toBe(initialHash);
    });

    it('should detect when block has been modified', () => {
      const transactions = [createMockTransaction('alice', 'bob', 100)];
      const block = new Block(1, transactions, 'prev_hash');

      const originalHash = block.hash;

      block.idx = 999;

      const currentHash = block.calculateHash();
      expect(currentHash).not.toBe(originalHash);
    });
  });
});
