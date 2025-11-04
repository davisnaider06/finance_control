// Em: frontend/src/components/PrivateRoute.tsx

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const PrivateRoute = () => {
  const { user, isLoading } = useAuth(); 


  if (isLoading) {
    return <div>Carregando...</div>; 
  }


  if (!user) {

    return <Navigate to="/login" replace />;
  }


  return <Outlet />;
};