'use client';

import { Copy, Eraser, FilePenLine } from 'lucide-react';

import { estimateAudioDuration } from '@/lib/utils';
import { SectionCard, SectionHeading } from '@/components/ui';

export function TextPreview({
  text,
  onTextChange,
  onCopy,
  onReset,
}: {
  text: string;
  onTextChange: (value: string) => void;
  onCopy: () => void;
  onReset: () => void;
}) {
  const metrics = estimateAudioDuration(text);
  const characters = text.length;

  return (
    <SectionCard className="h-full">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <SectionHeading
            eyebrow="Preview"
            title="Review and refine the extracted text"
            description="Edit anything before generating audio, paste text manually, or clean the canvas with one click."
          />
          <div className="grid grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-black/20 p-3 text-center text-sm text-slate-200">
            <div>
              <p className="text-lg font-semibold text-white">{metrics.words}</p>
              <p>Words</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-white">{characters}</p>
              <p>Characters</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-white">{metrics.label}</p>
              <p>Est. audio</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10"
          >
            <Copy className="h-4 w-4" />
            Copy text
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10"
          >
            <Eraser className="h-4 w-4" />
            Clear / reset
          </button>
        </div>

        <div className="relative">
          <FilePenLine className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-slate-500" />
          <textarea
            value={text}
            onChange={(event) => onTextChange(event.target.value)}
            placeholder="Paste your text here or upload a file to start…"
            className="min-h-[380px] w-full rounded-3xl border border-white/10 bg-slate-950/75 px-12 py-4 text-sm leading-7 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/20"
          />
        </div>
      </div>
    </SectionCard>
  );
}
