export default function Loading() {
  return (
    <div className="max-w-editorial mx-auto px-6 md:px-grid-margin py-12 animate-pulse">

      {/* Hero skeleton */}
      <div className="border-b border-warm-gray pb-12 mb-12">
        <div className="h-3 w-24 bg-warm-gray rounded mb-8" />
        <div className="h-14 w-3/4 bg-warm-gray rounded mb-4" />
        <div className="h-14 w-1/2 bg-warm-gray rounded mb-8" />
        <div className="flex gap-3 mb-8">
          <div className="h-6 w-16 bg-warm-gray rounded" />
          <div className="h-6 w-20 bg-warm-gray rounded" />
        </div>
        <div className="w-full aspect-[21/9] bg-warm-gray rounded" />
      </div>

      {/* Secondary articles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col gap-3 border-t border-warm-gray pt-6">
            <div className="h-2 w-16 bg-warm-gray rounded" />
            <div className="h-6 w-full bg-warm-gray rounded" />
            <div className="h-6 w-4/5 bg-warm-gray rounded" />
            <div className="h-4 w-24 bg-warm-gray rounded mt-2" />
          </div>
        ))}
      </div>

    </div>
  )
}
