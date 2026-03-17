export function LoadingState() {
  return (
    <div className="space-y-4" aria-label="Loading tasks">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="h-32 animate-pulse rounded-[1.75rem] border border-white/10 bg-white/5"
        />
      ))}
    </div>
  );
}

