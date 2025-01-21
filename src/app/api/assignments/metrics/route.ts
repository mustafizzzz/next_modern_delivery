import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { AssignmentMetricsModel } from '@/model/AssignmentMetrics';


export async function GET() {
  await dbConnect();

  try {
    // Fetch the assignment metrics
    const metrics = await AssignmentMetricsModel.findOne();

    if (!metrics) {
      return NextResponse.json(
        { success: false, message: 'Metrics not found.' },
        { status: 404 }
      );
    }

    // Return the metrics
    return NextResponse.json(
      { success: true, message: 'Metrics fetched successfully.', metrics },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching assignment metrics: ', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching assignment metrics. Please try again later.' },
      { status: 500 }
    );
  }


}





