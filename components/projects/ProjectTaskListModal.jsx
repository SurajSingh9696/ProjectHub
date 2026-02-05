'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, CheckCircle2, ListChecks } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function ProjectTaskListModal({ project, onClose }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusStyles = {
    'To Do': 'bg-slate-500/10 text-slate-300 border-slate-500/30',
    'In Progress': 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    'Review': 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    'Completed': 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`/api/tasks?project=${project._id}&includeCompletedProjects=true&limit=200`);
        if (res.ok) {
          const data = await res.json();
          setTasks(data.tasks || []);
        } else {
          toast.error('Failed to load project tasks');
        }
      } catch (error) {
        toast.error('Failed to load project tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [project._id]);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 md:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        className="bg-gradient-to-br from-charcoal-800 to-charcoal-900 rounded-2xl border border-charcoal-700 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-charcoal-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <ListChecks size={20} className="text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-warm-50">Task List</h2>
              <p className="text-xs md:text-sm text-charcoal-400">{project.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-charcoal-700 rounded-lg transition"
          >
            <X size={18} className="text-charcoal-400 md:w-5 md:h-5" />
          </button>
        </div>

        <div className="p-4 md:p-6">
          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-charcoal-800/60 rounded-xl" />
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 mx-auto rounded-full bg-charcoal-700/50 flex items-center justify-center mb-3">
                <CheckCircle2 size={22} className="text-charcoal-400" />
              </div>
              <p className="text-charcoal-300 font-medium">No tasks found</p>
              <p className="text-xs text-charcoal-500 mt-1">This project doesn’t have any tasks yet.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              <div className="hidden sm:grid grid-cols-12 gap-3 px-3 text-xs font-semibold text-charcoal-400 uppercase">
                <div className="col-span-6">Task</div>
                <div className="col-span-3">Due Date</div>
                <div className="col-span-3">Status</div>
              </div>
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 p-3 rounded-xl bg-charcoal-800/60 border border-charcoal-700/70 hover:border-charcoal-600 transition"
                >
                  <div className="sm:col-span-6">
                    <p className="text-warm-50 font-semibold text-sm md:text-base line-clamp-1">
                      {task.title}
                    </p>
                    <p className="text-xs text-charcoal-400 mt-0.5">
                      {task.project?.name || project.name}
                    </p>
                  </div>
                  <div className="sm:col-span-3 flex items-center gap-2 text-xs md:text-sm text-charcoal-300">
                    <Calendar size={14} className="text-blue-400" />
                    <span>
                      {task.dueDate ? format(new Date(task.dueDate), 'MMM dd, yyyy') : 'No due date'}
                    </span>
                  </div>
                  <div className="sm:col-span-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border ${statusStyles[task.status] || 'bg-charcoal-700 text-charcoal-300 border-charcoal-600'}`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
