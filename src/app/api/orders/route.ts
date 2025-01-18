import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { OrderModel } from '@/model/Order';


export async function POST(req: Request) {
  await dbConnect();

  try {
    const { customer, area, items, status, scheduledFor, totalAmount } = await req.json();

    // Validate required fields
    if (!customer || !customer.name || !customer.phone || !customer.address) {
      return NextResponse.json(
        { success: false, message: 'Customer details are required' },
        { status: 400 }
      );
    }
    if (!area || !items || items.length === 0 || !totalAmount) {
      return NextResponse.json(
        { success: false, message: 'Order details are incomplete' },
        { status: 400 }
      );
    }

    // Create new order object
    const newOrder = new OrderModel({
      orderNumber: `ORD-${Date.now()}`,
      customer,
      area,
      items,
      status: status || 'pending',
      scheduledFor,
      assignedTo: '',
      totalAmount,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newOrder.save();

    return NextResponse.json(
      { success: true, message: 'Order created successfully', newOrder },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating order: ', error);
    return NextResponse.json(
      { success: false, message: 'Error creating order. Please try again later.' },
      { status: 500 }
    );
  }
}


export async function GET(req: Request) {
  await dbConnect();

  try {
    const orders = await OrderModel.find();

    // If no orders are found
    if (orders.length === 0) {
      return NextResponse.json(
        { success: true, message: 'No orders found.' },
        { status: 200 }
      );
    }

    // Return fetched orders
    return NextResponse.json(
      { success: true, orders },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching orders: ', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching orders. Please try again later.' },
      { status: 500 }
    );
  }
}

