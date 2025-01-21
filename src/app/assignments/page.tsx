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
import { DeliveryPartner } from "@/types/partner"

export default function AssignmentDashboard() {
  const { toast } = useToast()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [metrics, setMetrics] = useState<AssignmentMetrics | null>(null)
  const [partners, setPartners] = useState<DeliveryPartner[]>([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [metricsResponse, assignmentsResponse, partnersResponse] = await Promise.all([
        axios.get("/api/assignments/metrics"),
        axios.get("/api/assignments/all-assignments"),
        axios.get("/api/partners")
      ])

      setMetrics(metricsResponse.data.metrics)
      setAssignments(assignmentsResponse.data.assignments)
      setPartners(partnersResponse.data.partners)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch assignments data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const runAssignments = async () => {
    setLoading(true)
    try {
      await axios.post("/api/assignments/run")
      await fetchData()
      toast({
        title: "Success",
        description: "Assignments processed successfully",
      })
    } catch (error) {
      console.error("Error running assignments:", error)
      toast({
        title: "Error",
        description: "Failed to process assignments",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!metrics || assignments.length === 0) {
    return <div>No data available</div>
  }

  const activePartners = new Set(
    partners
      .filter(p => p.status === 'active')
      .map(p => p._id)
  ).size

  const calculatePartnerMetrics = (partners: DeliveryPartner[]) => {
    const availablePartners = partners.filter(p =>
      p.status === 'active' && p.currentLoad < 3
    ).length;

    const busyPartners = partners.filter(p =>
      p.status === 'active' && p.currentLoad >= 3
    ).length;

    const offlinePartners = partners.filter(p =>
      p.status === 'inactive'
    ).length;

    return {
      available: availablePartners,
      busy: busyPartners,
      offline: offlinePartners
    };
  }

  const partnerMetrics = calculatePartnerMetrics(partners);

  console.log("assignments:::", assignments);
  console.log("metrics:::", metrics);







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
            <div className="text-2xl font-bold">{(metrics.successRate * 100)}%</div>
          </CardContent>
        </Card>


        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.averageTime > 3600000
                ? `${(metrics.averageTime / 3600000).toFixed(2)} hrs`
                : `${(metrics.averageTime / 60000).toFixed(2)} min`
              }
            </div>
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
            <ActiveAssignmentsTable assignments={assignments} partners={partners} />
          </CardContent>
        </Card>

        <Card className="col-span-3 hover:bg-gray-50 transition-colors">
          <CardHeader>
            <CardTitle>Partner Availability</CardTitle>
          </CardHeader>
          <PartnerAvailabilityStatus partners={partnerMetrics} />
        </Card>

      </div>
    </div>
  )
}

