'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const authContext = useAuth();
  const user = authContext?.user;
  const refreshUser = authContext?.refreshUser;

  useEffect(() => {
    // Load theme from localStorage or user preferences
    if (user) {
      const userTheme = user.preferences?.theme || 'dark';
      setTheme(userTheme);
      localStorage.setItem('theme', userTheme);
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(userTheme);
    } else {
      const savedTheme = localStorage.getItem('theme') || 'light';
      setTheme(savedTheme);
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(savedTheme);
    }
  }, [user]);

  const handleThemeToggle = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Apply theme immediately
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);

    if (user) {
      try {
        const res = await fetch('/api/user/settings', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            preferences: {
              theme: newTheme,
              notifications: user.preferences?.notifications ?? true,
            },
          }),
        });

        if (res.ok) {
          if (refreshUser) refreshUser();
        }
      } catch (error) {
        console.error('Failed to save theme:', error);
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-charcoal-900/80 backdrop-blur-md border-b border-charcoal-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <Link href="/" className="text-2xl font-bold text-amber-500">
              ProjectHub
            </Link>
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-warm-100 hover:text-amber-500 transition">
              Features
            </Link>
            <Link href="#use-cases" className="text-warm-100 hover:text-amber-500 transition">
              Use Cases
            </Link>
            <Link href="#workflow" className="text-warm-100 hover:text-amber-500 transition">
              Workflow
            </Link>
            <button
              onClick={handleThemeToggle}
              className="p-2 text-warm-100 hover:text-amber-500 transition"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <Link href="/auth/login" className="text-warm-100 hover:text-amber-500 transition">
              Login
            </Link>
            <Link
              href="/auth/register"
              className="px-6 py-2 bg-amber-500 text-charcoal-900 rounded-lg font-semibold hover:bg-amber-400 transition"
            >
              Get Started
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-warm-100"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-charcoal-800 border-t border-charcoal-700"
        >
          <div className="px-4 py-4 space-y-3">
            <Link href="#features" className="block text-warm-100 hover:text-amber-500 transition">
              Features
            </Link>
            <Link href="#use-cases" className="block text-warm-100 hover:text-amber-500 transition">
              Use Cases
            </Link>
            <Link href="#workflow" className="block text-warm-100 hover:text-amber-500 transition">
              Workflow
            </Link>
            <button
              onClick={handleThemeToggle}
              className="flex items-center gap-2 text-warm-100 hover:text-amber-500 transition"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              <span>Switch to {theme === 'light' ? 'dark' : 'light'} mode</span>
            </button>
            <Link href="/auth/login" className="block text-warm-100 hover:text-amber-500 transition">
              Login
            </Link>
            <Link
              href="/auth/register"
              className="block px-6 py-2 bg-amber-500 text-charcoal-900 rounded-lg font-semibold hover:bg-amber-400 transition text-center"
            >
              Get Started
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
