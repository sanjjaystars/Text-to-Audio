'use client';

import { LoaderCircle, Sparkles } from 'lucide-react';

import { SectionCard, SectionHeading } from '@/components/ui';

export function ConvertPanel({
  disabled,
  isGenerating,
  progress,
  onGenerate,
}: {
  disabled: boolean;
  isGenerating: boolean;
  progress: number;
  onGenerate: () => void;
}) {
  return (
    <SectionCard>
      <div className="space-y-5">
        <SectionHeading
          eyebrow="Convert"
          title="Generate downloadable audio"
          description="Your text is converted into speech, merged into a single MP3, then kept available for inline playback and secure download."
        />

        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
          <div className="mb-4 flex items-center justify-between text-sm text-slate-300">
            <span>Conversion progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onGenerate}
          disabled={disabled || isGenerating}
          className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-violet-500 px-5 py-4 text-base font-semibold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isGenerating ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
          {isGenerating ? 'Generating audio…' : 'Generate Audio'}
        </button>
      </div>
    </SectionCard>
  );
}
