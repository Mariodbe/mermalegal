'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
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
          <h1 className="mt-4 text-2xl font-bold text-[var(--text-primary)]">Recuperar contraseña</h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Te enviamos un enlace para crear una nueva contraseña
          </p>
        </div>

        <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-8 shadow-sm">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 mx-auto text-2xl">
                ✉️
              </div>
              <p className="font-semibold text-[var(--text-primary)]">Revisa tu correo</p>
              <p className="text-sm text-[var(--text-secondary)]">
                Si <strong>{email}</strong> tiene una cuenta en MermaLegal, recibirás un enlace en los próximos minutos.
              </p>
              <p className="text-xs text-[var(--text-muted)]">Revisa también la carpeta de spam.</p>
              <Link
                href="/auth/login"
                className="mt-2 inline-block text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                ← Volver al inicio de sesión
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-300">
                  {error}
                </div>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="touch-input focus-ring w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                  placeholder="tu@restaurante.es"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="focus-ring w-full rounded-lg bg-primary-600 py-3 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
              </button>
              <p className="text-center text-sm text-[var(--text-secondary)]">
                <Link href="/auth/login" className="font-medium text-primary-600 hover:text-primary-700">
                  ← Volver al inicio de sesión
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
