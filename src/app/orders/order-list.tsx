"use client"
import { useMemo, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Order } from "@/types/orders"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { DeliveryPartner } from "@/types/partner"
import { toast } from "@/hooks/use-toast"
import axios from "axios"
import { OrderStatusBadge } from "./order-status"

type OrderListProps = {
  orders: Order[]
  partners: DeliveryPartner[]

}


export function OrderList({ orders, partners }: OrderListProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(false);


  console.log('partners', partners);


  const [commandValue, setCommandValue] = useState("")

  // Filter active partners
  const activePartners = useMemo(() => {
    return partners.filter(partner =>
      partner.status === 'active' &&
      partner.currentLoad < 3
    )
  }, [partners])

  // search filtering logic
  const filteredPartners = useMemo(() => {

    return activePartners.filter(partner =>
      partner.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [search, activePartners])




  const handleAssignPartner = async (orderId: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post('/api/orders/assign', { orderId, partnerId: value })
      if (response.data.success) {
        toast({
          title: "Partner assigned",
          description: "The partner has been assigned to the order successfully.",
          variant: "default"
        })
        setValue("")
        setOpen(false)
        setSearch("");
      }

    } catch (error) {
      console.error('Error assigning partner:', error)
      toast({
        title: "Error",
        description: "Error assigning partner. Please try again later.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders List</CardTitle>
      </CardHeader>

      <CardContent>

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
                  {order.status === "pending" && !order.assignedTo ? (
                    <Badge variant="outline" className="capitalize">
                      {order.status}
                    </Badge>
                  ) : (
                    <OrderStatusBadge status={order.status} orderId={order._id} />
                  )}
                </TableCell>
                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                <TableCell>{order.area}</TableCell>
                <TableCell>{order.scheduledFor}</TableCell>
                <TableCell>
                  {order.assignedTo ? partners.find(partner => partner._id === order.assignedTo)?.name : "Unassigned"}
                </TableCell>

                <TableCell>
                  <div className="flex flex-col space-y-3">
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

                    {(order.status === "pending") && (order.assignedTo === "") && (

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm">
                            Assign Partner
                          </Button>
                        </DialogTrigger>

                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Assign Partner</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="partner" className="text-right">
                                Partner
                              </Label>
                              <div className="col-span-3">
                                <Popover open={open} onOpenChange={setOpen}>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      aria-expanded={open}
                                      className="w-[200px] justify-between"
                                    >
                                      {value ? activePartners.find((partner) => partner._id === value)?.name : "Select partner..."}
                                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-[200px] p-0">

                                    <Command shouldFilter={false}>
                                      <CommandInput
                                        placeholder="Search partner..."
                                        value={commandValue}
                                        onValueChange={(newValue) => {
                                          setCommandValue(newValue)
                                          setSearch(newValue)
                                        }}
                                      />
                                      <CommandList>
                                        {filteredPartners.length === 0 ? (
                                          <CommandEmpty>No partner found.</CommandEmpty>
                                        ) : (
                                          <CommandGroup>
                                            {filteredPartners.map((partner) => (
                                              <CommandItem
                                                key={partner._id}
                                                value={partner._id}
                                                onSelect={(currentValue) => {
                                                  setValue(currentValue === value ? "" : currentValue)
                                                  setOpen(false)
                                                }}
                                              >
                                                <Check
                                                  className={cn(
                                                    "mr-2 h-4 w-4",
                                                    value === partner._id ? "opacity-100" : "opacity-0",
                                                  )}
                                                />
                                                {partner.name}
                                              </CommandItem>
                                            ))}
                                          </CommandGroup>
                                        )}
                                      </CommandList>
                                    </Command>

                                  </PopoverContent>
                                </Popover>
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit" onClick={() => handleAssignPartner(order._id)}>
                              {isLoading ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
                                </>
                              ) : (
                                'Assign Partner'
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}

                  </div>

                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>

      </CardContent>
    </Card >
  )
}

// function OrderStatusBadge({ status }: { status: string }) {

//   const getBadgeVariant = (status: string) => {
//     const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
//       pending: "outline",
//       assigned: "secondary",
//       picked: "secondary",
//       delivered: "default",
//       failed: "destructive",
//     }
//     return variants[status] ?? "default"
//   }

//   return (
//     <Badge variant={getBadgeVariant(status)} className="capitalize">
//       {status}
//     </Badge>
//   )
// }

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

