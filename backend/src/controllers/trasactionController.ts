import { Request, Response } from 'express';
import { db } from '../lib/db';
import { z } from 'zod';
import { createTransactionSchema, updateTransactionSchema } from '../schemas/transaction';
import crypto from 'crypto';

// @ts-ignore - Adiciona 'user' ao Request
const getUserId = (req: Request): string => req.user.id;

/**
 * GET /api/transactions
 * Busca todas as transações (com join de categoria)
 */
export const getTransactions = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  try {
    const query = `
      SELECT 
        t.id, 
        t.description, 
        t.amount, 
        t.type, 
        t.date, 
        c.id as "categoryId",
        c.name as "categoryName"
      FROM "Transaction" t
      LEFT JOIN "Category" c ON t."categoryId" = c.id
      WHERE t."userId" = $1
      ORDER BY t.date DESC
    `;
    const result = await db.query(query, [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

/**
 * GET /api/transactions/:id
 * Busca uma transação específica
 */
export const getTransactionById = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { id } = req.params;
  try {
    const query = 'SELECT * FROM "Transaction" WHERE id = $1 AND "userId" = $2';
    const result = await db.query(query, [id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Transação não encontrada' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar transação:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

/**
 * POST /api/transactions
 * Cria uma nova transação
 */
export const createTransaction = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  try {
    const { description, amount, type, date, categoryId } = 
      req.body as z.infer<typeof createTransactionSchema>['body'];

    const transactionId = crypto.randomUUID();
    const query = `
      INSERT INTO "Transaction" (id, description, amount, type, date, "userId", "categoryId", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING *
    `;
    
    const newTransaction = await db.query(query, [
      transactionId,
      description,
      amount,
      type,
      date ? new Date(date) : new Date(),
      userId,
      categoryId
    ]);

    res.status(201).json(newTransaction.rows[0]);
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

/**
 * PUT /api/transactions/:id
 * Atualiza uma transação
 */
export const updateTransaction = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { id } = req.params;
  try {
    const { description, amount, type, date, categoryId } = 
      req.body as z.infer<typeof updateTransactionSchema>['body'];

    // Verificar se a transação pertence ao usuário
    const checkQuery = 'SELECT * FROM "Transaction" WHERE id = $1 AND "userId" = $2';
    const checkResult = await db.query(checkQuery, [id, userId]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Transação não encontrada ou não autorizada' });
    }

    // Construir a query de atualização dinamicamente
    const fields: any[] = [];
    const values: any[] = [];
    let fieldIndex = 1;

    if (description) { fields.push(`description = $${fieldIndex++}`); values.push(description); }
    if (amount) { fields.push(`amount = $${fieldIndex++}`); values.push(amount); }
    if (type) { fields.push(`type = $${fieldIndex++}`); values.push(type); }
    if (date) { fields.push(`date = $${fieldIndex++}`); values.push(new Date(date)); }
    if (categoryId) { fields.push(`"categoryId" = $${fieldIndex++}`); values.push(categoryId); }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'Nenhum campo para atualizar' });
    }

    fields.push(`"updatedAt" = NOW()`);
    
    values.push(id); // $ (último) para o WHERE id
    values.push(userId); // $ (penúltimo) para o WHERE userId

    const updateQuery = `
      UPDATE "Transaction"
      SET ${fields.join(', ')}
      WHERE id = $${fieldIndex++} AND "userId" = $${fieldIndex++}
      RETURNING *
    `;
    
    const updatedResult = await db.query(updateQuery, values);
    res.json(updatedResult.rows[0]);

  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};


/**
 * DELETE /api/transactions/:id
 * Deleta uma transação
 */
export const deleteTransaction = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { id } = req.params;
  try {
    const deleteQuery = 'DELETE FROM "Transaction" WHERE id = $1 AND "userId" = $2 RETURNING id';
    const result = await db.query(deleteQuery, [id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Transação não encontrada ou não autorizada' });
    }

    res.status(200).json({ message: 'Transação deletada com sucesso', id });
  } catch (error) {
    console.error('Erro ao deletar transação:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};
