import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Order } from "@/types/orders"

type OrderListProps = {
  orders: Order[]
  onAssignPartner: (orderId: string, partnerId: string) => void
}

// Dummy data for partners
const partners = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Bob Johnson" },
]

export function OrderList({ orders, onAssignPartner }: OrderListProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order Number</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Total Amount</TableHead>
          <TableHead>Area</TableHead>
          <TableHead>Scheduled For</TableHead>
          <TableHead>Assigned To</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order._id}>
            <TableCell>{order.orderNumber}</TableCell>
            <TableCell>{order.customer.name}</TableCell>
            <TableCell>
              <OrderStatusBadge status={order.status} />
            </TableCell>
            <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
            <TableCell>{order.area}</TableCell>
            <TableCell>{order.scheduledFor}</TableCell>
            <TableCell>{order.assignedTo || "Unassigned"}</TableCell>
            <TableCell>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Order Details</DialogTitle>
                  </DialogHeader>
                  {selectedOrder && <OrderDetails order={selectedOrder} />}
                </DialogContent>
              </Dialog>
              {order.status === "pending" && (
                <Select onValueChange={(partnerId) => onAssignPartner(order._id, partnerId)}>
                  <SelectTrigger className="w-[180px] mt-2">
                    <SelectValue placeholder="Assign Partner" />
                  </SelectTrigger>
                  <SelectContent>
                    {partners.map((partner) => (
                      <SelectItem key={partner.id} value={partner.id}>
                        {partner.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
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

function OrderDetails({ order }: { order: Order }) {
  return (
    <div className="mt-4">
      <h3 className="font-bold">Customer Details:</h3>
      <p>Name: {order.customer.name}</p>
      <p>Phone: {order.customer.phone}</p>
      <p>Address: {order.customer.address}</p>
      <h3 className="font-bold mt-4">Items:</h3>
      <ul className="list-disc list-inside">
        {order.items.map((item, index) => (
          <li key={index}>
            {item.name} - Quantity: {item.quantity}, Price: ${item.price.toFixed(2)}
          </li>
        ))}
      </ul>
      <p className="mt-4">
        <strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}
      </p>
      <p>
        <strong>Created At:</strong> {order.createdAt.toLocaleString()}
      </p>
      <p>
        <strong>Updated At:</strong> {order.updatedAt.toLocaleString()}
      </p>
    </div>
  )
}

