import type { PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';

export function SectionCard({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <section
      className={cn(
        'rounded-3xl border border-white/10 bg-white/5 p-5 shadow-glow backdrop-blur-xl md:p-6',
        className,
      )}
    >
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-300">{eyebrow}</p>
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-white md:text-2xl">{title}</h2>
        <p className="text-sm leading-6 text-slate-300">{description}</p>
      </div>
    </div>
  );
}
