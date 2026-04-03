'use client';

import { useState, useEffect, useRef } from 'react';

// ── Animated counter ──
export function AnimatedCounter({ target, suffix = '', duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
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
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <div ref={ref} className="text-4xl sm:text-5xl font-bold text-primary-600 tabular-nums">
      {count.toLocaleString('es-ES')}{suffix}
    </div>
  );
}

// ── Urgency banner with live date ──
export function UrgencyBanner() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  const lawDate = new Date('2026-04-02T00:00:00');
  const now = new Date();
  const isActive = now >= lawDate;

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-red-500/30 bg-gradient-to-r from-red-950 to-orange-950 p-8 sm:p-10">
      <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/10 rounded-full blur-3xl" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
          </span>
          <span className="text-sm font-bold text-red-400 uppercase tracking-wider">
            {isActive ? 'Ley en vigor' : 'Cuenta atras'}
          </span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          {isActive
            ? 'La Ley 1/2025 ya esta en vigor'
            : 'La Ley 1/2025 entra en vigor pronto'}
        </h3>
        <p className="text-red-200 text-lg max-w-2xl">
          {isActive
            ? 'Desde el 2 de abril de 2026, todos los establecimientos de hosteleria estan obligados a cumplir con la normativa de desperdicio alimentario. Las multas pueden alcanzar los 500.000€.'
            : 'Preparate antes de que entre en vigor. Las multas pueden alcanzar los 500.000€.'}
        </p>
        <div className="mt-6 grid grid-cols-3 gap-4 max-w-md mx-auto">
          <div className="rounded-xl bg-white/10 backdrop-blur p-4 text-center">
            <div className="text-3xl font-bold text-white">2.000€</div>
            <div className="text-xs text-red-300 mt-1">Multa minima</div>
          </div>
          <div className="rounded-xl bg-white/10 backdrop-blur p-4 text-center">
            <div className="text-3xl font-bold text-white">60.000€</div>
            <div className="text-xs text-red-300 mt-1">Infraccion grave</div>
          </div>
          <div className="rounded-xl bg-white/10 backdrop-blur p-4 text-center">
            <div className="text-3xl font-bold text-white">500.000€</div>
            <div className="text-xs text-red-300 mt-1">Multa maxima</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Interactive demo preview ──
export function DemoPreview() {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    {
      title: 'Selecciona categoria',
      desc: 'Toca el tipo de alimento',
      content: (
        <div className="grid grid-cols-3 gap-2">
          {[
            { emoji: '🍞', label: 'Panaderia', active: true },
            { emoji: '🥩', label: 'Proteina', active: false },
            { emoji: '🧀', label: 'Lacteos', active: false },
            { emoji: '🥦', label: 'Verdura', active: false },
            { emoji: '🍲', label: 'Preparados', active: false },
            { emoji: '📦', label: 'Otros', active: false },
          ].map((cat) => (
            <div
              key={cat.label}
              className={`rounded-xl p-3 text-center transition-all cursor-pointer ${
                cat.active
                  ? 'bg-amber-100 dark:bg-amber-900 border-2 border-primary-500 scale-105'
                  : 'bg-[var(--bg-tertiary)] border-2 border-transparent opacity-60'
              }`}
            >
              <div className="text-2xl">{cat.emoji}</div>
              <div className="text-[10px] font-bold mt-1">{cat.label}</div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Indica el peso',
      desc: 'Botones grandes, sin teclear',
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-center rounded-xl bg-[var(--bg-tertiary)] p-4">
            <span className="text-4xl font-bold text-[var(--text-primary)] tabular-nums">2.5</span>
            <span className="ml-2 text-xl text-[var(--text-muted)]">kg</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[0.5, 1, 2, 5].map((v) => (
              <div
                key={v}
                className={`rounded-lg border-2 py-3 text-center text-sm font-bold ${
                  v === 2
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-950 text-primary-700'
                    : 'border-[var(--border-color)] text-[var(--text-secondary)]'
                }`}
              >
                {v} kg
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'Elige destino',
      desc: 'Conforme a la jerarquia legal',
      content: (
        <div className="grid grid-cols-2 gap-2">
          {[
            { emoji: '❤️', label: 'Donacion', bg: 'bg-emerald-100 dark:bg-emerald-900', active: false },
            { emoji: '🌱', label: 'Compost', bg: 'bg-lime-100 dark:bg-lime-900', active: true },
            { emoji: '🐄', label: 'Pienso', bg: 'bg-orange-100 dark:bg-orange-900', active: false },
            { emoji: '🗑️', label: 'Destruccion', bg: 'bg-red-100 dark:bg-red-900', active: false },
          ].map((dest) => (
            <div
              key={dest.label}
              className={`rounded-xl p-4 text-center ${dest.bg} ${
                dest.active ? 'border-2 border-primary-500 scale-105' : 'border-2 border-transparent opacity-60'
              } transition-all cursor-pointer`}
            >
              <div className="text-2xl">{dest.emoji}</div>
              <div className="text-xs font-bold mt-1">{dest.label}</div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((s) => (s + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-6 shadow-xl max-w-sm mx-auto">
      {/* Phone frame header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--border-color)]">
        <div className="h-3 w-3 rounded-full bg-red-400" />
        <div className="h-3 w-3 rounded-full bg-yellow-400" />
        <div className="h-3 w-3 rounded-full bg-green-400" />
        <span className="ml-2 text-xs text-[var(--text-muted)]">mermalegal.vercel.app</span>
      </div>

      {/* Step indicator */}
      <div className="flex gap-1.5 mb-4">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              i <= activeStep ? 'bg-primary-600' : 'bg-[var(--bg-tertiary)]'
            }`}
          />
        ))}
      </div>

      <div className="mb-3">
        <h4 className="font-bold text-[var(--text-primary)]">{steps[activeStep].title}</h4>
        <p className="text-xs text-[var(--text-muted)]">{steps[activeStep].desc}</p>
      </div>

      <div className="transition-all duration-300">
        {steps[activeStep].content}
      </div>

      {/* Step dots */}
      <div className="flex justify-center gap-2 mt-4">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveStep(i)}
            className={`h-2 rounded-full transition-all ${
              i === activeStep ? 'w-6 bg-primary-600' : 'w-2 bg-[var(--bg-tertiary)]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ── Scroll-triggered fade in ──
export function FadeInOnScroll({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
}
