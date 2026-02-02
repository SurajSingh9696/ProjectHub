'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-12 text-center"
      >
        <h2 className="text-4xl font-bold text-charcoal-900 mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-xl text-charcoal-800 mb-8">
          Join thousands of teams already using ProjectHub
        </p>
        <Link
          href="/auth/register"
          className="inline-flex items-center gap-2 px-8 py-4 bg-charcoal-900 text-warm-50 rounded-lg font-semibold hover:bg-charcoal-800 transition"
        >
          Create Free Account
          <ArrowRight size={20} />
        </Link>
      </motion.div>
    </section>
  );
}
