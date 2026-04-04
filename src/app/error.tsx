'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg-secondary)] px-4 text-center">
      <div className="text-5xl mb-4">⚠️</div>
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Algo ha ido mal</h1>
      <p className="mt-2 text-[var(--text-secondary)] max-w-sm">
        Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.
      </p>
      <button
        onClick={reset}
        className="mt-8 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
      >
        Intentar de nuevo
      </button>
    </div>
  );
}
