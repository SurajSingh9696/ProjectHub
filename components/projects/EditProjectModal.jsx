'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Loader2, Users, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EditProjectModal({ project, onClose, onSuccess }) {
  const today = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState({
    name: project.name || '',
    description: project.description || '',
    category: project.category || 'Team',
    status: project.status || 'Active',
    deadline: project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : today,
  });
  const [teamMembers, setTeamMembers] = useState(
    project.teamMembers && project.teamMembers.length > 0 
      ? project.teamMembers 
      : ['']
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Project name must be at least 3 characters';
    }

    if (formData.deadline) {
      const deadlineDate = new Date(formData.deadline);
      deadlineDate.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (deadlineDate < today) {
        newErrors.deadline = 'Deadline cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const isCompletingProject = formData.status === 'Completed' && project.status !== 'Completed';
      let completeTasks = false;

      if (isCompletingProject) {
        const taskRes = await fetch(`/api/tasks?project=${project._id}&includeCompletedProjects=true&limit=200`);
        if (taskRes.ok) {
          const taskData = await taskRes.json();
          const incompleteTasks = (taskData.tasks || []).filter(task => task.status !== 'Completed');
          if (incompleteTasks.length > 0) {
            const confirmComplete = confirm(
              'This project has incomplete tasks. Completing the project will mark them as completed and remove them from the task board. Continue?'
            );
            if (!confirmComplete) {
              setIsLoading(false);
              return;
            }
            completeTasks = true;
          }
        }
      }

      const isTeamProject = formData.category === 'Team' || formData.category === 'Business';
      const filteredTeamMembers = isTeamProject 
        ? teamMembers.filter(member => member.trim() !== '') 
        : [];

      const res = await fetch(`/api/projects/${project._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          teamMembers: filteredTeamMembers,
          completeTasks: completeTasks || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Project updated successfully!');
        onSuccess();
      } else {
        if (res.status === 409 && data?.requiresConfirmation) {
          const confirmComplete = confirm(
            'This project has incomplete tasks. Completing the project will mark them as completed and remove them from the task board. Continue?'
          );
          if (!confirmComplete) {
            setIsLoading(false);
            return;
          }

          const retryRes = await fetch(`/api/projects/${project._id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...formData,
              teamMembers: filteredTeamMembers,
              completeTasks: true,
            }),
          });

          const retryData = await retryRes.json();
          if (retryRes.ok) {
            toast.success('Project updated successfully!');
            onSuccess();
          } else {
            toast.error(retryData.error || 'Failed to update project');
          }
        } else {
          toast.error(data.error || 'Failed to update project');
        }
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, '']);
  };

  const removeTeamMember = (index) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const updateTeamMember = (index, value) => {
    const updated = [...teamMembers];
    updated[index] = value;
    setTeamMembers(updated);
  };

  const isTeamProject = formData.category === 'Team' || formData.category === 'Business';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 md:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-charcoal-800 rounded-xl border border-charcoal-700 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-charcoal-700">
          <h2 className="text-xl md:text-2xl font-bold text-warm-50">Edit Project</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-charcoal-700 rounded-lg transition"
          >
            <X size={18} className="text-charcoal-400 md:w-5 md:h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-warm-100 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                className={`w-full px-3 py-2 text-sm bg-charcoal-700 border rounded-lg text-warm-100 focus:outline-none focus:border-amber-500 transition ${
                  errors.name ? 'border-red-500' : 'border-charcoal-600 hover:border-charcoal-500'
                }`}
              />
              {errors.name && (
                <p className="mt-1.5 text-red-400 text-xs flex items-center gap-1">
                  <span>⚠️</span> {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-warm-100 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-charcoal-700 border border-charcoal-600 rounded-lg text-warm-100 focus:outline-none focus:border-amber-500 transition hover:border-charcoal-500 cursor-pointer"
              >
                <option value="Student">Student</option>
                <option value="Team">Team</option>
                <option value="Business">Business</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-warm-100 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-charcoal-700 border border-charcoal-600 rounded-lg text-warm-100 focus:outline-none focus:border-amber-500 transition hover:border-charcoal-500 cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-warm-100 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 text-sm bg-charcoal-700 border border-charcoal-600 rounded-lg text-warm-100 focus:outline-none focus:border-amber-500 transition resize-none hover:border-charcoal-500"
                placeholder="Brief description of your project..."
              />
            </div>

            {/* Team Members Section - Only for Team/Business */}
            {isTeamProject && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-warm-100 mb-2 flex items-center gap-2">
                  <Users size={16} className="text-amber-500" />
                  Team Members
                </label>
                <div className="space-y-2 mb-2">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={member}
                        onChange={(e) => updateTeamMember(index, e.target.value)}
                        placeholder={index === 0 ? "You (Default member)" : "Member name"}
                        className="flex-1 px-4 py-2.5 bg-charcoal-700 border border-charcoal-600 rounded-lg text-warm-100 focus:outline-none focus:border-amber-500 transition hover:border-charcoal-500 text-sm"
                      />
                      {teamMembers.length > 1 && (
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => removeTeamMember(index)}
                          className="p-2.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all border border-red-500/30"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      )}
                    </div>
                  ))}
                </div>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addTeamMember}
                  className="w-full py-2.5 bg-charcoal-700 border-2 border-dashed border-charcoal-600 hover:border-amber-500/50 rounded-lg text-charcoal-400 hover:text-amber-500 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <Plus size={16} />
                  Add Team Member
                </motion.button>
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-warm-100 mb-2">
                Deadline (Optional)
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => {
                  setFormData({ ...formData, deadline: e.target.value });
                  if (errors.deadline) setErrors({ ...errors, deadline: '' });
                }}
                className={`w-full px-3 py-2 text-sm bg-charcoal-700 border rounded-lg text-warm-100 focus:outline-none focus:border-amber-500 transition ${
                  errors.deadline ? 'border-red-500' : 'border-charcoal-600 hover:border-charcoal-500'
                }`}
              />
              {errors.deadline && (
                <p className="mt-1.5 text-red-400 text-xs flex items-center gap-1">
                  <span>⚠️</span> {errors.deadline}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-charcoal-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2.5 border border-charcoal-600 text-charcoal-300 rounded-lg font-semibold hover:bg-charcoal-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-amber-500 text-charcoal-900 rounded-lg font-semibold hover:bg-amber-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Update Project
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
