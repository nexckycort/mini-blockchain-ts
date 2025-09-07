import { Database } from 'bun:sqlite';

import { DB_PATH } from '../config/env';
import { Block, type BlockData } from '../core/block';

const db = new Database(DB_PATH);

function initStorage(): void {
  db.query(`CREATE TABLE IF NOT EXISTS blocks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  idx INTEGER NOT NULL,
  timestamp TEXT NOT NULL,
  data TEXT,
  prevHash TEXT NOT NULL,
  hash TEXT NOT NULL UNIQUE,
  nonce INTEGER NOT NULL
);`).run();

  db.query('PRAGMA journal_mode = WAL;').run();
}

// Initialize database when module loads
initStorage();

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
  const query = db.query<BlockData, any>(
    'SELECT * FROM blocks ORDER BY idx ASC',
  );
  const rows = query.all();

  const blocks = rows.map((row) => {
    const transactions = JSON.parse(row.data);
    const block = new Block(row.idx, transactions, row.prevHash);
    block.hash = row.hash;
    block.timestamp = row.timestamp;
    return block;
  });

  return blocks;
}
