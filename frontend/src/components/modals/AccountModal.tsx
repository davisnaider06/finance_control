// Em: frontend/src/components/modals/AccountModal.tsx

import { useState, useEffect, FormEvent } from 'react';
import api from '../../services/api';
import styles from './Modal.module.css'; // Reutilizamos o CSS!

// 1. --- Interfaces ---
interface Account {
  id: number;
  name: string;
  type: string;
  initial_balance: string;
}

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountSaved: () => void; // Para recarregar a lista
  accountToEdit: Account | null; // A conta a ser editada (ou null se for 'Adicionar')
}

// 2. --- Componente ---
export const AccountModal = ({ isOpen, onClose, onAccountSaved, accountToEdit }: AccountModalProps) => {
  // 3. --- Estados do Formulário ---
  const [name, setName] = useState('');
  const [type, setType] = useState('checking'); // 'checking' = Conta Corrente
  const [initialBalance, setInitialBalance] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 4. --- Lógica de Edição ---
  // Este efeito preenche o formulário se estivermos editando
  useEffect(() => {
    if (accountToEdit) {
      // Modo Edição: Preenche o formulário
      setName(accountToEdit.name);
      setType(accountToEdit.type);
      setInitialBalance(accountToEdit.initial_balance);
    } else {
      // Modo Adição: Reseta o formulário
      setName('');
      setType('checking');
      setInitialBalance('');
    }
  }, [accountToEdit, isOpen]); // Roda quando o modal abre ou a conta muda

  // 5. --- Função de 'Submit' ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const accountData = {
      name: name,
      type: type,
      initial_balance: parseFloat(initialBalance) || 0, // Garante que é um número
    };

    try {
      if (accountToEdit) {
        // MODO EDIÇÃO (PUT)
        await api.put(`/accounts/${accountToEdit.id}`, accountData);
      } else {
        // MODO ADIÇÃO (POST)
        await api.post('/accounts', accountData);
      }
      
      // 6. Sucesso!
      onAccountSaved(); // Avisa a página para recarregar
      handleClose();      // Fecha e limpa o modal

    } catch (err) {
      console.error("Erro ao salvar conta:", err);
      setError("Falha ao salvar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // 7. --- Função de Fechar ---
  const handleClose = () => {
    setName('');
    setType('checking');
    setInitialBalance('');
    setError(null);
    onClose(); // Chama a função 'onClose' do pai
  };

  if (!isOpen) {
    return null;
  }

  // Define o título do modal
  const modalTitle = accountToEdit ? "Editar Conta" : "Adicionar Nova Conta";

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        
        <div className={styles.modalHeader}>
          <h2>{modalTitle}</h2>
          <button onClick={handleClose} className={styles.closeButton}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            
            <div className={styles.formGroup}>
              <label htmlFor="accountName">Nome da Conta</label>
              <input
                type="text"
                id="accountName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Conta Bancária, Carteira"
                required
              />
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="accountType">Tipo</label>
                <select 
                  id="accountType"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                >
                  <option value="checking">Conta Corrente</option>
                  <option value="savings">Poupança</option>
                  <option value="cash">Dinheiro (Carteira)</option>
                  <option value="credit_card">Cartão de Crédito</option>
                  <option value="investment">Investimento</option>
                  <option value="other">Outro</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="initialBalance">Saldo Inicial (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  id="initialBalance"
                  value={initialBalance}
                  onChange={(e) => setInitialBalance(e.target.value)}
                  placeholder="0,00"
                  required
                />
              </div>
            </div>

            {error && <p className={styles.formError}>{error}</p>}
          </div>

          <div className={styles.modalFooter}>
            <button type="submit" className={styles.saveButton} disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};