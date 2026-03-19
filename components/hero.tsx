import { AudioLines, FileText, Sparkles } from 'lucide-react';

import { APP_NAME } from '@/lib/constants';

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/60 px-6 py-12 shadow-glow backdrop-blur-xl md:px-10 md:py-16">
      <div className="absolute inset-0 bg-grid opacity-80" />
      <div className="absolute -left-20 top-10 h-48 w-48 rounded-full bg-fuchsia-500/25 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="relative grid gap-10 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-200">
            <Sparkles className="h-4 w-4" />
            Premium text-to-audio workflow
          </span>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
              {APP_NAME}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
              Turn your books and text files into downloadable audio with a polished workflow built for fast previews, natural voices, and instant playback.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-slate-200">
            {[
              'Upload PDF or TXT',
              'Preview and edit extracted text',
              'Generate streamable MP3 audio',
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
          {[
            {
              icon: FileText,
              title: 'Reliable extraction',
              description: 'Read clean text from readable PDF pages and plain TXT uploads.',
            },
            {
              icon: AudioLines,
              title: 'Two polished voices',
              description: 'Switch between curated male and female narration profiles.',
            },
            {
              icon: Sparkles,
              title: 'Ready to download',
              description: 'Generate browser-streamable audio and save a secure MP3 copy.',
            },
          ].map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur transition duration-200 hover:border-violet-400/30 hover:bg-white/10"
            >
              <div className="mb-3 inline-flex rounded-xl bg-violet-500/15 p-2 text-violet-200">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-base font-semibold text-white">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
