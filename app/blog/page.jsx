'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

const blogPosts = [
  {
    title: '10 Tips for Effective Project Management',
    excerpt: 'Discover proven strategies to manage your projects more efficiently and deliver results on time.',
    date: 'January 28, 2026',
    readTime: '5 min read',
    category: 'Productivity',
  },
  {
    title: 'How to Build a High-Performing Team',
    excerpt: 'Learn the secrets to creating a collaborative environment that drives team success.',
    date: 'January 25, 2026',
    readTime: '7 min read',
    category: 'Team Management',
  },
  {
    title: 'The Future of Remote Work',
    excerpt: 'Explore how project management tools are shaping the future of distributed teams.',
    date: 'January 20, 2026',
    readTime: '6 min read',
    category: 'Remote Work',
  },
  {
    title: 'Mastering Kanban Boards',
    excerpt: 'A comprehensive guide to using Kanban boards for visual project management.',
    date: 'January 15, 2026',
    readTime: '8 min read',
    category: 'Tutorials',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 transition mb-8"
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold text-warm-50 mb-4">Blog</h1>
          <p className="text-xl text-charcoal-300 mb-12">
            Insights, tips, and updates from the ProjectHub team
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-charcoal-800 rounded-lg border border-charcoal-700 p-6 hover:border-amber-500/50 transition group cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
                
                <h2 className="text-2xl font-bold text-warm-50 mb-3 group-hover:text-amber-500 transition">
                  {post.title}
                </h2>
                
                <p className="text-charcoal-300 mb-4">
                  {post.excerpt}
                </p>

                <div className="flex items-center gap-4 text-sm text-charcoal-400">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-charcoal-400">More articles coming soon...</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
