import { Router } from 'express';
// MUDANÇA: Remover a importação do 'express-validator' que não estamos usando
// import { body } from 'express-validator';
import { registerUser, loginUser, getUserProfile } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validateRequest';
import { registerSchema, loginSchema } from '../schemas/auth'; // Os schemas Zod

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Registra um novo usuário
 * @access  Public
 */
router.post('/register', validateRequest(registerSchema), registerUser);

/**
 * @route   POST /api/auth/login
 * @desc    Autentica o usuário e obtém o token
 * @access  Public
 */
router.post('/login', validateRequest(loginSchema), loginUser);

/**
 * @route   GET /api/auth/me
 * @desc    Obtém o perfil do usuário logado
 * @access  Private
 */
router.get('/me', authMiddleware, getUserProfile);


export default router;

