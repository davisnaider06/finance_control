import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom'; 
import { Sidebar } from './Sidebar';
import styles from './MainLayout.module.css'; 
import { Header } from './Header/Header'; 

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
        {isSidebarOpen && (
          <div 
            className={styles.sidebarOverlay} 
            onClick={closeSidebar}
            // Adicione um estilo para este overlay no MainLayout.module.css
            // (position: fixed; top: 0; left: 0; width: 100%; height: 100%; bg: rgba(0,0,0,0.5); z-index: 950;)
          />
        )}
      </div>
    </div>
  );
};