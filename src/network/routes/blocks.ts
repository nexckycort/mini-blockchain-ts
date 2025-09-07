import { Hono } from 'hono';

import { blockchain } from '../../state/singleton';

const app = new Hono();

app.get('/', (c) => {
  return c.json(blockchain.chain);
});

export default app;
