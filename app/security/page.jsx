'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, Database, Key, CheckCircle } from 'lucide-react';

const securityFeatures = [
  {
    icon: Lock,
    title: 'Data Encryption',
    description: 'All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption.',
  },
  {
    icon: Key,
    title: 'Secure Authentication',
    description: 'Industry-standard authentication with JWT tokens and httpOnly cookies for maximum security.',
  },
  {
    icon: Database,
    title: 'Data Privacy',
    description: 'Your data belongs to you. We never sell or share your information with third parties.',
  },
  {
    icon: Eye,
    title: 'Access Controls',
    description: 'Granular permissions and role-based access control to protect sensitive information.',
  },
  {
    icon: Shield,
    title: 'Regular Audits',
    description: 'Continuous security monitoring and regular third-party security audits.',
  },
  {
    icon: CheckCircle,
    title: 'Compliance',
    description: 'We follow industry best practices and comply with data protection regulations.',
  },
];

export default function SecurityPage() {
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
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-500/10 rounded-full mb-6">
              <Shield size={40} className="text-amber-500" />
            </div>
            <h1 className="text-5xl font-bold text-warm-50 mb-4">Security at ProjectHub</h1>
            <p className="text-xl text-charcoal-300 max-w-3xl mx-auto">
              Your security and privacy are our top priorities. We implement enterprise-grade security 
              measures to protect your data and ensure your peace of mind.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-charcoal-800 rounded-lg border border-charcoal-700 p-6 hover:border-amber-500/50 transition"
              >
                <feature.icon size={32} className="text-amber-500 mb-4" />
                <h3 className="text-xl font-bold text-warm-50 mb-2">{feature.title}</h3>
                <p className="text-charcoal-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="space-y-8 max-w-4xl mx-auto">
            <section className="bg-charcoal-800 rounded-lg border border-charcoal-700 p-8">
              <h2 className="text-3xl font-bold text-warm-50 mb-4">Our Security Practices</h2>
              
              <div className="space-y-6 text-charcoal-300">
                <div>
                  <h3 className="text-xl font-semibold text-amber-500 mb-2">Infrastructure Security</h3>
                  <p>
                    Our infrastructure is hosted on secure, enterprise-grade cloud platforms with 
                    24/7 monitoring and automated backups. All servers are hardened and regularly 
                    patched with the latest security updates.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-amber-500 mb-2">Application Security</h3>
                  <p>
                    We follow OWASP security guidelines and conduct regular security assessments. 
                    Our code undergoes security reviews and automated vulnerability scanning before deployment.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-amber-500 mb-2">Password Protection</h3>
                  <p>
                    Passwords are hashed using bcrypt with salt rounds, ensuring that even if data 
                    is compromised, your passwords remain secure. We never store passwords in plain text.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-amber-500 mb-2">Data Backup</h3>
                  <p>
                    Automated daily backups ensure your data is safe and can be recovered in case of 
                    any issues. Backups are encrypted and stored in geographically separate locations.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-charcoal-800 rounded-lg border border-charcoal-700 p-8">
              <h2 className="text-3xl font-bold text-warm-50 mb-4">Responsible Disclosure</h2>
              <p className="text-charcoal-300 mb-4">
                We take security vulnerabilities seriously. If you discover a security issue, 
                please report it to us responsibly:
              </p>
              <ul className="space-y-2 text-charcoal-300 mb-6">
                <li>• Email security issues to <a href="mailto:otheruse998877@gmail.com" className="text-amber-500">otheruse998877@gmail.com</a></li>
                <li>• Provide detailed information about the vulnerability</li>
                <li>• Allow us reasonable time to address the issue before public disclosure</li>
                <li>• We will acknowledge your report within 48 hours</li>
              </ul>
            </section>

            <section className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-warm-50 mb-4">Questions About Security?</h2>
              <p className="text-charcoal-300 mb-4">
                We're transparent about our security practices. If you have any questions or concerns, 
                please don't hesitate to reach out.
              </p>
              <a 
                href="mailto:otheruse998877@gmail.com"
                className="inline-block px-6 py-3 bg-amber-500 text-charcoal-900 rounded-lg font-semibold hover:bg-amber-400 transition"
              >
                Contact Security Team
              </a>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
