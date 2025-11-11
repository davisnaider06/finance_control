import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}
// Objeto de configuração
const config: PoolConfig = {};

// 1. Verifica se estamos em produção (no Render)
if (process.env.DATABASE_URL) {
  // Estamos no Render, usamos a DATABASE_URL
  config.connectionString = process.env.DATABASE_URL;
  // Adiciona a configuração SSL necessária para Supabase/Render
  config.ssl = {
    rejectUnauthorized: false,
  };
} else {
  // Estamos em desenvolvimento local
  config.host = '127.0.0.1'; 
  config.port = Number(process.env.DB_PORT);
  config.user = process.env.DB_USER;
  config.password = process.env.DB_PASSWORD;
  config.database = process.env.DB_DATABASE;
}

// 2. Cria o Pool com a configuração correta
const pool = new Pool(config);

// Testa a conexão
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Erro ao conectar ao banco de dados:', err.stack);
  }
  console.log('Conexão com o PostgreSQL estabelecida com sucesso!');
  release();
});

export default pool;