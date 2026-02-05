'use client';

import { Calendar, Users, MoreVertical, Edit2, Trash2, CheckCircle, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import EditProjectModal from './EditProjectModal';
import ProjectDetailsModal from './ProjectDetailsModal';

export default function ProjectCard({ project, onUpdate }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [expandedStatus, setExpandedStatus] = useState(false);
  const menuRef = useRef(null);

  const statusColors = {
    'Active': 'bg-green-500/10 text-green-500 border-green-500/30 dark:bg-green-500/10 dark:text-green-500 dark:border-green-500/30',
    'On Hold': 'bg-amber-500/10 text-amber-500 border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-500 dark:border-amber-500/30',
    'Completed': 'bg-blue-500/10 text-blue-500 border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-500 dark:border-blue-500/30',
  };

  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

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
        if (onUpdate) onUpdate();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete project');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsDeleting(false);
      setShowMenu(false);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setShowEditModal(true);
    setShowMenu(false);
  };

  const handleStatusChange = async (newStatus) => {
    if (newStatus === project.status) {
      setShowMenu(false);
      return;
    }

    setIsUpdating(true);
    setShowMenu(false);
    
    try {
      const res = await fetch(`/api/projects/${project._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success(`Project status updated to ${newStatus}`);
        if (onUpdate) onUpdate();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to update status');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCardClick = () => {
    setShowDetailsModal(true);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        onClick={handleCardClick}
        className="bg-gradient-to-br from-charcoal-800 to-charcoal-800/80 border border-charcoal-700 rounded-xl p-4 md:p-5 hover:border-amber-500/50 transition-all group cursor-pointer relative"
      >
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-transparent transition-all pointer-events-none rounded-xl" />
        
        <div className="relative">
          {/* Header with Name and Menu */}
          <div className="flex items-start justify-between mb-3 md:mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg md:text-xl font-bold text-warm-50 group-hover:text-amber-500 transition line-clamp-2 mb-1">
                {project.name}
              </h3>
              <p className="text-xs text-charcoal-400">{project.category}</p>
            </div>
            
            <div className="relative ml-2" ref={menuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-2 hover:bg-charcoal-700 rounded-lg transition opacity-0 group-hover:opacity-100"
              >
                <MoreVertical size={18} className="text-charcoal-400" />
              </button>
              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-charcoal-800 border border-charcoal-700 rounded-lg shadow-xl z-20 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={handleEdit}
                      className="w-full flex items-center gap-3 px-4 py-3 text-warm-100 hover:bg-charcoal-700 transition text-left"
                    >
                      <Edit2 size={16} className="text-amber-500" />
                      <span>Edit Project</span>
                    </button>
                    
                    {/* Collapsible Status Section on Mobile */}
                    <div className="md:hidden">
                      <div className="border-t border-charcoal-700" />
                      <button
                        onClick={() => setExpandedStatus(!expandedStatus)}
                        className="w-full flex items-center justify-between px-4 py-3 text-warm-100 hover:bg-charcoal-700 transition text-left"
                      >
                        <span className="text-sm font-medium">Change Status</span>
                        <ChevronDown 
                          size={16} 
                          className={`text-charcoal-400 transition-transform ${expandedStatus ? 'rotate-180' : ''}`}
                        />
                      </button>
                      <AnimatePresence>
                        {expandedStatus && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <button
                              onClick={() => handleStatusChange('Active')}
                              disabled={isUpdating || project.status === 'Active'}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 transition text-left text-sm disabled:opacity-50 ${
                                project.status === 'Active' ? 'bg-charcoal-700 text-green-400' : 'text-warm-100 hover:bg-charcoal-700'
                              }`}
                            >
                              <CheckCircle size={14} className="text-green-500" />
                              <span>Active</span>
                            </button>
                            <button
                              onClick={() => handleStatusChange('On Hold')}
                              disabled={isUpdating || project.status === 'On Hold'}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 transition text-left text-sm disabled:opacity-50 ${
                                project.status === 'On Hold' ? 'bg-charcoal-700 text-amber-400' : 'text-warm-100 hover:bg-charcoal-700'
                              }`}
                            >
                              <CheckCircle size={14} className="text-amber-500" />
                              <span>On Hold</span>
                            </button>
                            <button
                              onClick={() => handleStatusChange('Completed')}
                              disabled={isUpdating || project.status === 'Completed'}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 transition text-left text-sm disabled:opacity-50 ${
                                project.status === 'Completed' ? 'bg-charcoal-700 text-blue-400' : 'text-warm-100 hover:bg-charcoal-700'
                              }`}
                            >
                              <CheckCircle size={14} className="text-blue-500" />
                              <span>Completed</span>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Always Visible Status on Desktop */}
                    <div className="hidden md:block">
                      <div className="border-t border-charcoal-700 my-1" />
                      <div className="px-3 py-2 text-xs font-semibold text-charcoal-400 uppercase">Status</div>
                      <button
                        onClick={() => handleStatusChange('Active')}
                        disabled={isUpdating || project.status === 'Active'}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 transition text-left text-sm disabled:opacity-50 ${
                          project.status === 'Active' ? 'bg-charcoal-700 text-green-400' : 'text-warm-100 hover:bg-charcoal-700'
                        }`}
                      >
                        <CheckCircle size={14} className="text-green-500" />
                        <span>Active</span>
                      </button>
                      <button
                        onClick={() => handleStatusChange('On Hold')}
                        disabled={isUpdating || project.status === 'On Hold'}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 transition text-left text-sm disabled:opacity-50 ${
                          project.status === 'On Hold' ? 'bg-charcoal-700 text-amber-400' : 'text-warm-100 hover:bg-charcoal-700'
                        }`}
                      >
                        <CheckCircle size={14} className="text-amber-500" />
                        <span>On Hold</span>
                      </button>
                      <button
                        onClick={() => handleStatusChange('Completed')}
                        disabled={isUpdating || project.status === 'Completed'}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 transition text-left text-sm disabled:opacity-50 ${
                          project.status === 'Completed' ? 'bg-charcoal-700 text-blue-400' : 'text-warm-100 hover:bg-charcoal-700'
                        }`}
                      >
                        <CheckCircle size={14} className="text-blue-500" />
                        <span>Completed</span>
                      </button>
                    </div>

                    <div className="border-t border-charcoal-700 my-1" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete();
                      }}
                      disabled={isDeleting}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-charcoal-700 transition text-left disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={16} />
                      <span>{isDeleting ? 'Deleting...' : 'Delete Project'}</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Footer with Deadline and Status */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 md:gap-3">
            {project.deadline ? (
              <div className="flex items-center gap-2 text-xs md:text-sm text-charcoal-400">
                <Calendar size={14} className="md:w-4 md:h-4" />
                <span>{format(new Date(project.deadline), 'MMM dd, yyyy')}</span>
              </div>
            ) : (
              <div className="text-xs text-charcoal-500">No deadline</div>
            )}
            
            <span className={`self-start sm:self-auto text-xs px-3 py-1.5 rounded-lg border-2 font-semibold ${statusColors[project.status]}`}>
              {project.status}
            </span>
          </div>
        </div>
      </motion.div>

      {showDetailsModal && (
        <ProjectDetailsModal
          project={project}
          onClose={() => setShowDetailsModal(false)}
          onUpdate={onUpdate}
        />
      )}

      {showEditModal && (
        <EditProjectModal
          project={project}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            if (onUpdate) onUpdate();
          }}
        />
      )}
    </>
  );
}
