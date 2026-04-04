import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg-secondary)] px-4 text-center">
      <div className="text-8xl font-black text-primary-600 opacity-20 select-none">404</div>
      <h1 className="mt-4 text-2xl font-bold text-[var(--text-primary)]">Página no encontrada</h1>
      <p className="mt-2 text-[var(--text-secondary)] max-w-sm">
        La página que buscas no existe o ha sido movida.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
