import { useLocation } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { ThemeToggle } from '../../ThemeToggle';
import styles from './Header.module.css';

const routeTitles: Record<string, string> = {
  '/': 'Visão Geral',
  '/transactions': 'Transações',
  '/accounts': 'Minhas Contas',
  '/categories': 'Minhas Categorias',
  '/budgets': 'Meus Orçamentos',
};

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const location = useLocation();
  const title = routeTitles[location.pathname] || 'Dashboard';

  return (
    <header className={styles.header}>
      <div className={styles.titleWrapper}>
        <button
          type="button"
          className={styles.menuButton}
          onClick={onMenuClick}
          aria-label="Abrir menu"
        >
          <FaBars />
        </button>
        
        <h1 className={styles.title}>{title}</h1>
      </div>

      <div className={styles.controls}>
        <ThemeToggle />
      </div>
    </header>
  );
};