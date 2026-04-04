export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-48 rounded-lg bg-[var(--bg-tertiary)]" />
          <div className="h-4 w-64 rounded bg-[var(--bg-tertiary)]" />
        </div>
        <div className="h-14 w-44 rounded-xl bg-[var(--bg-tertiary)]" />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0,1,2,3].map((i) => (
          <div key={i} className="rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] p-5 space-y-3">
            <div className="h-3 w-20 rounded bg-[var(--bg-tertiary)]" />
            <div className="h-8 w-24 rounded-lg bg-[var(--bg-tertiary)]" />
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] p-6">
        <div className="h-5 w-40 rounded bg-[var(--bg-tertiary)] mb-4" />
        <div className="h-48 rounded-xl bg-[var(--bg-tertiary)]" />
      </div>

      {/* Table */}
      <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] p-6">
        <div className="h-5 w-36 rounded bg-[var(--bg-tertiary)] mb-4" />
        <div className="space-y-3">
          {[0,1,2,3,4].map((i) => (
            <div key={i} className="h-10 rounded-lg bg-[var(--bg-tertiary)]" />
          ))}
        </div>
      </div>
    </div>
  );
}
