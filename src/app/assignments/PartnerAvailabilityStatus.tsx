import { Pie, PieChart, ResponsiveContainer, Cell, Legend, Tooltip as RechartsTooltip } from "recharts"
import { CardContent } from "@/components/ui/card"

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

  const COLORS = ["#000000", "#333333", "#666666", "#999999", "#CCCCCC"]

  return (

    <CardContent className="h-[300px] pb-0">
      <ResponsiveContainer width="100%" height="100%">
        {data.some(d => d.value > 0) ? (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip
              formatter={(value: number, name: string) => [`${value}`, name]}
            />
            <Legend />
          </PieChart>
        ) : (
          <div className="flex items-center justify-center h-full">
            No data available
          </div>
        )}
      </ResponsiveContainer>
    </CardContent>

  )
}