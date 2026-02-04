import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-charcoal-700 py-8 md:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-lg md:text-xl font-bold text-amber-500 mb-3 md:mb-4">ProjectHub</h3>
            <p className="text-charcoal-400 text-xs md:text-sm">
              Modern project management for everyone
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-warm-100 mb-3 md:mb-4 text-sm md:text-base">Product</h4>
            <ul className="space-y-1.5 md:space-y-2 text-charcoal-400 text-xs md:text-sm">
              <li><Link href="#features" className="hover:text-amber-500 transition">Features</Link></li>
              <li><Link href="#use-cases" className="hover:text-amber-500 transition">Use Cases</Link></li>
              <li><Link href="#workflow" className="hover:text-amber-500 transition">Workflow</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-warm-100 mb-3 md:mb-4 text-sm md:text-base">Company</h4>
            <ul className="space-y-1.5 md:space-y-2 text-charcoal-400 text-xs md:text-sm">
              <li><Link href="/about" className="hover:text-amber-500 transition">About</Link></li>
              <li><Link href="/blog" className="hover:text-amber-500 transition">Blog</Link></li>
              <li><Link href="/careers" className="hover:text-amber-500 transition">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-warm-100 mb-3 md:mb-4 text-sm md:text-base">Legal</h4>
            <ul className="space-y-1.5 md:space-y-2 text-charcoal-400 text-xs md:text-sm">
              <li><Link href="/privacy" className="hover:text-amber-500 transition">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-amber-500 transition">Terms</Link></li>
              <li><Link href="/security" className="hover:text-amber-500 transition">Security</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-6 md:pt-8 border-t border-charcoal-700 text-center text-charcoal-400 text-xs md:text-sm">
          <p>&copy; 2026 ProjectHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
