import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../lib/db'; // Nosso pool 'pg'
import { z } from 'zod';
import { registerSchema, loginSchema } from '../schemas/auth'; // Os schemas Zod
import crypto from 'crypto'; // Para gerar UUIDs

// Chave secreta do JWT (Mover para .env!)
const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-muito-segura';

/**
 * Controller para REGISTRAR um novo usuário
 */
export const registerUser = async (req: Request, res: Response) => {
  try {
    // A validação Zod já foi feita pelo middleware
    const { name, email, password } = req.body as z.infer<typeof registerSchema>['body'];

    // 1. Verificar se o usuário já existe
    const existingUserQuery = 'SELECT * FROM "User" WHERE email = $1';
    const existingUserResult = await db.query(existingUserQuery, [email]);

    if (existingUserResult.rows.length > 0) {
      return res.status(400).json({ message: 'Usuário com este email já existe' });
    }

    // 2. Criptografar a senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Criar o usuário no banco
    const insertUserQuery = `
      INSERT INTO "User" (id, name, email, "password", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING id, name, email
    `;
    
    // Gerar um UUID para o novo usuário
    const userId = crypto.randomUUID(); 
    
    const newUserResult = await db.query(insertUserQuery, [
      userId,
      name,
      email,
      hashedPassword,
    ]);
    const user = newUserResult.rows[0];

    // 4. Retornar sucesso
    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      user,
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

/**
 * Controller para LOGAR um usuário
 */
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as z.infer<typeof loginSchema>['body'];

    // 1. Encontrar o usuário
    const findUserQuery = 'SELECT * FROM "User" WHERE email = $1';
    const userResult = await db.query(findUserQuery, [email]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }
    const user = userResult.rows[0];

    // 2. Verificar a senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    // 3. Criar o Payload do JWT (note que os nomes das colunas podem ser minúsculos)
    const payload = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };

    // 4. Gerar e retornar o token
    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '7d' }, // Token expira em 7 dias
      (err, token) => {
        if (err) throw err;
        res.json({
          message: 'Login bem-sucedido',
          token,
        });
      }
    );

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

/**
 * Controller para OBTER O PERFIL do usuário logado
 * (Usado pelo AuthContext do frontend)
 */
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    // O 'req.user' foi adicionado pelo 'authMiddleware'
    // @ts-ignore (pois estamos adicionando 'user' ao Request)
    if (!req.user || !req.user.id) {
       return res.status(401).json({ message: 'Não autorizado' });
    }
    
    // @ts-ignore
    const userId = req.user.id;

    // Buscar o usuário no banco (sem a senha)
    const findUserQuery = 'SELECT id, name, email, "createdAt" FROM "User" WHERE id = $1';
    const userResult = await db.query(findUserQuery, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json(userResult.rows[0]);

  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

