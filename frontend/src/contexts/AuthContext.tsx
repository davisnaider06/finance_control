import React, { createContext, useState, useEffect, type ReactNode } from 'react';

// Definindo os tipos para o contexto
// Em um app real, o 'user' seria um objeto mais complexo
type User = {
  id: string;
  email: string;
  name: string;
};

export type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

// Criando o contexto com um valor padrão 'undefined'
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

/**
 * Provedor de Autenticação.
 * Gerencia o estado de autenticação (token, usuário) e o armazena
 * no localStorage para persistência.
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    // Tenta pegar o token do localStorage ao iniciar
    return localStorage.getItem('authToken');
  });
  const [loading, setLoading] = useState(true); // Loading inicial para verificar o token

  // Efeito para verificar o token e buscar dados do usuário ao carregar
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          // Se tiver um token, tentamos buscar os dados do usuário
          // Esta rota '/api/auth/me' ou '/api/auth/profile' deve existir no seu backend
          // e validar o token para retornar os dados do usuário.
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData: User = await response.json();
            setUser(userData);
          } else {
            // Token inválido ou expirado
            throw new Error('Token inválido');
          }
        } catch (error) {
          console.error("Falha ao verificar token:", error);
          // Limpa o estado se a verificação falhar
          setToken(null);
          setUser(null);
          localStorage.removeItem('authToken');
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  /**
   * Função de Login: Armazena o token e busca os dados do usuário.
   */
  const login = async (newToken: string) => {
    setLoading(true);
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    
    // O ideal é que a função de login já busque os dados do usuário
    // ou que o useEffect acima cuide disso.
    // Vamos re-executar a lógica de verificação (que agora usará o novo token)
    try {
      const response = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${newToken}` },
      });
      if (response.ok) {
        const userData: User = await response.json();
        setUser(userData);
      } else {
        throw new Error('Não foi possível buscar dados do usuário após o login');
      }
    } catch (error) {
      console.error(error);
      // Mesmo se falhar em buscar o usuário, o token está salvo.
      // O useEffect pode tentar de novo.
    } finally {
      setLoading(false);
    }
  };

  /**
   * Função de Logout: Limpa o estado e o localStorage.
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
  };

  const value = {
    isAuthenticated: !!token && !!user,
    user,
    token,
    login,
    logout,
    loading, // Exporta o estado de loading para exibir spinners
  };

  // Não renderiza os filhos até que a verificação inicial do token esteja completa
  // Em um app real, você pode mostrar um spinner de tela cheia aqui
  if (loading) {
     return (
       <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 dark:bg-gray-950">
         {/* Você pode substituir isso por um componente de Spinner global */}
         <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
       </div>
     );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
