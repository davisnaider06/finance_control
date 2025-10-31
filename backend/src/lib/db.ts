import { Pool } from 'pg';

// Configuração do Pool de Conexões
// O 'node-postgres' vai automaticamente ler as variáveis de ambiente
// (PGUSER, PGHOST, PGDATABASE, PGPASSWORD, PGPORT)
// ou você pode passar uma connectionString.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
  
  
});

pool.on('connect', () => {
  console.log('Cliente conectado ao banco de dados (PostgreSQL)');
});

pool.on('error', (err, client) => {
  console.error('Erro inesperado no cliente do pool', err);
  process.exit(-1);
});

// Exportamos uma função 'query' que usa o pool
// Isso nos permite fazer queries de forma centralizada
export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
};

// (Opcional) Teste de conexão
export const testDbConnection = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('Conexão com PostgreSQL bem-sucedida.');
  } catch (err) {
    console.error('Falha ao conectar com o PostgreSQL:', err);
  }
};

