// Em: frontend/src/components/charts/ExpensePieChart.tsx

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// <<< MUDANÇA 1: Adicionar a "index signature" [key: string]: any
// Isso diz ao TypeScript que, além de 'name' e 'value',
// o objeto pode ter qualquer outra chave, o que satisfaz o 'recharts'.
interface PieChartData {
  name: string;
  value: number;
  [key: string]: any; 
}

interface ExpensePieChartProps {
  data: PieChartData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919'];

export const ExpensePieChart = ({ data }: ExpensePieChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label={(entry) => entry.name}
        >
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
      </PieChart>
    </ResponsiveContainer>
  );
};