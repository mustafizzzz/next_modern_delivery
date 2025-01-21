"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, CheckCircle2, Clock, Package, Users, XCircle } from "lucide-react"
import ActiveAssignmentsTable from "./ActiveAssignmentsTable"
import PartnerAvailabilityStatus from "./PartnerAvailabilityStatus"
import { ApiResponse, Assignment, AssignmentMetrics, AssignmentPageProps } from "@/types/assignment"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"

export default function AssignmentDashboard() {
  const { toast } = useToast()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [metrics, setMetrics] = useState<AssignmentMetrics | null>(null)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [metricsResponse, assignmentsResponse] = await Promise.all([
        fetch("api/assignments/metrics"),
        fetch("api/assignments/all-assignments"),
      ])
      const metricsData = await metricsResponse.json()
      const assignmentsData = await assignmentsResponse.json()

      setMetrics(metricsData.metrics)
      setAssignments(assignmentsData.assignments)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const runAssignments = async () => {
    setLoading(true)
    try {
      await fetch("api/assignments/run", { method: "POST" })
      await fetchData()
    } catch (error) {
      console.error("Error running assignments:", error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!metrics || assignments.length === 0) {
    return <div>No data available</div>
  }

  const activePartners = new Set(assignments.map((a) => a.partnerId)).size





  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">

      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Assignment Dashboard</h2>
        <Button onClick={runAssignments}>Run Assignments</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assigned</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalAssigned}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(metrics.successRate * 100).toFixed(2)}%</div>
          </CardContent>
        </Card>


        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(metrics.averageTime / 60000).toFixed(2)} min</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Partners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePartners}</div>
          </CardContent>
        </Card>

      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Active Assignments</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ActiveAssignmentsTable assignments={assignments} />
          </CardContent>
        </Card>
        {/* <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Partner Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <PartnerAvailabilityStatus partners={data.partners} />
          </CardContent>
        </Card> */}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

        {/* <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Failure Reasons</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.metrics.failureReasons.map((reason) => (
                <li key={reason.reason} className="flex items-center">
                  <XCircle className="mr-2 h-4 w-4 text-destructive" />
                  <span className="flex-1">{reason.reason}</span>
                  <span className="font-medium">{reason.count}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card> */}

      </div>
    </div>
  )
}

