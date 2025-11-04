

import { Pool } from 'pg';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do .env
dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  // Configurações de SSL se o banco exigir (ex: Railway, Render)
  // ssl: {
  //   rejectUnauthorized: false
  // }
});

// Testa a conexão
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Erro ao conectar ao banco de dados:', err.stack);
  }
  console.log('Conexão com o PostgreSQL estabelecida com sucesso!');
 release();
});

export default pool;