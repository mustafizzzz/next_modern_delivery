import type React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AssignmentMetrics } from "@/types/assignment";

type FailureMetricsChartProps = {
  metrics: AssignmentMetrics
}

const FailureMetricsChart: React.FC<FailureMetricsChartProps> = ({ metrics }) => {
  
  const totalFailures = metrics.failureReasons.reduce((sum, item) => sum + item.count, 0)

  const dataWithPercentage = metrics.failureReasons.map((item) => ({
    ...item,
    percentage: ((item.count / totalFailures) * 100).toFixed(1),
  }))

  return (

    <CardContent className="pb-0">
      <div className="mb-6">
        <p className="text-gray-600">Total Failed Assignments: {totalFailures}</p>
      </div>
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={dataWithPercentage}
            margin={{ top: 20, right: 50, left: 60, bottom: 40 }}
            barSize={40}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="reason"
              textAnchor="end"
              height={60}
              interval={0}
              angle={-45}
            />
            <YAxis
              label={{
                value: "Number of Failures",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle" },
              }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="bg-white p-4 border rounded shadow">
                      <p className="font-medium">{data.reason}</p>
                      <p className="text-sm">Count: {data.count}</p>
                      <p className="text-sm">Percentage: {data.percentage}%</p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar
              dataKey="count"
              fill="#000000"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardContent>

  )
}

export default FailureMetricsChart

