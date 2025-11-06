// Em: frontend/src/components/modals/BudgetModal.tsx

import { useState, useEffect, type FormEvent } from 'react';
import api from '../../services/api';
import styles from './Modal.module.css';

// --- Interfaces ---
interface Budget {
  id: number;
  category_id: number;
  amount: string;
  month_date: string;
  // (category_name e icon não são necessários aqui)
}

interface Category {
  id: number;
  name: string;
  type: 'revenue' | 'expense';
}

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBudgetSaved: () => void; // Para recarregar a lista
  budgetToEdit: Budget | null; // O orçamento a ser editado
}

// Helper para formatar a data AAAA-MM-DD para AAAA-MM
const formatDateToMonthInput = (dateString: string): string => {
  try {
    return new Date(dateString).toISOString().substring(0, 7); // Retorna "YYYY-MM"
  } catch (e) {
    return new Date().toISOString().substring(0, 7);
  }
};
// Helper para formatar o input AAAA-MM para AAAA-MM-01
const formatMonthInputToDate = (monthString: string): string => {
  return `${monthString}-01`; // Salva o primeiro dia do mês
};


// 2. --- Componente ---
export const BudgetModal = ({ isOpen, onClose, onBudgetSaved, budgetToEdit }: BudgetModalProps) => {
  // 3. --- Estados do Formulário ---
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  // Salva o mês no formato "AAAA-MM" para o input type="month"
  const [month, setMonth] = useState(new Date().toISOString().substring(0, 7));
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 4. --- Efeito para buscar categorias (só busca despesas!)
  useEffect(() => {
    if (isOpen && categories.length === 0) {
      const fetchCategories = async () => {
        try {
          const response = await api.get('/categories');
          // Orçamentos são (geralmente) para Despesas
          const expenseCategories = response.data.filter(
            (cat: Category) => cat.type === 'expense'
          );
          setCategories(expenseCategories);
        } catch (err) {
          console.error("Erro ao buscar categorias:", err);
        }
      };
      fetchCategories();
    }
  }, [isOpen, categories.length]);

  // 5. --- Efeito para Lógica de Edição ---
  useEffect(() => {
    if (budgetToEdit) {
      // Modo Edição
      setCategoryId(String(budgetToEdit.category_id));
      setAmount(budgetToEdit.amount);
      setMonth(formatDateToMonthInput(budgetToEdit.month_date));
    } else {
      // Modo Adição
      resetForm();
    }
  }, [budgetToEdit, isOpen]);

  const resetForm = () => {
    setCategoryId('');
    setAmount('');
    setMonth(new Date().toISOString().substring(0, 7));
  };

  // 6. --- Função de 'Submit' ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const budgetData = {
      category_id: parseInt(categoryId),
      amount: parseFloat(amount) || 0,
      month_date: formatMonthInputToDate(month), // Converte "AAAA-MM" para "AAAA-MM-01"
    };

    try {
      if (budgetToEdit) {
        // MODO EDIÇÃO (PUT)
        await api.put(`/budgets/${budgetToEdit.id}`, budgetData);
      } else {
        // MODO ADIÇÃO (POST)
        await api.post('/budgets', budgetData);
      }
      
      onBudgetSaved();
      handleClose();

    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); // Ex: "Já existe um orçamento..."
      } else {
        setError("Falha ao salvar. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 7. --- Função de Fechar ---
  const handleClose = () => {
    resetForm();
    setError(null);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  const modalTitle = budgetToEdit ? "Editar Orçamento" : "Adicionar Novo Orçamento";

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        
        <div className={styles.modalHeader}>
          <h2>{modalTitle}</h2>
          <button onClick={handleClose} className={styles.closeButton}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            
            {/* O formulário terá 3 campos */}
            <div className={styles.formGroup} style={{ marginBottom: '1rem' }}>
              <label htmlFor="budgetCategory">Categoria (Apenas Despesas)</label>
              <select 
                id="budgetCategory"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value="" disabled>Selecione...</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="budgetAmount">Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  id="budgetAmount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Ex: 400,00"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="budgetMonth">Mês/Ano</label>
                <input
                  type="month" // Este é o input especial!
                  id="budgetMonth"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
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