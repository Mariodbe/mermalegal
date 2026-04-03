'use client';

import {
  type WasteEntry,
  WASTE_CATEGORY_LABELS,
  DESTINATION_LABELS,
  getWasteColor,
  formatKg,
} from '@/lib/types';

export function WasteTable({ entries }: { entries: WasteEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="py-12 text-center text-[var(--text-muted)]">
        <svg className="mx-auto h-12 w-12 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="text-sm">No hay registros todavia</p>
        <p className="text-xs mt-1">Pulsa &quot;Registrar merma&quot; para empezar</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-6">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b border-[var(--border-color)]">
            <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Fecha
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Categoria
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Peso
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Destino
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Registrado por
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-color)]">
          {entries.map((entry) => (
            <tr key={entry.id} className="hover:bg-[var(--bg-secondary)] transition-colors">
              <td className="px-6 py-3 text-sm text-[var(--text-secondary)] whitespace-nowrap">
                {new Date(entry.recorded_at).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </td>
              <td className="px-6 py-3 whitespace-nowrap">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: `${getWasteColor(entry.category)}20`,
                    color: getWasteColor(entry.category),
                  }}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: getWasteColor(entry.category) }}
                  />
                  {WASTE_CATEGORY_LABELS[entry.category]}
                </span>
              </td>
              <td className="px-6 py-3 text-right text-sm font-semibold text-[var(--text-primary)] tabular-nums">
                {formatKg(entry.weight_kg)}
              </td>
              <td className="px-6 py-3 text-sm text-[var(--text-secondary)] whitespace-nowrap">
                {DESTINATION_LABELS[entry.destination]}
              </td>
              <td className="px-6 py-3 text-sm text-[var(--text-muted)] whitespace-nowrap truncate max-w-[150px]">
                {entry.recorded_by}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
