export default function Loading() {
  return (
    <div className="max-w-editorial mx-auto px-6 md:px-grid-margin py-12 animate-pulse">
      <div className="border-b border-warm-gray pb-10 mb-12">
        <div className="h-3 w-28 bg-warm-gray rounded mb-6" />
        <div className="h-12 w-64 bg-warm-gray rounded mb-2" />
        <div className="h-4 w-48 bg-warm-gray rounded" />
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="py-10 border-b border-warm-gray">
          <div className="flex gap-10">
            <div className="w-48 h-48 bg-warm-gray rounded flex-shrink-0 hidden md:block" />
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex gap-2">
                <div className="h-4 w-8 bg-warm-gray rounded" />
                <div className="h-4 w-16 bg-warm-gray rounded" />
                <div className="h-4 w-20 bg-warm-gray rounded" />
              </div>
              <div className="h-8 w-3/4 bg-warm-gray rounded" />
              <div className="h-8 w-1/2 bg-warm-gray rounded" />
              <div className="h-5 w-full bg-warm-gray rounded mt-2" />
              <div className="h-5 w-5/6 bg-warm-gray rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
