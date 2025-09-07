import { describe, expect, it } from 'bun:test';

import { Blockchain } from './blockchain';

describe('Blockchain', () => {
  it('should create genesis block', () => {
    const chain = new Blockchain();
    expect(chain.chain.length).toBe(1);
    expect(chain.chain[0].prevHash).toBe('0');
  });
});
