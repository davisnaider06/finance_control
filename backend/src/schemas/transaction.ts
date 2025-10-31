import { z } from 'zod';

export const createTransactionSchema = z.object({
  body: z.object({
    description: z.string().min(1, 'Descrição é obrigatória'),
    amount: z.number().positive('Valor deve ser positivo'),
    type: z.enum(['income', 'expense'], { message: "Tipo deve ser 'income' ou 'expense'" }),
    date: z.string().datetime().optional(), // Data como string ISO
    categoryId: z.string().uuid('ID da Categoria inválido'),
  }),
});

export const updateTransactionSchema = z.object({
  body: z.object({
    description: z.string().min(1).optional(),
    amount: z.number().positive().optional(),
    type: z.enum(['income', 'expense']).optional(),
    date: z.string().datetime().optional(),
    categoryId: z.string().uuid().optional(),
  }),
  params: z.object({
    id: z.string().uuid('ID da Transação inválido'),
  })
});
