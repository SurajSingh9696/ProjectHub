'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, FolderKanban, Calendar, Users, Filter, X } from 'lucide-react';
import Link from 'next/link';
import ProjectCard from '@/components/projects/ProjectCard';
import CreateProjectModal from '@/components/projects/CreateProjectModal';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

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

  const filteredProjects = projects.filter(p => {
    if (activeFilter === 'all') return true;
    // Check if filter matches category or status
    return p.category === activeFilter || p.status === activeFilter;
  });

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

      {/* Desktop Filters - All in One Line */}
      <div className="hidden md:flex mb-6 flex-wrap gap-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            activeFilter === 'all'
              ? 'bg-amber-500 text-charcoal-900'
              : 'bg-charcoal-800 text-charcoal-300 hover:bg-charcoal-700'
          }`}
        >
          All
        </button>
        
        {['Student', 'Team', 'Business', 'Active', 'On Hold', 'Completed', 'Archived'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeFilter === filter
                ? 'bg-amber-500 text-charcoal-900'
                : 'bg-charcoal-800 text-charcoal-300 hover:bg-charcoal-700'
            }`}
          >
            {filter}
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

      {/* Mobile Filter Button - Bottom Right */}
      <button
        onClick={() => setShowFilterModal(true)}
        className="md:hidden fixed bottom-20 right-6 z-40 bg-amber-500 text-charcoal-900 p-4 rounded-full shadow-lg hover:bg-amber-400 transition-all hover:scale-110"
      >
        <Filter size={24} />
      </button>

      {/* Mobile Filter Modal */}
      {showFilterModal && (
        <div className="md:hidden fixed inset-0 bg-charcoal-900/80 backdrop-blur-sm z-50 flex items-end">
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="bg-charcoal-800 w-full rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-warm-50">Filters</h2>
              <button
                onClick={() => setShowFilterModal(false)}
                className="text-charcoal-400 hover:text-warm-50 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setActiveFilter('all');
                  setShowFilterModal(false);
                }}
                className={`w-full px-4 py-3 rounded-lg font-medium transition text-left ${
                  activeFilter === 'all'
                    ? 'bg-amber-500 text-charcoal-900'
                    : 'bg-charcoal-700 text-charcoal-300 hover:bg-charcoal-600'
                }`}
              >
                All Projects
              </button>
              
              {['Student', 'Team', 'Business', 'Active', 'On Hold', 'Completed', 'Archived'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    setActiveFilter(filter);
                    setShowFilterModal(false);
                  }}
                  className={`w-full px-4 py-3 rounded-lg font-medium transition text-left ${
                    activeFilter === filter
                      ? 'bg-amber-500 text-charcoal-900'
                      : 'bg-charcoal-700 text-charcoal-300 hover:bg-charcoal-600'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowFilterModal(false)}
              className="w-full mt-6 py-3 bg-charcoal-700 text-warm-100 rounded-lg font-semibold hover:bg-charcoal-600 transition"
            >
              Close
            </button>
          </motion.div>
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
