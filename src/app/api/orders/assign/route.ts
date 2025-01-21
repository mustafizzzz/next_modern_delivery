import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { OrderModel } from '@/model/Order';
import { DeliveryPartnerModel } from '@/model/DeliveryPartner';
import { AssignmentMetricsModel } from '@/model/AssignmentMetrics';

export async function POST(req: Request) {
  await dbConnect();

  try {
    // Get the data from the request body
    const { orderId, partnerId } = await req.json();

    // Validate the input
    if (!orderId || !partnerId) {
      return NextResponse.json(
        { success: false, message: 'Order ID and Partner ID are required.' },
        { status: 400 }
      );
    }

    // Check if the order exists
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found.' },
        { status: 404 }
      );
    }

    // Check if the delivery partner exists and is available
    const partner = await DeliveryPartnerModel.findById(partnerId);
    if (!partner) {
      return NextResponse.json(
        { success: false, message: 'Delivery partner not found.' },
        { status: 404 }
      );
    }

    if (partner.status === 'inactive') {
      return NextResponse.json(
        { success: false, message: 'Partner is inactive and cannot be assigned.' },
        { status: 400 }
      );
    }

    // Assign the partner to the order
    order.assignedTo = partnerId;
    order.status = 'assigned';
    await order.save();

    partner.currentLoad += 1;
    await partner.save();


    // Fetch existing metrics or initialize if not present
    let metrics = await AssignmentMetricsModel.findOne();
    if (!metrics) {
      metrics = new AssignmentMetricsModel({
        totalAssigned: 0,
        successRate: 0,
        averageTime: 0,
        failureReasons: [],
      });
    }
    metrics.totalAssigned += 1;

    await metrics.save();

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Partner assigned to the order successfully.',
        order,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error assigning partner to order: ', error);
    return NextResponse.json(
      { success: false, message: 'Error assigning partner to order. Please try again later.' },
      { status: 500 }
    );
  }
}
