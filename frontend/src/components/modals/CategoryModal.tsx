// Em: frontend/src/components/modals/CategoryModal.tsx

import { useState, useEffect, type FormEvent } from 'react';
import api from '../../services/api';
import styles from './Modal.module.css'; // Reutilizamos o CSS!

// 1. --- Interfaces ---
interface Category {
  id: number;
  name: string;
  type: 'revenue' | 'expense';
  icon: string | null;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategorySaved: () => void; // Para recarregar a lista
  categoryToEdit: Category | null; // A categoria a ser editada
}

// 2. --- Componente ---
export const CategoryModal = ({ isOpen, onClose, onCategorySaved, categoryToEdit }: CategoryModalProps) => {
  // 3. --- Estados do Formulário ---
  const [name, setName] = useState('');
  const [type, setType] = useState<'revenue' | 'expense'>('expense');
  const [icon, setIcon] = useState(''); // (Por enquanto, um campo de texto simples)
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 4. --- Lógica de Edição ---
  useEffect(() => {
    if (categoryToEdit) {
      // Modo Edição
      setName(categoryToEdit.name);
      setType(categoryToEdit.type);
      setIcon(categoryToEdit.icon || '');
    } else {
      // Modo Adição
      setName('');
      setType('expense');
      setIcon('');
    }
  }, [categoryToEdit, isOpen]);

  // 5. --- Função de 'Submit' ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const categoryData = {
      name: name,
      type: type,
      icon: icon || null, // Se estiver vazio, envia null
    };

    try {
      if (categoryToEdit) {
        // MODO EDIÇÃO (PUT)
        await api.put(`/categories/${categoryToEdit.id}`, categoryData);
      } else {
        // MODO ADIÇÃO (POST)
        await api.post('/categories', categoryData);
      }
      
      onCategorySaved(); // Avisa a página para recarregar
      handleClose();       // Fecha e limpa o modal

    } catch (err: any) {
      console.error("Erro ao salvar categoria:", err);
      // Pega erros de validação do backend (ex: email já existe)
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Falha ao salvar. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 6. --- Função de Fechar ---
  const handleClose = () => {
    setName('');
    setType('expense');
    setIcon('');
    setError(null);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  const modalTitle = categoryToEdit ? "Editar Categoria" : "Adicionar Nova Categoria";

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        
        <div className={styles.modalHeader}>
          <h2>{modalTitle}</h2>
          <button onClick={handleClose} className={styles.closeButton}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            
            <div className={styles.formGroup}>
              <label htmlFor="categoryName">Nome da Categoria</label>
              <input
                type="text"
                id="categoryName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Salário, Comer fora"
                required
              />
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="categoryType">Tipo</label>
                <select 
                  id="categoryType"
                  value={type}
                  onChange={(e) => setType(e.target.value as 'revenue' | 'expense')}
                  required
                >
                  <option value="expense">Despesa</option>
                  <option value="revenue">Receita</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="categoryIcon">Ícone (Opcional)</label>
                <input
                  type="text"
                  id="categoryIcon"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="Ex: car, home, food"
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