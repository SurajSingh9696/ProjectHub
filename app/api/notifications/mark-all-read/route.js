import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Notification from '@/lib/models/Notification';
import { getAuthUser } from '@/lib/auth/jwt';

export async function PATCH(request) {
  try {
    const userId = await getAuthUser(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    await Notification.updateMany(
      { user: userId, read: false },
      { read: true }
    );

    return NextResponse.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all read error:', error);
    return NextResponse.json(
      { error: 'Failed to mark all as read' },
      { status: 500 }
    );
  }
}
