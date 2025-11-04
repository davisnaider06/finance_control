// Em: frontend/src/App.tsx

import { Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { PrivateRoute } from './components/PrivateRoutes';
import { MainLayout } from './components/layout/MainLayout';

function App() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rotas Privadas
        1. O <PrivateRoute> checa se o usuário está logado.
        2. Se estiver, ele renderiza o <MainLayout>.
        3. O <MainLayout> renderiza a Sidebar e um <Outlet>.
        4. O React Router coloca as rotas filhas (Dashboard, etc) dentro do <Outlet>.
      */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          
          <Route path="/" element={<Dashboard />} />
          {/* (Quando criar a página de transações, ela irá aqui)
            <Route path="/transactions" element={<TransactionsPage />} /> 
          */}

        </Route>
      </Route>

    </Routes>
  );
}

export default App;