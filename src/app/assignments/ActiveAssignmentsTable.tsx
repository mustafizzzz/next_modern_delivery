import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Assignment } from "@/types/assignment"
import { DeliveryPartner } from "@/types/partner"
import { Badge } from "@/components/ui/badge"

export default function ActiveAssignmentsTable({
  assignments,
  partners
}: {
  assignments: Assignment[],
  partners: DeliveryPartner[]
}) {
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const getPartnerDetails = (partnerId: string) => {
    return partners.find(partner => partner._id === partnerId)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Partner</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>

          {assignments.map((assignment) => {
            const partner = getPartnerDetails(assignment.partnerId)
            return (
              <TableRow key={assignment._id}>
                <TableCell>
                  {partner ? (
                    <div>
                      <div className="font-medium">{partner.name}</div>
                      <div className="text-sm text-muted-foreground">{partner.phone}</div>
                    </div>
                  ) : 'Unknown Partner'}
                </TableCell>
                <TableCell>
                  <Badge variant={assignment.status === 'success' ? 'default' : 'destructive'}>
                    {assignment.status}
                  </Badge>
                </TableCell>
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
                        <div className="mt-4 space-y-4">
                          <div>
                            <strong>Order ID:</strong> {selectedAssignment.orderId}
                          </div>
                          {partner && (
                            <div className="space-y-2">
                              <div>
                                <strong>Partner Name:</strong> {partner.name}
                              </div>
                              <div>
                                <strong>Contact:</strong> {partner.phone}
                              </div>
                              <div>
                                <strong>Email:</strong> {partner.email}
                              </div>
                            </div>
                          )}
                          <div>
                            <strong>Status:</strong>{' '}
                            <Badge variant={selectedAssignment.status === 'success' ? 'default' : 'destructive'}>
                              {selectedAssignment.status}
                            </Badge>
                          </div>
                          <div>
                            <strong>Timestamp:</strong>{' '}
                            {new Date(selectedAssignment.timestamp).toLocaleString()}
                          </div>
                          {selectedAssignment.reason && (
                            <div>
                              <strong>Failure Reason:</strong> {selectedAssignment.reason}
                            </div>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </>
  )
}

