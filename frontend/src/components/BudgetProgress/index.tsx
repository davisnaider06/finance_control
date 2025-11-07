import styles from './BudgetProgress.module.css';
import { DynamicIcon } from '../DynamicIcon';
import { formatCurrency } from '../../utils/formatters';

interface BudgetProgressProps {
  name: string;
  icon: string | null;
  spent: number;
  budgeted: number;
  month_date?: string | null;
}

const formatMonthYear = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  } catch (e) {
    return dateString;
  }
};

export const BudgetProgressCard = ({ name, icon, spent, budgeted, month_date }: BudgetProgressProps) => {

  const percent = budgeted > 0 ? Math.max(0, (spent / budgeted) * 100) : 0;
  const barPercent = Math.min(100, percent);
  const remaining = budgeted - spent;
  let barColorClass = styles.fillGreen;
  if (percent > 90) {
    barColorClass = styles.fillRed; 
  } else if (percent > 70) {
    barColorClass = styles.fillYellow;
  }

  return (
    <div className={styles.card}>
      <div className={styles.icon}>
        <DynamicIcon name={icon || 'FaQuestionCircle'} />
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <h4>{name} {month_date && `(${formatMonthYear(month_date)})`}</h4>
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