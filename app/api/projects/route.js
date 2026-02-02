import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
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
    const limit = parseInt(searchParams.get('limit')) || 20;

    await dbConnect();

    const projects = await Project.find({
      $or: [
        { owner: userId },
        { 'members.user': userId }
      ]
    })
      .populate('owner', 'name email avatar')
      .sort({ updatedAt: -1 })
      .limit(limit);

    return NextResponse.json({ projects });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
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

    const { name, description, category, deadline, status = 'Active' } = await request.json();

    // Enhanced validation
    if (!name || name.trim().length < 3) {
      return NextResponse.json(
        { error: 'Project name must be at least 3 characters long' },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: 'Please select a project category' },
        { status: 400 }
      );
    }

    // Validate deadline if provided
    if (deadline) {
      const deadlineDate = new Date(deadline);
      if (isNaN(deadlineDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid deadline date' },
          { status: 400 }
        );
      }
      if (deadlineDate < new Date()) {
        return NextResponse.json(
          { error: 'Deadline cannot be in the past' },
          { status: 400 }
        );
      }
    }

    await dbConnect();

    const project = await Project.create({
      name: name.trim(),
      description: description ? description.trim() : '',
      category,
      deadline,
      status,
      owner: userId,
      members: [{
        user: userId,
        role: 'owner',
      }],
    });

    await Activity.create({
      user: userId,
      project: project._id,
      action: 'created project',
      details: { projectName: name },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
