// Em: frontend/src/pages/Accounts/index.tsx

import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import styles from './Accounts.module.css';
import { AccountModal } from '../../components/modals/AccountModal';
// (Vamos precisar de ícones, por enquanto usaremos texto/emoji)

// 1. Define a 'forma' da Conta
interface Account {
  id: number;
  name: string;
  type: string;
  initial_balance: string;
}

export function AccountsPage() {
  // 2. Estados
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  // Guarda a conta que estamos editando
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  // ... (fetchAccounts e useEffect continuam iguais)
  const fetchAccounts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('/accounts');
      setAccounts(response.data);
    } catch (err) {
      console.error("Erro ao buscar contas:", err);
      setError("Não foi possível carregar as contas.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);


  // 4. Efeito para buscar os dados na montagem
  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // 5. Função de Excluir
  const handleDelete = async (accountId: number) => {
    // Pede confirmação
    if (window.confirm("Tem certeza que deseja excluir esta conta? TODAS as transações associadas a ela também serão excluídas.")) {
      try {
        await api.delete(`/accounts/${accountId}`);
        // Se deu certo, atualiza a lista
        fetchAccounts(); 
      } catch (err) {
        console.error("Erro ao excluir conta:", err);
        alert("Não foi possível excluir a conta.");
      }
    }
  };

 const handleOpenAddModal = () => {
    setEditingAccount(null); // Garante que não estamos editando
    setIsModalOpen(true);
  };

  // Abre o modal para EDITAR (preenchido)
  const handleOpenEditModal = (account: Account) => {
    setEditingAccount(account); // Define a conta a ser editada
    setIsModalOpen(true);
  };

  // Fecha o modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAccount(null); // Limpa a conta em edição
  };

  // Chamado pelo modal quando salva (para recarregar a lista)
  const handleAccountSaved = () => {
    fetchAccounts();
  };
  if (isLoading) {
    return <div className={styles.loading}>Carregando contas...</div>;
  }
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  // 6. O JSX
  return (
    <div className={styles.accountsContainer}>
      <div className={styles.header}>
        <h1>Minhas Contas</h1>
        <button onClick={handleOpenAddModal} className={styles.addButton}>
          Adicionar Conta
        </button>
      </div>

      <div className={styles.accountsList}>
        {accounts.length > 0 ? (
          accounts.map(account => (
            <div key={account.id} className={styles.accountCard}>
              <div className={styles.accountInfo}>
                <h3>{account.name}</h3>
                <span>{account.type}</span>
              </div>
              <div className={styles.accountActions}>
                <button 
                onClick={() => handleOpenEditModal(account)}
                className={styles.editButton}>
                  ✏️ 
                </button>
                <button 
                  onClick={() => handleDelete(account.id)} 
                  className={styles.deleteButton}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        ) : (
          !isLoading && <p>Nenhuma conta cadastrada.</p>
        )}
        {isLoading && <div className={styles.loading}>Carregando...</div>}
      </div>

      <AccountModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAccountSaved={handleAccountSaved}
        accountToEdit={editingAccount}
      />

    </div>
  );
}