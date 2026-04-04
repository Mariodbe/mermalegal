'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-secondary)] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-primary-600">
            <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" fill="#059669" opacity="0.15" />
              <path d="M10 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
              <path d="M16 8v6M13 11l3-3 3 3" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            MermaLegal
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-[var(--text-primary)]">Nueva contraseña</h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">Elige una contraseña segura para tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-8 shadow-sm space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-300">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Nueva contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="touch-input focus-ring w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3 text-[var(--text-primary)]"
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <div>
            <label htmlFor="confirm" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Repetir contraseña
            </label>
            <input
              id="confirm"
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="touch-input focus-ring w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3 text-[var(--text-primary)]"
              placeholder="Repite la contraseña"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="focus-ring w-full rounded-lg bg-primary-600 py-3 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
}
