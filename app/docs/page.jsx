'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Video, MessageCircle, FileText, Zap, HelpCircle } from 'lucide-react';

const sections = [
  {
    icon: BookOpen,
    title: 'Getting Started',
    description: 'Learn the basics of ProjectHub and get up and running quickly',
    topics: [
      'Creating your first project',
      'Adding tasks and team members',
      'Understanding the dashboard',
      'Setting up your profile',
    ],
  },
  {
    icon: Zap,
    title: 'Features Guide',
    description: 'Explore all the powerful features ProjectHub has to offer',
    topics: [
      'Kanban task boards',
      'Project management',
      'Team collaboration',
      'Activity tracking',
      'Notifications system',
    ],
  },
  {
    icon: FileText,
    title: 'Best Practices',
    description: 'Tips and strategies for effective project management',
    topics: [
      'Organizing large projects',
      'Task prioritization methods',
      'Effective team communication',
      'Time management techniques',
    ],
  },
];

const faqs = [
  {
    question: 'How do I create a new project?',
    answer: 'Navigate to the Projects page and click the "Create Project" button. Fill in the project details including name, description, start date, and end date.',
  },
  {
    question: 'Can I invite team members to my projects?',
    answer: 'Currently, projects are personal. Team collaboration features are coming soon in future updates.',
  },
  {
    question: 'How do I change my password?',
    answer: 'Go to Settings > Security and use the "Change Password" section to update your password securely.',
  },
  {
    question: 'What happens when I delete my account?',
    answer: 'All your data including projects, tasks, and activities will be permanently deleted. This action cannot be undone.',
  },
  {
    question: 'How do I upload an avatar?',
    answer: 'Go to Settings and click on your avatar or the "Change Avatar" button. You can upload an image (max 1MB) or select from default avatars.',
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 transition mb-8"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-500/10 rounded-full mb-6">
              <BookOpen size={40} className="text-amber-500" />
            </div>
            <h1 className="text-5xl font-bold text-warm-50 mb-4">Documentation</h1>
            <p className="text-xl text-charcoal-300 max-w-3xl mx-auto">
              Everything you need to know about using ProjectHub effectively
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Link 
              href="#getting-started"
              className="bg-charcoal-800 rounded-lg border border-charcoal-700 p-6 hover:border-amber-500/50 transition group"
            >
              <BookOpen className="text-amber-500 mb-3" size={32} />
              <h3 className="text-xl font-bold text-warm-50 mb-2 group-hover:text-amber-500 transition">
                Getting Started
              </h3>
              <p className="text-charcoal-300 text-sm">Learn the basics</p>
            </Link>

            <Link 
              href="#features"
              className="bg-charcoal-800 rounded-lg border border-charcoal-700 p-6 hover:border-amber-500/50 transition group"
            >
              <Zap className="text-amber-500 mb-3" size={32} />
              <h3 className="text-xl font-bold text-warm-50 mb-2 group-hover:text-amber-500 transition">
                Features
              </h3>
              <p className="text-charcoal-300 text-sm">Explore capabilities</p>
            </Link>

            <Link 
              href="#faq"
              className="bg-charcoal-800 rounded-lg border border-charcoal-700 p-6 hover:border-amber-500/50 transition group"
            >
              <HelpCircle className="text-amber-500 mb-3" size={32} />
              <h3 className="text-xl font-bold text-warm-50 mb-2 group-hover:text-amber-500 transition">
                FAQ
              </h3>
              <p className="text-charcoal-300 text-sm">Common questions</p>
            </Link>
          </div>

          {/* Documentation Sections */}
          <div className="space-y-12 mb-16">
            {sections.map((section, index) => (
              <motion.section
                key={index}
                id={section.title.toLowerCase().replace(' ', '-')}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-charcoal-800 rounded-lg border border-charcoal-700 p-8"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <section.icon size={24} className="text-amber-500" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-warm-50 mb-2">{section.title}</h2>
                    <p className="text-charcoal-300">{section.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {section.topics.map((topic, topicIndex) => (
                    <div
                      key={topicIndex}
                      className="flex items-start gap-3 p-4 bg-charcoal-900 rounded-lg border border-charcoal-700"
                    >
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-charcoal-300">{topic}</span>
                    </div>
                  ))}
                </div>
              </motion.section>
            ))}
          </div>

          {/* FAQ Section */}
          <motion.section
            id="faq"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-4xl font-bold text-warm-50 mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-charcoal-800 rounded-lg border border-charcoal-700 p-6"
                >
                  <h3 className="text-lg font-semibold text-amber-500 mb-2 flex items-start gap-2">
                    <HelpCircle size={20} className="flex-shrink-0 mt-0.5" />
                    {faq.question}
                  </h3>
                  <p className="text-charcoal-300 ml-7">{faq.answer}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Additional Resources */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-charcoal-800 rounded-lg border border-charcoal-700 p-8">
              <Video className="text-amber-500 mb-4" size={32} />
              <h3 className="text-2xl font-bold text-warm-50 mb-3">Video Tutorials</h3>
              <p className="text-charcoal-300 mb-4">
                Watch step-by-step video guides to master ProjectHub features.
              </p>
              <button className="text-amber-500 hover:text-amber-400 transition font-semibold">
                Coming Soon →
              </button>
            </div>

            <div className="bg-charcoal-800 rounded-lg border border-charcoal-700 p-8">
              <MessageCircle className="text-amber-500 mb-4" size={32} />
              <h3 className="text-2xl font-bold text-warm-50 mb-3">Need More Help?</h3>
              <p className="text-charcoal-300 mb-4">
                Can't find what you're looking for? Get in touch with our support team.
              </p>
              <a 
                href="mailto:otheruse998877@gmail.com"
                className="inline-block px-6 py-3 bg-amber-500 text-charcoal-900 rounded-lg font-semibold hover:bg-amber-400 transition"
              >
                Contact Support
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
