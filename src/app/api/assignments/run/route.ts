import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { AssignmentModel } from '@/model/Assignment';
import { AssignmentMetricsModel } from '@/model/AssignmentMetrics';

export async function POST(req: Request) {
  await dbConnect();

  try {
    // Fetch all successful assignments for recalculating metrics
    const successfulAssignments = await AssignmentModel.find({ status: 'success' });

    if (successfulAssignments.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No successful assignments found to process.' },
        { status: 400 }
      );
    }

    // Fetch existing metrics or create new if not present
    let metrics = await AssignmentMetricsModel.findOne();
    if (!metrics) {
      metrics = new AssignmentMetricsModel({
        totalAssigned: 0,
        successRate: 0,
        averageTime: 0,
        failureReasons: []
      });
    }

    // Update metrics for successful assignments
    metrics.totalAssigned = successfulAssignments.length;

    // Recalculate success rate
    const failedAssignments = await AssignmentModel.find({ status: 'failed' });
    const successfulCount = successfulAssignments.length;
    const failureCount = failedAssignments.length;
    metrics.successRate = successfulCount / (successfulCount + failureCount);

    // Calculate average time for successful assignments
    const assignmentTimestamps = successfulAssignments.map(assignment => new Date(assignment.timestamp).getTime());
    const totalTime = assignmentTimestamps.reduce((acc, time) => acc + time, 0);

    if (assignmentTimestamps.length > 0) {
      metrics.averageTime = totalTime / assignmentTimestamps.length / 1000; // Convert ms to seconds
    } else {
      metrics.averageTime = 0;
    }

    // Recalculate failure reasons and counts
    const failureReasons = await AssignmentModel.aggregate([
      { $match: { status: 'failed' } },
      { $group: { _id: '$reason', count: { $sum: 1 } } }
    ]);

    metrics.failureReasons = failureReasons.map((fr) => ({
      reason: fr._id,
      count: fr.count
    }));

    // Save updated metrics
    await metrics.save();

    return NextResponse.json(
      { success: true, message: 'Assignment metrics recalculated successfully.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error recalculating assignment metrics: ', error);
    return NextResponse.json(
      { success: false, message: 'Error recalculating assignment metrics. Please try again later.' },
      { status: 500 }
    );
  }
}
