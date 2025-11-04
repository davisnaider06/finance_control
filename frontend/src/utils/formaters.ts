// Em: frontend/src/utils/formatters.ts

// Usamos a API 'Intl' nativa do JavaScript para formatar moedas.
// Isso é muito melhor do que tentar fazer com strings.
const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL', // Vamos usar Real (BRL). Mude para 'EUR' se quiser Euro.
});

export const formatCurrency = (value: number | string) => {
  // Converte o valor (que vem do banco como string) para número
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;

  // Se não for um número válido, retorna um traço
  if (isNaN(numericValue)) {
    return '—';
  }

  return currencyFormatter.format(numericValue);
};