import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Sidebar.module.css';


export const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <Link to="/">Orçamento Fácil</Link>
      </div>

      <ul className={styles.navList}>
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? styles.activeLink : ''}>
            {/* Ícone */} Visão Geral
          </NavLink>
        </li>
        <li>
          <NavLink to="/transactions" className={({ isActive }) => isActive ? styles.activeLink : ''}>
            {/* Ícone */} Transações
          </NavLink>
        </li>
        {/* Adicionar mais links aqui (Contas, Orçamentos, etc) */}
      </ul>

      <div className={styles.sidebarFooter}>
        <div className={styles.userInfo}>
          {user?.name || 'Usuário'}
        </div>
        <button onClick={logout} className={styles.logoutButton}>
          Sair
        </button>
      </div>
    </nav>
  );
};