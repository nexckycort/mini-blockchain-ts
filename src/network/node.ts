import { Hono } from 'hono';

import blocksRoutes from './routes/blocks';

const app = new Hono();

app.route('/blocks', blocksRoutes);

export default app;
