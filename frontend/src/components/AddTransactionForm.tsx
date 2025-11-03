import React, { useState, type FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { type Category, type Transaction } from '../types/index';

interface AddTransactionFormProps {
  categories: Category[];
  onTransactionAdded: (newTransaction: Transaction) => void; // Callback para atualizar o dashboard
  onClose: () => void; // Para fechar o modal
}

export const AddTransactionForm = ({ 
  categories, 
  onTransactionAdded, 
  onClose 
}: AddTransactionFormProps) => {
  
  // Estado do formulário
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Hoje
  const [categoryId, setCategoryId] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { token } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validação
    if (!description || !amount || !categoryId || !date) {
      setError('Por favor, preencha todos os campos.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          description,
          amount: parseFloat(amount), // Backend espera um número
          type,
          date: new Date(date).toISOString(), // Backend espera ISO string
          categoryId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // 'data.errors' vem do nosso middleware Zod no backend!
        const errorMsg = data.message || (data.errors ? JSON.stringify(data.errors) : 'Erro desconhecido');
        throw new Error(errorMsg);
      }
      
      // Sucesso!
      // O 'data' retornado pelo backend é a transação completa
      // Precisamos "enriquecer" ela com o nome da categoria para o frontend
      const categoryName = categories.find(c => c.id === categoryId)?.name || 'Desconhecida';
      const newTransaction: Transaction = { ...data, categoryName };

      onTransactionAdded(newTransaction); // Atualiza o estado no Dashboard
      onClose(); // Fecha o modal

    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Ocorreu um erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
      {/* Exibição de Erro */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center" role="alert">
          <span>{error}</span>
        </div>
      )}

      {/* Tipo: Receita / Despesa */}
      <fieldset>
        <div className="flex gap-4">
          <Label 
            className={`w-full text-center p-3 rounded-lg border-2 cursor-pointer ${type === 'income' ? 'bg-green-100 border-green-500' : 'bg-gray-100'}`}
          >
            <input 
              type="radio" 
              name="type" 
              value="income" 
              checked={type === 'income'} 
              onChange={() => setType('income')}
              className="sr-only" // Esconde o radio button
            />
            Receita
          </Label>
          <Label 
            className={`w-full text-center p-3 rounded-lg border-2 cursor-pointer ${type === 'expense' ? 'bg-red-100 border-red-500' : 'bg-gray-100'}`}
          >
            <input 
              type="radio" 
              name="type" 
              value="expense" 
              checked={type === 'expense'} 
              onChange={() => setType('expense')}
              className="sr-only"
            />
            Despesa
          </Label>
        </div>
      </fieldset>

      <div className="space-y-1">
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Salário, Aluguel"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="amount">Valor (R$)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0,00"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="date">Data</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="category">Categoria</Label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-100"
        >
          <option value="" disabled>Selecione uma categoria</option>
          {categories.length > 0 ? (
            categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))
          ) : (
            <option disabled>Carregando categorias...</option>
          )}
        </select>
        {/* TODO: Adicionar um botão para criar categoria */}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar Transação'}
      </Button>
    </form>
  );
};

