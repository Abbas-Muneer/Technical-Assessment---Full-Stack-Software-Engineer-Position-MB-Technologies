export function TaskCard({ task, isCompleting, onComplete }) {
  return (
    <article className="rounded-[1.75rem] border border-white/10 bg-white/6 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-sm transition hover:border-white/20 hover:bg-white/8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
              Pending
            </span>
            <span className="text-sm text-slate-400">
              {new Date(task.createdAt).toLocaleString()}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">{task.title}</h3>
            <p className="mt-2 max-w-xl text-sm leading-7 text-slate-300">{task.description}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onComplete}
          disabled={isCompleting}
          className="inline-flex shrink-0 items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-300/18 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Done
        </button>
      </div>
    </article>
  );
}

