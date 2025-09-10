import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import blocksRoutes from './routes/blocks';
import mempoolRouter from './routes/mempool/mempool';
import mineRouter from './routes/mine/mine';
import transactionsRouter from './routes/txs/transactions';

const app = new Hono();

app.use(logger());
app.use(cors());

app.get('/health', (c) =>
  c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }),
);

app.route('/blocks', blocksRoutes);
app.route('/mempool', mempoolRouter);
app.route('/txs', transactionsRouter);
app.route('/mine', mineRouter);

export default app;
