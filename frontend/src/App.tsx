// Em: frontend/src/App.tsx

import { Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { PrivateRoute } from './components/PrivateRoutes';
import { MainLayout } from './components/layout/MainLayout';
import { TransactionsPage } from './pages/Transactions';
import { AccountsPage } from './pages/Accounts';
import { CategoriesPage } from './pages/Categories';

function App() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;