'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// ── Animated counter ──────────────────────────────────────────────────────────
export function AnimatedCounter({ target, suffix = '', prefix = '', duration = 2000 }: {
  target: number; suffix?: string; prefix?: string; duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const animate = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * target));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <div ref={ref} className="text-4xl sm:text-5xl font-bold text-primary-600 tabular-nums">
      {prefix}{count.toLocaleString('es-ES')}{suffix}
    </div>
  );
}

// ── Loss Calculator (hero) ────────────────────────────────────────────────────
export function LossCalculator({ ctaHref }: { ctaHref: string }) {
  const [clientes, setClientes] = useState('');
  const [ticket, setTicket] = useState('');

  const clientesNum = parseFloat(clientes) || 0;
  const ticketNum = parseFloat(ticket) || 0;
  const hasValues = clientesNum > 0 && ticketNum > 0;

  const revenue = clientesNum * ticketNum * 365;
  const annualLoss = Math.round(revenue * 0.07);
  const monthlyLoss = Math.round(annualLoss / 12);
  const potentialSaving = Math.round(annualLoss * 0.25);

  return (
    <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-950 to-red-900 px-6 py-4 flex items-center gap-3">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-red-400" />
        </span>
        <span className="text-sm font-bold text-red-100 uppercase tracking-wider">
          Calculadora de pérdidas — Ley 1/2025
        </span>
      </div>

      <div className="p-6 space-y-5">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
              Clientes por día (aprox.)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">👤</span>
              <input
                type="number"
                value={clientes}
                onChange={(e) => setClientes(e.target.value)}
                placeholder="Ej: 80"
                min="1"
                className="w-full rounded-xl border-2 border-[var(--border-color)] bg-[var(--bg-primary)] pl-10 pr-4 py-3.5 text-lg font-semibold text-[var(--text-primary)] focus:border-red-400 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
              Ticket medio por cliente (€)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">€</span>
              <input
                type="number"
                value={ticket}
                onChange={(e) => setTicket(e.target.value)}
                placeholder="Ej: 22"
                min="1"
                className="w-full rounded-xl border-2 border-[var(--border-color)] bg-[var(--bg-primary)] pl-10 pr-4 py-3.5 text-lg font-semibold text-[var(--text-primary)] focus:border-red-400 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Result */}
        {hasValues ? (
          <div className="rounded-xl bg-red-950 border border-red-800 p-5 space-y-4">
            <div className="text-center">
              <p className="text-sm text-red-300 mb-1">Estás perdiendo aproximadamente</p>
              <p className="text-4xl font-bold text-white tabular-nums">
                {annualLoss.toLocaleString('es-ES')}€
              </p>
              <p className="text-sm text-red-400 mt-1">al año en desperdicio alimentario</p>
            </div>
            <div className="h-px bg-red-800" />
            <div className="grid grid-cols-2 gap-3 text-center text-sm">
              <div>
                <p className="text-red-400 text-xs">Pérdida mensual</p>
                <p className="font-bold text-white text-lg">{monthlyLoss.toLocaleString('es-ES')}€</p>
              </div>
              <div>
                <p className="text-emerald-400 text-xs">Podrías recuperar</p>
                <p className="font-bold text-emerald-300 text-lg">{potentialSaving.toLocaleString('es-ES')}€</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] p-5 text-center">
            <p className="text-[var(--text-muted)] text-sm">
              Introduce tus datos para ver cuánto estás perdiendo
            </p>
            <div className="mt-3 text-3xl font-bold text-[var(--text-primary)] opacity-25">_ _ . _ _ _€</div>
          </div>
        )}

        <Link
          href={ctaHref}
          className="block w-full rounded-xl bg-primary-600 py-4 text-center text-base font-bold text-white hover:bg-primary-700 transition-colors"
        >
          {hasValues ? `Recuperar ${potentialSaving.toLocaleString('es-ES')}€ gratis →` : 'Ver mi pérdida exacta — gratis →'}
        </Link>
        <p className="text-center text-xs text-[var(--text-muted)]">
          Sin tarjeta. Tu primer local es gratis.
        </p>
      </div>
    </div>
  );
}

// ── Scroll-triggered fade in ──────────────────────────────────────────────────
export function FadeInOnScroll({ children, className = '', delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => setVisible(true), delay);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
    >
      {children}
    </div>
  );
}

// ── PDF Document mock ─────────────────────────────────────────────────────────
export function PDFMock() {
  return (
    <div className="relative mx-auto max-w-sm">
      {/* Shadow layers for depth */}
      <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-xl bg-gray-800 opacity-30" />
      <div className="absolute inset-0 translate-x-1 translate-y-1 rounded-xl bg-gray-700 opacity-20" />

      {/* Main document */}
      <div className="relative rounded-xl bg-white text-gray-900 shadow-2xl overflow-hidden text-[11px]">
        {/* Header */}
        <div className="bg-emerald-700 px-5 py-3 flex items-center justify-between">
          <div>
            <p className="text-white font-bold text-sm">PLAN DE PREVENCIÓN</p>
            <p className="text-emerald-200 text-[10px]">Art. 5 — Ley 1/2025</p>
          </div>
          <div className="text-right">
            <p className="text-emerald-200 text-[10px]">Generado por</p>
            <p className="text-white font-bold text-xs">MermaLegal®</p>
          </div>
        </div>

        <div className="px-5 py-4 space-y-3">
          {/* Company */}
          <div className="pb-2 border-b border-gray-100">
            <p className="text-gray-400 text-[9px] uppercase tracking-wider">Establecimiento</p>
            <p className="font-bold text-sm text-gray-800">Restaurante El Ejemplo, S.L.</p>
            <p className="text-gray-500 text-[10px]">Responsable: Juan García · Jefe de cocina</p>
          </div>

          {/* KPIs */}
          <div>
            <p className="text-gray-400 text-[9px] uppercase tracking-wider mb-1.5">KPIs — Últimas 4 semanas</p>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: 'Merma total', val: '62,4 kg', color: 'bg-red-50 text-red-700' },
                { label: 'Coste merma', val: '487€', color: 'bg-orange-50 text-orange-700' },
                { label: 'Donado', val: '18,2 kg', color: 'bg-green-50 text-green-700' },
              ].map((k) => (
                <div key={k.label} className={`rounded-lg p-2 text-center ${k.color}`}>
                  <p className="font-bold text-sm">{k.val}</p>
                  <p className="text-[8px] leading-tight mt-0.5">{k.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Measures */}
          <div>
            <p className="text-gray-400 text-[9px] uppercase tracking-wider mb-1.5">Medidas de prevención activas</p>
            <ul className="space-y-1">
              {[
                'Rotación FIFO en cámaras frigoríficas',
                'Ajuste de pedidos según demanda real',
                'Registro diario con trazabilidad completa',
                'Donación semanal a banco de alimentos',
                'Formación continua del personal',
              ].map((m) => (
                <li key={m} className="flex items-start gap-1.5">
                  <svg className="h-3 w-3 text-emerald-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{m}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer stamp */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <p className="text-gray-400 text-[9px]">Generado el 4 de abril de 2026</p>
            <div className="flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5">
              <svg className="h-2.5 w-2.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-[9px] font-semibold text-emerald-700">Conforme Ley 1/2025</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
