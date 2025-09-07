import { Hono } from 'hono';

import routes from './network/node';
import { initStorage } from './storage/storage';

initStorage();

const app = new Hono();
app.route('/', routes);

export default app;
