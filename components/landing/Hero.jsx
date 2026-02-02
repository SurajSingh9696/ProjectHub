'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent" />
      
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full mb-6"
        >
          <Sparkles size={16} className="text-amber-500" />
          <span className="text-amber-500 text-sm font-medium">Modern Project Management</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-warm-50 mb-6 leading-tight"
        >
          Streamline Your
          <span className="text-amber-500"> Workflow</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-charcoal-300 mb-10 max-w-2xl mx-auto"
        >
          The all-in-one project management platform designed for students, teams, and businesses.
          Track progress, collaborate seamlessly, and achieve your goals.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/auth/register"
            className="group px-8 py-4 bg-amber-500 text-charcoal-900 rounded-lg font-semibold hover:bg-amber-400 transition flex items-center justify-center gap-2"
          >
            Start Free Trial
            <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
          </Link>
          <Link
            href="#features"
            className="px-8 py-4 bg-charcoal-800 text-warm-100 rounded-lg font-semibold hover:bg-charcoal-700 transition"
          >
            Learn More
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-transparent to-transparent z-10" />
          <div className="bg-charcoal-800 rounded-xl shadow-2xl p-4 border border-charcoal-700">
            <div className="aspect-video bg-gradient-to-br from-charcoal-700 to-charcoal-800 rounded-lg overflow-hidden">
              <img 
                src="/images/home.png" 
                alt="ProjectHub Dashboard Preview" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
