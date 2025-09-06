import { hashTransaction } from '../crypto/hash';

export function calculateMerkleRoot(transactions: string[]) {
  let leafHashes = transactions.map((tx) => hashTransaction(tx));

  while (leafHashes.length > 1) {
    const parentHashes = [];
    for (let i = 0; i < leafHashes.length; i += 2) {
      const left = leafHashes[i];
      const right = leafHashes[i + 1] ?? left;

      const combinedHash = hashTransaction(left + right);
      parentHashes.push(combinedHash);
    }

    leafHashes = parentHashes;
  }

  return leafHashes[0];
}
