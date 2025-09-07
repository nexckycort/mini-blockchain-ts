import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

import { mempool } from '../../../state/mempool';
import { Transaction } from '../../../wallet/transaction';
import { transactionSchema } from './schema';

const app = new Hono();

app.post('/', zValidator('json', transactionSchema), (c) => {
  const { from, to, amount, signature } = c.req.valid('json');

  const tx = Transaction.fromData({
    from,
    to,
    amount,
    signature,
  });
  if (!tx.isValid()) {
    throw new HTTPException(400, { message: 'Invalid signature' });
  }

  mempool.addTransaction(tx);

  return c.json({
    message: 'Transaction accepted',
    txId: tx.id,
  });
});

export default app;
