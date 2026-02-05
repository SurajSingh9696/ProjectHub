'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { Search, Bell, LogOut, User, Settings, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationPanel from './NotificationPanel';
import toast from 'react-hot-toast';

export default function TopBar() {
  const router = useRouter();
  const { user, logout, refreshUser } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState('dark');
  const [isTogglingTheme, setIsTogglingTheme] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user) {
      setTheme(user.preferences?.theme || 'dark');
      fetchUnreadCount();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        const unread = data.notifications?.filter(n => !n.read).length || 0;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Failed to fetch notification count');
    }
  };

  const handleThemeToggle = async () => {
    if (isTogglingTheme) return;
    
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setIsTogglingTheme(true);

    try {
      const res = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences: {
            theme: newTheme,
            notifications: user?.preferences?.notifications ?? true,
          },
        }),
      });

      if (res.ok) {
        if (refreshUser) refreshUser();
      } else {
        setTheme(theme); // Revert
      }
    } catch (error) {
      setTheme(theme); // Revert
    } finally {
      setIsTogglingTheme(false);
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/dashboard/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <header className="h-16 bg-charcoal-800 border-b border-charcoal-700 flex items-center justify-between px-6">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search projects, tasks... (Press Enter)"
              className="w-full pl-10 pr-4 py-2 bg-charcoal-700 border border-charcoal-600 rounded-lg text-warm-100 placeholder-charcoal-400 focus:outline-none focus:border-amber-500 transition"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleThemeToggle}
            disabled={isTogglingTheme}
            className="p-2 hover:bg-charcoal-700 rounded-lg transition disabled:opacity-50"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon size={20} className="text-charcoal-300" />
            ) : (
              <Sun size={20} className="text-charcoal-300" />
            )}
          </button>

          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-charcoal-700 rounded-lg transition"
          >
            <Bell size={20} className="text-charcoal-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 bg-amber-500 text-charcoal-900 rounded-full text-xs font-bold flex items-center justify-center px-1">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 px-3 py-2 hover:bg-charcoal-700 rounded-lg transition"
            >
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={18} className="text-charcoal-900" />
                )}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-warm-100">{user?.name || 'User'}</p>
                <p className="text-xs text-charcoal-400">{user?.email}</p>
              </div>
            </button>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-56 bg-charcoal-700 border border-charcoal-600 rounded-lg shadow-xl overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-charcoal-600">
                    <p className="text-sm font-medium text-warm-100">{user?.name}</p>
                    <p className="text-xs text-charcoal-400 mt-1">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      router.push('/dashboard/settings');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-warm-100 hover:bg-charcoal-600 transition"
                  >
                    <Settings size={18} />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-charcoal-600 transition border-t border-charcoal-600"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => {
          setShowNotifications(false);
          fetchUnreadCount();
        }}
      />
    </>
  );
}
