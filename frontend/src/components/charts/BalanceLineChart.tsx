// Em: frontend/src/components/charts/BalanceLineChart.tsx

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/formaters'; 

interface LineChartData {
  name: string; // A data, ex: "04/11"
  balance: number;
}

interface BalanceLineChartProps {
  data: LineChartData[];
}

export const BalanceLineChart = ({ data }: BalanceLineChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={(value) => formatCurrency(value)} />
        <Tooltip formatter={(value: number) => formatCurrency(value)} />
        <Line 
          type="monotone" 
          dataKey="balance" 
          stroke="#004a99" // Mesmo azul da sidebar
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 8 }} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};