import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Activity from '@/lib/models/Activity';
import { getAuthUser } from '@/lib/auth/jwt';

export async function DELETE(request, { params }) {
  try {
    const userId = await getAuthUser(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = await params;

    // Find and delete the activity, ensuring it belongs to the user
    const activity = await Activity.findOneAndDelete({
      _id: id,
      user: userId
    });

    if (!activity) {
      return NextResponse.json(
        { error: 'Activity not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Activity deleted successfully',
      activity 
    });
  } catch (error) {
    console.error('Delete activity error:', error);
    return NextResponse.json(
      { error: 'Failed to delete activity' },
      { status: 500 }
    );
  }
}
