import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../database/db';

// Função de Cadastro
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Por favor, preencha todos os campos.' });
  }

  try {
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Este e-mail já está em uso.' });
    }


    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Salvar o usuário no banco
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, passwordHash]
    );
    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao tentar cadastrar.' });
  }
};


export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Por favor, forneça e-mail e senha.' });
  }

  try {

    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);


    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const user = userResult.rows[0];


    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }


    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET não definido no .env');
    }

    
    const token = jwt.sign(
      { userId: user.id }, 
      jwtSecret,            
      { expiresIn: '1d' }
    );


    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao tentar fazer login.' });
  }
}
