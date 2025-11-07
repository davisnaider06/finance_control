
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import styles from './MainLayout.module.css'; 
import { Header } from './Header/Header'; 

export const MainLayout = () => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.mainWrapper}>
      <Header />
      <main className={styles.content}>
        
        <Outlet /> 
      </main>
      </div>
    </div>
  );
};