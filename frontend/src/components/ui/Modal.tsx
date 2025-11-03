import React, { type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

/**
 * Componente simples de Modal reutilizável.
 */
export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    // Overlay (fundo)
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      {/* Conteúdo do Modal */}
      <div
        className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800 m-4"
        onClick={(e) => e.stopPropagation()} // Impede de fechar ao clicar no conteúdo
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between pb-4 border-b dark:border-gray-700">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Corpo (onde o formulário vai entrar) */}
        <div className="mt-6">
          {children}
        </div>
      </div>
    </div>
  );
};
