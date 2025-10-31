import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import transactionRoutes from './routes/transactions'; // (Arquivo que você já tem)
import categoryRoutes from './routes/categories'; // (Arquivo que você já tem)

// Carrega variáveis de ambiente (necessário 'dotenv')
// import * as dotenv from 'dotenv';
// dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors()); // Habilita CORS
app.use(express.json()); // Parser para JSON

// --- Rotas da API ---
// Prefixo '/api' para todas as rotas
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);

// Rota de "saúde"
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
});
