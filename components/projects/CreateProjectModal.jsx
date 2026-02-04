'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, Calendar, Tag, Users, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const categoryColors = {
  'Student': '#10b981',
  'Team': '#f59e0b',
  'Business': '#3b82f6',
};

export default function CreateProjectModal({ onClose, onSuccess }) {
  const today = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Team',
    status: 'Active',
    deadline: today,
  });
  const [teamMembers, setTeamMembers] = useState(['']);
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
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsLoading(true);

    try {
      const isTeamProject = formData.category === 'Team' || formData.category === 'Business';
      const filteredTeamMembers = isTeamProject 
        ? teamMembers.filter(member => member.trim() !== '') 
        : [];

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          teamMembers: filteredTeamMembers,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Project created successfully!');
        onSuccess();
      } else {
        toast.error(data.error || 'Failed to create project');
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 md:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-gradient-to-br from-charcoal-800 to-charcoal-900 rounded-2xl border border-charcoal-700 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-charcoal-700/50">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
              <Calendar size={18} className="text-white md:w-5 md:h-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-warm-50">Create Project</h2>
              <p className="text-xs md:text-sm text-charcoal-400 hidden sm:block">Start something amazing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-charcoal-700 rounded-lg transition-all hover:rotate-90"
          >
            <X size={18} className="text-charcoal-400 md:w-5 md:h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 md:space-y-5">
          <div>
            <label className="block text-sm font-medium text-warm-100 mb-2">
              Project Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              className={`w-full px-3 py-2 text-sm bg-charcoal-700/50 border rounded-lg text-warm-100 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${
                errors.name ? 'border-red-500' : 'border-charcoal-600 hover:border-charcoal-500'
              }`}
              placeholder="e.g., Website Redesign Project"
            />
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-1.5 flex items-center gap-1"
              >
                ⚠️ {errors.name}
              </motion.p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-warm-100 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-charcoal-700/50 border border-charcoal-600 hover:border-charcoal-500 rounded-lg text-warm-100 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all resize-none"
              placeholder="What is this project about?"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-warm-100 mb-2">
              Category *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['Student', 'Team', 'Business'].map((category) => (
                <motion.button
                  key={category}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setFormData({ ...formData, category });
                    if (errors.category) setErrors({ ...errors, category: '' });
                  }}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    formData.category === category
                      ? 'border-amber-500 bg-gradient-to-br from-amber-500/20 to-amber-600/10 shadow-lg shadow-amber-500/20'
                      : 'border-charcoal-600 bg-charcoal-700/50 hover:border-amber-500/50 hover:bg-charcoal-600/70'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Tag size={20} style={{ color: categoryColors[category] }} />
                    <span className={`text-sm font-medium ${
                      formData.category === category ? 'text-amber-400' : 'text-charcoal-300'
                    }`}>
                      {category}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
            {errors.category && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-1.5 flex items-center gap-1"
              >
                ⚠️ {errors.category}
              </motion.p>
            )}
          </div>

          {/* Team Members Section - Only for Team/Business */}
          {isTeamProject && (
            <div>
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
                      className="flex-1 px-4 py-2.5 bg-charcoal-700/50 border border-charcoal-600 hover:border-charcoal-500 rounded-xl text-warm-100 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-sm"
                    />
                    {teamMembers.length > 1 && (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => removeTeamMember(index)}
                        className="p-2.5 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-all border border-red-500/30"
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
                className="w-full py-2.5 bg-charcoal-700/50 border-2 border-dashed border-charcoal-600 hover:border-amber-500/50 rounded-xl text-charcoal-400 hover:text-amber-500 transition-all flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Plus size={16} />
                Add Team Member
              </motion.button>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-warm-100 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-charcoal-700/50 border border-charcoal-600 hover:border-charcoal-500 rounded-lg text-warm-100 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3cpath%20d%3D%22M7%207l3%203%203-3%22%20stroke%3D%22%23f59e0b%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3c%2Fsvg%3E')] bg-[length:1.2rem] bg-[right_0.5rem_center] bg-no-repeat pr-8"
            >
              <option value="Active" className="bg-charcoal-800 text-warm-100">Active</option>
              <option value="On Hold" className="bg-charcoal-800 text-warm-100">On Hold</option>
              <option value="Completed" className="bg-charcoal-800 text-warm-100">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-warm-100 mb-2 flex items-center gap-2">
              <Calendar size={16} className="text-amber-500" />
              Deadline (Optional)
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => {
                setFormData({ ...formData, deadline: e.target.value });
                if (errors.deadline) setErrors({ ...errors, deadline: '' });
              }}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-3 py-2 text-sm bg-charcoal-700/50 border rounded-lg text-warm-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${
                errors.deadline ? 'border-red-500' : 'border-charcoal-600 hover:border-charcoal-500'
              }`}
            />
            {errors.deadline && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-1.5 flex items-center gap-1"
              >
                ⚠️ {errors.deadline}
              </motion.p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-charcoal-700/50 text-warm-100 rounded-xl font-semibold hover:bg-charcoal-600/70 transition-all disabled:opacity-50 border border-charcoal-600"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gradient-to-br from-amber-500 to-amber-600 text-charcoal-900 rounded-xl font-semibold hover:from-amber-400 hover:to-amber-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-amber-500/30"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
