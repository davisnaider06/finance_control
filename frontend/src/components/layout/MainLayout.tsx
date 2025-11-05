
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import styles from './MainLayout.module.css'; 
import { ThemeToggle } from '../ThemeToggle';

export const MainLayout = () => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.content}>
        <ThemeToggle />
        <Outlet /> 
      </main>
    </div>
  );
};