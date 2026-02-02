'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
          <h1 className="text-5xl font-bold text-warm-50 mb-4">Terms of Service</h1>
          <p className="text-charcoal-400 mb-8">Last updated: February 2, 2026</p>

          <div className="space-y-8 text-charcoal-300">
            <section>
              <h2 className="text-3xl font-bold text-warm-50 mb-4">Agreement to Terms</h2>
              <p>
                By accessing or using ProjectHub, you agree to be bound by these Terms of Service. 
                If you disagree with any part of these terms, you may not access the service.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-warm-50 mb-4">Use License</h2>
              <p>
                Permission is granted to temporarily access and use ProjectHub for personal or business 
                project management purposes. This is the grant of a license, not a transfer of title.
              </p>
              <p className="mt-4">Under this license you may not:</p>
              <ul className="space-y-2 mt-2">
                <li>• Modify or copy the materials</li>
                <li>• Use the materials for any commercial purpose</li>
                <li>• Attempt to decompile or reverse engineer any software</li>
                <li>• Remove any copyright or proprietary notations</li>
                <li>• Transfer the materials to another person</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-warm-50 mb-4">User Accounts</h2>
              <p>
                When you create an account with us, you must provide accurate, complete, and current 
                information. Failure to do so constitutes a breach of the Terms.
              </p>
              <p className="mt-4">
                You are responsible for safeguarding the password and for all activities that occur 
                under your account. You must notify us immediately upon becoming aware of any breach 
                of security or unauthorized use of your account.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-warm-50 mb-4">Content</h2>
              <p>
                Our Service allows you to create, post, and share content. You retain ownership of 
                content you submit, post or display on or through the Service.
              </p>
              <p className="mt-4">
                By posting content, you grant us a worldwide, non-exclusive, royalty-free license 
                to use, reproduce, and display such content solely for the purpose of providing the Service.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-warm-50 mb-4">Prohibited Uses</h2>
              <p>You may not use the Service:</p>
              <ul className="space-y-2 mt-2">
                <li>• For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>• To violate any international, federal, provincial or state regulations, rules, laws, or local ordinances</li>
                <li>• To infringe upon or violate our intellectual property rights</li>
                <li>• To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>• To submit false or misleading information</li>
                <li>• To upload or transmit viruses or any other type of malicious code</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-warm-50 mb-4">Service Availability</h2>
              <p>
                We strive to provide continuous service but do not guarantee that the service will be 
                available at all times. We may experience hardware, software, or other problems requiring 
                maintenance or upgrades.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-warm-50 mb-4">Termination</h2>
              <p>
                We may terminate or suspend your account immediately, without prior notice or liability, 
                for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
              <p className="mt-4">
                Upon termination, your right to use the Service will immediately cease. You may delete 
                your account at any time from your account settings.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-warm-50 mb-4">Limitation of Liability</h2>
              <p>
                In no event shall ProjectHub, nor its directors, employees, partners, agents, suppliers, 
                or affiliates, be liable for any indirect, incidental, special, consequential or punitive 
                damages, including without limitation, loss of profits, data, use, goodwill, or other 
                intangible losses.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-warm-50 mb-4">Changes to Terms</h2>
              <p>
                We reserve the right to modify or replace these Terms at any time. We will provide notice 
                of any material changes by posting the new Terms on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-warm-50 mb-4">Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at{' '}
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
