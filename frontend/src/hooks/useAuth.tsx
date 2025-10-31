import { useContext } from 'react';
// Importaremos o AuthContext que criaremos a seguir
// CORREÇÃO: Alterando caminho relativo para alias de caminho (@/)
import { AuthContext, type AuthContextType } from '../contexts/AuthContext';

/**
 * Hook customizado para facilitar o acesso ao AuthContext.
 * Lança um erro se for usado fora de um AuthProvider.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

