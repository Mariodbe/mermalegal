export default function PlanLoading() {
  return (
    <div className="max-w-lg mx-auto space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-48 rounded-lg bg-[var(--bg-tertiary)]" />
        <div className="h-4 w-64 rounded bg-[var(--bg-tertiary)]" />
      </div>

      {/* Progress bar */}
      <div className="flex gap-1.5">
        {[0,1,2,3,4].map((i) => (
          <div key={i} className="h-1.5 flex-1 rounded-full bg-[var(--bg-tertiary)]" />
        ))}
      </div>

      <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-6 space-y-5">
        <div className="h-5 w-40 rounded bg-[var(--bg-tertiary)]" />
        <div className="h-12 rounded-lg bg-[var(--bg-tertiary)]" />
        <div className="h-4 w-32 rounded bg-[var(--bg-tertiary)]" />
        <div className="grid grid-cols-2 gap-3">
          {[0,1,2,3].map((i) => (
            <div key={i} className="h-14 rounded-xl bg-[var(--bg-tertiary)]" />
          ))}
        </div>
        <div className="h-12 rounded-xl bg-[var(--bg-tertiary)]" />
      </div>
    </div>
  );
}
