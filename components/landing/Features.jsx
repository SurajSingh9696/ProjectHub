'use client';

import { motion } from 'framer-motion';
import { Kanban, Users, BarChart3, Zap, Shield, Workflow } from 'lucide-react';

const features = [
  {
    icon: Kanban,
    title: 'Kanban Boards',
    description: 'Visualize your workflow with intuitive drag-and-drop task boards',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Work together seamlessly with real-time updates and comments',
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    description: 'Monitor project health with detailed analytics and insights',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized performance for smooth and responsive experience',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Enterprise-grade security to keep your data safe',
  },
  {
    icon: Workflow,
    title: 'Custom Workflows',
    description: 'Adapt the platform to match your unique processes',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-12 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-warm-50 mb-3 md:mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-base md:text-xl text-charcoal-300 max-w-2xl mx-auto px-4">
            Powerful features designed to help you manage projects efficiently
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-charcoal-800 p-4 md:p-6 rounded-xl border border-charcoal-700 hover:border-amber-500/50 transition-all hover:shadow-xl hover:shadow-amber-500/10"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-3 md:mb-4 group-hover:bg-amber-500/20 transition">
                <feature.icon size={20} className="text-amber-500 md:w-6 md:h-6" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-warm-50 mb-2">
                {feature.title}
              </h3>
              <p className="text-charcoal-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
