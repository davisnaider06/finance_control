import { useTheme } from '../../contexts/ThemeContext';
import styles from './ThemeToggle.module.css';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    
    <label className={styles.toggleContainer}>
      <span className={styles.toggleLabel}>Modo Escuro</span>
      <div className={styles.switch}>
        <input 
          type="checkbox" 
          checked={theme === 'dark'} 
          onChange={toggleTheme}     
        />
        <span className={styles.slider}></span> 
      </div>
    </label>
  );
};