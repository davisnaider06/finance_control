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


export const updateTransaction = async (req: AuthRequest, res: Response) => {
  const { id } = req.params; // ID da transação
  const { account_id, category_id, amount, description, date } = req.body;
  const userId = req.userId;

  if (!account_id || !category_id || !amount || !date) {
    return res.status(400).json({ message: 'Conta, categoria, valor e data são obrigatórios.' });
  }

  try {
    // --- Verificações de Segurança (MUITO IMPORTANTE) ---
    // 1. Checa se a CONTA (nova ou antiga) pertence ao usuário
    const accountCheck = await pool.query(
      'SELECT user_id FROM accounts WHERE id = $1 AND user_id = $2', 
      [account_id, userId]
    );
    if (accountCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Acesso negado. A conta não pertence a este usuário.' });
    }

    // 2. Checa se a CATEGORIA (nova ou antiga) pertence ao usuário
    const categoryCheck = await pool.query(
      'SELECT user_id FROM categories WHERE id = $1 AND user_id = $2', 
      [category_id, userId]
    );
    if (categoryCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Acesso negado. A categoria não pertence a este usuário.' });
    }

    // 3. Se tudo estiver OK, atualiza a transação
    const updatedTransaction = await pool.query(
      `UPDATE transactions 
       SET account_id = $1, category_id = $2, amount = $3, date = $4, description = $5 
       WHERE id = $6 AND user_id = $7 
       RETURNING *`,
      [account_id, category_id, amount, description || null, date, id, userId]
    );
    
    if (updatedTransaction.rows.length === 0) {
       // Isso acontece se o ID da transação não for encontrado ou não pertencer ao usuário
      return res.status(404).json({ message: 'Transação não encontrada.' });
    }

    res.status(200).json(updatedTransaction.rows[0]);

  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Excluir uma Transação
export const deleteTransaction = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const deletedTransaction = await pool.query(
      'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (deletedTransaction.rows.length === 0) {
      return res.status(404).json({ message: 'Transação não encontrada ou não pertence a este usuário.' });
    }

    res.status(200).json({ message: 'Transação excluída com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir transação:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};