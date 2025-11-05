// Em: frontend/src/contexts/ThemeContext.tsx

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextData {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

interface ThemeProviderProps {
  children: ReactNode;
}

// Função para pegar a preferência inicial
const getInitialTheme = (): Theme => {
  // 1. Tenta pegar do localStorage (escolha anterior do usuário)
  const storedTheme = localStorage.getItem('theme') as Theme | null;
  if (storedTheme) {
    return storedTheme;
  }
  
  // 2. Se não tiver, checa a preferência do Sistema Operacional
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  // 3. Se não, o padrão é 'light'
  return 'light';
};


export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Efeito que roda toda vez que o 'theme' MUDAR
  useEffect(() => {
    // 1. Salva a escolha no localStorage
    localStorage.setItem('theme', theme);
    
    // 2. Aplica o 'data-theme' no <body>
    // Isso é o que vai permitir o CSS mudar!
    document.body.setAttribute('data-theme', theme);

  }, [theme]);

  // Função para trocar o tema
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook customizado
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};