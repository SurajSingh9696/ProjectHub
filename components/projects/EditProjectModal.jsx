'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Loader2 } from 'lucide-react';
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
      const res = await fetch(`/api/projects/${project._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Project updated successfully!');
        onSuccess();
      } else {
        toast.error(data.error || 'Failed to update project');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-charcoal-800 rounded-xl border border-charcoal-700 w-full max-w-3xl"
      >
        <div className="flex items-center justify-between p-6 border-b border-charcoal-700">
          <h2 className="text-2xl font-bold text-warm-50">Edit Project</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-charcoal-700 rounded-lg transition"
          >
            <X size={20} className="text-charcoal-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
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
                className={`w-full px-4 py-2.5 bg-charcoal-700 border rounded-lg text-warm-100 focus:outline-none focus:border-amber-500 transition ${
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
                className="w-full px-4 py-2.5 bg-charcoal-700 border border-charcoal-600 rounded-lg text-warm-100 focus:outline-none focus:border-amber-500 transition hover:border-charcoal-500 cursor-pointer"
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
                className="w-full px-4 py-2.5 bg-charcoal-700 border border-charcoal-600 rounded-lg text-warm-100 focus:outline-none focus:border-amber-500 transition hover:border-charcoal-500 cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
                <option value="Archived">Archived</option>
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
                className="w-full px-4 py-2.5 bg-charcoal-700 border border-charcoal-600 rounded-lg text-warm-100 focus:outline-none focus:border-amber-500 transition resize-none hover:border-charcoal-500"
                placeholder="Brief description of your project..."
              />
            </div>

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
                className={`w-full px-4 py-2.5 bg-charcoal-700 border rounded-lg text-warm-100 focus:outline-none focus:border-amber-500 transition ${
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
