import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Mon', tasks: 12 },
  { day: 'Tue', tasks: 15 },
  { day: 'Wed', tasks: 8 },
  { day: 'Thu', tasks: 18 },
  { day: 'Fri', tasks: 14 },
  { day: 'Sat', tasks: 10 },
  { day: 'Sun', tasks: 16 },
];

export function ActivityChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="day"
          tick={{ fill: '#64748b' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#64748b' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          }}
          cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
        />
        <Bar
          dataKey="tasks"
          fill="#3b82f6"
          radius={[8, 8, 0, 0]}
          isAnimationActive={true}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
