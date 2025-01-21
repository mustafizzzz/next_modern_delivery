import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { AssignmentModel } from '@/model/Assignment';
import { AssignmentMetricsModel } from '@/model/AssignmentMetrics';

export async function POST() {
  await dbConnect();

  try {
    // Fetch existing metrics or create new if not present
    let metrics = await AssignmentMetricsModel.findOne();

    if (!metrics) {
      metrics = new AssignmentMetricsModel({
        totalAssigned: 0,
        successRate: 0,
        averageTime: 0,
        failureReasons: [],
      });
    }

    // Fetch all assignments
    const allAssignments = await AssignmentModel.find();
    const successfulAssignments = allAssignments.filter((assignment) => assignment.status === 'success');

    // Calculate success rate
    const successfulCount = successfulAssignments.length;
    metrics.successRate = metrics.totalAssigned > 0
      ? successfulCount / metrics.totalAssigned
      : 0;

    // Calculate average time for successful assignments
    const assignmentTimestamps = successfulAssignments.map((assignment) => new Date(assignment.timestamp).getTime());
    const totalTime = assignmentTimestamps.reduce((acc, time) => acc + time, 0);

    metrics.averageTime = assignmentTimestamps.length > 0
      ? totalTime / assignmentTimestamps.length / 1000 // Convert ms to seconds
      : 0;

    // Update failure reasons
    const failureReasons = await AssignmentModel.aggregate([
      { $match: { status: 'failed' } },
      { $group: { _id: '$reason', count: { $sum: 1 } } },
    ]);

    metrics.failureReasons = failureReasons.map((fr) => ({
      reason: fr._id,
      count: fr.count,
    }));

    // Save the updated metrics
    await metrics.save();

    return NextResponse.json(
      { success: true, message: 'Assignment metrics recalculated successfully.', metrics },
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
