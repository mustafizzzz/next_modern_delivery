"use client"

import { useState, useMemo, useCallback } from "react"
import { Order, OrderFilters, PerformanceMetrics } from "@/types/orders"
import { MetricsCard } from "./metrics-card"
import axios from "axios"
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query"
import { OrderFiltersComponent } from "./order-filters"
import { OrderList } from "./order-list"
import { DeliveryPartner } from "@/types/partner"
import { Loader2 } from "lucide-react"

const queryClient = new QueryClient()

//main content component
function OrdersPage() {

  const [filters, setFilters] = useState<OrderFilters>({
    status: [],
    areas: [],
    date: "",
  });

  const [refreshLoade, setRefreshLoade] = useState(false);

  const { data: orders = [], isLoading, refetch } = useQuery<Order[]>({
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

  console.log('orders:::', orders);

  const { data: partners = [] } = useQuery<DeliveryPartner[]>({
    queryKey: ['partners'],
    queryFn: async () => {
      const { data } = await axios.get('/api/partners')
      return data.partners
    },
    staleTime: 1000 * 60
  })


  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter(
      (order) =>
        (filters.status.length === 0 || filters.status.includes(order.status)) &&
        (filters.areas.length === 0 || filters.areas.includes(order.area)) &&
        (filters.date === "" || new Date(order.createdAt).toISOString().startsWith(filters.date)),
    )
  }, [orders, filters])

  console.log('filteredOrders:::', filteredOrders);


  const metrics: PerformanceMetrics = useMemo(() => {
    const ordersByStatus: { [key: string]: number } = {}
    const ordersByArea: { [key: string]: number } = {}
    let totalDeliveryTime = 0
    let deliveredOrders = 0

    orders.forEach((order) => {
      // Count orders by status
      ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1

      // Count orders by area
      ordersByArea[order.area] = (ordersByArea[order.area] || 0) + 1

      // Calculate average delivery time (assuming 'delivered' status and using updatedAt - createdAt)
      if (order.status === "delivered") {
        totalDeliveryTime += new Date(order.updatedAt).getTime() - new Date(order.createdAt).getTime()
        deliveredOrders++
      }
    })

    const averageDeliveryTime =
      deliveredOrders > 0
        ? Math.round(totalDeliveryTime / deliveredOrders / 60000) // Convert to minutes
        : 0

    return {
      totalOrders: orders.length,
      ordersByStatus,
      ordersByArea,
      averageDeliveryTime,
    }
  }, [orders])

  console.log('metrics:::', metrics);

  const availableAreas = useMemo(() => {
    return Array.from(new Set(orders.map(order => order.area)))
  }, [orders])


  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters)
  }, []);



  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Orders Dashboard</h1>
      <MetricsCard metrics={metrics} />
      <div className="mt-8">
        <OrderFiltersComponent filters={filters} onFilterChange={handleFilterChange}
          refetch={refetch} refreshLoade={refreshLoade} availableAreas={availableAreas} />
      </div>
      <div className="mt-4">
        <OrderList orders={filteredOrders} partners={partners} />
      </div>
    </div>
  )
}



// main page component
export default function OrdersPageWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <OrdersPage />
    </QueryClientProvider>
  )
}