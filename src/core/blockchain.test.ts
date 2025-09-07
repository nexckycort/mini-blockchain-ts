import { afterAll, describe, expect, it } from 'bun:test';
import { clearDatabase } from '../storage/storage';
import { Blockchain } from './blockchain';

describe('Blockchain', () => {
  afterAll(() => {
    clearDatabase();
  });

  it('should create genesis block', () => {
    const chain = new Blockchain();

    expect(chain.chain.length).toBe(1);
    expect(chain.chain[0].prevHash).toBe('0');
  });

  it('should add valid block', () => {
    const chain = new Blockchain();

    const block = chain.addBlock([
      {
        from: '04a34b6c8e2f4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f',
        to: '04b34b6c8e2f4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f',
        amount: 100,
        signature: 'abcdef1234567890',
        isValid: () => true,
      },
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    ] as any);

    expect(chain.chain.length).toBe(2);
    expect(block.prevHash).toBe(chain.chain[0].hash);
  });

  it('should reject block with invalid transaction', () => {
    const chain = new Blockchain();

    expect(() =>
      chain.addBlock([
        {
          from: '04a34b6c8e2f4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f',
          to: '04b34b6c8e2f4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f',
          amount: 100,
          signature: 'abcdef1234567890',
          isValid: () => false,
        },
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      ] as any),
    ).toThrow('Block rejected: invalid transaction found');
  });

  it('should validate chain integrity', () => {
    const chain = new Blockchain();

    chain.addBlock([
      {
        from: '04a34b6c8e2f4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f',
        to: '04b34b6c8e2f4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f',
        amount: 100,
        signature: 'abcdef1234567890',
        isValid: () => true,
      },
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    ] as any);
    expect(chain.isValid()).toBe(true);

    chain.chain[1].transactions[0].amount = 9999;
    expect(chain.isValid()).toBe(false);
  });
});
