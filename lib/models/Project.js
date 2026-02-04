import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    enum: ['Student', 'Team', 'Business'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'On Hold', 'Completed', 'Archived'],
    default: 'Active',
  },
  color: {
    type: String,
    default: '#f59e0b',
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'member'],
      default: 'member',
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  teamMembers: [{
    type: String,
  }],
  deadline: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

ProjectSchema.index({ owner: 1 });
ProjectSchema.index({ 'members.user': 1 });
ProjectSchema.index({ status: 1 });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
