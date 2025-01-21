import { Pie, PieChart, ResponsiveContainer, Cell, Legend } from "recharts"

export default function PartnerAvailabilityStatus({
  partners,
}: {
  partners: {
    available: number
    busy: number
    offline: number
  }
}) {
  const data = [
    { name: "Available", value: partners.available },
    { name: "Busy", value: partners.busy },
    { name: "Offline", value: partners.offline },
  ]

  const COLORS = ["#4ade80", "#facc15", "#f87171"]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

