'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, MapPin, Briefcase, Clock } from 'lucide-react';

const openings = [
  {
    title: 'Senior Full Stack Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description: 'Join our engineering team to build the next generation of project management tools.',
  },
  {
    title: 'Product Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    description: 'Help shape the user experience of ProjectHub with your creative vision.',
  },
  {
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description: 'Build and maintain our infrastructure to ensure reliability and scalability.',
  },
  {
    title: 'Customer Success Manager',
    department: 'Customer Success',
    location: 'Remote',
    type: 'Full-time',
    description: 'Help our customers achieve success with ProjectHub and drive product adoption.',
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 transition mb-8"
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold text-warm-50 mb-4">Join Our Team</h1>
          <p className="text-xl text-charcoal-300 mb-12">
            Help us build the future of project management
          </p>

          <div className="bg-charcoal-800 rounded-lg border border-charcoal-700 p-8 mb-12">
            <h2 className="text-2xl font-bold text-warm-50 mb-4">Why Work at ProjectHub?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-amber-500 mb-2">Remote-First Culture</h3>
                <p className="text-charcoal-300">Work from anywhere in the world with flexible hours.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-500 mb-2">Competitive Benefits</h3>
                <p className="text-charcoal-300">Health insurance, unlimited PTO, and equity options.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-500 mb-2">Growth Opportunities</h3>
                <p className="text-charcoal-300">Learn from experienced teammates and grow your career.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-500 mb-2">Great Team</h3>
                <p className="text-charcoal-300">Work with talented, passionate people who care.</p>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-warm-50 mb-8">Open Positions</h2>
          
          <div className="space-y-6">
            {openings.map((job, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-charcoal-800 rounded-lg border border-charcoal-700 p-6 hover:border-amber-500/50 transition group"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-warm-50 mb-2 group-hover:text-amber-500 transition">
                      {job.title}
                    </h3>
                    <p className="text-charcoal-300 mb-4">{job.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-charcoal-400">
                      <div className="flex items-center gap-1">
                        <Briefcase size={16} />
                        <span>{job.department}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{job.type}</span>
                      </div>
                    </div>
                  </div>
                  <button className="px-6 py-3 bg-amber-500 text-charcoal-900 rounded-lg font-semibold hover:bg-amber-400 transition whitespace-nowrap">
                    Apply Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 bg-amber-500/10 border border-amber-500/20 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-warm-50 mb-2">Don't see a perfect fit?</h3>
            <p className="text-charcoal-300 mb-4">
              We're always looking for talented people. Send us your resume and let us know how you'd like to contribute.
            </p>
            <button className="px-6 py-3 bg-charcoal-700 text-warm-100 rounded-lg font-semibold hover:bg-charcoal-600 transition">
              Get in Touch
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
