// Em: frontend/src/pages/Categories/index.tsx

import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import styles from './Categories.module.css';
import { CategoryModal } from '../../components/modals/CategoryModal'; 
import { DynamicIcon } from '../../components/DynamicIcon';
// ... (Interface Category)
interface Category {
  id: number;
  name: string;
  type: 'revenue' | 'expense';
  icon: string | null;
}

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // <<< MUDANÇA: Estados para controlar o Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // ... (fetchCategories e useEffect continuam iguais)
  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (err) {
      console.error("Erro ao buscar categorias:", err);
      setError("Não foi possível carregar as categorias.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // ... (handleDelete continua o mesmo)
  const handleDelete = async (categoryId: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta categoria?")) {
      try {
        await api.delete(`/categories/${categoryId}`);
        fetchCategories(); 
      } catch (err: any) { 
        if (err.response && err.response.data && err.response.data.message) {
          alert(err.response.data.message);
        } else {
          alert("Não foi possível excluir a categoria.");
        }
      }
    }
  };

  // <<< MUDANÇA: Funções para abrir/fechar o modal
  
  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleCategorySaved = () => {
    fetchCategories();
  };


  return (
    <div className={styles.categoriesContainer}>
      <div className={styles.header}>
        {/* <<< MUDANÇA: Botão agora abre o modal */}
        <button onClick={handleOpenAddModal} className={styles.addButton}>
          Adicionar Categoria
        </button>
      </div>

      <div className={styles.listWrapper}>
        {categories.length > 0 ? (
          categories.map(category => (
            <div key={category.id} className={styles.listItem}>
                <div className={styles.categoryIcon}>
                <DynamicIcon name={category.icon || 'FaCircle'} />
              </div>
              <div className={styles.categoryInfo}>
                <h3>{category.name}</h3>
                <span style={{ color: category.type === 'revenue' ? 'var(--color-green)' : 'var(--color-red)' }}>
                  {category.type === 'revenue' ? 'Receita' : 'Despesa'}
                </span>
              </div>
              <div className={styles.categoryActions}>
                {/* <<< MUDANÇA: Botão de editar agora funciona */}
                <button 
                  onClick={() => handleOpenEditModal(category)}
                  className={styles.editButton}
                >
                  ✏️
                </button>
                <button 
                  onClick={() => handleDelete(category.id)} 
                  className={styles.deleteButton}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        ) : (
          !isLoading && <p style={{ padding: '1.5rem' }}>Nenhuma categoria cadastrada.</p>
        )}
        {isLoading && <div className={styles.loading}>Carregando...</div>}
      </div>

      {/* <<< MUDANÇA: O Modal de Adicionar/Editar */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCategorySaved={handleCategorySaved}
        categoryToEdit={editingCategory}
      />

    </div>
  );
}