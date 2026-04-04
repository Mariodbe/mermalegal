export default function LocationsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-32 rounded-lg bg-[var(--bg-tertiary)]" />
          <div className="h-4 w-56 rounded bg-[var(--bg-tertiary)]" />
        </div>
        <div className="h-10 w-32 rounded-xl bg-[var(--bg-tertiary)]" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[0,1,2].map((i) => (
          <div key={i} className="rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[var(--bg-tertiary)]" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-32 rounded bg-[var(--bg-tertiary)]" />
                <div className="h-3 w-24 rounded bg-[var(--bg-tertiary)]" />
              </div>
            </div>
            <div className="h-px bg-[var(--bg-tertiary)]" />
            <div className="h-4 w-20 rounded bg-[var(--bg-tertiary)]" />
          </div>
        ))}
      </div>
    </div>
  );
}
