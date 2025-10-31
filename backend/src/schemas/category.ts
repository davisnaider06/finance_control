import { z } from 'zod';

export const categorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Nome da categoria é obrigatório'),
  }),
});
