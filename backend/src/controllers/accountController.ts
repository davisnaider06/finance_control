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

export const updateAccount = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, type, initial_balance } = req.body;
  const userId = req.userId;

  if (!name || !type || initial_balance === undefined) {
    return res.status(400).json({ message: 'Campos nome, tipo e saldo inicial são obrigatórios.' });
  }

  try {
    const updatedAccount = await pool.query(
      `UPDATE accounts 
       SET name = $1, type = $2, initial_balance = $3 
       WHERE id = $4 AND user_id = $5 
       RETURNING *`,
      [name, type, initial_balance, id, userId]
    );

    if (updatedAccount.rows.length === 0) {
      return res.status(404).json({ message: 'Conta não encontrada ou não pertence a este usuário.' });
    }

    res.status(200).json(updatedAccount.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar conta:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const deleteAccount = async (req: AuthRequest, res: Response) => {
  const { id } = req.params; 
  const userId = req.userId;

  try {
    const deletedAccount = await pool.query(
      'DELETE FROM accounts WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (deletedAccount.rows.length === 0) {
      return res.status(404).json({ message: 'Conta não encontrada ou não pertence a este usuário.' });
    }

    res.status(200).json({ message: 'Conta excluída com sucesso.', deletedAccount: deletedAccount.rows[0] });
  } catch (error) {
    console.error('Erro ao excluir conta:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};