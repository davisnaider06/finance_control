import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Sidebar.module.css';
import { DynamicIcon } from '../DynamicIcon';
// 1. Importe o ícone de fechar
import { FaTimes } from 'react-icons/fa';

// 2. Defina a interface para as novas props
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// 3. Receba as props no componente
export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user, logout } = useAuth();

  return (
    // 4. Adicione a classe 'open' dinamicamente com base na prop 'isOpen'
    <nav className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.sidebarHeader}>
        <Link to="/" onClick={onClose}>Orçamento Fácil</Link>
        {/* 5. Botão de fechar (só aparece no mobile) */}
        <button 
          className={styles.closeButton} 
          onClick={onClose}
          aria-label="Fechar menu"
        >
          <FaTimes />
        </button>
      </div>

      <ul className={styles.navList}>
        {/* Adicionamos onClick={onClose} para fechar o menu ao clicar em um link no mobile */}
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? styles.activeLink : ''} onClick={onClose}>
            <DynamicIcon name="FaChartPie" />
            <span>Visão Geral</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/transactions" className={({ isActive }) => isActive ? styles.activeLink : ''} onClick={onClose}>
            <DynamicIcon name="FaExchangeAlt" />
            <span>Transações</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/accounts" className={({ isActive }) => isActive ? styles.activeLink : ''} onClick={onClose}>
            <DynamicIcon name="FaLandmark" />
            <span>Contas</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/categories" className={({ isActive }) => isActive ? styles.activeLink : ''} onClick={onClose}>
            <DynamicIcon name="FaTags" />
            <span>Categorias</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/budgets" className={({ isActive }) => isActive ? styles.activeLink : ''} onClick={onClose}>
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