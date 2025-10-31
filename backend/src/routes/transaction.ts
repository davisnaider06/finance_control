import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validateRequest';
import { createTransactionSchema, updateTransactionSchema } from '../schemas/transaction';
import { 
  getTransactions, 
  createTransaction, 
  deleteTransaction, 
  updateTransaction,
  getTransactionById 
} from '../controllers/trasactionController';

const router = Router();

// Todas as rotas de transações são protegidas
router.use(authMiddleware);

/**
 * @route   GET /api/transactions
 * @desc    Busca todas as transações do usuário logado
 * @access  Private
 */
router.get('/', getTransactions);

/**
 * @route   GET /api/transactions/:id
 * @desc    Busca uma transação específica
 * @access  Private
 */
router.get('/:id', getTransactionById);

/**
 * @route   POST /api/transactions
 * @desc    Cria uma nova transação
 * @access  Private
 */
router.post('/', validateRequest(createTransactionSchema), createTransaction);

/**
 * @route   PUT /api/transactions/:id
 * @desc    Atualiza uma transação
 * @access  Private
 */
router.put('/:id', validateRequest(updateTransactionSchema), updateTransaction);

/**
 * @route   DELETE /api/transactions/:id
 * @desc    Deleta uma transação
 * @access  Private
 */
router.delete('/:id', deleteTransaction);


export default router;
