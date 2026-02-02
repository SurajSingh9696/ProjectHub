'use client';

import { AuthProvider } from '@/lib/context/AuthContext';
import Sidebar from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';
import { Toaster } from 'react-hot-toast';

export default function DashboardLayout({ children }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-charcoal-900 flex">
        <Toaster position="top-right" />
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
