import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import blocksRoutes from './routes/blocks';
import transactionsRouter from './routes/transactions';

const app = new Hono();

app.use(logger());
app.use(cors());

app.route('/blocks', blocksRoutes);
app.route('/tx', transactionsRouter);

export default app;
