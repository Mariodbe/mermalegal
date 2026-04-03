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
  donation: '#059669',
  compost: '#65a30d',
  animal_feed: '#d97706',
  destruction: '#dc2626',
};

export function WasteChart({ data }: { data: ChartDay[] }) {
  const maxKg = Math.max(...data.map((d) => d.kg), 1);
  const chartHeight = 200;
  const barWidth = 40;
  const gap = 12;
  const totalWidth = data.length * (barWidth + gap) - gap;

  if (data.every((d) => d.kg === 0)) {
    return (
      <div className="flex items-center justify-center h-[200px] text-[var(--text-muted)] text-sm">
        No hay datos para mostrar
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${totalWidth + 40} ${chartHeight + 40}`}
        className="w-full max-w-full"
        style={{ minWidth: '320px' }}
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
          const y = chartHeight - pct * chartHeight;
          return (
            <g key={pct}>
              <line
                x1="0"
                y1={y}
                x2={totalWidth + 40}
                y2={y}
                stroke="var(--border-color)"
                strokeDasharray="4 4"
              />
              <text
                x={totalWidth + 38}
                y={y + 4}
                textAnchor="end"
                className="text-[10px]"
                fill="var(--text-muted)"
              >
                {(maxKg * pct).toFixed(1)}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((day, i) => {
          const x = i * (barWidth + gap);
          const totalH = (day.kg / maxKg) * chartHeight;

          // Stacked segments
          const segments: { key: string; value: number; color: string }[] = [
            { key: 'destruction', value: day.destruction, color: COLORS.destruction },
            { key: 'animal_feed', value: day.animal_feed, color: COLORS.animal_feed },
            { key: 'compost', value: day.compost, color: COLORS.compost },
            { key: 'donation', value: day.donation, color: COLORS.donation },
          ];

          let offsetY = 0;

          return (
            <g key={i}>
              {/* Bar background */}
              <rect
                x={x}
                y={0}
                width={barWidth}
                height={chartHeight}
                fill="var(--bg-tertiary)"
                rx="6"
                opacity="0.3"
              />

              {/* Stacked bar */}
              {segments.map((seg) => {
                if (seg.value <= 0) return null;
                const segH = (seg.value / maxKg) * chartHeight;
                const y = chartHeight - offsetY - segH;
                offsetY += segH;
                return (
                  <rect
                    key={seg.key}
                    x={x}
                    y={y}
                    width={barWidth}
                    height={segH}
                    fill={seg.color}
                    rx="4"
                  />
                );
              })}

              {/* Value label */}
              {day.kg > 0 && (
                <text
                  x={x + barWidth / 2}
                  y={chartHeight - totalH - 6}
                  textAnchor="middle"
                  className="text-[11px] font-semibold"
                  fill="var(--text-primary)"
                >
                  {day.kg.toFixed(1)}
                </text>
              )}

              {/* Day label */}
              <text
                x={x + barWidth / 2}
                y={chartHeight + 16}
                textAnchor="middle"
                className="text-[11px]"
                fill="var(--text-muted)"
              >
                {day.date}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-xs text-[var(--text-secondary)]">
        {Object.entries(COLORS).map(([key, color]) => {
          const labels: Record<string, string> = {
            donation: 'Donacion',
            compost: 'Compost',
            animal_feed: 'Pienso',
            destruction: 'Destruccion',
          };
          return (
            <div key={key} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color }} />
              {labels[key]}
            </div>
          );
        })}
      </div>
    </div>
  );
}
