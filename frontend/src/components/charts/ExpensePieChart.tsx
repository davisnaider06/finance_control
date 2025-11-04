// Em: frontend/src/components/charts/ExpensePieChart.tsx

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface PieChartData {
  name: string;
  value: number;
}

interface ExpensePieChartProps {
  data: PieChartData[];
}

// Cores para os gomos do gráfico. Pode adicionar mais.
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919'];

export const ExpensePieChart = ({ data }: ExpensePieChartProps) => {
  return (
    // ResponsiveContainer é ESSENCIAL. 
    // Ele faz o gráfico se adaptar ao tamanho do 'div' pai.
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value" // A 'key' que definimos no SQL
          nameKey="name"   // A 'key' que definimos no SQL
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label={(entry) => entry.name} // Mostra o nome da categoria
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
      </PieChart>
    </ResponsiveContainer>
  );
};