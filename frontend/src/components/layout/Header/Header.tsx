// Este componente é inteligente: ele descobre o título da página
// sozinho, lendo a URL do navegador.

import { useLocation } from 'react-router-dom';
import { ThemeToggle } from '../../ThemeToggle';
import styles from './Header.module.css';

// Mapeia os caminhos da URL para os títulos
const routeTitles: Record<string, string> = {
  '/': 'Visão Geral',
  '/transactions': 'Transações',
  '/accounts': 'Minhas Contas',
  '/categories': 'Minhas Categorias',
  '/budgets': 'Meus Orçamentos',
};

export const Header = () => {
  const location = useLocation(); // Pega a localização atual (ex: /transactions)
  
  // Encontra o título correspondente, ou usa "Dashboard" como padrão
  const title = routeTitles[location.pathname] || 'Dashboard';

  return (
    <header className={styles.header}>
      {/* 1. O Título da Página (dinâmico) */}
      <h1 className={styles.title}>{title}</h1>

      {/* 2. O Toggle de Tema */}
      <div className={styles.controls}>
        <ThemeToggle />
        {/* (No futuro, poderíamos adicionar um ícone de 'notificações' ou 'usuário' aqui) */}
      </div>
    </header>
  );
};