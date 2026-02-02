'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Search,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
  { icon: FolderKanban, label: 'Projects', href: '/dashboard/projects' },
  { icon: CheckSquare, label: 'Tasks', href: '/dashboard/tasks' },
  { icon: Search, label: 'Search', href: '/dashboard/search' },
  { icon: Activity, label: 'Activity', href: '/dashboard/activity' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 256 }}
      className="bg-charcoal-800 border-r border-charcoal-700 flex flex-col"
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-charcoal-700">
        {!collapsed && (
          <Link href="/dashboard" className="text-xl font-bold text-amber-500">
            ProjectHub
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-charcoal-700 rounded-lg transition"
        >
          {collapsed ? (
            <ChevronRight size={20} className="text-charcoal-400" />
          ) : (
            <ChevronLeft size={20} className="text-charcoal-400" />
          )}
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-amber-500/10 text-amber-500'
                  : 'text-charcoal-300 hover:bg-charcoal-700 hover:text-warm-100'
              }`}
            >
              <Icon size={20} />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="p-4 border-t border-charcoal-700">
          <div className="bg-charcoal-700 rounded-lg p-4">
            <p className="text-sm text-warm-100 font-medium mb-1">Need help?</p>
            <p className="text-xs text-charcoal-400 mb-3">Check our documentation</p>
            <Link 
              href="/docs"
              className="block w-full px-3 py-2 bg-amber-500 text-charcoal-900 rounded-lg text-sm font-semibold hover:bg-amber-400 transition text-center"
            >
              Learn More
            </Link>
          </div>
        </div>
      )}
    </motion.aside>
  );
}
