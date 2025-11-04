
import React, { createContext, useState, useContext, type ReactNode, useEffect } from 'react';
import api from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextData {
  user: User | null;     
  token: string | null;    
  isLoading: boolean;    
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}


const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); 
 
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
   
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setIsLoading(false); // Termina o carregamento inicial
  }, []);

const register = async (name: string, email: string, password: string) => {
    try {

      await api.post('/auth/register', { name, email, password });

    
    
      await login(email, password);
      
    } catch (error) {
      console.error('Falha no cadastro:', error);
      
      throw error;
    }
  };

  // Função de Login
  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      const { token: apiToken, user: apiUser } = response.data;

      // Salva no localStorage
      localStorage.setItem('authToken', apiToken);
      localStorage.setItem('authUser', JSON.stringify(apiUser));

      // Atualiza o estado global
      setToken(apiToken);
      setUser(apiUser);

      // Define o token no cabeçalho padrão do axios
      api.defaults.headers.common['Authorization'] = `Bearer ${apiToken}`;

    } catch (error) {
      console.error('Falha no login:', error);
      // Lança o erro para que o formulário de login possa tratá-lo (ex: mostrar "senha errada")
      throw error;
    }
  };

  // Função de Logout
  const logout = () => {
    // Limpa o localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');

    // Limpa o estado global
    setToken(null);
    setUser(null);

    // Remove o token do cabeçalho do axios
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, register}}>
      {children}
    </AuthContext.Provider>
  );
};

// 5. Cria o Hook customizado (useAuth)
// Isso é um atalho para não ter que importar 'useContext' e 'AuthContext' toda vez
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};