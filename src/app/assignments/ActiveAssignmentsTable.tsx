import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Assignment } from "@/types/assignment"

export default function ActiveAssignmentsTable({
  assignments,
}: {
  assignments: Assignment[]
}) {
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Partner ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.map((assignment) => (
            <TableRow key={assignment._id}>
              <TableCell className="font-medium">{assignment.orderId}</TableCell>
              <TableCell>{assignment.partnerId}</TableCell>
              <TableCell>{assignment.status}</TableCell>
              <TableCell>{new Date(assignment.timestamp).toLocaleString()}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setSelectedAssignment(assignment)}>
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Assignment Details</DialogTitle>
                    </DialogHeader>
                    {selectedAssignment && (
                      <div className="mt-4">
                        <p>
                          <strong>Order ID:</strong> {selectedAssignment.orderId}
                        </p>
                        <p>
                          <strong>Partner ID:</strong> {selectedAssignment.partnerId}
                        </p>
                        <p>
                          <strong>Status:</strong> {selectedAssignment.status}
                        </p>
                        <p>
                          <strong>Timestamp:</strong> {new Date(selectedAssignment.timestamp).toLocaleString()}
                        </p>
                        {selectedAssignment.reason && (
                          <p>
                            <strong>Reason:</strong> {selectedAssignment.reason}
                          </p>
                        )}
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

