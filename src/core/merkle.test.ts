import { describe, expect, it } from 'bun:test';

import { calculateMerkleRoot } from './merkle';

describe('Merkle', () => {
  it('should calculate correct merkle root for transactions', () => {
    const merkleRoot = calculateMerkleRoot([
      {
        from: '04a34b6c8e2f4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f',
        to: '04b34b6c8e2f4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f',
        amount: 100,
        signature: 'abcdef1234567890',
      },
      {
        from: '04c34b6c8e2f4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f',
        to: '04d34b6c8e2f4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f',
        amount: 50,
        signature: '1234567890abcdef',
      },
    ] as any);

    const expectedMerkleRoot =
      '8008919b051108e688418ca58ecf4313a115a922f29afb7da8cec6dabfe5f78f';

    expect(merkleRoot).toBe(expectedMerkleRoot);
  });
});
