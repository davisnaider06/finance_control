
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import styles from './MainLayout.module.css'; 

export const MainLayout = () => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.content}>
        {/* O conteúdo da rota (Dashboard, Transações) será injetado aqui */}
        <Outlet /> 
      </main>
    </div>
  );
};