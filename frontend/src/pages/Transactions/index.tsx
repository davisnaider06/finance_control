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
  account_id: number;
  category_id: number;
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

  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

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
  }, []); 

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]); // O '[]' garante que rode só uma vez

  const handleDelete = async (transactionId: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta transação?")) {
      try {
        await api.delete(`/transactions/${transactionId}`);
        fetchTransactions(); // Recarrega a lista
      } catch (err) {
        console.error("Erro ao excluir transação:", err);
        alert("Não foi possível excluir a transação.");
      }
    }
  };


  const handleOpenAddModal = () => {
    setEditingTransaction(null); // Garante que não esta editando
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (transaction: Transaction) => {
    setEditingTransaction(transaction); // Define a transação
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };


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
        <button className={styles.addButton} onClick={handleOpenAddModal}>Adicionar Transação</button>
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
              <th className={styles.actionsHeader}>Ações</th>
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
                  <td className={styles.actionsCell}>
                    <button 
                      onClick={() => handleOpenEditModal(t)} 
                      className={styles.editButton}
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDelete(t.id)} 
                      className={styles.deleteButton}
                    >
                      🗑️
                    </button>
                  </td>
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
        onClose={handleCloseModal}
        onTransactionAdded={handleTransactionAdded}
        // @ts-ignore
        transactionToEdit={editingTransaction}
      />
    </div>
  );
}