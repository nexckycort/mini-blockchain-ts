/**
 * Mining configuration for Proof-of-Work
 */
export interface MiningConfig {
  /** Number of leading zeros required in hash */
  difficulty: number;
  /** Maximum number of nonce attempts before giving up */
  maxNonce: number;
  /** Target time for mining a block (in milliseconds) */
  targetBlockTime: number;
}

export const DEFAULT_MINING_CONFIG: MiningConfig = {
  difficulty: 1,
  maxNonce: 1_000_000,
  targetBlockTime: 10_000,
};

export function isHashValid(hash: string, difficulty: number): boolean {
  const target = '0'.repeat(difficulty);
  return hash.substring(0, difficulty) === target;
}

export function getDifficultyTarget(difficulty: number): string {
  return '0'.repeat(difficulty);
}
