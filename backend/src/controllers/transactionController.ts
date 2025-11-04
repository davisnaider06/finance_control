// Em: backend/src/controllers/transactionController.ts

import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import pool from '../database/db';

// Criar uma nova transação (receita ou despesa)
export const createTransaction = async (req: AuthRequest, res: Response) => {
  const { account_id, category_id, amount, description, date } = req.body;
  const userId = req.userId;

  if (!account_id || !category_id || !amount || !date) {
    return res.status(400).json({ message: 'Conta, categoria, valor e data são obrigatórios.' });
  }

  try {
    const accountCheck = await pool.query(
      'SELECT user_id FROM accounts WHERE id = $1', [account_id]
    );
    if (accountCheck.rows.length === 0 || accountCheck.rows[0].user_id !== userId) {
      return res.status(403).json({ message: 'Acesso negado. A conta não pertence a este usuário.' });
    }


    const categoryCheck = await pool.query(
      'SELECT user_id FROM categories WHERE id = $1', [category_id]
    );
    if (categoryCheck.rows.length === 0 || categoryCheck.rows[0].user_id !== userId) {
      return res.status(403).json({ message: 'Acesso negado. A categoria não pertence a este usuário.' });
    }


    const newTransaction = await pool.query(
      'INSERT INTO transactions (user_id, account_id, category_id, amount, description, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userId, account_id, category_id, amount, description || null, date]
    );

    res.status(201).json(newTransaction.rows[0]);

  } catch (error) {
    console.error('Erro ao criar transação:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};


export const getTransactions = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;

  try {
    
    const transactions = await pool.query(
      `SELECT 
         t.*, 
         c.name as category_name, 
         c.type as category_type,
         a.name as account_name
       FROM transactions t
       JOIN categories c ON t.category_id = c.id
       JOIN accounts a ON t.account_id = a.id
       WHERE t.user_id = $1
       ORDER BY t.date DESC
       LIMIT 50`,
      [userId]
    );
    res.status(200).json(transactions.rows);
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};