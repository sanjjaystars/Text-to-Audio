'use client';

import { Download, Music4, TimerReset } from 'lucide-react';

import { formatBytes } from '@/lib/utils';
import { SectionCard, SectionHeading } from '@/components/ui';
import type { GenerateAudioResponse } from '@/types/book2audio';

export function AudioResult({ result }: { result: GenerateAudioResponse | null }) {
  return (
    <SectionCard className="h-full">
      <div className="space-y-5">
        <SectionHeading
          eyebrow="Result"
          title="Listen and download your MP3"
          description="Generated audio is streamable directly in the browser and available through a temporary secure download link."
        />

        {result ? (
          <div className="space-y-5 rounded-3xl border border-emerald-400/20 bg-emerald-500/5 p-5">
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-200">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5">
                <Music4 className="h-4 w-4 text-emerald-300" />
                Ready to play
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5">
                <TimerReset className="h-4 w-4 text-violet-300" />
                Expires {new Date(result.expiresAt).toLocaleString()}
              </span>
            </div>

            <audio controls className="w-full">
              <source src={result.audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>

            <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-slate-200 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <p className="font-medium text-white">Generated MP3</p>
                <p>
                  Estimated duration {result.durationEstimate} • {formatBytes(result.byteLength)}
                </p>
              </div>
              <a
                href={result.downloadUrl}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/15 px-4 py-2 font-medium text-violet-100 transition hover:bg-violet-500/25"
              >
                <Download className="h-4 w-4" />
                Download MP3
              </a>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/10 bg-black/20 p-8 text-center text-sm leading-7 text-slate-400">
            Generate audio to unlock the embedded player and MP3 download link.
          </div>
        )}
      </div>
    </SectionCard>
  );
}
