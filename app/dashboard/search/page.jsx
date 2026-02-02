'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Filter, X } from 'lucide-react';
import TaskCard from '@/components/tasks/TaskCard';
import ProjectCard from '@/components/projects/ProjectCard';

export const dynamic = 'force-dynamic';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [filter, setFilter] = useState('all');
  const [results, setResults] = useState({ tasks: [], projects: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        fetch(`/api/tasks`),
        fetch(`/api/projects`),
      ]);

      const tasksData = await tasksRes.json();
      const projectsData = await projectsRes.json();

      const filteredTasks = (tasksData.tasks || []).filter(task =>
        task.title.toLowerCase().includes(query.toLowerCase()) ||
        task.description?.toLowerCase().includes(query.toLowerCase())
      );

      const filteredProjects = (projectsData.projects || []).filter(project =>
        project.name.toLowerCase().includes(query.toLowerCase()) ||
        project.description?.toLowerCase().includes(query.toLowerCase())
      );

      setResults({ tasks: filteredTasks, projects: filteredProjects });
    } catch (error) {
      console.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (query) handleSearch();
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);

  const displayResults = filter === 'all' 
    ? [...results.projects, ...results.tasks]
    : filter === 'projects' 
    ? results.projects 
    : results.tasks;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-warm-50 mb-6">Search</h1>

        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects, tasks..."
              className="w-full pl-12 pr-12 py-4 bg-charcoal-800 border border-charcoal-700 rounded-lg text-warm-100 placeholder-charcoal-400 focus:outline-none focus:border-amber-500 transition"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-charcoal-700 rounded transition"
              >
                <X size={18} className="text-charcoal-400" />
              </button>
            )}
          </div>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-charcoal-800 border border-charcoal-700 rounded-lg text-warm-100 focus:outline-none focus:border-amber-500 transition"
          >
            <option value="all">All</option>
            <option value="projects">Projects</option>
            <option value="tasks">Tasks</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-charcoal-400 mt-4">Searching...</p>
        </div>
      ) : query ? (
        <div className="space-y-6">
          {results.projects.length > 0 && (filter === 'all' || filter === 'projects') && (
            <div>
              <h2 className="text-xl font-bold text-warm-50 mb-4">
                Projects ({results.projects.length})
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.projects.map((project, index) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {results.tasks.length > 0 && (filter === 'all' || filter === 'tasks') && (
            <div>
              <h2 className="text-xl font-bold text-warm-50 mb-4">
                Tasks ({results.tasks.length})
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.tasks.map((task, index) => (
                  <motion.div
                    key={task._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TaskCard task={task} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {results.projects.length === 0 && results.tasks.length === 0 && (
            <div className="text-center py-12">
              <SearchIcon size={64} className="text-charcoal-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-charcoal-400 mb-2">No results found</h3>
              <p className="text-charcoal-500">Try different keywords</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <SearchIcon size={64} className="text-charcoal-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-charcoal-400 mb-2">Start Searching</h3>
          <p className="text-charcoal-500">Enter keywords to find projects and tasks</p>
        </div>
      )}
    </div>
  );
}
