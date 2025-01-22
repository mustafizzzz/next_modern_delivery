"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, ShoppingCart, CheckCircle, Star, Loader2, RefreshCw } from "lucide-react"
import "leaflet/dist/leaflet.css"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query"
import { DeliveryPartner } from "@/types/partner"
import axios from "axios"
import { Order } from "@/types/orders"
import { Assignment, AssignmentMetrics } from "@/types/assignment"
// import { ActiveOrderMap } from "ActiveOrderMapActiveOrderMap"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import dynamic from "next/dynamic"

const queryClient = new QueryClient()
const ActiveOrderMap = dynamic(() => import('./ActiveOrderMap').then(mod => mod.ActiveOrderMap), { ssr: false })

function DashboardPage() {

  const [refreshLoade, setRefreshLoade] = useState(false);

  const { data: partners = [], refetch: partnerRefetch } = useQuery<DeliveryPartner[]>({

    queryKey: ["partners"],
    queryFn: async () => {
      try {
        setRefreshLoade(true);
        const { data } = await axios.get("/api/partners");
        return data.partners;
      } catch (error) {
        console.error("Error fetching partners", error);
      } finally {
        setRefreshLoade(false);
      }

    },
    staleTime: 60000,
  });

  const { data: orders = [], refetch: orderRefetch } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      try {
        setRefreshLoade(true);
        const { data } = await axios.get('/api/orders')
        return data.orders
      } catch (error) {
        console.error("Error fetching orders", error);
      } finally {
        setRefreshLoade(false);
      }
    },
    staleTime: 1000 * 60  // 1 minutes
  })

  const { data: assignmentMetrics, refetch: assignmentMetricsRefetch } = useQuery<AssignmentMetrics>(
    {
      queryKey: ["metrics"],
      queryFn: async () => {
        const response = await axios.get("/api/assignments/metrics");
        return response.data.metrics;
      },
      staleTime: 60000
    }
  )

  const { data: assignments = [], refetch: assignmnetRefetch } = useQuery<Assignment[]>(
    {
      queryKey: ["assignments"],
      queryFn: async () => {
        const response = await axios.get("/api/assignments/all-assignments");
        return response.data.assignments;
      },
      staleTime: 60000
    }
  );

  const recentAssignments = useMemo(() => {
    return [...assignments]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [assignments]);

  if (refreshLoade) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }


  const activePartners = partners.filter((p) => p.status === "active")
  const pendingOrders = orders.filter((o) => o.status === "pending")

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button
          onClick={
            async () => {
              try {
                await partnerRefetch();
                await orderRefetch();
                await assignmentMetricsRefetch();
                await assignmnetRefetch();

                toast({
                  title: "Data refreshed",
                  description: "Data has been refreshed successfully",
                })
              } catch (error) {
                console.error("Error refreshing data:", error);
                toast({
                  title: "Error refreshing data",
                  description: "An error occurred while refreshing data",
                  variant: "destructive",
                })
              }
            }
          }
          variant="outline"
          disabled={refreshLoade}
        >
          {refreshLoade ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

        <MetricCard
          title="Active Partners"
          value={`${activePartners.length} / ${partners.length}`}
          description="Currently available for delivery"
          subValue={`${((activePartners.length / partners.length) * 100).toFixed(1)}% Active Rate`}
          icon={<Users className="h-8 w-8 text-muted-foreground" />}
        />
        <MetricCard
          title="Today's Orders"
          value={orders.length.toString()}
          description="Total orders in the system"
          subValue={`${pendingOrders.length} Pending`}
          icon={<ShoppingCart className="h-8 w-8 text-muted-foreground" />}
        />
        <MetricCard
          title="Assignment Success"
          value={`${assignmentMetrics ? (assignmentMetrics.successRate * 100).toFixed(1) : '0.0'}%`}
          description="Today's assignment rate"
          subValue={`${assignmentMetrics ? assignmentMetrics.totalAssigned : '0'} Total Assignments`}
          icon={<CheckCircle className="h-8 w-8 text-muted-foreground" />}
        />
        <MetricCard
          title="Partner Rating"
          value={`${(partners.reduce((sum, p) => sum + p.metrics.rating, 0) / partners.length).toFixed(1)} / 5.0`}
          description="Average partner performance"
          subValue="Based on customer feedback"
          icon={<Star className="h-8 w-8 text-muted-foreground" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">

        <Card className="hover:bg-gray-50">
          <CardHeader>
            <CardTitle>Active Orders Map</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ActiveOrderMap orders={orders} />
          </CardContent>
        </Card>

        <Card className="hover:bg-gray-50">
          <CardHeader>
            <CardTitle>Today&apos;s Scheduled Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Scheduled For</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell>{order.orderNumber}</TableCell>
                      <TableCell>{order.customer.name}</TableCell>
                      <TableCell>{order.scheduledFor}</TableCell>
                      <TableCell>
                        <OrderStatusBadge status={order.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <Card className="hover:bg-gray-50">
          <CardHeader>
            <CardTitle>Partner Availability Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Areas</TableHead>
                    <TableHead>Shift ends</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partners.map((partner) => (
                    <TableRow key={partner._id}>
                      <TableCell>{partner.name}</TableCell>
                      <TableCell>{partner.areas.join(", ")}</TableCell>
                      <TableCell>
                        {partner.shift.end}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={partner.status === "active" ? "default" : "secondary"}
                        >
                          {partner.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="hover:bg-gray-50">
          <CardHeader>
            <CardTitle>Recent Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Partner</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentAssignments.map((assignment) => {
                    const partner = partners.find(p => p._id === assignment.partnerId);
                    const order = orders.find(o => o._id === assignment.orderId);

                    return (
                      <TableRow key={assignment._id}>
                        <TableCell>
                          {new Date(assignment.timestamp).toLocaleTimeString()}
                        </TableCell>
                        <TableCell>
                          {order?.orderNumber || assignment.orderId}
                        </TableCell>
                        <TableCell>
                          {partner?.name || 'Unknown Partner'}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={assignment.status === "success" ? "default" : "destructive"}
                          >
                            {assignment.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

      </div>

    </div>
  )
}

function MetricCard({ title, value, description, subValue, icon }: { title: string, value: string, description: string, subValue: string, icon: React.ReactNode }) {
  return (
    <Card className="hover:bg-gray-50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <div className="text-sm font-medium mt-2 text-muted-foreground">{subValue}</div>
      </CardContent>
    </Card>
  )
}

function OrderStatusBadge({ status }: { status: string }) {

  const getBadgeVariant = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      pending: "outline",
      assigned: "secondary",
      picked: "secondary",
      delivered: "default",
      failed: "destructive",
    }
    return variants[status] ?? "default"
  }

  return (
    <Badge variant={getBadgeVariant(status)} className="capitalize">
      {status}
    </Badge>
  )
}


export default function DashboardPageWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardPage />
    </QueryClientProvider>
  );
}

