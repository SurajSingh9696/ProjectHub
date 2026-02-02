'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import TaskCard from '@/components/tasks/TaskCard';
import CreateTaskModal from '@/components/tasks/CreateTaskModal';
import toast from 'react-hot-toast';

const columns = [
  { id: 'To Do', title: 'To Do', color: 'slate', bgColor: 'bg-slate-500/10', dotColor: 'bg-slate-500' },
  { id: 'In Progress', title: 'In Progress', color: 'blue', bgColor: 'bg-blue-500/10', dotColor: 'bg-blue-500' },
  { id: 'Review', title: 'Review', color: 'purple', bgColor: 'bg-purple-500/10', dotColor: 'bg-purple-500' },
  { id: 'Completed', title: 'Completed', color: 'emerald', bgColor: 'bg-emerald-500/10', dotColor: 'bg-emerald-500' },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (!draggedTask || draggedTask.status === newStatus) {
      setDraggedTask(null);
      return;
    }

    // Update UI immediately
    setTasks(prev => prev.map(task =>
      task._id === draggedTask._id ? { ...task, status: newStatus } : task
    ));

    try {
      const res = await fetch(`/api/tasks/${draggedTask._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success(`Task moved to ${newStatus}`);
      } else {
        toast.error('Failed to update task');
        fetchTasks();
      }
    } catch (error) {
      toast.error('Failed to update task');
      fetchTasks();
    }

    setDraggedTask(null);
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-charcoal-800 rounded w-1/4" />
          <div className="grid grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-charcoal-800 rounded-xl h-96" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-warm-50">Task Board</h1>
          <p className="text-charcoal-300 mt-1">Drag and drop to organize your tasks</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-charcoal-900 rounded-lg font-semibold hover:bg-amber-400 transition"
        >
          <Plus size={20} />
          New Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1">
        {columns.map((column) => (
          <div key={column.id} className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-warm-100 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${column.dotColor}`} />
                {column.title}
                <span className="text-xs text-charcoal-400 ml-1">
                  ({getTasksByStatus(column.id).length})
                </span>
              </h2>
            </div>

            <div
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
              className={`flex-1 rounded-xl p-4 transition min-h-[200px] ${column.bgColor} ${
                dragOverColumn === column.id ? 'ring-2 ring-amber-500 bg-opacity-20' : ''
              }`}
            >
              <div className="space-y-3">
                {getTasksByStatus(column.id).map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    isDragging={draggedTask?._id === task._id}
                    onDragStart={() => handleDragStart(task)}
                    onUpdate={fetchTasks}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <CreateTaskModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchTasks();
          }}
        />
      )}
    </div>
  );
}
