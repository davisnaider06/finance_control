import React, { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

type PrivateRouteProps = {
  children: ReactNode;
};

/**
 * Componente de Rota Privada.
 * Verifica se o usuário está autenticado. Se estiver, renderiza os 'children'.
 * Se não, redireciona para a página de login, salvando a localização
 * atual para que o usuário possa ser redirecionado de volta após o login.
 */
export function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // 1. Se ainda estiver verificando a autenticação (loading inicial do AuthContext)
  //    Não renderiza nada ou mostra um spinner de tela cheia.
  //    Isto previne um "flash" da página de login antes da autenticação ser verificada.
  if (loading) {
    return (
       <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 dark:bg-gray-950">
         <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
       </div>
    );
  }

  // 2. Se a verificação terminou e o usuário não está autenticado
  if (!isAuthenticated) {
    // Redireciona para /login, guardando a rota que o usuário tentou acessar
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Se está autenticado, renderiza o componente filho (ex: DashboardPage)
  return <>{children}</>;
}

// Nota: Na sua estrutura de pastas, este arquivo estava em 'components/ui/'.
// Embora seja incomum (geralmente fica em 'components/'), estou seguindo
// a estrutura da imagem que você forneceu.
