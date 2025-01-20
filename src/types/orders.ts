export type Order = {
  _id: string
  orderNumber: string
  customer: {
    name: string
    phone: string
    address: string
  }
  area: string
  items: {
    name: string
    quantity: number
    price: number
  }[]
  status: "pending" | "assigned" | "picked" | "delivered"
  scheduledFor: string // HH:mm
  assignedTo?: string // partner ID
  totalAmount: number
  createdAt: Date
  updatedAt: Date
}


//client types for orders
export type OrderFilters = {
  status: string[]
  areas: string[]
  date: string
}

export type OrdersPageProps = {
  orders: Order[]
  filters: OrderFilters
}

export type PerformanceMetrics = {
  totalOrders: number
  ordersByStatus: {
    [key: string]: number
  }
  ordersByArea: {
    [key: string]: number
  }
  averageDeliveryTime: number
}