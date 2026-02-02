export default function Loading() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-warm-50 mb-6">Search</h1>
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <div className="w-full h-14 bg-charcoal-800 border border-charcoal-700 rounded-lg animate-pulse"></div>
          </div>
          <div className="w-32 h-14 bg-charcoal-800 border border-charcoal-700 rounded-lg animate-pulse"></div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-32 bg-charcoal-800 border border-charcoal-700 rounded-lg animate-pulse"></div>
        <div className="h-32 bg-charcoal-800 border border-charcoal-700 rounded-lg animate-pulse"></div>
        <div className="h-32 bg-charcoal-800 border border-charcoal-700 rounded-lg animate-pulse"></div>
      </div>
    </div>
  );
}
