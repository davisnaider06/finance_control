// Em: backend/src/routes/account.routes.ts

import { Router } from 'express';
import { createAccount, getAccounts } from '../controllers/accountController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// APLICA O MIDDLEWARE EM TODAS AS ROTAS DESTE ARQUIVO
// Qualquer rota definida abaixo desta linha vai exigir um token válido.
router.use(authMiddleware);

// POST /api/accounts - Criar uma nova conta
router.post('/', createAccount);

// GET /api/accounts - Buscar todas as contas do usuário
router.get('/', getAccounts);

// (Futuramente podemos adicionar PUT e DELETE aqui)
// router.put('/:id', updateAccount);
// router.delete('/:id', deleteAccount);

export default router;