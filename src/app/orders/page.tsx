"use client"

import { useState, useMemo, useCallback } from "react"
import { Order, OrderFilters, PerformanceMetrics } from "@/types/orders"
import { MetricsCard } from "./metrics-card"
import axios from "axios"
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query"
import { OrderFiltersComponent } from "./order-filters"
import { OrderList } from "./order-list"

const queryClient = new QueryClient()

//main content component
function OrdersPage() {
  const [filters, setFilters] = useState<OrderFilters>({
    status: [],
    areas: [],
    date: "",
  });

  const { data: orders = [], isLoading, error } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await axios.get('/api/orders')
      return data.orders
    },
    staleTime: 1000 * 60  // 1 minutes
  })

  console.log('orders:::', orders);

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter(
      (order) =>
        (filters.status.length === 0 || filters.status.includes(order.status)) &&
        (filters.areas.length === 0 || filters.areas.includes(order.area)) &&
        (filters.date === "" || order.createdAt.toISOString().startsWith(filters.date)),
    )
  }, [orders, filters])

  console.log('filteredOrders:::', filteredOrders);


  const metrics: PerformanceMetrics = useMemo(() => {
    const ordersByStatus: { [key: string]: number } = {}
    const ordersByArea: { [key: string]: number } = {}
    let totalDeliveryTime = 0
    let deliveredOrders = 0

    filteredOrders.forEach((order) => {
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
      totalOrders: filteredOrders.length,
      ordersByStatus,
      ordersByArea,
      averageDeliveryTime,
    }
  }, [filteredOrders])

  console.log('metrics:::', metrics);


  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters)
  }, []);

  const handleAssignPartner = useCallback((orderId: string, partnerId: string) => {
    console.log('orderId:::', orderId);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Orders Dashboard</h1>
      <MetricsCard metrics={metrics} />
      <div className="mt-8">
        <OrderFiltersComponent filters={filters} onFilterChange={handleFilterChange} />
      </div>
      <div className="mt-8">
        <OrderList orders={filteredOrders} onAssignPartner={handleAssignPartner} />
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