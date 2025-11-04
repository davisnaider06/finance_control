// Em: backend/src/routes/auth.routes.ts

import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController';

const router = Router();

// Rota de Cadastro
// POST /api/auth/register
router.post('/register', registerUser);

// Rota de Login
// POST /api/auth/login
router.post('/login', loginUser);

export default router;