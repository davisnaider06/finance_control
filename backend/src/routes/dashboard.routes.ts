import { Router } from 'express';
import { 
  getDashboardSummary, 
  getExpenseByCategory, 
  getBalanceEvolution 
} from '../controllers/dashboardController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
router.use(authMiddleware);

// GET /api/dashboard/summary
router.get('/summary', getDashboardSummary);

// GET /api/dashboard/expense-by-category
router.get('/expense-by-category', getExpenseByCategory);

// GET /api/dashboard/balance-evolution
router.get('/balance-evolution', getBalanceEvolution);

export default router;