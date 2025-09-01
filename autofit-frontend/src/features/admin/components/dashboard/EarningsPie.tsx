import { Pie, PieChart, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts"

const COLORS = ["#2563eb", "#14b8a6", "#06b6d4"]

export type PieDatum = {
  service: string
  value: number
}

export function EarningsPie({ data }: { data: PieDatum[] }) {
  return (
    <div className="h-64 w-full md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="service"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={6}
          >
            {data.map((entry, index) => (
              <Cell key={entry.service} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Tooltip formatter={(value: number, name: string) => [`${name}: ₹${Number(value).toLocaleString()}`]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}