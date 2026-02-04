'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity as ActivityIcon, FolderKanban, CheckSquare, Users, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ActivityPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await fetch('/api/activity');
      if (res.ok) {
        const data = await res.json();
        setActivities(data.activities || []);
      }
    } catch (error) {
      console.error('Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (action) => {
    if (action.includes('project')) return FolderKanban;
    if (action.includes('task')) return CheckSquare;
    if (action.includes('member')) return Users;
    return ActivityIcon;
  };

  const formatKey = (key) => {
    // Convert camelCase or snake_case to readable format
    return key
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
      .trim();
  };

  const formatDetails = (details) => {
    if (!details || typeof details !== 'object') return null;
    
    const entries = Object.entries(details);
    if (entries.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {entries.map(([key, value]) => (
          <span
            key={key}
            className="inline-flex items-center px-2 py-1 bg-charcoal-700 rounded text-xs text-charcoal-300"
          >
            <span className="font-medium text-amber-500">{formatKey(key)}:</span>
            <span className="ml-1">{String(value)}</span>
          </span>
        ))}
      </div>
    );
  };

  const handleDelete = async (activityId) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;
    
    try {
      const res = await fetch(`/api/activity/${activityId}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setActivities(activities.filter(a => a._id !== activityId));
      }
    } catch (error) {
      console.error('Failed to delete activity');
    }
  };

  return (
    <div className="p-3 md:p-6">
      <div className="mb-4 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-warm-50">Activity</h1>
        <p className="text-sm md:text-base text-charcoal-300 mt-1">Recent activities across your projects</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-charcoal-800 rounded-xl h-20 animate-pulse" />
          ))}
        </div>
      ) : activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = getIcon(activity.action);
            return (
              <motion.div
                key={activity._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-charcoal-800 border border-charcoal-700 rounded-xl p-3 md:p-4 hover:border-amber-500/50 transition"
              >
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-amber-500 md:w-5 md:h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-warm-100">
                      <span className="font-semibold">{activity.user?.name || 'User'}</span>
                      {' '}{activity.action}
                    </p>
                    {activity.details && formatDetails(activity.details)}
                    <p className="text-xs text-charcoal-500 mt-2">
                      {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(activity._id)}
                    className="text-charcoal-500 hover:text-red-500 transition flex-shrink-0"
                    title="Delete activity"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-charcoal-800 border border-charcoal-700 rounded-xl">
          <ActivityIcon size={64} className="text-charcoal-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-charcoal-400 mb-2">No activity yet</h3>
          <p className="text-charcoal-500">Start creating projects and tasks to see activity</p>
        </div>
      )}
    </div>
  );
}
