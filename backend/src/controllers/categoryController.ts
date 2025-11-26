import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import pool from '../database/db';

// Criar uma nova categoria
export const createCategory = async (req: AuthRequest, res: Response) => {
  const { name, type, icon } = req.body;
  const userId = req.userId;

  if (!name || !type) {
    return res.status(400).json({ message: 'Nome e tipo são obrigatórios.' });
  }
  
  // <<< CORREÇÃO AQUI: Adicionamos 'savings' na validação
  if (type !== 'revenue' && type !== 'expense' && type !== 'savings') {
    return res.status(400).json({ message: "Tipo inválido. Deve ser 'revenue', 'expense' ou 'savings'." });
  }

  try {
    const newCategory = await pool.query(
      'INSERT INTO categories (user_id, name, type, icon) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, name, type, icon || null]
    );
    res.status(201).json(newCategory.rows[0]);
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Buscar todas as categorias do usuário
export const getCategories = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;

  try {
    const categories = await pool.query(
      'SELECT * FROM categories WHERE user_id = $1 ORDER BY type, name',
      [userId]
    );
    res.status(200).json(categories.rows);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Atualizar uma Categoria (Editar)
export const updateCategory = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, type, icon } = req.body;
  const userId = req.userId;

  if (!name || !type) {
    return res.status(400).json({ message: 'Nome e tipo são obrigatórios.' });
  }
  
  // <<< CORREÇÃO AQUI TAMBÉM: Adicionamos 'savings'
  if (type !== 'revenue' && type !== 'expense' && type !== 'savings') {
    return res.status(400).json({ message: "Tipo inválido. Deve ser 'revenue', 'expense' ou 'savings'." });
  }

  try {
    const updatedCategory = await pool.query(
      `UPDATE categories 
       SET name = $1, type = $2, icon = $3 
       WHERE id = $4 AND user_id = $5 
       RETURNING *`,
      [name, type, icon || null, id, userId]
    );

    if (updatedCategory.rows.length === 0) {
      return res.status(404).json({ message: 'Categoria não encontrada ou não pertence a este usuário.' });
    }

    res.status(200).json(updatedCategory.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Excluir uma Categoria
export const deleteCategory = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const deletedCategory = await pool.query(
      'DELETE FROM categories WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (deletedCategory.rows.length === 0) {
      return res.status(404).json({ message: 'Categoria não encontrada ou não pertence a este usuário.' });
    }

    res.status(200).json({ message: 'Categoria excluída com sucesso.' });
  } catch (error: any) {
    if (error.code === '23503') {
      return res.status(400).json({ 
        message: 'Não é possível excluir esta categoria, pois ela já está sendo usada em transações.' 
      });
    }
    console.error('Erro ao excluir categoria:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};