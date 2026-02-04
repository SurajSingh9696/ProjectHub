'use client';

import { Calendar, Tag, User, AlertCircle, MoreVertical, CheckSquare, Clock, PlayCircle, Archive, Edit2, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import EditTaskModal from './EditTaskModal';

const priorityColors = {
  'Low': 'bg-charcoal-600 text-charcoal-300',
  'Medium': 'bg-amber-500/10 text-amber-500',
  'High': 'bg-orange-500/10 text-orange-500',
  'Urgent': 'bg-red-500/10 text-red-500',
};

const statusColors = {
  'To Do': 'bg-charcoal-600 text-charcoal-300',
  'In Progress': 'bg-amber-500/10 text-amber-500 border-amber-500/30',
  'Review': 'bg-purple-500/10 text-purple-500 border-purple-500/30',
  'Completed': 'bg-green-500/10 text-green-500 border-green-500/30',
};

const statusIcons = {
  'To Do': Clock,
  'In Progress': PlayCircle,
  'Review': Eye,
  'Completed': CheckSquare,
};

export default function TaskCard({ task, isDragging, onDragStart, onTouchDrop, columnRefs, setDragOverColumn, onUpdate }) {
  const [isDraggable, setIsDraggable] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const longPressTimer = useRef(null);
  const cardRef = useRef(null);
  const menuRef = useRef(null);
  const [touchActive, setTouchActive] = useState(false);
  const clickCount = useRef(0);
  const clickTimer = useRef(null);

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

  const handleMouseDown = (e) => {
    clickCount.current += 1;

    if (clickCount.current === 1) {
      // First click - start timer for double-click detection
      clickTimer.current = setTimeout(() => {
        clickCount.current = 0;
      }, 300);
    } else if (clickCount.current === 2) {
      // Second click with mouse down - enable dragging immediately
      clearTimeout(clickTimer.current);
      e.preventDefault();
      setIsDraggable(true);
      clickCount.current = 0;
      
      // Trigger drag start manually after a tiny delay to ensure draggable is set
      setTimeout(() => {
        if (cardRef.current) {
          const dragEvent = new DragEvent('dragstart', {
            bubbles: true,
            cancelable: true,
            dataTransfer: new DataTransfer()
          });
          cardRef.current.dispatchEvent(dragEvent);
        }
      }, 0);
    }
  };

  const handleMouseUp = () => {
    // Disable draggable when mouse is released
    setIsDraggable(false);
  };

  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'move';
    if (onDragStart) {
      onDragStart(task);
    }
  };

  const handleDragEnd = () => {
    setIsDraggable(false);
  };

  const handleTouchStart = (e) => {
    // Start long press timer (600ms)
    longPressTimer.current = setTimeout(() => {
      setTouchActive(true);
      setIsDraggable(true);
      // Vibrate if supported
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 600);
  };

  const handleTouchMove = (e) => {
    // Cancel long press if user moves before timer completes
    if (longPressTimer.current && !touchActive) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
      return;
    }

    if (!touchActive) return;

    const touch = e.touches[0];
    const x = touch.clientX;
    const y = touch.clientY;

    // Check which column the touch is over
    if (columnRefs && columnRefs.current) {
      let targetColumn = null;
      
      Object.keys(columnRefs.current).forEach((columnId) => {
        const columnEl = columnRefs.current[columnId];
        if (columnEl) {
          const rect = columnEl.getBoundingClientRect();
          // Check if touch is within column bounds
          if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
            targetColumn = columnId;
          }
        }
      });

      if (targetColumn && setDragOverColumn) {
        setDragOverColumn(targetColumn);
      }
    }
  };

  const handleTouchEnd = (e) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (touchActive && columnRefs && columnRefs.current) {
      const touch = e.changedTouches[0];
      const x = touch.clientX;
      const y = touch.clientY;

      // Find target column
      let targetColumn = null;
      Object.keys(columnRefs.current).forEach((columnId) => {
        const columnEl = columnRefs.current[columnId];
        if (columnEl) {
          const rect = columnEl.getBoundingClientRect();
          if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
            targetColumn = columnId;
          }
        }
      });

      if (targetColumn && onTouchDrop) {
        onTouchDrop(task, targetColumn);
      }

      if (setDragOverColumn) {
        setDragOverColumn(null);
      }
    }

    setTouchActive(false);
    setIsDraggable(false);
  };

  const handleTouchCancel = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    setTouchActive(false);
    setIsDraggable(false);
    if (setDragOverColumn) {
      setDragOverColumn(null);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await fetch(`/api/tasks/${task._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success('Task status updated');
        if (onUpdate) onUpdate();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setShowMenu(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/tasks/${task._id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Task deleted successfully');
        if (onUpdate) onUpdate();
      } else {
        toast.error('Failed to delete task');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsDeleting(false);
      setShowMenu(false);
    }
  };

  const handleEdit = (e) => {
    if (e) e.stopPropagation();
    setShowEditModal(true);
    setShowMenu(false);
  };

  const StatusIcon = statusIcons[task.status] || Clock;

  return (
    <div
      ref={cardRef}
      draggable={isDraggable}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      className={`group bg-charcoal-800 border rounded-lg p-3 md:p-4 transition select-none ${
        isDraggable || touchActive ? 'border-amber-500 shadow-lg shadow-amber-500/30 scale-105 z-50 cursor-grabbing' : 'border-charcoal-700 cursor-pointer'
      } ${
        isDragging ? 'opacity-50 scale-95' : 'hover:border-amber-500/50'
      }`}
      style={{ touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-warm-100 font-medium line-clamp-2 flex-1">
          {task.title}
        </h3>
        
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 hover:bg-charcoal-700 rounded transition opacity-70 hover:opacity-100 md:opacity-0 md:group-hover:opacity-100"
          >
            <MoreVertical size={16} className="text-charcoal-400" />
          </button>
          
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 top-full mt-1 w-48 bg-charcoal-800 border border-charcoal-700 rounded-lg shadow-xl z-50 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleEdit}
                  className="w-full flex items-center gap-3 px-4 py-3 text-warm-100 hover:bg-charcoal-700 transition text-left"
                >
                  <Edit2 size={16} className="text-amber-500" />
                  <span>Edit Task</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  disabled={isDeleting}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-charcoal-700 transition text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={16} />
                  <span>{isDeleting ? 'Deleting...' : 'Delete Task'}</span>
                </button>
                <div className="border-t border-charcoal-700 my-1"></div>
                <div className="px-3 py-1.5 text-xs text-charcoal-400 font-medium">Change Status</div>
                {['To Do', 'In Progress', 'Review', 'Completed'].map((status) => {
                  const Icon = statusIcons[status];
                  return (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      disabled={task.status === status}
                      className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition text-left ${
                        task.status === status
                          ? 'bg-charcoal-700 text-charcoal-500 cursor-not-allowed'
                          : 'text-warm-100 hover:bg-charcoal-700'
                      }`}
                    >
                      <Icon size={14} />
                      <span>{status}</span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {task.description && (
        <p className="text-charcoal-400 text-sm mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="space-y-2">
        {task.dueDate && (
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1 text-charcoal-400">
              <Calendar size={14} />
              {format(new Date(task.dueDate), 'MMM dd')}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>
              <span
                className={`px-2 py-0.5 rounded border flex items-center gap-1 ${
                  statusColors[task.status] || statusColors['To Do']
                }`}
              >
                <StatusIcon size={12} />
                <span className="hidden sm:inline">{task.status}</span>
              </span>
            </div>
          </div>
        )}

        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.map((tag, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 bg-charcoal-700 text-charcoal-300 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {task.assignedTo && task.assignedTo.length > 0 && (
          <div className="flex -space-x-2 pt-2">
              {task.assignedTo.slice(0, 3).map((user, i) => (
                <div
                  key={i}
                  className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center border-2 border-charcoal-800"
                  title={user.name}
                >
                  <User size={12} className="text-charcoal-900" />
                </div>
              ))}
          </div>
        )}
      </div>

      {showEditModal && (
        <EditTaskModal
          task={task}
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
