import { Pool } from 'pg';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  }
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err.stack);
    return;
  }
  console.log('✅ Conectado ao PostgreSQL com sucesso!');
  release();
});

export default pool;
