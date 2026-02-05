import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Task from '@/lib/models/Task';
import Project from '@/lib/models/Project';
import Activity from '@/lib/models/Activity';
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

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 50;
    const projectId = searchParams.get('project');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const includeCompletedProjects = searchParams.get('includeCompletedProjects') === 'true';

    await dbConnect();

    let query = {
      $or: [
        { createdBy: userId },
        { assignedTo: userId }
      ]
    };

    if (projectId) query.project = projectId;
    if (status) query.status = status;
    if (priority) query.priority = priority;

    if (!includeCompletedProjects) {
      if (projectId) {
        const project = await Project.findById(projectId).select('status');
        if (project?.status === 'Completed') {
          return NextResponse.json({ tasks: [] });
        }
      } else {
        const completedProjects = await Project.find({ status: 'Completed' }).select('_id');
        if (completedProjects.length > 0) {
          query.project = query.project
            ? { $eq: query.project, $nin: completedProjects.map(p => p._id) }
            : { $nin: completedProjects.map(p => p._id) };
        }
      }
    }

    const tasks = await Task.find(query)
      .populate('project', 'name category')
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort({ order: 1, createdAt: -1 })
      .limit(limit);

    return NextResponse.json({ tasks });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
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

    const { title, description, project, status, priority, assignedTo, dueDate, tags } = await request.json();

    // Enhanced validation
    if (!title || title.trim().length < 3) {
      return NextResponse.json(
        { error: 'Task title must be at least 3 characters long' },
        { status: 400 }
      );
    }

    if (!project) {
      return NextResponse.json(
        { error: 'Please select a project' },
        { status: 400 }
      );
    }

    // Validate due date if provided
    if (dueDate) {
      const dueDateObj = new Date(dueDate);
      if (isNaN(dueDateObj.getTime())) {
        return NextResponse.json(
          { error: 'Invalid due date' },
          { status: 400 }
        );
      }
      if (dueDateObj < new Date()) {
        return NextResponse.json(
          { error: 'Due date cannot be in the past' },
          { status: 400 }
        );
      }
    }

    await dbConnect();

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      project,
      status: status || 'To Do',
      priority: priority || 'Medium',
      assignedTo,
      dueDate,
      tags,
      createdBy: userId,
    });

    await Activity.create({
      user: userId,
      project,
      task: task._id,
      action: 'created task',
      details: { taskTitle: title },
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
