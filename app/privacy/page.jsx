'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900">
      <div className="max-w-4xl mx-auto px-4 py-20">
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
          className="prose prose-invert max-w-none"
        >
          <h1 className="text-5xl font-bold text-warm-50 mb-4">Privacy Policy</h1>
          <p className="text-charcoal-400 mb-8">Last updated: February 2, 2026</p>

          <div className="space-y-8 text-charcoal-300">
            <section>
              <h2 className="text-3xl font-bold text-warm-50 mb-4">Introduction</h2>
              <p>
                At ProjectHub, we take your privacy seriously. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you use our project management platform.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-warm-50 mb-4">Information We Collect</h2>
              <h3 className="text-xl font-semibold text-amber-500 mb-2">Personal Information</h3>
              <ul className="space-y-2 mb-4">
                <li>• Name and email address</li>
                <li>• Account credentials</li>
                <li>• Profile information</li>
                <li>• Avatar images</li>
              </ul>

              <h3 className="text-xl font-semibold text-amber-500 mb-2">Usage Data</h3>
              <ul className="space-y-2">
                <li>• Projects, tasks, and activities you create</li>
                <li>• Team collaboration data</li>
                <li>• Usage patterns and preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-warm-50 mb-4">How We Use Your Information</h2>
              <ul className="space-y-2">
                <li>• To provide and maintain our service</li>
                <li>• To notify you about changes to our service</li>
                <li>• To provide customer support</li>
                <li>• To gather analysis or valuable information to improve our service</li>
                <li>• To monitor the usage of our service</li>
                <li>• To detect, prevent and address technical issues</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-warm-50 mb-4">Data Security</h2>
              <p>
                We implement appropriate technical and organizational security measures to protect your personal 
                information. Your data is encrypted in transit and at rest. However, no method of transmission 
                over the Internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-warm-50 mb-4">Data Retention</h2>
              <p>
                We will retain your personal information only for as long as necessary for the purposes set out 
                in this Privacy Policy. You can delete your account at any time from your settings page, which 
                will remove all your personal data from our systems.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-warm-50 mb-4">Your Rights</h2>
              <ul className="space-y-2">
                <li>• Access your personal data</li>
                <li>• Correct inaccurate data</li>
                <li>• Request deletion of your data</li>
                <li>• Object to processing of your data</li>
                <li>• Request transfer of your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-warm-50 mb-4">Cookies</h2>
              <p>
                We use cookies and similar tracking technologies to track activity on our service. 
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-warm-50 mb-4">Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by 
                posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-warm-50 mb-4">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:otheruse998877@gmail.com" className="text-amber-500 hover:text-amber-400">
                  otheruse998877@gmail.com
                </a>
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
