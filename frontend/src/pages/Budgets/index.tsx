import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import styles from './Budgets.module.css';
import { DynamicIcon } from '../../components/DynamicIcon';
import { formatCurrency } from '../../utils/formatters';
import { BudgetModal } from '../../components/modals/BudgetModal';
import { ReserveMoneyModal, TargetObjective } from '../../components/modals/ReserveMoneyModal';

interface Objective {
  id: number;
  category_id: number;
  amount: string; 
  month_date: string;
  category_name: string;
  category_icon: string | null;
  category_type: 'expense' | 'savings';
 }

const formatMonthYear = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  } catch (e) { return dateString; }
};

export function BudgetsPage() {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [editingObjective, setEditingObjective] = useState<Objective | null>(null);
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [targetForReservation, setTargetForReservation] = useState<TargetObjective | null>(null);

  const fetchObjectives = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/budgets');
      setObjectives(response.data);
    } catch (err) {
      console.error("Erro ao buscar objetivos:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchObjectives();
  }, [fetchObjectives]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este objetivo/orçamento?")) {
      await api.delete(`/budgets/${id}`);
      fetchObjectives();
    }
  };

  const openManageModal = (obj?: Objective) => {
    setEditingObjective(obj || null);
    setIsManageModalOpen(true);
  };

  const openReserveModal = (obj: Objective) => {
    setTargetForReservation({
      id: obj.id,
      name: obj.category_name,
      category_id: obj.category_id
    });
    setIsReserveModalOpen(true);
  };

  const savingsObjectives = objectives.filter(o => o.category_type === 'savings');
  const expenseBudgets = objectives.filter(o => o.category_type === 'expense');

  if (isLoading) return <div className="loading">Carregando...</div>;

  return (
    <div className={styles.budgetsContainer}>
      <div className={styles.header}>
        <h1>Meus Objetivos e Orçamentos</h1>
        <button onClick={() => openManageModal()} className={styles.addButton}>
          <DynamicIcon name="FaPlus" style={{marginRight: 8}} />
          Novo Objetivo/Orçamento
        </button>
      </div>


      <h2 className={styles.sectionTitle} style={{ color: 'var(--savings-color)' }}>
        <DynamicIcon name="FaPiggyBank" style={{ marginRight: 10 }} />
        Meus Cofrinhos
      </h2>
      <div className={styles.budgetList}>
        {savingsObjectives.length > 0 ? (
          savingsObjectives.map(obj => (
            <div key={obj.id} className={`${styles.budgetCard} ${styles.savingsCard}`}>
              <div className={styles.cardHeader}>
                <div className={styles.categoryInfo}>
                  <span className={styles.categoryIcon} style={{ backgroundColor: 'var(--savings-color)' }}>
                    <DynamicIcon name={obj.category_icon || 'FaPiggyBank'} style={{ color: 'white' }} />
                  </span>
                  <div>
                    <h3>{obj.category_name}</h3>
                    <span className={styles.monthLabel}>{formatMonthYear(obj.month_date)}</span>
                  </div>
                </div>
                <div className={styles.budgetActions}>
                  <button onClick={() => openManageModal(obj)} className={styles.iconButton}>✏️</button>
                  <button onClick={() => handleDelete(obj.id)} className={styles.iconButton}>🗑️</button>
                </div>
              </div>
              
              <div className={styles.cardBody}>
                <p className={styles.metaLabel}>Meta do mês:</p>
                <p className={styles.amountValue} style={{ color: 'var(--savings-color)' }}>
                  {formatCurrency(obj.amount)}
                </p>
                <button 
                  className={styles.reserveButton}
                  onClick={() => openReserveModal(obj)}
                >
                  <DynamicIcon name="FaCoins" /> Reservar Dinheiro
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.emptyState}>Nenhum cofrinho criado para este mês.</p>
        )}
      </div>
      {expenseBudgets.length > 0 && (
        <>
          <h2 className={styles.sectionTitle} style={{ marginTop: '2rem' }}>Orçamentos de Despesas</h2>
          <div className={styles.budgetList}>
            {expenseBudgets.map(budget => (
              <div key={budget.id} className={styles.budgetCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.categoryInfo}>
                    <span className={styles.categoryIcon}>
                      <DynamicIcon name={budget.category_icon || 'FaShoppingCart'} />
                    </span>
                    <h3>{budget.category_name}</h3>
                  </div>
                  <div className={styles.budgetActions}>
                     <button onClick={() => openManageModal(budget)} className={styles.iconButton}>✏️</button>
                     <button onClick={() => handleDelete(budget.id)} className={styles.iconButton}>🗑️</button>
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <span>{formatMonthYear(budget.month_date)}</span>
                  <p>{formatCurrency(budget.amount)}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <BudgetModal
        isOpen={isManageModalOpen}
        onClose={() => { setIsManageModalOpen(false); setEditingObjective(null); }}
        onBudgetSaved={fetchObjectives}
        budgetToEdit={editingObjective}
      />
      <ReserveMoneyModal
        isOpen={isReserveModalOpen}
        onClose={() => { setIsReserveModalOpen(false); setTargetForReservation(null); }}
        onReserveSuccess={() => {
          fetchObjectives(); 
        }}
        targetObjective={targetForReservation}
      />
    </div>
  );
}