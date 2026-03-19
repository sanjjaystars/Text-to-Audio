'use client';

import { Mic2 } from 'lucide-react';

import { VOICE_OPTIONS } from '@/lib/constants';
import type { VoiceOption } from '@/types/book2audio';
import { SectionCard, SectionHeading } from '@/components/ui';

export function VoiceSelector({
  value,
  onChange,
}: {
  value: VoiceOption;
  onChange: (voice: VoiceOption) => void;
}) {
  return (
    <SectionCard>
      <div className="space-y-5">
        <SectionHeading
          eyebrow="Voices"
          title="Choose your narration style"
          description="Exactly two realistic presets are available to keep the experience simple and focused."
        />

        <div className="grid gap-4 md:grid-cols-2">
          {VOICE_OPTIONS.map((voice) => {
            const active = value === voice.id;
            return (
              <button
                key={voice.id}
                type="button"
                onClick={() => onChange(voice.id)}
                className={`rounded-3xl border p-5 text-left transition duration-200 ${
                  active
                    ? 'border-violet-400 bg-violet-500/15 shadow-glow'
                    : 'border-white/10 bg-white/5 hover:border-violet-400/25 hover:bg-white/10'
                }`}
              >
                <div className="mb-4 inline-flex rounded-2xl bg-black/20 p-3 text-violet-200">
                  <Mic2 className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-white">{voice.label}</h3>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-slate-300">
                      {voice.sampleName}
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-slate-300">{voice.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </SectionCard>
  );
}
