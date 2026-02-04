import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Task from '@/lib/models/Task';
import Activity from '@/lib/models/Activity';
import { getAuthUser } from '@/lib/auth/jwt';

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const userId = await getAuthUser(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const task = await Task.findById(id);

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    const updates = await request.json();
    
    Object.keys(updates).forEach(key => {
      task[key] = updates[key];
    });

    task.updatedAt = Date.now();
    await task.save();

    await Activity.create({
      user: userId,
      project: task.project,
      task: task._id,
      action: 'updated task',
      details: updates,
    });

    return NextResponse.json({ task });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const userId = await getAuthUser(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const task = await Task.findById(id);

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    await Task.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
