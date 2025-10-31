import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validateRequest';
import { categorySchema } from '../schemas/category';
import { 
  getCategories, 
  createCategory, 
  deleteCategory 
} from '../controllers/categoryController';

const router = Router();

router.use(authMiddleware);

/**
 * @route   GET /api/categories
 * @desc    Busca todas as categorias do usuário
 * @access  Private
 */
router.get('/', getCategories);

/**
 * @route   POST /api/categories
 * @desc    Cria uma nova categoria
 * @access  Private
 */
router.post('/', validateRequest(categorySchema), createCategory);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Deleta uma categoria
 * @access  Private
 */
router.delete('/:id', deleteCategory);

// (PUT para atualizar categorias pode ser adicionado aqui)

export default router;
