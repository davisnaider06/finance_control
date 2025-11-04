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
  if (type !== 'revenue' && type !== 'expense') {
    return res.status(400).json({ message: "Tipo deve ser 'revenue' (receita) ou 'expense' (despesa)." });
  }

  try {
    const newCategory = await pool.query(
      'INSERT INTO categories (user_id, name, type, icon) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, name, type, icon || null] // Usa 'icon' se for enviado, senão null
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
    // Busca separando por tipo, o que facilita o front
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

// export const updateCategory = async (req: AuthRequest, res: Response) => { ... }
// export const deleteCategory = async (req: AuthRequest, res: Response) => { ... }