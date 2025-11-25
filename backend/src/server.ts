import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './database/db';
import authRoutes from './routes/auth.routes'
import accountRoutes from './routes/account.routes';
import categoryRoutes from './routes/category.routes';
import transactionRoutes from './routes/transaction.routes';
import dashboardRoutes from './routes/dashboard.routes';
import budgetRoutes from './routes/budget.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; 

const corsOptions = {
  origin: [
    'https://financy.netlify.app', 
    process.env.CORS_ORIGIN_URL || 'http://localhost:5173',
    'http://localhost:5173'
  ].filter(Boolean),
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions)); 

app.use(express.json());


// Rota de teste
app.get('/api/test', async (req: Request, res: Response) => {
  try {
  
    const result = await pool.query('SELECT NOW()'); 
    res.status(200).json({
      message: 'API está funcionando!',
      database_time: result.rows[0].now,
    });
  } catch (error) {
    console.error('Erro na rota de teste:', error);
    res.status(500).json({ message: 'Erro ao conectar ao banco de dados' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/budgets', budgetRoutes);

app.listen(PORT, () => {
  console.log(`Servidor backend rodando em http://localhost:${PORT}`);
});