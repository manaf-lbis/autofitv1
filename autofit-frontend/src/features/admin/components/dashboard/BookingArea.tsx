import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const COLORS = {
  live: "#2563eb",
  pretrip: "#14b8a6",
  roadside: "#06b6d4",
}

export type BookingsPoint = {
  label: string
  live: number
  pretrip: number
  roadside: number
}

export function BookingsArea({
  data,
  range,
}: {
  data: BookingsPoint[]
  range: "day" | "month" | "year"
}) {
  const singlePoint = range === "day"
  return (
    <div className="h-64 w-full md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: 6, right: 6, top: 6, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted/40" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} interval={singlePoint ? 0 : "preserveEnd"} tick={{ fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value: number, name: string) => [`${name}: ${value}`]} labelFormatter={(label) => label} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Area
            type="monotone"
            dataKey="live"
            stackId="1"
            stroke={COLORS.live}
            fill={COLORS.live}
            fillOpacity={0.18}
            name="Live Assistance"
          />
          <Area
            type="monotone"
            dataKey="pretrip"
            stackId="1"
            stroke={COLORS.pretrip}
            fill={COLORS.pretrip}
            fillOpacity={0.18}
            name="Pretrip Checkup"
          />
          <Area
            type="monotone"
            dataKey="roadside"
            stackId="1"
            stroke={COLORS.roadside}
            fill={COLORS.roadside}
            fillOpacity={0.18}
            name="Roadside Assistance"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}