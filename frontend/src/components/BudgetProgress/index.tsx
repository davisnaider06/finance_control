// Em: frontend/src/components/BudgetProgress/index.tsx

import styles from './BudgetProgress.module.css';
import { DynamicIcon } from '../DynamicIcon';
import { formatCurrency } from '../../utils/formatters';

interface BudgetProgressProps {
  name: string;
  icon: string | null;
  spent: number;
  budgeted: number;
}

export const BudgetProgressCard = ({ name, icon, spent, budgeted }: BudgetProgressProps) => {
  // 1. Calcula a porcentagem gasta (ex: 150 / 400 = 0.375)
  // Usamos Math.max(0, ...) e Math.min(100, ...) para garantir que fique entre 0% e 100%
  const percent = budgeted > 0 ? Math.max(0, (spent / budgeted) * 100) : 0;
  
  // Limita a barra em 100% (mesmo que gaste 200%)
  const barPercent = Math.min(100, percent);

  // 2. Calcula o valor restante
  const remaining = budgeted - spent;

  // 3. Define a cor da barra de progresso
  let barColorClass = styles.fillGreen;
  if (percent > 90) {
    barColorClass = styles.fillRed; // Mais de 90% gasto = Vermelho
  } else if (percent > 70) {
    barColorClass = styles.fillYellow; // Mais de 70% gasto = Amarelo
  }

  return (
    <div className={styles.card}>
      <div className={styles.icon}>
        <DynamicIcon name={icon || 'FaQuestionCircle'} />
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <h4>{name}</h4>
          {/* Mostra a porcentagem (ex: 38%) */}
          <span>{percent.toFixed(0)}%</span>
        </div>
        
        <div className={styles.progressBarBackground}>
          <div 
            className={`${styles.progressBarFill} ${barColorClass}`}
            style={{ width: `${barPercent}%` }}
          />
        </div>
        
        <div className={styles.footer}>
          <span className={styles.spent}>{formatCurrency(spent)}</span>
          <span className={styles.remaining}>
            {remaining >= 0 
              ? `${formatCurrency(remaining)} restantes`
              : `${formatCurrency(Math.abs(remaining))} acima`}
          </span>
        </div>
      </div>
    </div>
  );
};