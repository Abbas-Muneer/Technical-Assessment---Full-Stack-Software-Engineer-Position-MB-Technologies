export function AppLayout({ children }) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(148,163,184,0.18),_transparent_34%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">{children}</div>
    </main>
  );
}

