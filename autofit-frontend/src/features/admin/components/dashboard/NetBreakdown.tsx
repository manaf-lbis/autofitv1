import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const COLORS = {
  revenue: "#2563eb",
  paid: "#14b8a6",
  deductions: "#06b6d4", 
}

export type NetData = {
  revenue: number
  paid: number
  deductions: number
  net: number
}

export function NetBreakdown({ data }: { data: NetData }) {
  const rows = [
    { name: "Revenue", value: data.revenue, color: COLORS.revenue },
    { name: "Paid", value: data.paid, color: COLORS.paid },
    { name: "Company Profit", value: data.deductions, color: COLORS.deductions },
  ]
  return (
    <div className="h-48 w-full sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} layout="vertical" margin={{ left: 8, right: 8, top: 6, bottom: 6 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted/40" />
          <XAxis type="number" tickFormatter={(v) => `₹${Number(v).toLocaleString()}`} tick={{ fontSize: 12 }} />
          <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v: any) => [`${Number(v).toLocaleString()}`, "Amount"]} />
          <Bar dataKey="value" radius={4} name="Amount">
            {rows.map((r, i) => (
              <Cell key={i} fill={r.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}