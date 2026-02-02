'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Create Project',
    description: 'Set up your project with details, members, and objectives',
  },
  {
    number: '02',
    title: 'Add Tasks',
    description: 'Break down work into manageable tasks and assign them',
  },
  {
    number: '03',
    title: 'Track Progress',
    description: 'Monitor task status and project progress in real-time',
  },
  {
    number: '04',
    title: 'Achieve Goals',
    description: 'Complete tasks efficiently and celebrate success',
  },
];

export default function Workflow() {
  return (
    <section id="workflow" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-warm-50 mb-4">
            Simple Workflow
          </h2>
          <p className="text-xl text-charcoal-300 max-w-2xl mx-auto">
            Get started in minutes with our intuitive process
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={24} className="text-amber-500" />
                </div>
                <div className="text-5xl font-bold text-amber-500/20 leading-none">
                  {step.number}
                </div>
              </div>
              <h3 className="text-xl font-bold text-warm-50 mb-2">
                {step.title}
              </h3>
              <p className="text-charcoal-300">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
