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
    pendingTasks: 0,
    completedTasks: 0,
    pendingProjects: 0,
    completedProjects: 0,
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
  ];

  const projectCompletion = stats.projects > 0 ? (stats.completedProjects / stats.projects) * 100 : 0;
  const taskCompletion = stats.tasks > 0 ? (stats.completedTasks / stats.tasks) * 100 : 0;

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-charcoal-800 to-charcoal-800/80 border border-charcoal-700 rounded-xl p-4 md:p-6 hover:border-amber-500/30 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 md:w-12 md:h-12 bg-${stat.color}-500/10 rounded-lg flex items-center justify-center`}>
                  <Icon size={20} className={`text-${stat.color}-500 md:w-6 md:h-6`} />
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-warm-50">{stat.value}</h3>
              <p className="text-charcoal-400 text-xs md:text-sm mt-1">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Charts */}
      <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
        {/* Projects Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-charcoal-800 to-charcoal-800/80 border border-charcoal-700 rounded-xl p-4 md:p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-warm-50">Projects Progress</h3>
              <p className="text-charcoal-400 text-xs md:text-sm mt-1">Completion overview</p>
            </div>
            <div className="text-right">
              <div className="text-2xl md:text-3xl font-bold text-amber-500">
                {projectCompletion.toFixed(0)}%
              </div>
              <p className="text-charcoal-400 text-xs">Complete</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs md:text-sm mb-2">
                <span className="text-charcoal-400">Completed</span>
                <span className="text-blue-400 font-semibold">{stats.completedProjects} of {stats.projects}</span>
              </div>
              <div className="h-3 bg-charcoal-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${projectCompletion}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs md:text-sm mb-2">
                <span className="text-charcoal-400">Pending</span>
                <span className="text-orange-400 font-semibold">{stats.pendingProjects} of {stats.projects}</span>
              </div>
              <div className="h-3 bg-charcoal-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${100 - projectCompletion}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-charcoal-400">Completed</span>
              </div>
              <div className="text-xl md:text-2xl font-bold text-blue-400">{stats.completedProjects}</div>
            </div>
            <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-xs text-charcoal-400">Pending</span>
              </div>
              <div className="text-xl md:text-2xl font-bold text-orange-400">{stats.pendingProjects}</div>
            </div>
          </div>
        </motion.div>

        {/* Tasks Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-charcoal-800 to-charcoal-800/80 border border-charcoal-700 rounded-xl p-4 md:p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-warm-50">Tasks Progress</h3>
              <p className="text-charcoal-400 text-xs md:text-sm mt-1">Completion overview</p>
            </div>
            <div className="text-right">
              <div className="text-2xl md:text-3xl font-bold text-emerald-500">
                {taskCompletion.toFixed(0)}%
              </div>
              <p className="text-charcoal-400 text-xs">Complete</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs md:text-sm mb-2">
                <span className="text-charcoal-400">Completed</span>
                <span className="text-emerald-400 font-semibold">{stats.completedTasks} of {stats.tasks}</span>
              </div>
              <div className="h-3 bg-charcoal-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${taskCompletion}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs md:text-sm mb-2">
                <span className="text-charcoal-400">Pending</span>
                <span className="text-amber-400 font-semibold">{stats.pendingTasks} of {stats.tasks}</span>
              </div>
              <div className="h-3 bg-charcoal-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${100 - taskCompletion}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-xs text-charcoal-400">Completed</span>
              </div>
              <div className="text-xl md:text-2xl font-bold text-emerald-400">{stats.completedTasks}</div>
            </div>
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-xs text-charcoal-400">Pending</span>
              </div>
              <div className="text-xl md:text-2xl font-bold text-amber-400">{stats.pendingTasks}</div>
            </div>
          </div>
        </motion.div>
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
