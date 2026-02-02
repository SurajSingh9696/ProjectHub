'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, FolderKanban, Calendar, Users } from 'lucide-react';
import Link from 'next/link';
import ProjectCard from '@/components/projects/ProjectCard';
import CreateProjectModal from '@/components/projects/CreateProjectModal';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');

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
      console.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-warm-50">Projects</h1>
          <p className="text-charcoal-300 mt-1">Manage all your projects</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-charcoal-900 rounded-lg font-semibold hover:bg-amber-400 transition"
        >
          <Plus size={20} />
          New Project
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        {['all', 'Student', 'Team', 'Business'].map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === category
                ? 'bg-amber-500 text-charcoal-900'
                : 'bg-charcoal-800 text-charcoal-300 hover:bg-charcoal-700'
            }`}
          >
            {category === 'all' ? 'All Projects' : category}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-charcoal-800 rounded-xl h-48 animate-pulse" />
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProjectCard project={project} onUpdate={fetchProjects} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <FolderKanban size={64} className="text-charcoal-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-charcoal-400 mb-2">No projects found</h3>
          <p className="text-charcoal-500 mb-6">Create your first project to get started</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-amber-500 text-charcoal-900 rounded-lg font-semibold hover:bg-amber-400 transition"
          >
            Create Project
          </button>
        </div>
      )}

      {showModal && (
        <CreateProjectModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchProjects();
          }}
        />
      )}
    </div>
  );
}
