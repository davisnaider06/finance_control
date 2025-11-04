import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import pool from '../database/db';


export const createAccount = async (req: AuthRequest, res: Response) => {
  const { name, type, initial_balance } = req.body;
  const userId = req.userId; 

  if (!name || !type || initial_balance === undefined) {
    return res.status(400).json({ message: 'Campos nome, tipo e saldo inicial são obrigatórios.' });
  }

  try {
    const newAccount = await pool.query(
      'INSERT INTO accounts (user_id, name, type, initial_balance) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, name, type, initial_balance]
    );

    res.status(201).json(newAccount.rows[0]);
  } catch (error) {
    console.error('Erro ao criar conta:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Buscar todas as contas do usuário logado
export const getAccounts = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;

  try {
    const accounts = await pool.query(
      'SELECT * FROM accounts WHERE user_id = $1 ORDER BY name',
      [userId]
    );

    res.status(200).json(accounts.rows);
  } catch (error) {
    console.error('Erro ao buscar contas:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};