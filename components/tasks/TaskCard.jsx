'use client';

import { Calendar, Tag, User, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';

const priorityColors = {
  'Low': 'bg-charcoal-600 text-charcoal-300',
  'Medium': 'bg-amber-500/10 text-amber-500',
  'High': 'bg-orange-500/10 text-orange-500',
  'Urgent': 'bg-red-500/10 text-red-500',
};

export default function TaskCard({ task, isDragging, onDragStart, onUpdate }) {
  const [isDraggable, setIsDraggable] = useState(false);

  const handleDoubleClick = (e) => {
    setIsDraggable(true);
  };

  const handleMouseDown = (e) => {
    if (isDraggable) {
      // Keep draggable while mouse is held
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

  return (
    <div
      draggable={isDraggable}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`bg-charcoal-800 border rounded-lg p-4 transition select-none ${
        isDraggable ? 'border-amber-500 cursor-grab shadow-lg shadow-amber-500/30' : 'border-charcoal-700 cursor-pointer'
      } ${
        isDragging ? 'opacity-50 scale-95 cursor-grabbing' : 'hover:border-amber-500/50'
      }`}
      title={isDraggable ? 'Drag to move' : 'Double-click to enable dragging'}
    >
      <h3 className="text-warm-100 font-medium mb-2 line-clamp-2">
        {task.title}
      </h3>

      {task.description && (
        <p className="text-charcoal-400 text-sm mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="space-y-2">
        {task.dueDate && (
          <div className="flex items-center gap-2 text-xs text-charcoal-400">
            <Calendar size={14} />
            {format(new Date(task.dueDate), 'MMM dd')}
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

        <div className="flex items-center justify-between pt-2">
          <span className={`text-xs px-2 py-1 rounded ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>

          {task.assignedTo && task.assignedTo.length > 0 && (
            <div className="flex -space-x-2">
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
      </div>
    </div>
  );
}
