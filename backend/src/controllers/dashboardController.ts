// Em: backend/src/controllers/dashboardController.ts

import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import pool from '../database/db';

const GET_EXPENSE_BY_CATEGORY_QUERY = `
    SELECT 
        c.name as name, -- 'recharts' espera uma propriedade 'name'
        COALESCE(SUM(ABS(t.amount)), 0) as value -- 'recharts' espera 'value'
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = $1
      AND t.amount < 0 -- Apenas despesas
      AND t.date >= DATE_TRUNC('month', CURRENT_DATE)
      AND t.date < (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month')
    GROUP BY c.name
    HAVING COALESCE(SUM(ABS(t.amount)), 0) > 0 -- Não mostrar categorias com R$ 0,00
    ORDER BY value DESC;
`;

export const getExpenseByCategory = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  try {
    const result = await pool.query(GET_EXPENSE_BY_CATEGORY_QUERY, [userId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar despesas por categoria:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};


// Consulta para o Gráfico de Linha (Evolução do Saldo nos Últimos 30 dias)
const GET_BALANCE_EVOLUTION_QUERY = `
WITH 
Days AS (
    -- 1. Gerar os últimos 30 dias
    SELECT generate_series(
        CURRENT_DATE - INTERVAL '29 days', 
        CURRENT_DATE, 
        '1 day'
    )::date as date
),
DailyTransactions AS (
    -- 2. Somar transações por dia
    SELECT 
        date, 
        SUM(amount) as daily_total
    FROM transactions
    WHERE user_id = $1
      AND date >= (CURRENT_DATE - INTERVAL '29 days')
    GROUP BY date
),
InitialBalance AS (
    -- 3. Calcular o "saldo inicial" de 30 dias atrás
    SELECT 
        (SELECT COALESCE(SUM(initial_balance), 0) FROM accounts WHERE user_id = $1) +
        (SELECT COALESCE(SUM(amount), 0) FROM transactions 
         WHERE user_id = $1 AND date < (CURRENT_DATE - INTERVAL '29 days')) 
    as starting_balance
)
-- 4. Juntar tudo e calcular o saldo acumulado
SELECT 
    -- Formata a data para "dd/mm" (ex: '04/11') para o 'recharts'
    TO_CHAR(d.date, 'DD/MM') as name, -- 'recharts' espera 'name'
    (SELECT starting_balance FROM InitialBalance) + 
    COALESCE(SUM(dt.daily_total) OVER (ORDER BY d.date), 0) as balance
FROM Days d
LEFT JOIN DailyTransactions dt ON d.date = dt.date
ORDER BY d.date ASC;
`;

export const getBalanceEvolution = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  try {
    const result = await pool.query(GET_BALANCE_EVOLUTION_QUERY, [userId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar evolução do saldo:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};


// Esta é a consulta "mágica"
const GET_DASHBOARD_SUMMARY_QUERY = `
WITH M_Base AS (
    -- 1. Pega o saldo inicial de todas as contas
    SELECT COALESCE(SUM(initial_balance), 0) as total_initial_balance
    FROM accounts
    WHERE user_id = $1
),
T_Base AS (
    -- 2. Pega o total de receitas e despesas
    SELECT 
        COALESCE(SUM(CASE WHEN t.amount > 0 THEN t.amount ELSE 0 END), 0) as total_revenue,
        COALESCE(SUM(CASE WHEN t.amount < 0 THEN t.amount ELSE 0 END), 0) as total_expense
    FROM transactions t
    WHERE t.user_id = $1
),
T_CurrentMonth AS (
    -- 3. Pega receitas e despesas SÓ DO MÊS ATUAL
    SELECT 
        COALESCE(SUM(CASE WHEN t.amount > 0 THEN t.amount ELSE 0 END), 0) as revenue_this_month,
        COALESCE(SUM(CASE WHEN t.amount < 0 THEN t.amount ELSE 0 END), 0) as expense_this_month
    FROM transactions t
    WHERE t.user_id = $1 
      AND t.date >= DATE_TRUNC('month', CURRENT_DATE)
      AND t.date < (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month')
)
-- 4. Junta tudo
SELECT 
    (M_Base.total_initial_balance + T_Base.total_revenue + T_Base.total_expense) as current_balance,
    T_Base.total_revenue,
    T_Base.total_expense,
    T_CurrentMonth.revenue_this_month,
    T_CurrentMonth.expense_this_month
FROM M_Base, T_Base, T_CurrentMonth;
`;


export const getDashboardSummary = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;

  try {
    const summaryResult = await pool.query(GET_DASHBOARD_SUMMARY_QUERY, [userId]);
    
    // O resultado da query complexa estará na primeira linha
    const summaryData = summaryResult.rows[0];

    res.status(200).json(summaryData);

  } catch (error) {
    console.error('Erro ao buscar resumo do dashboard:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};