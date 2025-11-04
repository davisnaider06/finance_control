// Em: backend/src/routes/category.routes.ts

import { Router } from 'express';
import { createCategory, getCategories } from '../controllers/categoyController'
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Aplica o middleware de autenticação a todas as rotas de categoria
router.use(authMiddleware);

// POST /api/categories - Criar nova categoria
router.post('/', createCategory);

// GET /api/categories - Buscar todas as categorias do usuário
router.get('/', getCategories);

export default router;