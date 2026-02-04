'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-24 md:pt-32 pb-12 md:pb-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent" />
      
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-amber-500/10 border border-amber-500/20 rounded-full mb-4 md:mb-6"
        >
          <Sparkles size={14} className="text-amber-500 md:w-4 md:h-4" />
          <span className="text-amber-500 text-xs md:text-sm font-medium">Modern Project Management</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-7xl font-bold text-warm-50 mb-4 md:mb-6 leading-tight"
        >
          Streamline Your
          <span className="text-amber-500"> Workflow</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base md:text-xl text-charcoal-300 mb-6 md:mb-10 max-w-2xl mx-auto px-4"
        >
          The all-in-one project management platform designed for students, teams, and businesses.
          Track progress, collaborate seamlessly, and achieve your goals.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4"
        >
          <Link
            href="/auth/register"
            className="group px-6 py-3 md:px-8 md:py-4 bg-amber-500 text-charcoal-900 rounded-lg font-semibold hover:bg-amber-400 transition flex items-center justify-center gap-2"
          >
            Start Free Trial
            <ArrowRight size={18} className="group-hover:translate-x-1 transition md:w-5 md:h-5" />
          </Link>
          <Link
            href="#features"
            className="px-6 py-3 md:px-8 md:py-4 bg-charcoal-800 text-warm-100 rounded-lg font-semibold hover:bg-charcoal-700 transition"
          >
            Learn More
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 md:mt-16 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-transparent to-transparent z-10" />
          <div className="bg-charcoal-800 rounded-xl shadow-2xl p-2 md:p-4 border border-charcoal-700">
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
