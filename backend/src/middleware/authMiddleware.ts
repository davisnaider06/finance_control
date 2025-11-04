

import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: number;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  // 1. Pegar o token do cabeçalho
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
  }

  // 2. O token vem no formato "Bearer [token]". Vamos separar.
  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer' || !parts[1]){
    return res.status(401).json({ message: 'Token em formato inválido.' });
  }

  const token = parts[1];

  // 3. Validar o token
  try {
    
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET não definido no .env');
    }

    const decoded = jwt.verify(token, jwtSecret);

    if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded) {
      
      const payload = decoded as JwtPayload & { userId: number };

      req.userId = payload.userId; 
      next(); 
    } else {
      throw new Error('Payload do token em formato inválido');
    }

  } catch (error) {
    if (error instanceof Error && error.message === 'JWT_SECRET não definido no .env') {
        console.error("ERRO GRAVE: JWT_SECRET não está configurado no arquivo .env.");
        return res.status(500).json({ message: 'Erro interno de configuração do servidor.' });
    }
    
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};