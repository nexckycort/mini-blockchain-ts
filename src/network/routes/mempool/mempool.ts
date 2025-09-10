import { Hono } from 'hono';

import { mempool } from '../../../state/mempool';

const app = new Hono();

app.get('/', (c) => {
  const txs = mempool.getTransactions();

  return c.json(txs);
});

export default app;
