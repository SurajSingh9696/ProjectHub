import { Suspense } from 'react';
import SearchContent from './SearchContent';

export const dynamic = 'force-dynamic';

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="p-3 md:p-6">
        <div className="max-w-4xl">
          <h1 className="text-2xl md:text-3xl font-bold text-warm-50 mb-4 md:mb-6">Search</h1>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="flex-1 relative">
              <div className="w-full h-14 bg-charcoal-800 border border-charcoal-700 rounded-lg animate-pulse"></div>
            </div>
            <div className="w-32 h-14 bg-charcoal-800 border border-charcoal-700 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
