'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Bell, Moon, Sun, Save, Loader2, Camera, Upload, Calendar, FolderKanban, CheckSquare, TrendingUp, Plus, BarChart3, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, logout, refreshUser } = useAuth();
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(true);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [stats, setStats] = useState({
    projectsCount: 0,
    tasksCount: 0,
    completedTasks: 0,
  });

  // Default avatar options
  const defaultAvatars = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
  ];

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
      });
      setAvatarPreview(user.avatar || null);
      setTheme(user.preferences?.theme || 'light');
      setNotifications(user.preferences?.notifications ?? true);
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const [projectsRes, tasksRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/tasks'),
      ]);

      if (projectsRes.ok && tasksRes.ok) {
        const projectsData = await projectsRes.json();
        const tasksData = await tasksRes.json();
        
        setStats({
          projectsCount: projectsData.projects?.length || 0,
          tasksCount: tasksData.tasks?.length || 0,
          completedTasks: tasksData.tasks?.filter(t => t.status === 'Completed').length || 0,
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  const handleSaveProfile = async () => {
    if (!profileData.name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!profileData.email.trim()) {
      toast.error('Email is required');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Profile updated successfully!');
        if (refreshUser) refreshUser();
      } else {
        toast.error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePreferences = async (newPreferences) => {
    setIsSavingPreferences(true);
    try {
      const res = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences: newPreferences,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Preferences saved!');
        if (refreshUser) refreshUser();
      } else {
        toast.error(data.error || 'Failed to save preferences');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSavingPreferences(false);
    }
  };

  const handleThemeChange = async (newTheme) => {
    setTheme(newTheme);
    await handleSavePreferences({
      theme: newTheme,
      notifications,
    });
  };

  const handleNotificationsToggle = async () => {
    const newNotifications = !notifications;
    setNotifications(newNotifications);
    await handleSavePreferences({
      theme,
      notifications: newNotifications,
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        toast.error('Image size should be less than 1MB');
        return;
      }
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatar) {
      toast.error('Please select an image first');
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', avatar);

      const res = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Avatar updated successfully!');
        setAvatar(null);
        if (refreshUser) refreshUser();
      } else {
        toast.error(data.error || 'Failed to upload avatar');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSelectDefaultAvatar = async (avatarUrl) => {
    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatarUrl', avatarUrl);

      const res = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Avatar updated successfully!');
        setAvatarPreview(avatarUrl);
        if (refreshUser) refreshUser();
      } else {
        toast.error(data.error || 'Failed to update avatar');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleChangePassword = async () => {
    toast.success('Password changed successfully!');
  };

  return (
    <div className="p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-warm-50">Settings</h1>
        <p className="text-charcoal-300 mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Settings */}
        <div className="lg:col-span-2 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-charcoal-800 border border-charcoal-700 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-warm-50 mb-6 flex items-center gap-2">
            <User size={24} className="text-amber-500" />
            Profile Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-warm-100 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-4 py-3 bg-charcoal-700 border border-charcoal-600 rounded-lg text-warm-100 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-warm-100 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full px-4 py-3 bg-charcoal-700 border border-charcoal-600 rounded-lg text-warm-100 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-charcoal-900 rounded-lg font-semibold hover:bg-amber-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-charcoal-800 border border-charcoal-700 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-warm-50 mb-6 flex items-center gap-2">
            <Lock size={24} className="text-amber-500" />
            Change Password
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-warm-100 mb-2">
                Current Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-charcoal-700 border border-charcoal-600 rounded-lg text-warm-100 focus:outline-none focus:border-amber-500 transition"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-warm-100 mb-2">
                New Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-charcoal-700 border border-charcoal-600 rounded-lg text-warm-100 focus:outline-none focus:border-amber-500 transition"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-warm-100 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-charcoal-700 border border-charcoal-600 rounded-lg text-warm-100 focus:outline-none focus:border-amber-500 transition"
                placeholder="••••••••"
              />
            </div>

            <button
              onClick={handleChangePassword}
              className="px-6 py-3 bg-amber-500 text-charcoal-900 rounded-lg font-semibold hover:bg-amber-400 transition"
            >
              Update Password
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-charcoal-800 border border-charcoal-700 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-warm-50">Preferences</h2>
            {isSavingPreferences && (
              <div className="flex items-center gap-2 text-amber-500 text-sm">
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-amber-500" />
                <div>
                  <p className="font-medium text-warm-100">Notifications</p>
                  <p className="text-sm text-charcoal-400">Receive email notifications</p>
                </div>
              </div>
              <button
                onClick={handleNotificationsToggle}
                disabled={isSavingPreferences}
                className={`relative w-14 h-8 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed ${
                  notifications ? 'bg-amber-500' : 'bg-charcoal-600'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition ${
                    notifications ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'light' ? (
                  <Sun size={20} className="text-amber-500" />
                ) : (
                  <Moon size={20} className="text-amber-500" />
                )}
                <div>
                  <p className="font-medium text-warm-100">Theme</p>
                  <p className="text-sm text-charcoal-400">Choose your preferred theme</p>
                </div>
              </div>
              <select
                value={theme}
                onChange={(e) => handleThemeChange(e.target.value)}
                disabled={isSavingPreferences}
                className="px-4 py-2 bg-charcoal-700 border border-charcoal-600 rounded-lg text-warm-100 focus:outline-none focus:border-amber-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-charcoal-800 border border-red-500/50 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-red-500 mb-6">Danger Zone</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Logout Section */}
            <div className="p-4 border border-charcoal-700 rounded-lg">
              <h3 className="font-semibold text-warm-100 mb-2">Logout</h3>
              <p className="text-sm text-charcoal-400 mb-4">
                Sign out of your account. You'll need to sign in again to access it.
              </p>
              <button
                onClick={logout}
                className="w-full px-4 py-2.5 bg-charcoal-700 text-warm-100 rounded-lg font-medium hover:bg-charcoal-600 transition"
              >
                Logout
              </button>
            </div>

            {/* Delete Account Section */}
            <div className="p-4 border border-red-500/30 rounded-lg">
              <h3 className="font-semibold text-red-500 mb-2 flex items-center gap-2">
                <Trash2 size={18} />
                Delete Account
              </h3>
              <p className="text-sm text-charcoal-400 mb-4">
                Permanently delete your account and all associated data. This cannot be undone.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full px-4 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition"
              >
                Delete Account
              </button>
            </div>
          </div>
        </motion.div>
        </div>

        {/* Right Column - Avatar */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-charcoal-800 border border-charcoal-700 rounded-xl p-6 sticky top-6"
          >
            <h2 className="text-xl font-bold text-warm-50 mb-6 flex items-center gap-2">
              <Camera size={24} className="text-amber-500" />
              Profile Picture
            </h2>

            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                <div className="w-40 h-40 rounded-full bg-charcoal-700 border-4 border-charcoal-600 overflow-hidden flex items-center justify-center">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={64} className="text-charcoal-500" />
                  )}
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-amber-400 transition shadow-lg"
                >
                  <Camera size={20} className="text-charcoal-900" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>

              <p className="text-sm text-charcoal-400 text-center mb-4">
                Click the camera icon to upload a new profile picture (Max 5MB)
              </p>

              {avatar && (
                <button
                  onClick={handleAvatarUpload}
                  disabled={isUploadingAvatar}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 text-charcoal-900 rounded-lg font-semibold hover:bg-amber-400 transition disabled:opacity-50 disabled:cursor-not-allowed mb-6"
                >
                  {isUploadingAvatar ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={20} />
                      Upload Avatar
                    </>
                  )}
                </button>
              )}

              {/* Default Avatars */}
              <div className="w-full">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-warm-100">Or choose a default avatar</h3>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {defaultAvatars.map((avatarUrl, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectDefaultAvatar(avatarUrl)}
                      disabled={isUploadingAvatar}
                      className={`w-full aspect-square rounded-full overflow-hidden border-2 transition hover:border-amber-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                        avatarPreview === avatarUrl ? 'border-amber-500 ring-2 ring-amber-500/50' : 'border-charcoal-600'
                      }`}
                      title="Click to use this avatar"
                    >
                      <img
                        src={avatarUrl}
                        alt={`Default avatar ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Account Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-charcoal-800 border border-charcoal-700 rounded-xl p-6 mt-6"
          >
            <h2 className="text-lg font-bold text-warm-50 mb-4 flex items-center gap-2">
              <BarChart3 size={20} className="text-amber-500" />
              Account Statistics
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <FolderKanban size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-charcoal-400">Projects</p>
                    <p className="text-xl font-bold text-warm-100">{stats.projectsCount}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <CheckSquare size={20} className="text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-charcoal-400">Total Tasks</p>
                    <p className="text-xl font-bold text-warm-100">{stats.tasksCount}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <TrendingUp size={20} className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-charcoal-400">Completed</p>
                    <p className="text-xl font-bold text-warm-100">{stats.completedTasks}</p>
                  </div>
                </div>
              </div>

              {user?.createdAt && (
                <div className="flex items-center justify-between pt-4 border-t border-charcoal-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                      <Calendar size={20} className="text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm text-charcoal-400">Member Since</p>
                      <p className="text-sm font-semibold text-warm-100">
                        {new Date(user.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Profile Completeness */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-charcoal-800 border border-charcoal-700 rounded-xl p-6 mt-6"
          >
            <h2 className="text-lg font-bold text-warm-50 mb-4">Profile Completeness</h2>
            
            {(() => {
              const completenessItems = [
                { label: 'Name', completed: !!user?.name },
                { label: 'Email', completed: !!user?.email },
                { label: 'Avatar', completed: !!user?.avatar },
                { label: 'Theme Set', completed: !!user?.preferences?.theme },
              ];
              const completedCount = completenessItems.filter(item => item.completed).length;
              const percentage = Math.round((completedCount / completenessItems.length) * 100);

              return (
                <>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-charcoal-400">{percentage}% Complete</span>
                      <span className="text-sm font-semibold text-amber-500">{completedCount}/{completenessItems.length}</span>
                    </div>
                    <div className="w-full h-2 bg-charcoal-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    {completenessItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-charcoal-400">{item.label}</span>
                        <span className={`${item.completed ? 'text-green-500' : 'text-charcoal-500'}`}>
                          {item.completed ? '✓' : '○'}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-charcoal-800 border border-charcoal-700 rounded-xl p-6 mt-6"
          >
            <h2 className="text-lg font-bold text-warm-50 mb-4">Quick Actions</h2>
            
            <div className="space-y-3">
              <a
                href="/dashboard/projects"
                className="flex items-center gap-3 p-3 bg-charcoal-700 hover:bg-charcoal-600 rounded-lg transition group"
              >
                <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center group-hover:bg-amber-500/20 transition">
                  <Plus size={20} className="text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-warm-100">New Project</p>
                  <p className="text-xs text-charcoal-400">Create a new project</p>
                </div>
              </a>

              <a
                href="/dashboard/tasks"
                className="flex items-center gap-3 p-3 bg-charcoal-700 hover:bg-charcoal-600 rounded-lg transition group"
              >
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center group-hover:bg-purple-500/20 transition">
                  <CheckSquare size={20} className="text-purple-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-warm-100">View Tasks</p>
                  <p className="text-xs text-charcoal-400">Manage your tasks</p>
                </div>
              </a>

              <a
                href="/dashboard/activity"
                className="flex items-center gap-3 p-3 bg-charcoal-700 hover:bg-charcoal-600 rounded-lg transition group"
              >
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center group-hover:bg-blue-500/20 transition">
                  <TrendingUp size={20} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-warm-100">View Activity</p>
                  <p className="text-xs text-charcoal-400">See recent activities</p>
                </div>
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <DeleteAccountModal
          onClose={() => setShowDeleteModal(false)}
          onSuccess={() => {
            setShowDeleteModal(false);
            logout();
          }}
        />
      )}
    </div>
  );
}

function DeleteAccountModal({ onClose, onSuccess }) {
  const [password, setPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async (e) => {
    e.preventDefault();
    
    if (!password) {
      setError('Password is required');
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      const res = await fetch('/api/user/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Account deleted successfully');
        onSuccess();
      } else {
        setError(data.error || 'Failed to delete account');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-charcoal-800 rounded-xl border border-red-500/50 w-full max-w-md"
      >
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-red-500/10 rounded-full mx-auto mb-4">
            <Trash2 size={24} className="text-red-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-red-500 text-center mb-2">Delete Account</h2>
          <p className="text-charcoal-300 text-center mb-6">
            This action is permanent and cannot be undone. All your data including projects, tasks, and activities will be permanently deleted.
          </p>

          <form onSubmit={handleDelete} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-warm-100 mb-2">
                Confirm with your password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter your password"
                className={`w-full px-4 py-3 bg-charcoal-700 border rounded-lg text-warm-100 focus:outline-none focus:border-red-500 transition ${
                  error ? 'border-red-500' : 'border-charcoal-600'
                }`}
                autoFocus
              />
              {error && (
                <p className="mt-2 text-red-400 text-sm flex items-center gap-1">
                  <span>⚠️</span> {error}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-charcoal-600 text-charcoal-300 rounded-lg font-semibold hover:bg-charcoal-700 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isDeleting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Delete Account
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
