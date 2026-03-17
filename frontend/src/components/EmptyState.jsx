export function EmptyState() {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-white/15 bg-white/5 px-6 py-10 text-center">
      <p className="text-sm font-medium uppercase tracking-[0.35em] text-slate-400">All clear</p>
      <h3 className="mt-4 text-2xl font-semibold text-white">No incomplete tasks right now.</h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">
        Add a task on the left and it will appear here immediately, capped to the five newest active items.
      </p>
    </div>
  );
}

