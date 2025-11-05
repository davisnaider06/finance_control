// Em: frontend/src/components/DynamicIcon/index.tsx

import React from 'react';
// Importa TODOS os ícones da biblioteca "Font Awesome" (fa)
import * as FaIcons from 'react-icons/fa';

interface DynamicIconProps {
  name: string; // O nome do ícone que salvamos, ex: "FaCar", "FaHome"
}

// Mapeamento de tipo para o TS entender que o 'name' é uma chave válida
type FaIconKeys = keyof typeof FaIcons;

export const DynamicIcon = ({ name }: DynamicIconProps) => {
  // 1. Verifica se o nome do ícone é válido
  const iconKey = name as FaIconKeys;
  if (!FaIcons[iconKey]) {
    // Se o ícone não for encontrado, renderiza um ícone padrão (ex: um círculo)
    return <FaIcons.FaCircle size={20} />; 
  }

  // 2. Renderiza o ícone dinamicamente
  const IconComponent = FaIcons[iconKey];
  return <IconComponent size={20} />;
};