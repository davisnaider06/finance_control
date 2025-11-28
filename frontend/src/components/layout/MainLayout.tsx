import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header/Header';
import styles from './MainLayout.module.css';

export const MainLayout = () => {
const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);


  return (
    <div className={styles.layout}>
     <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      

      <div className={styles.mainWrapper}>
        <Header onMenuClick={openSidebar} />
        <main className={styles.content}>
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};