import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Notification from '@/lib/models/Notification';
import { getAuthUser } from '@/lib/auth/jwt';
import { formatDistanceToNow } from 'date-fns';

export async function GET(request) {
  try {
    const userId = await getAuthUser(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    // Add formatted time to each notification
    const formattedNotifications = notifications.map(notif => ({
      ...notif,
      id: notif._id.toString(),
      _id: notif._id.toString(),
      time: formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true }),
    }));

    return NextResponse.json({ notifications: formattedNotifications });
  } catch (error) {
    console.error('Fetch notifications error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const userId = await getAuthUser(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const data = await request.json();
    
    const notification = await Notification.create({
      user: userId,
      ...data,
    });

    return NextResponse.json({ notification }, { status: 201 });
  } catch (error) {
    console.error('Create notification error:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}
