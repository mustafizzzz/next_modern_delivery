import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PerformanceMetrics } from "@/types/orders"

import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"

type MetricsCardProps = {
  metrics: PerformanceMetrics
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export function MetricsCard({ metrics }: MetricsCardProps) {

  const statusData = Object.entries(metrics.ordersByStatus).map(([name, value]) => ({ name, value }))

  const areaData = Object.entries(metrics.ordersByArea).map(([name, value]) => ({ name, value }))

  return (
    <div className="grid gap-4 md:grid-cols-2">

      <Card>
        <CardHeader>
          <CardTitle>Orders by Status</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {statusData.length > 0 ? (
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            ) : (
              <div className="flex items-center justify-center h-full">No data available</div>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>Orders by Area</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {areaData.length > 0 ? (
              <BarChart data={areaData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8">
                  {areaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <div className="flex items-center justify-center h-full">No data available</div>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>Total Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{metrics.totalOrders}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Average Delivery Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{metrics.averageDeliveryTime} min</div>
        </CardContent>
      </Card>
    </div>
  )
}

