import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { LogOut, PlusCircle, TrendingUp, TrendingDown } from 'lucide-react';

// --- Tipos (Vamos movê-los para 'types/index.ts' mais tarde) ---
interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string; // ou Date
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
  icon: string; // (opcional)
}
// --- Fim dos Tipos ---


/**
 * Componente de Cabeçalho do Dashboard
 * Mostra o nome do usuário e o botão de logout.
 */
const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redireciona para o login após o logout
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md p-4">
      <div className="container mx-auto max-w-7xl flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Olá, {user?.name || 'Usuário'}!
        </h1>
        <Button 
          onClick={handleLogout} 
          className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 w-auto"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </header>
  );
};

/**
 * Componente de Resumo Financeiro (Cards)
 * Mostra o saldo total, receitas e despesas.
 */
const SummaryCards = ({ income, expense }: { income: number; expense: number }) => {
  const balance = income - expense;

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Card Saldo Total */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Saldo Total</h3>
        <p className={`text-3xl font-bold mt-2 ${balance >= 0 ? 'text-gray-900 dark:text-gray-100' : 'text-red-500 dark:text-red-400'}`}>
          {formatCurrency(balance)}
        </p>
      </div>
      
      {/* Card Receitas */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-green-500">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Receitas</h3>
          <TrendingUp className="h-6 w-6 text-green-500" />
        </div>
        <p className="text-3xl font-bold mt-2 text-green-600 dark:text-green-500">
          {formatCurrency(income)}
        </p>
      </div>
      
      {/* Card Despesas */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-red-500">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Despesas</h3>
          <TrendingDown className="h-6 w-6 text-red-500" />
        </div>
        <p className="text-3xl font-bold mt-2 text-red-500 dark:text-red-400">
          {formatCurrency(expense)}
        </p>
      </div>
    </section>
  );
};

/**
 * Componente da Lista de Transações (Placeholder)
 * Irá listar as transações recentes.
 */
const TransactionList = ({ transactions }: { transactions: Transaction[] }) => {
  if (transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <h3 className="text-lg font-semibold mb-2">Sem Transações</h3>
        <p className="text-gray-500 dark:text-gray-400">Você ainda não adicionou nenhuma transação.</p>
        <Button className="mt-4 w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Primeira Transação
        </Button>
      </div>
    );
  }

  // TODO: Implementar a lista de transações
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Transações Recentes</h3>
      {/* Aqui virá o map das transações */}
      <p className="text-gray-500 dark:text-gray-400">Lista de transações (em breve)...</p>
    </div>
  );
};


/**
 * Página Principal do Dashboard
 * Organiza os componentes de cabeçalho, resumo e transações.
 */
export function DashboardPage() {
  const { token } = useAuth(); // Pegar o token para fazer chamadas de API
  
  // Estado para armazenar dados financeiros
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Totais calculados
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  // Efeito para buscar os dados do backend ao carregar a página
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // 1. Buscar transações
        // Esta rota '/api/transactions' deve existir no seu backend
        const transResponse = await fetch('/api/transactions', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!transResponse.ok) throw new Error('Falha ao buscar transações');
        const transData: Transaction[] = await transResponse.json();
        setTransactions(transData);

        // 2. Buscar categorias (se necessário, ou pode ser em outro local)
        // const catResponse = await fetch('/api/categories', {
        //   headers: { 'Authorization': `Bearer ${token}` }
        // });
        // if (!catResponse.ok) throw new Error('Falha ao buscar categorias');
        // const catData: Category[] = await catResponse.json();
        // setCategories(catData);

        // 3. Calcular totais (isso também pode vir do backend)
        let income = 0;
        let expense = 0;
        transData.forEach(tx => {
          if (tx.type === 'income') {
            income += tx.amount;
          } else {
            expense += tx.amount;
          }
        });
        setTotalIncome(income);
        setTotalExpense(expense);

      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError('Erro ao carregar dados do dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]); // Depende do token para re-buscar se o login mudar

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <DashboardHeader />
      
      <main className="container mx-auto max-w-7xl p-6">
        {/* Indicador de Loading ou Erro */}
        {loading && (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {error && (
           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center mb-6" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Conteúdo principal (só mostra se não estiver carregando e sem erro inicial) */}
        {!loading && !error && (
          <>
            {/* Cards de Resumo */}
            <SummaryCards income={totalIncome} expense={totalExpense} />
            
            {/* Seção de Transações e Ações */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {/* Lista de Transações */}
                <TransactionList transactions={transactions} />
              </div>
              <div className="lg:col-span-1">
                {/* (Placeholder) Formulário Rápido de Adição ou Gráficos */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg h-full">
                  <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
                  <Button className="w-full mb-4">
                     <PlusCircle className="mr-2 h-4 w-4" />
                     Nova Receita
                  </Button>
                  <Button className="w-full bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700">
                     <PlusCircle className="mr-2 h-4 w-4" />
                     Nova Despesa
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// Exportação padrão para 'lazy loading' se necessário
export default DashboardPage;
