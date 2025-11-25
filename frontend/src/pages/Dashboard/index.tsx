import { useEffect, useState } from 'react';
import api from '../../services/api';
import styles from './Dashboard.module.css';
import { formatCurrency } from '../../utils/formatters';
import { ExpensePieChart } from '../../components/charts/ExpensePieChart';
import { BalanceLineChart } from '../../components/charts/BalanceLineChart';
import { BudgetProgressCard } from '../../components/BudgetProgress';

interface DashboardSummary {
  current_balance: string;
  revenue_this_month: string;
  expense_this_month: string;
}
interface ChartData {
  name: string;
  value: number;
  balance: number;
}

interface BudgetData {
  id: number;
  category_name: string;
  category_icon: string | null;
  budgeted_amount: number;
  spent_amount: number;
  month_date: string;
}

const getCurrencyClass = (value: number | string) => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  if (numericValue > 0) return styles.positive;
  if (numericValue < 0) return styles.negative;
  return styles.neutral;
};

const formatMonthYear = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  } catch (e) {
    return dateString;
  }
};

const parseNumericData = (data: any[]) => data.map(item => ({
  ...item,
  value: parseFloat(item.value || '0'),
  balance: parseFloat(item.balance || '0'),
  budgeted_amount: parseFloat(item.budgeted_amount || '0'),
  spent_amount: parseFloat(item.spent_amount || '0'),
}));


export function Dashboard() {

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [pieData, setPieData] = useState<ChartData[]>([]);
  const [lineData, setLineData] = useState<ChartData[]>([]);
  const [monthBudgets, setMonthBudgets] = useState<BudgetData[]>([]);
  const [allBudgets, setAllBudgets] = useState<BudgetData[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [summaryRes, pieRes, lineRes, monthBudgetRes, allBudgetsRes] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/dashboard/expense-by-category'),
          api.get('/dashboard/balance-evolution'),
          api.get('/dashboard/budget-progress'), 
          api.get('/budgets'),                   
        ]);


        setSummary(summaryRes.data);

        setPieData(parseNumericData(pieRes.data));
        setLineData(parseNumericData(lineRes.data));
        
        setMonthBudgets(parseNumericData(monthBudgetRes.data));
        setAllBudgets(parseNumericData(allBudgetsRes.data)); 

      } catch (err) {
        console.error("Erro ao buscar dados do dashboard:", err);
        setError("Não foi possível carregar os dados.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);


  if (isLoading) {
    return <div className={styles.loading}>Carregando dados...</div>;
  }
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }
  if (!summary) {
    return <div>Nenhum dado encontrado.</div>;
  }


  const { 
    current_balance, 
    revenue_this_month, 
    expense_this_month 
  } = summary;
  const month_balance = parseFloat(revenue_this_month) + parseFloat(expense_this_month);

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.summaryGrid}>
        
        <div className={styles.summaryCard}>
          <h3>Balanço Atual</h3>
          <p className={`${styles.currency} ${getCurrencyClass(current_balance)}`}>
            {formatCurrency(current_balance)}
          </p>
        </div>
        
        <div className={styles.summaryCard}>
          <h3>Este Mês</h3>
          <p className={`${styles.currency} ${styles.positive}`}>
            {formatCurrency(revenue_this_month)}
          </p>
          <p className={`${styles.currency} ${getCurrencyClass(month_balance)}`}>
            {formatCurrency(month_balance)}
          </p>
        </div>
        
        <div className={styles.summaryCard}>
          <h3>Despesa (Este Mês)</h3>
          <p className={`${styles.currency} ${styles.negative}`}>
            {formatCurrency(expense_this_month)}
          </p>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h2>Balanço (Últimos 30 dias)</h2>
          <BalanceLineChart data={lineData} />
        </div>
        <div className={styles.chartCard}>
          <h2>Gastos por Categoria (Mês)</h2>
          <ExpensePieChart data={pieData} />
        </div>
      </div>

      {monthBudgets.length > 0 && (
        <div className={styles.chartCard}>
          <h2>Orçamentos (Este Mês)</h2>
          
          {monthBudgets.map((budget) => (
            <BudgetProgressCard
              key={`month-${budget.id}`}
              name={budget.category_name}
              icon={budget.category_icon}
              spent={budget.spent_amount}
              budgeted={budget.budgeted_amount} 
              month_date={null}
            />
          ))}
        </div>
      )}

      {allBudgets.length > 0 && (
        <div className={styles.chartCard}>
          <h2>Todos os Orçamentos</h2>
          
          {allBudgets.map((budget) => (
            <BudgetProgressCard
              key={`all-${budget.id}`}
              name={budget.category_name}
              icon={budget.category_icon}
              spent={budget.spent_amount}
              budgeted={budget.budgeted_amount} 
              month_date={budget.month_date} 
            />
          ))}
        </div>
      )}
    </div>
  );
}