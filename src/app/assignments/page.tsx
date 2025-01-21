"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, Loader2, Package, RefreshCw, Users } from "lucide-react"
import ActiveAssignmentsTable from "./ActiveAssignmentsTable"
import PartnerAvailabilityStatus from "./PartnerAvailabilityStatus"
import { Assignment, AssignmentMetrics } from "@/types/assignment"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import { DeliveryPartner } from "@/types/partner"
import FailureMetricsChart from "./FailureMetricsChart"
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query"

const queryClient = new QueryClient();

function AssignmentDashboard() {
  const { toast } = useToast()
  const [runAssesmentLoading, setRunAssesmmentLoading] = useState(false);

  const { data: metrics, isLoading: metricsLoading } = useQuery<AssignmentMetrics>(
    {
      queryKey: ["metrics"],
      queryFn: async () => {
        const response = await axios.get("/api/assignments/metrics");
        return response.data.metrics;
      },
      staleTime: 60000
    }
  )

  const { data: assignments = [], isLoading: assignmentsLoading } = useQuery<Assignment[]>(
    {
      queryKey: ["assignments"],
      queryFn: async () => {
        const response = await axios.get("/api/assignments/all-assignments");
        return response.data.assignments;
      },
      staleTime: 60000
    }
  );

  const { data: partners = [], isLoading: partnersLoading } = useQuery<DeliveryPartner[]>(
    {
      queryKey: ["partners"],
      queryFn: async () => {
        const response = await axios.get("/api/partners");
        return response.data.partners;
      },
      staleTime: 60000
    }
  );

  const runAssignments = async () => {
    try {
      setRunAssesmmentLoading(true);
      await axios.post("/api/assignments/run");
      toast({
        title: "Success",
        description: "Assignments refetch successfully",
      });

      // Manually refetch the data after the POST request
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      queryClient.invalidateQueries({ queryKey: ["partners"] });


    } catch (error) {
      console.error("Error running assignments:", error);
      toast({
        title: "Error",
        description: "Failed to process assignments",
        variant: "destructive",
      });
    } finally {
      setRunAssesmmentLoading(false);
    }
  };

  const loading = metricsLoading || assignmentsLoading || partnersLoading;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!metrics || !assignments || assignments.length === 0) {
    return <div>No data available</div>;
  }

  const activePartners = partners ? new Set(
    partners
      .filter(p => p.status === 'active')
      .map(p => p._id)
  ).size : 0;

  const calculatePartnerMetrics = (partners: DeliveryPartner[]) => {
    const availablePartners = partners.filter(p =>
      p.status === 'active' && p.currentLoad < 3
    ).length;

    const busyPartners = partners.filter(p =>
      p.status === 'active' && p.currentLoad >= 2
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
        <Button onClick={runAssignments} disabled={runAssesmentLoading}>
          {
            runAssesmentLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
              </>
            ) : <>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </>
          }
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        <MetricCard title="Total Assigned" value={metrics.totalAssigned} icon={Package} />
        <MetricCard title="Success Rate" value={`${(metrics.successRate * 100).toFixed(1)}%`} icon={CheckCircle2} />
        <MetricCard title="Average Time"
          value={metrics.averageTime > 3600000
            ? `${(metrics.averageTime / 3600000).toFixed(2)} hrs`
            : `${(metrics.averageTime / 60000).toFixed(2)} min`
          }
          icon={Clock} />

        <MetricCard title="Active Partners" value={activePartners} icon={Users} />

      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Left Column: Active Assignments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Active Assignments</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ActiveAssignmentsTable assignments={assignments} partners={partners} />
          </CardContent>
        </Card>

        {/* Right Column: Partner Availability and Failure Reasons */}
        <div className="grid gap-4">

          <Card className="hover:bg-gray-50 transition-colors">
            <CardHeader>
              <CardTitle>Partner Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <PartnerAvailabilityStatus partners={partnerMetrics} />
            </CardContent>
          </Card>

          {/* Failure Reasons */}
          <Card className="hover:bg-gray-50 transition-colors">
            <CardHeader>
              <CardTitle>Failure Reasons</CardTitle>
            </CardHeader>

            <FailureMetricsChart metrics={metrics} />

          </Card>
        </div>
      </div>


    </div>
  )
}

function MetricCard({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ElementType; }) {
  return (

    <Card className="p-6 flex-1 hover:bg-gray-50 transition-colors">
      <div className="flex items-start space-x-4">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Icon className="h-10 w-10 text-gray-600" />
        </div>
        <div>
          <h3 className="text-[15px] font-medium text-gray-500 mb-1.5">{title}</h3>
          <p className="text-[18px] font-semibold text-gray-900 leading-none">{value}</p>
        </div>
      </div>
    </Card>
  )
}



export default function AssignmentDashboardWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <AssignmentDashboard />
    </QueryClientProvider>
  );
}

