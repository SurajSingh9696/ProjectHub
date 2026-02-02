import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Project from '@/lib/models/Project';
import Task from '@/lib/models/Task';
import { getAuthUser } from '@/lib/auth/jwt';

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

    const [projects, tasks] = await Promise.all([
      Project.find({
        $or: [
          { owner: userId },
          { 'members.user': userId }
        ]
      }),
      Task.find({
        createdBy: userId
      })
    ]);

    const pending = tasks.filter(t => t.status !== 'Completed').length;
    const completed = tasks.filter(t => t.status === 'Completed').length;

    return NextResponse.json({
      projects: projects.length,
      tasks: tasks.length,
      pending,
      completed,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
