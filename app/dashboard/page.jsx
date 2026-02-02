'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FolderKanban,
  CheckSquare,
  Clock,
  TrendingUp,
  Plus,
} from 'lucide-react';
import Link from 'next/link';
import CreateProjectModal from '@/components/projects/CreateProjectModal';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    projects: 0,
    tasks: 0,
    pending: 0,
    completed: 0,
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [showProjectModal, setShowProjectModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, projectsRes, tasksRes] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/projects?limit=3'),
        fetch('/api/tasks?limit=5'),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setRecentProjects(projectsData.projects || []);
      }

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setRecentTasks(tasksData.tasks || []);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data');
    }
  };

  const statCards = [
    { icon: FolderKanban, label: 'Total Projects', value: stats.projects, color: 'amber' },
    { icon: CheckSquare, label: 'Total Tasks', value: stats.tasks, color: 'green' },
    { icon: Clock, label: 'Pending', value: stats.pending, color: 'orange' },
    { icon: TrendingUp, label: 'Completed', value: stats.completed, color: 'blue' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-warm-50">Dashboard Overview</h1>
          <p className="text-charcoal-300 mt-1">Welcome back! Here's what's happening</p>
        </div>
        <button
          onClick={() => setShowProjectModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-charcoal-900 rounded-lg font-semibold hover:bg-amber-400 transition"
        >
          <Plus size={20} />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-charcoal-800 border border-charcoal-700 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-500/10 rounded-lg flex items-center justify-center`}>
                  <Icon size={24} className={`text-${stat.color}-500`} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-warm-50">{stat.value}</h3>
              <p className="text-charcoal-400 text-sm mt-1">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-charcoal-800 border border-charcoal-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-warm-50">Recent Projects</h2>
            <Link href="/dashboard/projects" className="text-amber-500 hover:text-amber-400 text-sm">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentProjects.length > 0 ? (
              recentProjects.map((project) => (
                <div
                  key={project._id}
                  className="flex items-center justify-between p-4 bg-charcoal-700 rounded-lg hover:bg-charcoal-600 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                      <FolderKanban size={20} className="text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-warm-100 font-medium">{project.name}</h3>
                      <p className="text-charcoal-400 text-sm">{project.category}</p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-charcoal-600 text-charcoal-300 rounded">
                    {project.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-charcoal-400">
                <p>No projects yet. Create your first project!</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-charcoal-800 border border-charcoal-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-warm-50">Recent Tasks</h2>
            <Link href="/dashboard/tasks" className="text-amber-500 hover:text-amber-400 text-sm">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center justify-between p-3 bg-charcoal-700 rounded-lg hover:bg-charcoal-600 transition cursor-pointer"
                >
                  <div className="flex-1">
                    <h3 className="text-warm-100 text-sm font-medium">{task.title}</h3>
                    <p className="text-charcoal-400 text-xs mt-1">{task.priority}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    task.status === 'Completed' ? 'bg-green-500/10 text-green-500' :
                    task.status === 'In Progress' ? 'bg-amber-500/10 text-amber-500' :
                    'bg-charcoal-600 text-charcoal-400'
                  }`}>
                    {task.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-charcoal-400">
                <p>No tasks yet. Start by creating a project!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showProjectModal && (
        <CreateProjectModal
          onClose={() => setShowProjectModal(false)}
          onSuccess={() => {
            setShowProjectModal(false);
            fetchDashboardData();
          }}
        />
      )}
    </div>
  );
}
