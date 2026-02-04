import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Project from '@/lib/models/Project';
import Task from '@/lib/models/Task';
import Activity from '@/lib/models/Activity';
import { getAuthUser } from '@/lib/auth/jwt';

export async function GET(request, { params }) {
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

    const project = await Project.findById(id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const isMember = project.owner.toString() === userId || 
                     project.members.some(m => m.user._id.toString() === userId);

    if (!isMember) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json({ project });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

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

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const isOwnerOrAdmin = project.owner.toString() === userId ||
                           project.members.some(m => 
                             m.user.toString() === userId && ['owner', 'admin'].includes(m.role)
                           );

    if (!isOwnerOrAdmin) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    const updates = await request.json();
    
    // Handle team members update
    if (updates.teamMembers !== undefined) {
      project.teamMembers = updates.teamMembers;
    }
    
    // Update other fields
    const allowedUpdates = ['name', 'description', 'category', 'status', 'deadline'];
    allowedUpdates.forEach(key => {
      if (updates[key] !== undefined) {
        project[key] = updates[key];
      }
    });

    project.updatedAt = Date.now();
    await project.save();

    await Activity.create({
      user: userId,
      project: project._id,
      action: 'updated project',
      details: updates,
    });

    return NextResponse.json({ project });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update project' },
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

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    if (project.owner.toString() !== userId) {
      return NextResponse.json(
        { error: 'Only project owner can delete' },
        { status: 403 }
      );
    }

    // Delete all tasks related to this project
    await Task.deleteMany({ project: id });

    // Delete the project
    await Project.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
