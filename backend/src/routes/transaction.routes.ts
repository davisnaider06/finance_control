// Em: backend/src/routes/transaction.routes.ts

import { Router } from 'express';
import { createTransaction, getTransactions } from '../controllers/transactionController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Aplica o middleware de autenticação
router.use(authMiddleware);

// POST /api/transactions - Criar nova transação
router.post('/', createTransaction);

// GET /api/transactions - Buscar transações
router.get('/', getTransactions);

export default router;