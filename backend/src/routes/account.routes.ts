// Em: backend/src/routes/account.routes.ts

import { Router } from 'express';
import { 
  createAccount, 
  getAccounts, 
  updateAccount, 
  deleteAccount 
} from '../controllers/accountController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();


router.use(authMiddleware);

// POST /api/accounts 
router.post('/', createAccount);

// GET /api/accounts 
router.get('/', getAccounts);

router.put('/:id', updateAccount);
router.delete('/:id', deleteAccount);

export default router;