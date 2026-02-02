import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db/mongoose';
import User from '@/lib/models/User';
import Project from '@/lib/models/Project';
import Task from '@/lib/models/Task';
import Activity from '@/lib/models/Activity';
import Notification from '@/lib/models/Notification';
import { getAuthUser } from '@/lib/auth/jwt';

export async function DELETE(request) {
  try {
    const userId = await getAuthUser(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Find user and verify password
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 401 }
      );
    }

    // Delete all user-related data
    await Promise.all([
      // Delete all projects owned by user
      Project.deleteMany({ owner: userId }),
      
      // Delete all tasks created by user
      Task.deleteMany({ createdBy: userId }),
      
      // Delete all activities
      Activity.deleteMany({ user: userId }),
      
      // Delete all notifications
      Notification.deleteMany({ user: userId }),
      
      // Finally, delete the user
      User.findByIdAndDelete(userId),
    ]);

    // Clear the auth cookie
    const response = NextResponse.json({ 
      message: 'Account deleted successfully' 
    });

    response.cookies.set('token', '', {
      httpOnly: true,
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}
