import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-charcoal-700 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold text-amber-500 mb-4">ProjectHub</h3>
            <p className="text-charcoal-400 text-sm">
              Modern project management for everyone
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-warm-100 mb-4">Product</h4>
            <ul className="space-y-2 text-charcoal-400 text-sm">
              <li><Link href="#features" className="hover:text-amber-500 transition">Features</Link></li>
              <li><Link href="#use-cases" className="hover:text-amber-500 transition">Use Cases</Link></li>
              <li><Link href="#workflow" className="hover:text-amber-500 transition">Workflow</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-warm-100 mb-4">Company</h4>
            <ul className="space-y-2 text-charcoal-400 text-sm">
              <li><Link href="/about" className="hover:text-amber-500 transition">About</Link></li>
              <li><Link href="/blog" className="hover:text-amber-500 transition">Blog</Link></li>
              <li><Link href="/careers" className="hover:text-amber-500 transition">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-warm-100 mb-4">Legal</h4>
            <ul className="space-y-2 text-charcoal-400 text-sm">
              <li><Link href="/privacy" className="hover:text-amber-500 transition">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-amber-500 transition">Terms</Link></li>
              <li><Link href="/security" className="hover:text-amber-500 transition">Security</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-charcoal-700 text-center text-charcoal-400 text-sm">
          <p>&copy; 2026 ProjectHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
