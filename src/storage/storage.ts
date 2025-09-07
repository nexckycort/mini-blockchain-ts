import { Database } from 'bun:sqlite';

import { Block, type BlockData } from '../core/block';

const db = new Database('db/db.sqlite');

export function initStorage(): void {
  db.query(`CREATE TABLE IF NOT EXISTS blocks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  idx INTEGER NOT NULL,
  timestamp TEXT NOT NULL,
  data TEXT,
  prevHash TEXT NOT NULL,
  hash TEXT NOT NULL UNIQUE,
  nonce INTEGER NOT NULL
);`).run('PRAGMA journal_mode = WAL;');
}

export function saveBlock(block: BlockData): void {
  db.query(`INSERT INTO blocks (idx, timestamp, data, prevHash, hash, nonce)
VALUES (?, ?, ?, ?, ?, ?);`).run(
    block.idx,
    block.timestamp,
    block.data,
    block.prevHash,
    block.hash,
    block.nonce,
  );
}

export function loadBlockchain(): Block[] {
  const query = db.query('SELECT * FROM blocks ORDER BY idx ASC').as(Block);
  const blocks = query.all();
  return blocks.map((block) => {
    // @ts-expect-error
    const transactions = JSON.parse(block.data);
    Reflect.deleteProperty(block, 'data');
    return {
      ...block,
      transactions,
    } as Block;
  });
}
