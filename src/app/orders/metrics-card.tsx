import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PerformanceMetrics } from "@/types/orders"
import { XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend, LineChart, Line } from "recharts"
import { Package2, Clock } from "lucide-react"

type MetricsCardProps = {
  metrics: PerformanceMetrics
}

const COLORS = ["#000000", "#333333", "#666666", "#999999", "#CCCCCC"]
const lineColor = '#333333';

export function MetricsCard({ metrics }: MetricsCardProps) {
  const statusData = Object.entries(metrics.ordersByStatus).map(([name, value]) => ({ name, value }))

  const sortedAreaData = Object.entries(metrics.ordersByArea)
    .map(([name, value]) => ({ name, value }))
    .slice(0, 4)

  const formatDeliveryTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`
    } else if (minutes < 1440) {
      const hours = Math.floor(minutes / 60)
      return `${hours} hr${hours > 1 ? "s" : ""}`
    } else {
      const days = Math.floor(minutes / 1440)
      return `${days} day${days > 1 ? "s" : ""}`
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">

      <Card className="hover:bg-gray-50 transition-colors">
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

      <Card className="hover:bg-gray-50 transition-colors">
        <CardHeader>
          <CardTitle>Top 4 Areas by Order Volume</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {sortedAreaData.length > 0 ? (
              <LineChart data={sortedAreaData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#000000"
                  strokeWidth={2}

                  dot={{ fill: lineColor }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            ) : (
              <div className="flex items-center justify-center h-full">
                No data available
              </div>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>


      <Card className="p-6 flex-1 hover:bg-gray-50 transition-colors">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Package2 className="h-10 w-10 text-gray-600" />
          </div>
          <div>
            <h3 className="text-[15px] font-medium text-gray-500 mb-1.5">Total Orders</h3>
            <p className="text-[18px] font-semibold text-gray-900 leading-none">
              {metrics.totalOrders}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 flex-1 hover:bg-gray-50 transition-colors">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Clock className="h-10 w-10 text-gray-600" />
          </div>
          <div>
            <h3 className="text-[15px] font-medium text-gray-500 mb-1.5">Average Delivery Time</h3>
            <p className="text-[18px] font-semibold text-gray-900 leading-none">
              {formatDeliveryTime(metrics.averageDeliveryTime)}
            </p>
          </div>
        </div>
      </Card>

    </div>
  )
}

