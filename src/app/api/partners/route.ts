import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { DeliveryPartnerModel } from '@/model/DeliveryPartner';

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { name, email, phone, status, currentLoad, areas, shift, metrics } = await req.json();
    console.log('Request body: ', req.body);

    // Check if partner already exists
    const existingPartner = await DeliveryPartnerModel.findOne({ email });

    if (existingPartner) {
      return NextResponse.json(
        { success: false, message: 'Partner already exists with this email' },
        { status: 400 }
      );
    }

    // Create new partner
    const newPartner = new DeliveryPartnerModel({
      name,
      email,
      phone,
      status,
      currentLoad,
      areas,
      shift,
      metrics
    });

    await newPartner.save();

    return NextResponse.json(
      { success: true, message: 'Partner created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating partner: ', error);
    return NextResponse.json(
      { success: false, message: 'Error creating partner. Please try again later.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  await dbConnect();
  try {
    const partners = await DeliveryPartnerModel.find();

    if (!partners) {
      return NextResponse.json(
        { success: false, message: 'No partners found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Partner fetched successfully", partners });

  } catch (error) {
    console.error('Error fetching partners: ', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching partners. Please try again later.' },
      { status: 500 }
    );
  }
}
