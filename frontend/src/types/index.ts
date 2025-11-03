/**
 * Tipos compartilhados pela aplicação frontend.
 */

// Representa o usuário logado (retornado pela rota /api/auth/me)
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

// Representa uma categoria (retornada por /api/categories)
export interface Category {
  id: string;
  name: string;
  userId: string;
}

// Representa uma transação (retornada por /api/transactions)
// Note que o backend retorna 'categoryName' graças ao JOIN
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string; // (string ISO 8601)
  categoryId: string;
  categoryName: string; // (Vem do JOIN no backend)
}
