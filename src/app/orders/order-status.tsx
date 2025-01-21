import { useState } from 'react'
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from '@/components/ui/textarea'

interface OrderStatusBadgeProps {
  status: string
  orderId: string
}

export function OrderStatusBadge({ status, orderId }: OrderStatusBadgeProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [reason, setReason] = useState("")
  const [pendingStatus, setPendingStatus] = useState<string | null>(null)
  const { toast } = useToast()

  const statuses = ['picked', 'delivered', 'failed']

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

  const handleStatusUpdate = async (newStatus: string) => {
    console.log('pendingStatus:::', pendingStatus);

    if (newStatus === 'failed') {
      setPendingStatus(newStatus)
      setShowDialog(true)
      return
    }

    try {
      setIsLoading(true)
      const response = await axios.put(`/api/orders/${orderId}/status`, { status: newStatus })
      if (response.data.success) {
        toast({
          title: "Status Updated",
          description: `Order status changed to ${newStatus}`,
        })
      }
    } catch (error) {
      console.error("Error in handleStatusUpdate", error)
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFailedSubmit = async () => {
    try {
      setIsLoading(true)
      const response = await axios.put(`/api/orders/${orderId}/status`, {
        status: 'failed',
        reason
      })
      if (response.data.success) {
        setShowDialog(false)
        setPendingStatus(null)
        setReason("")
        toast({
          title: "Status Updated",
          description: "Order marked as failed",
        })
      } else {
        toast({
          title: "Status Updated",
          description: response.data.message,
          "variant": "destructive"
        })

      }
    } catch (error) {
      console.error("Error in handleFailedSubmit", error)
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Badge
            variant={getBadgeVariant(status)}
            className="cursor-pointer hover:opacity-80"
          >
            {status}
          </Badge>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {statuses.map((s) => (
            <DropdownMenuItem
              key={s}
              onClick={() => handleStatusUpdate(s)}
              disabled={isLoading}
            >
              {s}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Failure Reason</DialogTitle>
          </DialogHeader>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why did the delivery fail?"
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDialog(false)
                setPendingStatus(null)
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleFailedSubmit}
              disabled={!reason || isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}