// Em: frontend/src/pages/Budgets/index.tsx

import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import styles from './Budgets.module.css';
import { DynamicIcon } from '../../components/DynamicIcon'; // Para o ícone da categoria
import { formatCurrency } from '../../utils/formatters'; // Para o valor
import { BudgetModal } from '../../components/modals/BudgetModal'; // O Modal

// 1. Define a 'forma' do Orçamento (como vem da API)
interface Budget {
  id: number;
  category_id: number;
  amount: string;
  month_date: string;
  category_name: string; // Vem do JOIN que fizemos no backend
  category_icon: string | null;
}

// Helper para formatar o mês (ex: 2025-11-01 -> Novembro/2025)
const formatMonthYear = (dateString: string) => {
  try {
    const date = new Date(dateString);
    // Adiciona timeZone 'UTC' para evitar problemas de fuso horário
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  } catch (e) {
    return dateString;
  }
};

export function BudgetsPage() {
  // 2. Estados
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados do modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  // 3. Função de busca de dados
  const fetchBudgets = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('/budgets');
      setBudgets(response.data);
    } catch (err) {
      console.error("Erro ao buscar orçamentos:", err);
      setError("Não foi possível carregar os orçamentos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 4. Efeito para buscar os dados na montagem
  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  // 5. Função de Excluir
  const handleDelete = async (budgetId: number) => {
    if (window.confirm("Tem certeza que deseja excluir este orçamento?")) {
      try {
        await api.delete(`/budgets/${budgetId}`);
        // Se deu certo, atualiza a lista
        fetchBudgets(); 
      } catch (err) {
        console.error("Erro ao excluir orçamento:", err);
        alert("Não foi possível excluir o orçamento.");
      }
    }
  };

  // Funções para abrir/fechar o modal
  const handleOpenAddModal = () => {
    setEditingBudget(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (budget: Budget) => {
    setEditingBudget(budget);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBudget(null);
  };

  const handleBudgetSaved = () => {
    fetchBudgets();
  };

  if (isLoading) {
    return <div className={styles.loading}>Carregando orçamentos...</div>;
  }
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.budgetsContainer}>
      <div className={styles.header}>
        <button onClick={handleOpenAddModal} className={styles.addButton}>
          Adicionar Orçamento
        </button>
      </div>

      <div className={styles.budgetList}>
        {budgets.length > 0 ? (
          budgets.map(budget => (
            <div key={budget.id} className={styles.budgetCard}>
              
              <div className={styles.cardHeader}>
                <div className={styles.categoryInfo}>
                  <span className={styles.categoryIcon}>
                    <DynamicIcon name={budget.category_icon || 'FaQuestionCircle'} />
                  </span>
                  <h3>{budget.category_name}</h3>
                </div>
                <div className={styles.budgetActions}>
                  <button 
                    onClick={() => handleOpenEditModal(budget)}
                    className={styles.editButton}
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleDelete(budget.id)} 
                    className={styles.deleteButton}
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <div className={styles.cardBody}>
                <span>{formatMonthYear(budget.month_date)}</span>
                <p>{formatCurrency(budget.amount)}</p>
              </div>

            </div>
          ))
        ) : (
          !isLoading && <p>Nenhum orçamento cadastrado.</p>
        )}
        {isLoading && <div className={styles.loading}>Carregando...</div>}
      </div>

      <BudgetModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onBudgetSaved={handleBudgetSaved}
        budgetToEdit={editingBudget}
      />
    </div>
  );
}