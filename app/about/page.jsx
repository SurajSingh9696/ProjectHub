'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Target, Users, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 transition mb-6 md:mb-8 text-sm md:text-base"
        >
          <ArrowLeft size={18} className="md:w-5 md:h-5" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-warm-50 mb-4 md:mb-6">About ProjectHub</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-base md:text-lg lg:text-xl text-charcoal-300 mb-6 md:mb-8">
              ProjectHub is a modern project management platform designed to help students, teams, 
              and businesses streamline their workflow and achieve their goals efficiently.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 my-8 md:my-12">
              <div className="bg-charcoal-800 p-4 md:p-6 rounded-lg border border-charcoal-700">
                <Target className="text-amber-500 mb-3 md:mb-4" size={24} />
                <h3 className="text-lg md:text-xl font-semibold text-warm-50 mb-2">Our Mission</h3>
                <p className="text-sm md:text-base text-charcoal-300">
                  To empower individuals and teams with intuitive tools that simplify project management.
                </p>
              </div>

              <div className="bg-charcoal-800 p-6 rounded-lg border border-charcoal-700">
                <Users className="text-amber-500 mb-4" size={32} />
                <h3 className="text-xl font-semibold text-warm-50 mb-2">Our Team</h3>
                <p className="text-charcoal-300">
                  A dedicated group of developers and designers passionate about productivity.
                </p>
              </div>

              <div className="bg-charcoal-800 p-6 rounded-lg border border-charcoal-700">
                <Zap className="text-amber-500 mb-4" size={32} />
                <h3 className="text-xl font-semibold text-warm-50 mb-2">Our Vision</h3>
                <p className="text-charcoal-300">
                  To become the go-to platform for seamless collaboration and project success.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-warm-50 mb-4 mt-12">Why Choose ProjectHub?</h2>
            <p className="text-charcoal-300 mb-4">
              We understand that managing projects can be overwhelming. That's why we've built ProjectHub 
              to be intuitive, powerful, and flexible enough to adapt to your unique workflow.
            </p>

            <ul className="space-y-2 text-charcoal-300 mb-8">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span>User-friendly interface designed for everyone</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span>Real-time collaboration features</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span>Comprehensive analytics and reporting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span>Enterprise-grade security and privacy</span>
              </li>
            </ul>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-6 mt-12">
              <h3 className="text-xl font-semibold text-warm-50 mb-2">Get Started Today</h3>
              <p className="text-charcoal-300 mb-4">
                Join thousands of users who are already managing their projects more efficiently.
              </p>
              <Link 
                href="/auth/register"
                className="inline-block px-6 py-3 bg-amber-500 text-charcoal-900 rounded-lg font-semibold hover:bg-amber-400 transition"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
