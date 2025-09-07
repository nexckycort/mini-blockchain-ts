import z from 'zod';

export const transactionSchema = z.object({
  from: z.string().regex(/^(04|02|03)[0-9a-fA-F]{64,128}$/, {
    message: 'Invalid public key format',
  }),
  to: z.string().regex(/^(04|02|03)[0-9a-fA-F]{64,128}$/, {
    message: 'Invalid public key format',
  }),
  amount: z.number().int().positive(),
  signature: z.string().regex(/^[0-9a-fA-F]+$/, {
    message: 'Signature must be hex string',
  }),
});
