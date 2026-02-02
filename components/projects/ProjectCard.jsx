'use client';

import Link from 'next/link';
import { FolderKanban, Calendar, Users, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import EditProjectModal from './EditProjectModal';

export default function ProjectCard({ project, onUpdate }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

  const statusColors = {
    'Active': 'bg-green-500/10 text-green-500',
    'On Hold': 'bg-amber-500/10 text-amber-500',
    'Completed': 'bg-blue-500/10 text-blue-500',
    'Archived': 'bg-charcoal-600 text-charcoal-400',
  };

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

  const handleEdit = () => {
    setShowEditModal(true);
    setShowMenu(false);
  };

  return (
    <div className="bg-charcoal-800 border border-charcoal-700 rounded-xl p-6 hover:border-amber-500/50 transition group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
            <FolderKanban size={24} className="text-amber-500" />
          </div>
          <div>
            <Link href={`/dashboard/projects/${project._id}`}>
              <h3 className="text-lg font-semibold text-warm-50 hover:text-amber-500 transition">
                {project.name}
              </h3>
            </Link>
            <p className="text-xs text-charcoal-400">{project.category}</p>
          </div>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.preventDefault();
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
                className="absolute right-0 top-full mt-2 w-48 bg-charcoal-800 border border-charcoal-700 rounded-lg shadow-xl z-10 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleEdit();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-warm-100 hover:bg-charcoal-700 transition text-left"
                >
                  <Edit2 size={16} className="text-amber-500" />
                  <span>Edit Project</span>
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
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

      {project.description && (
        <p className="text-charcoal-300 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <span className={`text-xs px-3 py-1 rounded-full ${statusColors[project.status]}`}>
          {project.status}
        </span>
        
        {project.deadline && (
          <div className="flex items-center gap-1 text-xs text-charcoal-400">
            <Calendar size={14} />
            {format(new Date(project.deadline), 'MMM dd, yyyy')}
          </div>
        )}
      </div>

      {project.members && project.members.length > 0 && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-charcoal-700">
          <Users size={16} className="text-charcoal-400" />
          <span className="text-sm text-charcoal-400">
            {project.members.length} member{project.members.length > 1 ? 's' : ''}
          </span>
        </div>
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
    </div>
  );
}
