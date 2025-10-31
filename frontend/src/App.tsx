import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage'; // (Criaremos a seguir)
import { DashboardPage } from './pages/DashboardPage'; // (Criaremos a seguir)
import { PrivateRoute } from './components/PrivateRoute'; // (Você já tem na estrutura)

function App() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rotas Privadas */}
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        } 
      />

      {/* Rota Padrão (redireciona para login ou dashboard) */}
      <Route 
        path="/"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;