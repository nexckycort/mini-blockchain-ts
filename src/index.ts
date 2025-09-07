import { Hono } from 'hono';

import routes from './network/node';
import { blockchain } from './state/singleton';

const app = new Hono();
app.route('/', routes);

console.log(`✅ Blockchain loaded: height=${blockchain.chain.length}`);

export default app;
