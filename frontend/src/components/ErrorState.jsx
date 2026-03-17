export function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-[1.75rem] border border-rose-300/20 bg-rose-300/10 px-6 py-8">
      <h3 className="text-xl font-semibold text-white">Unable to load tasks</h3>
      <p className="mt-2 text-sm leading-7 text-rose-100">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
      >
        Try again
      </button>
    </div>
  );
}

