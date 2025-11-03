import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importado para o logout
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { LogOut, PlusCircle, TrendingUp, TrendingDown, Edit2, Trash2, Loader2 } from 'lucide-react';
import { type Transaction, type Category } from '../types'; // Caminho padrão
import { Modal } from '../components/ui/Modal';
import { AddTransactionForm } from '../components/AddTransactionForm';

/**
 * Cabeçalho do Dashboard
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
 * Cards de Resumo (Receita, Despesa, Saldo)
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
 * Componente da Lista de Transações (AGORA ATUALIZADO)
 * Lista as transações reais e permite exclusão.
 */
const TransactionList = ({ 
  transactions, 
  onDeleteTransaction 
}: { 
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}) => {
  
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Sem Transações</h3>
        <p className="text-gray-500 dark:text-gray-400">Você ainda não adicionou nenhuma transação.</p>
        {/* O botão de adicionar agora fica nas "Ações Rápidas" */}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Transações Recentes</h3>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {transactions.map(tx => (
          <li key={tx.id} className="flex flex-wrap items-center justify-between py-4 sm:flex-nowrap">
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <div className={`p-3 rounded-full ${tx.type === 'income' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                {tx.type === 'income' ? 
                  <TrendingUp className="h-5 w-5 text-green-500" /> : 
                  <TrendingDown className="h-5 w-5 text-red-500" />
                }
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{tx.description}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {tx.categoryName} ・ {formatDate(tx.date)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-4 w-full sm:w-auto sm:mt-0 justify-end">
              <span className={`font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
              </span>
              <button 
                onClick={() => onDeleteTransaction(tx.id)}
                className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};


/**
 * Página Principal do Dashboard (ATUALIZADA)
 * Gerencia o estado, o modal e os dados.
 */
export function DashboardPage() {
  const { token } = useAuth();
  
  // Estado para armazenar dados financeiros
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para o modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Totais calculados (derivados do estado 'transactions')
  // Isso é melhor do que o useState, pois recalcula automaticamente
  const totalIncome = transactions
    .filter(tx => tx.type === 'income')
    .reduce((acc, tx) => acc + tx.amount, 0);
  const totalExpense = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((acc, tx) => acc + tx.amount, 0);


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
        // 1. Buscar transações E categorias (em paralelo)
        const [transResponse, catResponse] = await Promise.all([
          fetch('/api/transactions', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('/api/categories', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (!transResponse.ok) throw new Error('Falha ao buscar transações');
        if (!catResponse.ok) throw new Error('Falha ao buscar categorias');

        const transData: Transaction[] = await transResponse.json();
        const catData: Category[] = await catResponse.json();
        
        // Inverte para mostrar as mais novas primeiro
        setTransactions(transData.reverse()); 
        setCategories(catData);

      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError('Erro ao carregar dados do dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]); // Depende do token

  // --- Funções de Callback ---
  
  const handleTransactionAdded = (newTransaction: Transaction) => {
    // Adiciona a nova transação no topo da lista
    setTransactions(prev => [newTransaction, ...prev]);
  };
  
  const handleDeleteTransaction = async (id: string) => {
    // Adicionar confirmação
    if (!window.confirm("Tem certeza que deseja deletar esta transação?")) {
        return;
    }
    
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Falha ao deletar transação');
      }
      // Atualiza o estado local
      setTransactions(prev => prev.filter(tx => tx.id !== id));
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('Erro ao deletar transação');
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <DashboardHeader />
      
      <main className="container mx-auto max-w-7xl p-6">
        {/* Indicador de Loading ou Erro */}
        {loading && (
          <div className="flex justify-center items-center h-64">
             <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
          </div>
        )}
        
        {error && (
           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center mb-6" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Conteúdo principal */}
        {!loading && !error && (
          <>
            {/* Cards de Resumo */}
            <SummaryCards income={totalIncome} expense={totalExpense} />
            
            {/* Seção de Transações e Ações */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {/* Lista de Transações */}
                <TransactionList 
                  transactions={transactions} 
                  onDeleteTransaction={handleDeleteTransaction} 
                />
              </div>
              <div className="lg:col-span-1">
                {/* Ações Rápidas (AGORA FUNCIONAL) */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg h-full">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Ações Rápidas</h3>
                  <Button 
                    className="w-full mb-4"
                    onClick={() => setIsModalOpen(true)} // Abre o modal
                  >
                     <PlusCircle className="mr-2 h-4 w-4" />
                     Nova Transação
                  </Button>
                  {/* (Você pode adicionar um botão para "Gerenciar Categorias" aqui no futuro) */}
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Modal de Nova Transação (Fora do main) */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Adicionar Nova Transação"
      >
        <AddTransactionForm
          categories={categories}
          onTransactionAdded={handleTransactionAdded}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>

    </div>
  );
}

// Exportação padrão para 'lazy loading' se necessário
export default DashboardPage;

