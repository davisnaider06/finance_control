// Em: backend/src/routes/category.routes.ts

import { Router } from 'express';
import { 
  createCategory, 
  getCategories,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

// POST /api/categories 
router.post('/', createCategory);

// GET /api/categories 
router.get('/', getCategories);

// PUT /api/categories/:id 
router.put('/:id', updateCategory);

// DELETE /api/categories/:id
router.delete('/:id', deleteCategory);

export default router;