'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, CheckSquare, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const priorityColors = {
  'Low': 'bg-charcoal-600 hover:bg-charcoal-500 border-charcoal-500',
  'Medium': 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-500',
  'High': 'bg-orange-500/20 hover:bg-orange-500/30 border-orange-500',
  'Urgent': 'bg-red-500/20 hover:bg-red-500/30 border-red-500',
};

export default function EditTaskModal({ task, onClose, onSuccess }) {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: task.title || '',
    description: task.description || '',
    project: task.project?._id || task.project || '',
    priority: task.priority || 'Medium',
    status: task.status || 'To Do',
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    tags: task.tags ? task.tags.join(', ') : '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects);
      }
    } catch (error) {
      toast.error('Failed to load projects');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.project) {
      newErrors.project = 'Please select a project';
    }

    if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (dueDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
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

    const taskData = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [],
    };

    try {
      const res = await fetch(`/api/tasks/${task._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Task updated successfully!');
        onSuccess();
      } else {
        toast.error(data.error || 'Failed to update task');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 md:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-charcoal-800 to-charcoal-900 rounded-2xl border border-charcoal-700/50 shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-charcoal-700/50 bg-gradient-to-br from-charcoal-800 to-charcoal-900">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg shadow-lg shadow-amber-500/20">
              <CheckSquare size={18} className="text-charcoal-900 md:w-5 md:h-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-warm-50">Edit Task</h2>
              <p className="text-xs md:text-sm text-charcoal-400 hidden sm:block">Update task details</p>
            </div>
          </div>
          <motion.button
            type="button"
            whileHover={{ rotate: 90, scale: 1.1 }}
            onClick={onClose}
            className="p-2 hover:bg-charcoal-700/50 rounded-lg transition-all"
          >
            <X size={18} className="text-charcoal-400 md:w-5 md:h-5" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 md:space-y-5 overflow-y-auto flex-1"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <div>
            <label className="block text-sm font-medium text-warm-100 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: '' });
              }}
              className={`w-full px-4 py-3 bg-charcoal-700/50 border rounded-xl text-warm-100 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${
                errors.title ? 'border-red-500' : 'border-charcoal-600 hover:border-charcoal-500'
              }`}
              placeholder="e.g., Complete feature implementation"
            />
            {errors.title && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-1.5 flex items-center gap-1"
              >
                ⚠️ {errors.title}
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
              className="w-full px-4 py-3 bg-charcoal-700/50 border border-charcoal-600 hover:border-charcoal-500 rounded-xl text-warm-100 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all resize-none"
              placeholder="What needs to be done?"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-warm-100 mb-2">
              Project *
            </label>
            <select
              required
              value={formData.project}
              onChange={(e) => {
                setFormData({ ...formData, project: e.target.value });
                if (errors.project) setErrors({ ...errors, project: '' });
              }}
              className={`w-full px-4 py-3 bg-charcoal-700/50 border rounded-xl text-warm-100 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3cpath%20d%3D%22M7%207l3%203%203-3%22%20stroke%3D%22%23f59e0b%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3c%2Fsvg%3E')] bg-[length:1.5rem] bg-[right_0.5rem_center] bg-no-repeat pr-10 ${
                errors.project ? 'border-red-500' : 'border-charcoal-600 hover:border-charcoal-500'
              }`}
            >
              <option value="" className="bg-charcoal-800 text-warm-100">Select a project</option>
              {projects.map(project => (
                <option key={project._id} value={project._id} className="bg-charcoal-800 text-warm-100">
                  {project.name}
                </option>
              ))}
            </select>
            {errors.project && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-1.5 flex items-center gap-1"
              >
                ⚠️ {errors.project}
              </motion.p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-warm-100 mb-2">
              Priority *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['Low', 'Medium', 'High', 'Urgent'].map((priority) => (
                <motion.button
                  key={priority}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFormData({ ...formData, priority })}
                  className={`px-3 py-2.5 rounded-xl border-2 transition-all text-sm font-medium ${
                    formData.priority === priority
                      ? priorityColors[priority] + ' border-opacity-100 shadow-md'
                      : 'bg-charcoal-700/50 border-charcoal-600 text-charcoal-400 hover:border-charcoal-500'
                  } ${formData.priority === priority ? 'text-warm-100' : ''}`}
                >
                  {priority}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-warm-100 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-3 bg-charcoal-700/50 border border-charcoal-600 hover:border-charcoal-500 rounded-xl text-warm-100 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3cpath%20d%3D%22M7%207l3%203%203-3%22%20stroke%3D%22%23f59e0b%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3c%2Fsvg%3E')] bg-[length:1.5rem] bg-[right_0.5rem_center] bg-no-repeat pr-10"
            >
              <option value="To Do" className="bg-charcoal-800 text-warm-100">To Do</option>
              <option value="In Progress" className="bg-charcoal-800 text-warm-100">In Progress</option>
              <option value="Review" className="bg-charcoal-800 text-warm-100">Review</option>
              <option value="Completed" className="bg-charcoal-800 text-warm-100">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-warm-100 mb-2 flex items-center gap-2">
              <Calendar size={16} className="text-amber-500" />
              Due Date (Optional)
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => {
                setFormData({ ...formData, dueDate: e.target.value });
                if (errors.dueDate) setErrors({ ...errors, dueDate: '' });
              }}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-3 bg-charcoal-700/50 border rounded-xl text-warm-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${
                errors.dueDate ? 'border-red-500' : 'border-charcoal-600 hover:border-charcoal-500'
              }`}
            />
            {errors.dueDate && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-1.5 flex items-center gap-1"
              >
                ⚠️ {errors.dueDate}
              </motion.p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-warm-100 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-3 bg-charcoal-700/50 border border-charcoal-600 hover:border-charcoal-500 rounded-xl text-warm-100 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
              placeholder="e.g., frontend, urgent, bug-fix"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-4 py-3 bg-charcoal-700 text-warm-100 rounded-xl font-semibold hover:bg-charcoal-600 transition"
              disabled={isLoading}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-charcoal-900 rounded-xl font-semibold hover:from-amber-400 hover:to-amber-500 transition shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Task'
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
