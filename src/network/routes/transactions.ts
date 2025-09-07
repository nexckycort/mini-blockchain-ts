import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import z from 'zod/v4';

const app = new Hono();

app.post('/',zValidator(
    'json',
    z.object({
      from: z.string(),
      to: z.string(),
      amount: z.number(),
      signature: z.string(),
    })
  ), (c) => {
  // TODO: Process the transaction here
  return c.json({
  "message": "Transaction accepted",
  "txId": "tx123..."
});
});

export default app;
