'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Users, Briefcase } from 'lucide-react';

const useCases = [
  {
    icon: GraduationCap,
    title: 'Students',
    description: 'Manage assignments, track deadlines, and collaborate on group projects',
    features: ['Assignment tracking', 'Study schedules', 'Group collaboration'],
  },
  {
    icon: Users,
    title: 'Teams',
    description: 'Coordinate team efforts, share resources, and achieve collective goals',
    features: ['Team boards', 'Resource sharing', 'Progress reports'],
  },
  {
    icon: Briefcase,
    title: 'Businesses',
    description: 'Scale operations, manage multiple projects, and drive business growth',
    features: ['Multi-project management', 'Client tracking', 'Analytics dashboard'],
  },
];

export default function UseCases() {
  return (
    <section id="use-cases" className="py-20 px-4 bg-charcoal-800/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-warm-50 mb-4">
            Built for Everyone
          </h2>
          <p className="text-xl text-charcoal-300 max-w-2xl mx-auto">
            Whether you're a student, team, or business, ProjectHub adapts to your needs
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-charcoal-800 p-8 rounded-xl border border-charcoal-700"
            >
              <div className="w-16 h-16 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6">
                <useCase.icon size={32} className="text-amber-500" />
              </div>
              <h3 className="text-2xl font-bold text-warm-50 mb-3">
                {useCase.title}
              </h3>
              <p className="text-charcoal-300 mb-6">
                {useCase.description}
              </p>
              <ul className="space-y-2">
                {useCase.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-charcoal-400">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
