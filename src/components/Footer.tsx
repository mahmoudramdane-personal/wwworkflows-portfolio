export default function Footer() {
  return (
    <footer className="border-t border-black/5 py-8 mt-24">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
        <span className="text-neutral-400 text-xs tracking-wide">
          &copy;{new Date().getFullYear()} WWWorkflows
        </span>
        <span className="text-neutral-400 text-xs">
          Computational Design Studio
        </span>
      </div>
    </footer>
  );
}
