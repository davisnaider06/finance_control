// Em: frontend/src/pages/Register/index.tsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
// Vamos reutilizar os mesmos estilos da página de login!
import styles from '../Login/Login.module.css';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { register } = useAuth(); // Puxamos a nova função 'register'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await register(name, email, password);
      
      // Se o 'register' (e o 'login' automático) der certo, vai para o Dashboard
      navigate('/'); 
      
    } catch (err: any) { // 'any' para acessar 'response'
      console.error(err);
      // Verifica se é um erro da API (ex: e-mail já existe)
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Falha ao tentar cadastrar. Tente novamente.');
      }
    }
  };

  return (
    // Reutilizamos as classes CSS da tela de Login
    <div className={styles.loginPage}> 
      <div className={styles.loginFormContainer}>
        <form onSubmit={handleSubmit}>
          <h2>Criar sua conta</h2>
          
          {error && <p className={styles.errorMessage}>{error}</p>}

          <div className={styles.formGroup}>
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className={styles.loginButton}>
            Cadastrar
          </button>
        </form>
        
        <p className={styles.registerLink}>
          Já tem uma conta? <Link to="/login">Faça login</Link>
        </p>
      </div>
    </div>
  );
}