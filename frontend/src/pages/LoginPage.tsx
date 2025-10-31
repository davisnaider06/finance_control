import React, { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AtSign, Lock } from 'lucide-react';

// Importando os componentes de UI que você definiu
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';

// Vamos assumir que você terá um hook de autenticação para gerenciar o estado
import { useAuth } from '../hooks/useAuth';

/**
 * Página de Login
 * * Renderiza o formulário de login, gerencia o estado do formulário,
 * lida com a submissão e feedback de erro/loading.
 */
export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth(); // Hook de autenticação (criaremos um placeholder)

  /**
   * Lida com a submissão do formulário de login.
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Chamar a API do seu backend
      // A rota '/api/auth/login' deve corresponder ao seu 'backend/src/routes/auth.ts'
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // 2. Verificar se a resposta foi bem-sucedida
      if (!response.ok) {
        // Assume que o backend retorna uma mensagem de erro em `data.message` ou `data.error`
        throw new Error(data.message || data.error || 'Falha ao fazer login');
      }

      // 3. Chamar a função de login do contexto de autenticação
      // Assumimos que 'login' armazena o token e atualiza o estado do usuário
      // O 'data.token' depende da resposta do seu backend
      await login(data.token); 

      // 4. Redirecionar para o dashboard
      navigate('/dashboard');

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 dark:bg-gray-950 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 space-y-6">
        {/* Cabeçalho */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Bem-vindo de Volta
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Acesse sua conta para continuar
          </p>
        </div>

        {/* Exibição de Erro */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo de Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10" // Adiciona padding para o ícone
              />
            </div>
          </div>

          {/* Campo de Senha */}
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10" // Adiciona padding para o ícone
              />
            </div>
          </div>

          {/* Botão de Envio */}
          <div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </div>
        </form>

        {/* Link para Registro */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Não tem uma conta?{' '}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
          >
            Registre-se
          </Link>
        </p>
      </div>
    </div>
  );
}

// Exportação padrão para 'lazy loading' se necessário
export default LoginPage;
