import { useState, useEffect, FormEvent } from 'react';
import api from '../../services/api';
import styles from './Modal.module.css'; // Usamos o mesmo CSS dos outros modais
import { DynamicIcon } from '../DynamicIcon';
import { formatCurrency } from '../../utils/formatters';

// Interface do Objetivo alvo
export interface TargetObjective {
  id: number;           // ID do Orçamento/Objetivo
  name: string;         // Nome (ex: Viagem)
  category_id: number;  // Precisamos disso para criar a transação
}

interface Account {
  id: number;
  name: string;
  initial_balance: string;
}

interface ReserveMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReserveSuccess: () => void;
  targetObjective: TargetObjective | null;
}

export const ReserveMoneyModal = ({ isOpen, onClose, onReserveSuccess, targetObjective }: ReserveMoneyModalProps) => {
  const [amount, setAmount] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10)); // Hoje
  
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carrega as contas quando o modal abre
  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setSelectedAccountId('');
      setDate(new Date().toISOString().substring(0, 10));
      setError(null);
      
      api.get('/accounts')
        .then(res => setAccounts(res.data))
        .catch(err => console.error("Erro ao carregar contas:", err));
    }
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!targetObjective) return;

    setError(null);
    setIsLoading(true);

    // Cria o payload da transação de "Poupança"
    const transactionData = {
      account_id: parseInt(selectedAccountId),
      category_id: targetObjective.category_id, // Usa a categoria do objetivo
      budget_id: targetObjective.id,            // VINCULA AO OBJETIVO!
      amount: parseFloat(amount),
      description: `Reserva para: ${targetObjective.name}`,
      date: date,
      type: 'savings' // Tipo fundamental
    };

    try {
      await api.post('/transactions', transactionData);
      onReserveSuccess(); // Avisa a página pai para atualizar
      onClose();
    } catch (err: any) {
      console.error("Erro ao reservar:", err);
      setError("Falha ao realizar a reserva. Verifique o saldo da conta.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !targetObjective) return null;

  return (
    <div className={styles.overlay} style={{zIndex: 1100}}> {/* Z-index alto para ficar acima de tudo */}
      <div className={styles.content} style={{ maxWidth: '400px' }}>
        <div className={styles.modalHeader} style={{ backgroundColor: 'var(--savings-color)', color: 'white' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <DynamicIcon name="FaPiggyBank" />
            Guardar Dinheiro
          </h2>
          <button onClick={onClose} className={styles.closeButton} style={{ color: 'white' }}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
              Cofre: <strong>{targetObjective.name}</strong>
            </p>

            <div className={styles.formGroup}>
              <label htmlFor="reserveAmount" style={{ fontSize: '1.2rem', color: 'var(--savings-color)' }}>Quanto quer guardar?</label>
              <input
                type="number"
                id="reserveAmount"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="R$ 0,00"
                required
                style={{ fontSize: '1.5rem', padding: '0.8rem', textAlign: 'center', border: '2px solid var(--savings-color)' }}
                autoFocus
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="sourceAccount">Tirar de qual conta?</label>
              <select 
                id="sourceAccount" 
                value={selectedAccountId} 
                onChange={(e) => setSelectedAccountId(e.target.value)}
                required
              >
                <option value="" disabled>Selecione...</option>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({formatCurrency(acc.initial_balance)})
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="reserveDate">Data da Reserva</label>
                <input type="date" id="reserveDate" value={date} onChange={e => setDate(e.target.value)} required />
            </div>

            {error && <p className={styles.formError}>{error}</p>}
          </div>

          <div className={styles.modalFooter}>
            <button 
                type="submit" 
                className={styles.saveButton} 
                disabled={isLoading || !amount || !selectedAccountId}
                style={{ backgroundColor: 'var(--savings-color)', width: '100%', fontSize: '1.1rem' }}
            >
              {isLoading ? "Guardando..." : `Confirmar Reserva de ${amount ? formatCurrency(amount) : ''}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};