import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { OrderModel } from '@/model/Order';
import { DeliveryPartnerModel } from '@/model/DeliveryPartner';
import { AssignmentModel } from '@/model/Assignment';
import { AssignmentMetricsModel } from '@/model/AssignmentMetrics';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const { id } = params;
    const { status, reason } = await req.json();



    // Valid statuses for orders
    const validStatuses = ['pending', 'picked', 'delivered', 'failed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status provided.' },
        { status: 400 }
      );
    }

    // Find the order by ID
    const order = await OrderModel.findById(id);
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found.' },
        { status: 404 }
      );
    }

    // If the status is "picked" or "delivered", ensure a partner is assigned
    if ((status === 'picked' || status === 'delivered') && !order.assignedTo) {
      return NextResponse.json(
        { success: false, message: 'Cannot update to this status without a delivery partner assigned.' },
        { status: 400 }
      );
    }

    // Update the order status and save
    order.status = status;
    order.updatedAt = new Date();
    await order.save();
    console.log('status:::::::::', status);

    // Update the delivery partner's load if status is "delivered"
    if (status === 'delivered' && order.assignedTo) {
      const partner = await DeliveryPartnerModel.findById(order.assignedTo);
      if (partner) {
        partner.currentLoad = Math.max(0, partner.currentLoad - 1);
        await partner.save();
      }
    }

    // Make the assignment status
    if (status === 'delivered' || status === 'failed') {
      let assignment = await AssignmentModel.findOne({
        orderId: id,
        partnerId: order.assignedTo,
      });

      // If the assignment doesn't exist, create a new one
      if (!assignment) {
        assignment = new AssignmentModel({
          orderId: id,
          partnerId: order.assignedTo,
          timestamp: new Date(),
          status: status === 'delivered' ? 'success' : 'failed',
          reason: status === 'failed' ? `Status changed to ${status}` : undefined,
        });
      } else {
        // Update the existing assignment
        assignment.status = status === 'delivered' ? 'success' : 'failed';
        assignment.timestamp = new Date();
        assignment.reason =
          status === 'failed' ? `Status changed to ${status}` : undefined;
      }

      // Save the assignment (whether it's newly created or updated)
      await assignment.save();
    }

    // Update metrics only if the order is delivered or failed
    if (status === 'delivered' || status === 'failed') {
      let metrics = await AssignmentMetricsModel.findOne();

      // If no metrics exist, create new metrics
      if (!metrics) {
        metrics = new AssignmentMetricsModel({
          totalAssigned: 0,
          successRate: 0,
          averageTime: 0,
          failureReasons: [],
        });
      }

      // Fetch timestamps of all successful assignments to calculate average time
      const successfulAssignments = await AssignmentModel.find({ status: 'success' }, 'timestamp');
      const assignmentTimestamps = successfulAssignments.map((assignment) => assignment.timestamp);

      // Calculate total time from all successful assignment timestamps
      const totalTime = assignmentTimestamps.reduce(
        (acc, timestamp) => acc + new Date(timestamp).getTime(),
        0
      );

      // Update average time (in milliseconds converted to seconds for clarity)
      if (assignmentTimestamps.length > 0) {
        metrics.averageTime = totalTime / assignmentTimestamps.length / 1000; // Convert ms to seconds
      } else {
        metrics.averageTime = 0;
      }


      interface FailureReason {
        reason: string;
        count: number;
      }

      // Recalculate success rate
      const totalFailures = metrics.failureReasons.reduce((acc: number, fr: FailureReason) => acc + fr.count, 0);
      const successfulCount = metrics.totalAssigned - totalFailures;
      metrics.successRate = successfulCount / metrics.totalAssigned;

      // Update failure reasons
      if (status === 'failed' && reason) {
        const failureReasonIndex = metrics.failureReasons.findIndex(
          (fr: FailureReason) => fr.reason === reason
        );

        if (failureReasonIndex >= 0) {
          metrics.failureReasons[failureReasonIndex].count += 1;
        } else {
          metrics.failureReasons.push({ reason, count: 1 });
        }
      }

      // Save updated metrics
      await metrics.save();
    }



    return NextResponse.json(
      { success: true, message: 'Order status updated successfully.', order },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating order status: ', error);
    return NextResponse.json(
      { success: false, message: 'Error updating order status. Please try again later.' },
      { status: 500 }
    );
  }
}

