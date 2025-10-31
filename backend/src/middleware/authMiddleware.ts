import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-muito-segura';

/**
 * Middleware para verificar o token JWT.
 * Se o token for válido, adiciona o payload do usuário ao objeto `req`.
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // 1. Obter o token do header 'Authorization'
  const authHeader = req.header('Authorization');

  // 2. Verificar se o token existe
  if (!authHeader) {
    return res.status(401).json({ message: 'Token não fornecido, autorização negada' });
  }

  // 3. Verificar o formato 'Bearer <token>'
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
     return res.status(401).json({ message: 'Token mal formatado' });
  }
  
  const token = parts[1];

  try {
    // 4. Verificar e decodificar o token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 5. Adicionar o payload do usuário (que definimos como { user: { ... } }) ao request
    // @ts-ignore (Vamos estender o tipo Request do Express em 'types/index.ts' depois)
    req.user = (decoded as any).user;
    
    next(); // Passa para o próximo middleware ou controller

  } catch (err) {
    res.status(401).json({ message: 'Token inválido' });
  }
};
