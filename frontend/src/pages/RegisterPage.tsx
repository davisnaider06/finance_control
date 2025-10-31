import React, { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AtSign, Lock, User } from 'lucide-react';

// Usando os aliases de caminho que corrigimos
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { useAuth } from '../hooks/useAuth';

/**
 * Página de Registro
 * Renderiza o formulário de registro, gerencia o estado,
 * lida com a submissão e feedback de erro/loading.
 */
export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth(); // Usamos o login para autenticar após o registro

  /**
   * Lida com a submissão do formulário de registro.
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validação básica
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    try {
      // 1. Chamar a API do seu backend
      // A rota '/api/auth/register' deve corresponder ao seu 'backend/src/routes/auth.ts'
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      // 2. Verificar se a resposta foi bem-sucedida
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Falha ao registrar');
      }

      // 3. (Opcional) Fazer login automático após o registro
      // Assumindo que o backend retorna o token ao registrar
      if (data.token) {
        await login(data.token);
        navigate('/dashboard'); // Redireciona para o dashboard
      } else {
        // Ou redireciona para o login para o usuário entrar
        navigate('/login');
      }

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
            Crie sua Conta
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Comece a organizar suas finanças
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
          {/* Campo de Nome */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="pl-10"
              />
            </div>
          </div>
          
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
                className="pl-10"
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
                className="pl-10"
              />
            </div>
          </div>

          {/* Campo de Confirmar Senha */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="pl-10"
              />
            </div>
          </div>

          {/* Botão de Envio */}
          <div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
          </div>
        </form>

        {/* Link para Login */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Já tem uma conta?{' '}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
          >
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}

// Exportação padrão para 'lazy loading' se necessário
export default RegisterPage;
