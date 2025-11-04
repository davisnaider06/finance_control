// Em: frontend/src/pages/Login/index.tsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Login.module.css'; // Vamos criar este arquivo de CSS

export function Login() {
  // 1. Estados para controlar os campos do formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // Estado para mensagens de erro

  // 2. Hooks que vamos usar
  const navigate = useNavigate(); // Para redirecionar o usuário
  const { login } = useAuth();    // Nossa função de login do Contexto

  // 3. Função chamada ao enviar o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Impede o recarregamento da página
    setError(null);     // Limpa erros anteriores

    try {
      // 4. Tenta fazer o login
      await login(email, password);
      
      // 5. Se der certo, navega para o Dashboard
      navigate('/'); 
      
    } catch (err) {
      // 6. Se o 'login()' lançar um erro (ex: 401 Credenciais Inválidas)
      console.error(err);
      setError('E-mail ou senha inválidos. Tente novamente.');
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginFormContainer}>
        <form onSubmit={handleSubmit}>
          <h2>Entrar no Orçamento Fácil</h2>
          
          {/* Mostra o erro, se houver */}
          {error && <p className={styles.errorMessage}>{error}</p>}

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
            Entrar
          </button>
        </form>
        
        <p className={styles.registerLink}>
          Não tem uma conta? <Link to="/register">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}