'use client';

import { motion } from 'framer-motion';
import { X, Calendar, Tag, Users, Clock, Edit2, Trash2, User, ListChecks } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import EditProjectModal from './EditProjectModal';
import ProjectTaskListModal from './ProjectTaskListModal';
import toast from 'react-hot-toast';

export default function ProjectDetailsModal({ project, onClose, onUpdate }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTaskList, setShowTaskList] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const statusColors = {
    'Active': 'bg-green-500/10 text-green-500 border-green-500/30',
    'On Hold': 'bg-amber-500/10 text-amber-500 border-amber-500/30',
    'Completed': 'bg-blue-500/10 text-blue-500 border-blue-500/30',
    'Archived': 'bg-charcoal-600 text-charcoal-400 border-charcoal-500',
  };

  const categoryColors = {
    'Student': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
    'Team': 'bg-amber-500/10 text-amber-500 border-amber-500/30',
    'Business': 'bg-blue-500/10 text-blue-500 border-blue-500/30',
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/projects/${project._id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Project deleted successfully');
        onClose();
        if (onUpdate) onUpdate();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete project');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const hasTeamMembers = (project.category === 'Team' || project.category === 'Business') && 
                         project.teamMembers && project.teamMembers.length > 0;

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 md:p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-gradient-to-br from-charcoal-800 to-charcoal-900 rounded-2xl border border-charcoal-700 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-br from-charcoal-800 to-charcoal-900 border-b border-charcoal-700 p-4 md:p-6 flex items-center justify-between z-10">
            <h2 className="text-xl md:text-2xl font-bold text-warm-50">Project Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-charcoal-700 rounded-lg transition-all hover:rotate-90"
            >
              <X size={20} className="text-charcoal-400 md:w-6 md:h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 md:p-6 space-y-6">
            {/* Project Name */}
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-warm-50 mb-2">
                {project.name}
              </h3>
              {project.description && (
                <p className="text-charcoal-300 text-sm md:text-base leading-relaxed">
                  {project.description}
                </p>
              )}
            </div>

            {/* Category and Status */}
            <div className="flex flex-wrap gap-3">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${categoryColors[project.category]}`}>
                <Tag size={16} />
                <span className="font-semibold text-sm">{project.category}</span>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${statusColors[project.status]}`}>
                <Clock size={16} />
                <span className="font-semibold text-sm">{project.status}</span>
              </div>
            </div>

            {/* Deadline */}
            {project.deadline && (
              <div className="bg-blue-500/5 rounded-xl p-4 border border-blue-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Calendar size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-charcoal-400 mb-0.5">Deadline</p>
                    <p className="text-warm-50 font-semibold">
                      {format(new Date(project.deadline), 'MMMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Team Members */}
            {hasTeamMembers && (
              <div className="bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <Users size={18} className="text-emerald-400" />
                  <h4 className="text-warm-50 font-semibold">Team Members</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.teamMembers.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-700 rounded-lg text-sm border border-emerald-500/30 font-medium"
                    >
                      <User size={14} className="text-emerald-600" />
                      <span>{member}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Created Date */}
            <div className="text-xs text-charcoal-400 pt-4 border-t border-charcoal-700">
              Created {format(new Date(project.createdAt), 'MMMM dd, yyyy')}
              {project.updatedAt && project.updatedAt !== project.createdAt && (
                <> • Updated {format(new Date(project.updatedAt), 'MMMM dd, yyyy')}</>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEdit}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 text-charcoal-900 rounded-xl font-semibold hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/30"
              >
                <Edit2 size={18} />
                Edit Project
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowTaskList(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-charcoal-700/70 text-warm-100 border border-charcoal-600 rounded-xl font-semibold hover:bg-charcoal-700 transition-all"
              >
                <ListChecks size={18} className="text-amber-400" />
                Task List
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-400 border-2 border-red-500/30 rounded-xl font-semibold hover:bg-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 size={18} />
                {isDeleting ? 'Deleting...' : 'Delete Project'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {showEditModal && (
        <EditProjectModal
          project={project}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            onClose();
            if (onUpdate) onUpdate();
          }}
        />
      )}

      {showTaskList && (
        <ProjectTaskListModal
          project={project}
          onClose={() => setShowTaskList(false)}
        />
      )}
    </>
  );
}
