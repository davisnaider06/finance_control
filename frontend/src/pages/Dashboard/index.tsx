

import { useEffect, useState } from 'react';
import api from '../../services/api';
import styles from './Dashboard.module.css';
import { formatCurrency } from '../../utils/formatters';
import { ExpensePieChart } from '../../components/charts/ExpensePieChart';
import { BalanceLineChart } from '../../components/charts/BalanceLineChart';

// --- Interfaces dos dados ---
interface DashboardSummary {
  current_balance: string;
  revenue_this_month: string;
  expense_this_month: string;
  // (Adicione outros campos do summary se houver)
}
interface PieChartData {
  name: string;
  value: number;
}
interface LineChartData {
  name: string; // A data, ex: "04/11"
  balance: number;
}

// --- Funções Helper de Estilo ---
const getCurrencyClass = (value: number | string) => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  if (numericValue > 0) return styles.positive;
  if (numericValue < 0) return styles.negative;
  return styles.neutral;
};

export function Dashboard() {
  // --- Estados ---
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [pieData, setPieData] = useState<PieChartData[]>([]);
  const [lineData, setLineData] = useState<LineChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Efeito para Buscar TODOS os dados ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Usamos Promise.all para buscar tudo em paralelo
        const [summaryRes, pieRes, lineRes] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/dashboard/expense-by-category'),
          api.get('/dashboard/balance-evolution'),
        ]);

        const parsedPieData = pieRes.data.map((item: { name: string, value: string }) => ({
          name: item.name,
          value: parseFloat(item.value)
        }));

        const parsedLineData = lineRes.data.map((item: { name: string, balance: string }) => ({
          name: item.name,
          balance: parseFloat(item.balance)
        }));

        // Salva os dados nos seus respectivos estados
        setSummary(summaryRes.data);
        setPieData(parsedPieData);
        setLineData(parsedLineData);

      } catch (err) {
        console.error("Erro ao buscar dados do dashboard:", err);
        setError("Não foi possível carregar os dados.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // O array vazio '[]' garante que isso rode só uma vez

  // --- Renderização Condicional (Loading, Erro) ---
  if (isLoading) {
    return <div className={styles.loading}>Carregando dados...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  // Se passou por 'isLoading' e 'error', 'summary' não deve ser nulo
  // mas é uma boa prática checar.
  if (!summary) {
    return <div>Nenhum dado encontrado.</div>;
  }

  // --- O JSX Final ---
  const { 
    current_balance, 
    revenue_this_month, 
    expense_this_month 
  } = summary;

  const month_balance = parseFloat(revenue_this_month) + parseFloat(expense_this_month);

  return (
    <div className={styles.dashboardContainer}>
      <h1>Visão Geral</h1>
      
      {/* --- GRID DE CARDS DE RESUMO (Linha 1) --- */}
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
          <p className={`${styles.currency} ${styles.negative}`}>
            {formatCurrency(expense_this_month)}
          </p>
          <p className={`${styles.currency} ${getCurrencyClass(month_balance)}`}>
            {formatCurrency(month_balance)}
          </p>
        </div>
        
        {/* Card de Despesas*/}
        <div className={styles.summaryCard}>
          <h3>Despesa (Este Mês)</h3>
          <p className={`${styles.currency} ${styles.negative}`}>
            {formatCurrency(expense_this_month)}
          </p>
        </div>

      </div>

      {/* GRÁFICO DE LINHA  */}
      <div className={styles.chartCard}>
        <h2>Balanço (Últimos 30 dias)</h2>
        <BalanceLineChart data={lineData} />
      </div>

      <div className={styles.chartCard}>
        <h2>Gastos por Categoria</h2> 
        <ExpensePieChart data={pieData} />
      </div>


    </div>
  );
}