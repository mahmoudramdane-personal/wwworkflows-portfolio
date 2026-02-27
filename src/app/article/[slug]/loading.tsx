export default function ArticleLoading() {
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
          <div className="h-5 w-32 bg-neutral-100 rounded" />
        </section>

        {/* Body blocks */}
        <section className="mb-16 space-y-6">
          <div className="space-y-3">
            <div className="h-4 w-full bg-neutral-100 rounded" />
            <div className="h-4 w-5/6 bg-neutral-100 rounded" />
            <div className="h-4 w-4/6 bg-neutral-100 rounded" />
          </div>
          <div className="h-72 bg-neutral-100 rounded" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-neutral-100 rounded" />
            <div className="h-4 w-3/4 bg-neutral-100 rounded" />
            <div className="h-4 w-5/6 bg-neutral-100 rounded" />
          </div>
          <div className="h-56 bg-neutral-100 rounded" />
        </section>

      </div>
    </div>
  );
}
