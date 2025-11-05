import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import styles from './Transactions.module.css';
import { formatCurrency } from '../../utils/formatters';
import { AddTransactionModal } from '../../components/modals/AddTransactionModal';

interface Transaction {
  id: number;
  description: string;
  amount: string; 
  date: string; 
  category_name: string;
  category_type: 'revenue' | 'expense';
  account_name: string;
}

const getTransactionTypeClass = (type: 'revenue' | 'expense') => {
  return type === 'revenue' ? styles.positive : styles.negative;
};

const formatDate = (dateString: string) => {
  try {
    const [year, month, day] = dateString.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
  } catch (e) {
    return dateString; 
  }
};

export function TransactionsPage() {
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('/transactions');
      setTransactions(response.data);
    } catch (err) {
      console.error("Erro ao buscar transações:", err);
      setError("Não foi possível carregar as transações.");
    } finally {
      setIsLoading(false);
    }
  }, []); // O array vazio significa que a função NUNCA muda

  // O useEffect agora só chama a função
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]); // O '[]' garante que rode só uma vez

 const handleTransactionAdded = () => {
    fetchTransactions();
  };

  if (isLoading) {
    return <div>Carregando transações...</div>;
  }
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.transactionsContainer}>
      <div className={styles.header}>
        <h1>Transações</h1>
        <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>Adicionar Transação</button>
      </div>

      <div className={styles.tableCard}>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Valor</th>
              <th>Categoria</th>
              <th>Conta</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((t) => (
                <tr key={t.id}>
                  <td>{formatDate(t.date)}</td>
                  <td>{t.description || '—'}</td>
                  <td className={getTransactionTypeClass(t.category_type)}>
                    {formatCurrency(t.amount)}
                  </td>
                  <td>{t.category_name}</td>
                  <td>{t.account_name}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>Nenhuma transação encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTransactionAdded={handleTransactionAdded}
      />
    </div>
  );
}