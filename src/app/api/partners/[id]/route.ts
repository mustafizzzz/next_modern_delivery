import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { DeliveryPartnerModel } from '@/model/DeliveryPartner';

export async function PUT(req: Request, { params }: { params: { id: string } }) {

  await dbConnect();
  try {
    const partnerId = params.id;
    const { name, email, phone, status, currentLoad, areas, shift, metrics } = await req.json();

    //any one of the fields is required for updating the partner
    if (!name && !email && !phone && !status && !currentLoad && !areas && !shift && !metrics) {
      return NextResponse.json(
        { success: false, message: 'At least one field is required' },
        { status: 400 }
      );
    }

    // Find the partner by ID
    const partner = await DeliveryPartnerModel.findById(partnerId);

    if (!partner) {
      return NextResponse.json(
        { success: false, message: 'Partner not found' },
        { status: 404 }
      );
    }

    // Update partner information
    partner.name = name || partner.name;
    partner.email = email || partner.email;
    partner.phone = phone || partner.phone;
    partner.status = status || partner.status;
    partner.currentLoad = currentLoad || partner.currentLoad;
    partner.areas = areas || partner.areas;
    partner.shift = shift || partner.shift;
    partner.metrics = metrics || partner.metrics;

    await partner.save();

    return NextResponse.json(
      { success: true, message: 'Partner updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating partner: ', error);
    return NextResponse.json(
      { success: false, message: 'Error updating partner. Please try again later.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {

    const partnerId = params.id;

    // Find and delete the partner by ID
    const partner = await DeliveryPartnerModel.findByIdAndDelete(partnerId);

    if (!partner) {
      return NextResponse.json(
        { success: false, message: 'Partner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Partner deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting partner: ', error);
    return NextResponse.json(
      { success: false, message: 'Error deleting partner. Please try again later.' },
      { status: 500 }
    );
  }
}

