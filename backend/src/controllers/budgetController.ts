import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import pool from '../database/db';

// Buscar todos os orçamentos do usuário
export const getBudgets = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;

  try {
    // Vamos buscar os orçamentos e JÁ ADICIONAR o nome da categoria
    const budgets = await pool.query(
      `SELECT 
         b.*, 
         c.name as category_name,
         c.icon as category_icon
       FROM budgets b
       JOIN categories c ON b.category_id = c.id
       WHERE b.user_id = $1
       ORDER BY b.month_date DESC, c.name ASC`,
      [userId]
    );
    res.status(200).json(budgets.rows);
  } catch (error) {
    console.error('Erro ao buscar orçamentos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Criar um novo orçamento
export const createBudget = async (req: AuthRequest, res: Response) => {
  const { category_id, amount, month_date } = req.body;
  const userId = req.userId;

  if (!category_id || !amount || !month_date) {
    return res.status(400).json({ message: 'Categoria, valor e mês são obrigatórios.' });
  }

  try {
    const newBudget = await pool.query(
      'INSERT INTO budgets (user_id, category_id, amount, month_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, category_id, amount, month_date]
    );
    res.status(201).json(newBudget.rows[0]);
  } catch (error: any) {
    // Erro 23505 é 'unique violation' (violação da constraint UNIQUE)
    if (error.code === '23505') {
      return res.status(400).json({ 
        message: 'Já existe um orçamento para esta categoria neste mês.' 
      });
    }
    console.error('Erro ao criar orçamento:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Atualizar um orçamento
export const updateBudget = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { category_id, amount, month_date } = req.body;
  const userId = req.userId;

  try {
    const updatedBudget = await pool.query(
      'UPDATE budgets SET category_id = $1, amount = $2, month_date = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
      [category_id, amount, month_date, id, userId]
    );
    if (updatedBudget.rows.length === 0) {
      return res.status(404).json({ message: 'Orçamento não encontrado.' });
    }
    res.status(200).json(updatedBudget.rows[0]);
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Já existe um orçamento para esta categoria neste mês.' });
    }
    console.error('Erro ao atualizar orçamento:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Excluir um orçamento
export const deleteBudget = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const deletedBudget = await pool.query(
      'DELETE FROM budgets WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );
    if (deletedBudget.rows.length === 0) {
      return res.status(404).json({ message: 'Orçamento não encontrado.' });
    }
    res.status(200).json({ message: 'Orçamento excluído com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir orçamento:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};