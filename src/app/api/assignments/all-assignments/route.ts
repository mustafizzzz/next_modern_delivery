import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { AssignmentModel } from '@/model/Assignment';

export async function GET() {
  await dbConnect();

  try {
    // Fetch the assignment metrics
    const assignments = await AssignmentModel.find();

    if (!assignments) {
      return NextResponse.json(
        { success: false, message: 'Assignments not found.' },
        { status: 404 }
      );
    }

    // Return the metrics
    return NextResponse.json(
      { success: true, message: 'Metrics fetched successfully.', assignments },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching assignment: ', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching assignment. Please try again later.' },
      { status: 500 }
    );
  }
}