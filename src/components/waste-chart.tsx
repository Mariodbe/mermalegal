'use client';

interface ChartDay {
  date: string;
  kg: number;
  donation: number;
  compost: number;
  animal_feed: number;
  destruction: number;
}

const COLORS = {
  donation: { bg: 'bg-emerald-500', label: 'Donacion' },
  compost: { bg: 'bg-lime-500', label: 'Compost' },
  animal_feed: { bg: 'bg-amber-500', label: 'Pienso' },
  destruction: { bg: 'bg-red-500', label: 'Destruccion' },
};

const BAR_HEIGHT = 180;

export function WasteChart({ data }: { data: ChartDay[] }) {
  const maxKg = Math.max(...data.map((d) => d.kg), 0.1);

  if (data.every((d) => d.kg === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-[var(--text-muted)]">
        <svg className="h-12 w-12 mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
        <p className="text-sm">No hay datos esta semana</p>
        <p className="text-xs mt-1">Registra tu primera merma para ver el grafico</p>
      </div>
    );
  }

  // Y-axis labels
  const ySteps = 4;
  const yLabels = Array.from({ length: ySteps + 1 }, (_, i) => {
    const val = (maxKg / ySteps) * (ySteps - i);
    return val % 1 === 0 ? val.toFixed(0) : val.toFixed(1);
  });

  return (
    <div>
      <div className="flex">
        {/* Y axis */}
        <div className="flex flex-col justify-between items-end pr-3 shrink-0" style={{ height: `${BAR_HEIGHT}px` }}>
          {yLabels.map((label, i) => (
            <span key={i} className="text-[10px] text-[var(--text-muted)] leading-none">{label}</span>
          ))}
        </div>

        {/* Chart area */}
        <div className="flex-1 relative" style={{ height: `${BAR_HEIGHT}px` }}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
            <div
              key={pct}
              className="absolute left-0 right-0 border-t border-dashed border-[var(--border-color)]"
              style={{ top: `${(1 - pct) * 100}%` }}
            />
          ))}

          {/* Bars */}
          <div className="absolute inset-0 flex items-end gap-2 sm:gap-3 px-1">
            {data.map((day, i) => {
              const barH = maxKg > 0 ? (day.kg / maxKg) * BAR_HEIGHT : 0;
              const segments = [
                { key: 'donation', value: day.donation, bg: 'bg-emerald-500' },
                { key: 'compost', value: day.compost, bg: 'bg-lime-500' },
                { key: 'animal_feed', value: day.animal_feed, bg: 'bg-amber-500' },
                { key: 'destruction', value: day.destruction, bg: 'bg-red-500' },
              ].filter((s) => s.value > 0);

              return (
                <div key={i} className="flex-1 relative group" style={{ height: `${BAR_HEIGHT}px` }}>
                  {/* Value label on hover */}
                  {day.kg > 0 && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 text-[10px] sm:text-xs font-bold text-[var(--text-primary)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10"
                      style={{ bottom: `${barH + 4}px` }}
                    >
                      {day.kg.toFixed(1)} kg
                    </div>
                  )}

                  {/* Stacked bar */}
                  <div
                    className="absolute bottom-0 left-1 right-1 sm:left-1.5 sm:right-1.5 flex flex-col-reverse overflow-hidden rounded-t-lg transition-all duration-700 ease-out"
                    style={{ height: `${barH}px` }}
                  >
                    {segments.map((seg) => {
                      const segPct = day.kg > 0 ? (seg.value / day.kg) * 100 : 0;
                      return (
                        <div
                          key={seg.key}
                          className={`${seg.bg} w-full shrink-0 group-hover:brightness-110 transition-all`}
                          style={{ height: `${segPct}%` }}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Day labels */}
      <div className="flex mt-2">
        <div className="shrink-0 pr-3" style={{ width: '40px' }} />
        <div className="flex-1 flex gap-2 sm:gap-3 px-1">
          {data.map((day, i) => (
            <div key={i} className="flex-1 text-center text-[10px] sm:text-xs text-[var(--text-muted)] capitalize">
              {day.date}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-5 pt-4 border-t border-[var(--border-color)]">
        {Object.entries(COLORS).map(([key, { bg, label }]) => (
          <div key={key} className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
            <span className={`h-2.5 w-2.5 rounded-full ${bg}`} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
