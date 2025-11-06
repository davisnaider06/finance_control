// Em: backend/src/routes/budget.routes.ts

import { Router } from 'express';
import { 
  getBudgets, 
  createBudget, 
  updateBudget, 
  deleteBudget 
} from '../controllers/budgetController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
router.use(authMiddleware); // Proteger todas as rotas

// GET /api/budgets
router.get('/', getBudgets);

// POST /api/budgets
router.post('/', createBudget);

// PUT /api/budgets/:id
router.put('/:id', updateBudget);

// DELETE /api/budgets/:id
router.delete('/:id', deleteBudget);

export default router;