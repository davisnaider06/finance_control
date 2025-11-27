import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import styles from './MainLayout.module.css';

export const MainLayout = () => {

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location]);

  return (
    <div className={styles.layout}>
    
      <Sidebar 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)} 
      />

      {isMobileSidebarOpen && (
        <div 
          className={styles.sidebarOverlay} 
          onClick={() => setIsMobileSidebarOpen(false)} 
          aria-hidden="true"
        />
      )}

      <div className={styles.mainWrapper}>
        <Header onMenuClick={() => setIsMobileSidebarOpen(true)} />
        
        <main className={styles.content}>
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};