import { useState, useEffect, type FormEvent } from 'react';
import api from '../../services/api';
import styles from './Modal.module.css';

interface Transaction {
  id: number;
  description: string;
  amount: string;
  date: string;
  account_id: number;
  category_id: number;
  category_type: 'revenue' | 'expense';
}

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransactionAdded: () => void;
  transactionToEdit: Transaction | null;
}

interface Account {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  type: 'revenue' | 'expense' | 'savings';
}


export const AddTransactionModal = ({ 
  isOpen, 
  onClose, 
  onTransactionAdded, 
  transactionToEdit 
}: AddTransactionModalProps) => {
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [transactionType, setTransactionType] = useState<'expense' | 'revenue' | 'savings'>('expense');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [accountId, setAccountId] = useState('');
  const [categoryId, setCategoryId] = useState('');


  useEffect(() => {
    if (isOpen && (accounts.length === 0 || categories.length === 0)) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const [accountsRes, categoriesRes] = await Promise.all([
            api.get('/accounts'),
            api.get('/categories')
          ]);
          setAccounts(accountsRes.data);
          setCategories(categoriesRes.data);
        } catch (err) {
          console.error("Erro ao buscar contas/categorias:", err);
          setError("Não foi possível carregar os dados para o formulário.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen, accounts.length, categories.length]);


  useEffect(() => {
    if (transactionToEdit) {
      const numericAmount = parseFloat(transactionToEdit.amount);
      const type = numericAmount > 0 ? 'revenue' : 'expense';

      setTransactionType(type);

      setAmount(String(Math.abs(numericAmount)));
      // Formata a data de AAAA-MM-DDTHH:MM:SS.sssZ para AAAA-MM-DD
      setDate(new Date(transactionToEdit.date).toISOString().split('T')[0]);
      setDescription(transactionToEdit.description || '');
      setAccountId(String(transactionToEdit.account_id));
      setCategoryId(String(transactionToEdit.category_id));

    } else {
      resetForm();
    }
    // Roda sempre que o modal abre ou a transação a ser editada muda
  }, [transactionToEdit, isOpen]);


  const filteredCategories = categories.filter(c => c.type === transactionType);

  const resetForm = () => {
    setTransactionType('expense');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setDescription('');
    setAccountId('');
    setCategoryId('');
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!amount || !date || !accountId || !categoryId) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    let numericAmount = parseFloat(amount);
   if ((transactionType === 'expense' || transactionType === 'savings') && numericAmount > 0) {
      numericAmount = numericAmount * -1;
    }
    if (transactionType === 'revenue' && numericAmount < 0) {
      numericAmount = numericAmount * -1;
    }

    const transactionData = {
      account_id: parseInt(accountId),
      category_id: parseInt(categoryId),
      amount: numericAmount,
      date: date,
      description: description,
    };

    setIsLoading(true);
    try {
      if (transactionToEdit) {
        await api.put(`/transactions/${transactionToEdit.id}`, transactionData);
      } else {
        await api.post('/transactions', transactionData);
      }
      
      onTransactionAdded();
      handleClose();

    } catch (err) {
      console.error("Erro ao salvar transação:", err);
      setError("Falha ao salvar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };


  if (!isOpen) {
    return null;
  }
  

  const modalTitle = transactionToEdit ? "Editar Transação" : "Adicionar Transação";

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        
        <div className={styles.modalHeader}>
          <h2>{modalTitle}</h2>
          <button onClick={handleClose} className={styles.closeButton}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            
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
              <button 
                type="button"
                className={`${styles.typeButton} ${styles.savings} ${transactionType === 'savings' ? styles.active : ''}`}
                onClick={() => setTransactionType('savings')}
              >
                Cofrinho
              </button>
            </div>

            <div className={styles.formGrid}>
              
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

              <div className={styles.formGroup}>
                <label htmlFor="categoryId">Categoria</label>
                <select 
                  id="categoryId"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  <option value="" disabled>Selecione...</option>
                  {filteredCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
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