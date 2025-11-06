import { useState, useEffect, type FormEvent } from 'react';
import api from '../../services/api';
import styles from './Modal.module.css'; 
import {IconPicker} from '../IconPicker';


interface Category {
  id: number;
  name: string;
  type: 'revenue' | 'expense';
  icon: string | null;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategorySaved: () => void; 
  categoryToEdit: Category | null; 
}

export const CategoryModal = ({ isOpen, onClose, onCategorySaved, categoryToEdit }: CategoryModalProps) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'revenue' | 'expense'>('expense');
  const [selectedIcon, setSelectedIcon] = useState(''); 
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (categoryToEdit) {
     
      setName(categoryToEdit.name);
      setType(categoryToEdit.type);
      setSelectedIcon(categoryToEdit.icon || '');
    } else {
      
      setName('');
      setType('expense');
      setSelectedIcon('');
    }
  }, [categoryToEdit, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const categoryData = {
      name: name,
      type: type,
      icon: selectedIcon|| null,
    };

    try {
      if (categoryToEdit) {
        await api.put(`/categories/${categoryToEdit.id}`, categoryData);
      } else {
        await api.post('/categories', categoryData);
      }
      
      onCategorySaved(); 
      handleClose();       

    } catch (err: any) {
      console.error("Erro ao salvar categoria:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Falha ao salvar. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };


  const handleClose = () => {
    setName('');
    setType('expense');
    setSelectedIcon('');
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
              <label>Ícone</label>
              <IconPicker 
                selectedValue={selectedIcon}
                onSelect={setSelectedIcon}
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