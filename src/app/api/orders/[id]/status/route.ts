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
        partner.metrics.completedOrders += 1;
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
          reason: status === 'failed' ? `${reason}` : undefined,
        });
      } else {
        // Update the existing assignment
        assignment.status = status === 'delivered' ? 'success' : 'failed';
        assignment.timestamp = new Date();
        assignment.reason =
          status === 'failed' ? `${reason}` : undefined;
      }

      // Save the assignment (whether it's newly created or updated)
      await assignment.save();
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

