import { Request, Response } from 'express';
import { db } from '../lib/db';
import { z } from 'zod';
import { categorySchema } from '../schemas/category';
import crypto from 'crypto';

// @ts-ignore - Adiciona 'user' ao Request
const getUserId = (req: Request): string => req.user.id;

/**
 * GET /api/categories
 * Busca todas as categorias do usuário
 */
export const getCategories = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  try {
    const query = 'SELECT * FROM "Category" WHERE "userId" = $1 ORDER BY name ASC';
    const result = await db.query(query, [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

/**
 * POST /api/categories
 * Cria uma nova categoria
 */
export const createCategory = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  try {
    const { name } = req.body as z.infer<typeof categorySchema>['body'];

    // Verificar se a categoria já existe (UNIQUE constraint cuida disso, mas é bom checar)
    const checkQuery = 'SELECT * FROM "Category" WHERE name = $1 AND "userId" = $2';
    const checkResult = await db.query(checkQuery, [name, userId]);
    if (checkResult.rows.length > 0) {
      return res.status(400).json({ message: 'Categoria com este nome já existe' });
    }

    const categoryId = crypto.randomUUID();
    const query = `
      INSERT INTO "Category" (id, name, "userId")
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const newCategory = await db.query(query, [categoryId, name, userId]);
    res.status(201).json(newCategory.rows[0]);
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    // Checar erro de constraint UNIQUE
    // @ts-ignore
    if (error.code === '23505') { 
      return res.status(400).json({ message: 'Categoria com este nome já existe' });
    }
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

/**
 * DELETE /api/categories/:id
 * Deleta uma categoria
 */
export const deleteCategory = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { id } = req.params;
  try {
    // IMPORTANTE: O que fazer com transações que usam esta categoria?
    // O SQL (ON DELETE) define o comportamento. 
    // Se for ON DELETE CASCADE, as transações serão deletadas.
    // Se for ON DELETE SET NULL, o categoryId ficará nulo.
    // Se for ON DELETE RESTRICT (padrão), dará erro se houver transações.
    
    // Assumindo que queremos RESTRICT (não deixar deletar se estiver em uso)
    const checkUsageQuery = 'SELECT id FROM "Transaction" WHERE "categoryId" = $1 AND "userId" = $2 LIMIT 1';
    const usageResult = await db.query(checkUsageQuery, [id, userId]);
    if (usageResult.rows.length > 0) {
      return res.status(400).json({ message: 'Categoria está em uso e não pode ser deletada' });
    }

    // Se não estiver em uso, deleta
    const deleteQuery = 'DELETE FROM "Category" WHERE id = $1 AND "userId" = $2 RETURNING id';
    const result = await db.query(deleteQuery, [id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    res.status(200).json({ message: 'Categoria deletada com sucesso', id });
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};
