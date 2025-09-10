import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

import { mempool } from '../../../state/mempool';
import { blockchain } from '../../../state/singleton';

const app = new Hono();

app.post('/', (c) => {
  const txs = mempool.getTransactions();

  if (txs.length === 0) {
    throw new HTTPException(400, { message: 'No transactions to mine' });
  }

  blockchain.addBlock(txs);
  mempool.clearTransactions();

  return c.json(blockchain.chain.at(-1));
});

export default app;
