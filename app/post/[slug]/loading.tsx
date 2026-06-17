export default function ArticleLoading() {
  return (
    <div className="max-w-editorial mx-auto px-6 md:px-grid-margin py-12 animate-pulse">
      <div className="max-w-3xl mx-auto">

        <div className="h-3 w-32 bg-warm-gray rounded mb-8" />

        <div className="border-b border-warm-gray pb-8 mb-12">
          <div className="flex gap-2 mb-6">
            <div className="h-5 w-16 bg-warm-gray rounded" />
            <div className="h-5 w-20 bg-warm-gray rounded" />
          </div>
          <div className="h-12 w-full bg-warm-gray rounded mb-3" />
          <div className="h-12 w-4/5 bg-warm-gray rounded mb-6" />
          <div className="h-3 w-40 bg-warm-gray rounded mb-8" />
          <div className="w-full aspect-[21/9] bg-warm-gray rounded" />
        </div>

        <div className="flex flex-col gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-5 bg-warm-gray rounded" style={{ width: `${85 + (i % 3) * 5}%` }} />
          ))}
          <div className="h-8 w-48 bg-warm-gray rounded mt-4" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-5 bg-warm-gray rounded" style={{ width: `${80 + (i % 4) * 5}%` }} />
          ))}
        </div>

      </div>
    </div>
  )
}
