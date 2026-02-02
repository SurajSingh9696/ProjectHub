import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import UseCases from '@/components/landing/UseCases';
import Workflow from '@/components/landing/Workflow';
import CTA from '@/components/landing/CTA';
import Footer from '@/components/landing/Footer';
import Navbar from '@/components/landing/Navbar';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900">
      <Navbar />
      <Hero />
      <Features />
      <UseCases />
      <Workflow />
      <CTA />
      <Footer />
    </div>
  );
}
