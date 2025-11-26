import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Sidebar.module.css';
import { DynamicIcon } from '../DynamicIcon';


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
            <DynamicIcon name="FaChartPie" />
            <span>Visão Geral</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/transactions" className={({ isActive }) => isActive ? styles.activeLink : ''}>
            <DynamicIcon name="FaExchangeAlt" />
            <span>Transações</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/accounts" className={({ isActive }) => isActive ? styles.activeLink : ''}>
            <DynamicIcon name="FaLandmark" />
            <span>Contas</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/categories" className={({ isActive }) => isActive ? styles.activeLink : ''}>
            <DynamicIcon name="FaTags" />
            <span>Categorias</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/budgets" className={({ isActive }) => isActive ? styles.activeLink : ''}>
            <DynamicIcon name="FaPiggyBank" /> 
            <span>Orçamentos</span>
          </NavLink>
        </li>
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