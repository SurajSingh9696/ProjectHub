'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Login successful!', { duration: 2000 });
        setTimeout(() => router.push('/dashboard'), 1000);
      } else {
        toast.error(data.error || 'Login failed');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900 flex items-center justify-center px-4 py-8">
      <Toaster position="top-right" />
      
      <Link
        href="/"
        className="fixed top-4 left-4 md:top-6 md:left-6 flex items-center gap-2 px-3 py-2 md:px-4 bg-charcoal-800 hover:bg-charcoal-700 text-warm-100 rounded-lg transition border border-charcoal-700 hover:border-amber-500/50 text-sm md:text-base"
      >
        <ArrowLeft size={18} className="md:w-5 md:h-5" />
        <span className="hidden sm:inline">Back to Home</span>
      </Link>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-6 md:mb-8">
          <Link href="/" className="text-2xl md:text-3xl font-bold text-amber-500">
            ProjectHub
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-warm-50 mt-4 md:mt-6 mb-2">Welcome Back</h1>
          <p className="text-sm md:text-base text-charcoal-300">Sign in to your account</p>
        </div>

        <div className="bg-charcoal-800 rounded-xl border border-charcoal-700 p-4 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div>
              <label className="block text-xs md:text-sm font-medium text-warm-100 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" size={18} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 md:py-3 bg-charcoal-700 border border-charcoal-600 rounded-lg text-warm-100 text-sm md:text-base focus:outline-none focus:border-amber-500 transition"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-warm-100 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" size={18} />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 md:py-3 bg-charcoal-700 border border-charcoal-600 rounded-lg text-warm-100 text-sm md:text-base focus:outline-none focus:border-amber-500 transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-amber-500 text-charcoal-900 rounded-lg font-semibold hover:bg-amber-400 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-charcoal-400">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-amber-500 hover:text-amber-400 transition">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
