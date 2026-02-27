export default function ProjectLoading() {
  return (
    <div className="bg-white min-h-screen -mt-16 pt-16 animate-pulse">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">

        {/* Back nav */}
        <div className="pt-8">
          <div className="h-3 w-24 bg-neutral-200 rounded" />
        </div>

        {/* Title */}
        <section className="pt-12 pb-8 md:pt-16 md:pb-12">
          <div className="h-10 w-2/3 bg-neutral-200 rounded mb-4" />
          <div className="h-5 w-1/2 bg-neutral-100 rounded" />
        </section>

        {/* Metadata bar */}
        <section className="border-t border-b border-black/10 py-6 mb-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i}>
                <div className="h-2 w-12 bg-neutral-200 rounded mb-2" />
                <div className="h-4 w-20 bg-neutral-100 rounded" />
              </div>
            ))}
          </div>
        </section>

        {/* Body blocks */}
        <section className="mb-16 space-y-6">
          <div className="h-64 bg-neutral-100 rounded" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-neutral-100 rounded" />
            <div className="h-4 w-5/6 bg-neutral-100 rounded" />
            <div className="h-4 w-4/6 bg-neutral-100 rounded" />
          </div>
          <div className="h-80 bg-neutral-100 rounded" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-neutral-100 rounded" />
            <div className="h-4 w-3/4 bg-neutral-100 rounded" />
          </div>
        </section>

      </div>
    </div>
  );
}
