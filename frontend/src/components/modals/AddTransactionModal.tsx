// Em: frontend/src/components/modals/AddTransactionModal.tsx

import { useState, useEffect, type FormEvent } from 'react';
import api from '../../services/api';
import styles from './Modal.module.css';

// --- Interfaces ---
interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  // (Precisamos de uma forma de 'avisar' a tabela para recarregar)
  onTransactionAdded: () => void;
}

interface Account {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  type: 'revenue' | 'expense';
}

// --- Componente ---
export const AddTransactionModal = ({ isOpen, onClose, onTransactionAdded }: AddTransactionModalProps) => {
  // --- Estados de Lógica ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // --- Estados de Listas (para os <select>) ---
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // --- Estados do Formulário ---
  const [transactionType, setTransactionType] = useState<'expense' | 'revenue'>('expense');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Data de hoje
  const [description, setDescription] = useState('');
  const [accountId, setAccountId] = useState('');
  const [categoryId, setCategoryId] = useState('');

  // 1. Efeito para BUSCAR DADOS (Contas e Categorias) quando o modal abre
  useEffect(() => {
    // Só busca se o modal estiver aberto E as listas estiverem vazias
    if (isOpen && (accounts.length === 0 || categories.length === 0)) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          // Busca contas e categorias em paralelo
          const [accountsRes, categoriesRes] = await Promise.all([
            api.get('/accounts'),
            api.get('/categories')
          ]);
          setAccounts(accountsRes.data);
          setCategories(categoriesRes.data);
          setIsLoading(false);
        } catch (err) {
          console.error("Erro ao buscar contas/categorias:", err);
          setError("Não foi possível carregar os dados para o formulário.");
        }
      };
      fetchData();
    }
  }, [isOpen, accounts.length, categories.length]); // Dependências do efeito

  // 2. Filtra as categorias baseado no 'transactionType' (Receita/Despesa)
  const filteredCategories = categories.filter(c => c.type === transactionType);

  // 3. Reseta o formulário
  const resetForm = () => {
    setTransactionType('expense');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setDescription('');
    setAccountId('');
    setCategoryId('');
    setError(null);
  };

  // 4. Função de 'Submit' do Formulário
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validação
    if (!amount || !date || !accountId || !categoryId) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Converte o 'amount' para número.
    // Se for 'expense', garante que seja negativo.
    let numericAmount = parseFloat(amount);
    if (transactionType === 'expense' && numericAmount > 0) {
      numericAmount = numericAmount * -1;
    }
    // Se for 'revenue', garante que seja positivo.
    if (transactionType === 'revenue' && numericAmount < 0) {
      numericAmount = numericAmount * -1;
    }

    try {
      // 5. Envia para a API
      await api.post('/transactions', {
        account_id: parseInt(accountId),
        category_id: parseInt(categoryId),
        amount: numericAmount,
        date: date,
        description: description,
      });

      // 6. Sucesso!
      onTransactionAdded(); // Avisa a página de Transações para recarregar
      resetForm();          // Limpa o formulário
      onClose();            // Fecha o modal

    } catch (err) {
      console.error("Erro ao salvar transação:", err);
      setError("Falha ao salvar. Tente novamente.");
    }
  };

  // 7. A lógica para 'onClose' (limpar o form ao fechar)
  const handleClose = () => {
    resetForm();
    onClose();
  };


  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        
        <div className={styles.modalHeader}>
          <h2>Adicionar Transação</h2>
          <button onClick={handleClose} className={styles.closeButton}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            
            {/* Toggle de Receita/Despesa */}
            <div className={styles.typeToggle}>
              <button 
                type="button" 
                className={`${styles.typeButton} ${styles.expense} ${transactionType === 'expense' ? styles.active : ''}`}
                onClick={() => setTransactionType('expense')}
              >
                Despesa
              </button>
              <button 
                type="button"
                className={`${styles.typeButton} ${styles.revenue} ${transactionType === 'revenue' ? styles.active : ''}`}
                onClick={() => setTransactionType('revenue')}
              >
                Receita
              </button>
            </div>

            {/* Grid do Formulário */}
            <div className={styles.formGrid}>
              
              {/* Valor */}
              <div className={styles.formGroup}>
                <label htmlFor="amount">Valor</label>
                <input 
                  type="number" 
                  step="0.01" 
                  id="amount"
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              {/* Data */}
              <div className={styles.formGroup}>
                <label htmlFor="date">Data</label>
                <input 
                  type="date" 
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              {/* Conta */}
              <div className={styles.formGroup}>
                <label htmlFor="accountId">Conta</label>
                <select 
                  id="accountId" 
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  required
                >
                  <option value="" disabled>Selecione...</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
                </select>
              </div>

              {/* Categoria */}
              <div className={styles.formGroup}>
                <label htmlFor="categoryId">Categoria</label>
                <select 
                  id="categoryId"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  <option value="" disabled>Selecione...</option>
                  {/* Só mostra categorias filtradas! */}
                  {filteredCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Descrição */}
              <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}> {/* Ocupa 2 colunas */}
                <label htmlFor="description">Descrição (Opcional)</label>
                <input 
                  type="text" 
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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