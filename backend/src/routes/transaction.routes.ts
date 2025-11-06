import { Router } from 'express';
import { 
  createTransaction, 
  getTransactions,
  updateTransaction,
  deleteTransaction
} from '../controllers/transactionController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

// POST /api/transactions
router.post('/', createTransaction);

// GET /api/transactions
router.get('/', getTransactions);

router.put('/:id', updateTransaction);

// DELETE /api/transactions/:id 
router.delete('/:id', deleteTransaction);

export default router;