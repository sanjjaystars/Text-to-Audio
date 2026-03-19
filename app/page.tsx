'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { RefreshCcw } from 'lucide-react';

import { AudioResult } from '@/components/audio-result';
import { ConvertPanel } from '@/components/convert-panel';
import { Hero } from '@/components/hero';
import { TextPreview } from '@/components/text-preview';
import { UploadSection } from '@/components/upload-section';
import { VoiceSelector } from '@/components/voice-selector';
import type { ExtractResponse, GenerateAudioResponse, VoiceOption } from '@/types/book2audio';
import { ACCEPTED_EXTENSIONS, APP_NAME, DEFAULT_MAX_UPLOAD_SIZE_MB } from '@/lib/constants';

const EMPTY_PROGRESS = 0;

export default function Home() {
  const [text, setText] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>('female');
  const [audioResult, setAudioResult] = useState<GenerateAudioResponse | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(EMPTY_PROGRESS);
  const [fileMeta, setFileMeta] = useState<{ name: string | null; size: number | null }>({
    name: null,
    size: null,
  });

  const canGenerate = useMemo(() => text.trim().length > 0, [text]);

  async function handleFile(file: File | null) {
    if (!file) return;

    const extension = `.${file.name.split('.').pop()?.toLowerCase() ?? ''}`;
    if (!ACCEPTED_EXTENSIONS.includes(extension)) {
      toast.error('Please upload a PDF or TXT file.');
      return;
    }

    if (file.size > DEFAULT_MAX_UPLOAD_SIZE_MB * 1024 * 1024) {
      toast.error(`File is too large. Maximum size is ${DEFAULT_MAX_UPLOAD_SIZE_MB} MB.`);
      return;
    }

    setIsUploading(true);
    setProgress(15);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/extract', { method: 'POST', body: formData });
      const payload = (await response.json()) as ExtractResponse & { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? 'We could not extract text from this file.');
      }

      setText(payload.text);
      setOriginalText(payload.text);
      setAudioResult(null);
      setFileMeta({ name: payload.fileName, size: file.size });
      setProgress(100);
      toast.success(`Loaded ${payload.fileName} successfully.`);
    } catch (error) {
      setProgress(EMPTY_PROGRESS);
      toast.error(error instanceof Error ? error.message : 'File upload failed.');
    } finally {
      setIsUploading(false);
      setTimeout(() => setProgress(EMPTY_PROGRESS), 600);
    }
  }

  async function handleGenerate() {
    if (!text.trim()) {
      toast.error('Add or upload some text before generating audio.');
      return;
    }

    setIsGenerating(true);
    setProgress(20);
    const timer = window.setInterval(() => {
      setProgress((value) => (value >= 85 ? value : value + 5));
    }, 450);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: selectedVoice }),
      });

      const payload = (await response.json()) as GenerateAudioResponse & { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? 'Audio generation failed.');
      }

      setProgress(100);
      setAudioResult(payload);
      toast.success('Audio ready! You can now listen or download the MP3.');
    } catch (error) {
      setProgress(EMPTY_PROGRESS);
      toast.error(error instanceof Error ? error.message : 'Audio generation failed.');
    } finally {
      window.clearInterval(timer);
      setIsGenerating(false);
      setTimeout(() => setProgress(EMPTY_PROGRESS), 800);
    }
  }

  async function handleCopy() {
    if (!text) {
      toast.error('There is no text to copy yet.');
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      toast.success('Text copied to your clipboard.');
    } catch {
      toast.error('Clipboard access is unavailable in this browser.');
    }
  }

  function handleReset() {
    setText('');
    setOriginalText('');
    setAudioResult(null);
    setFileMeta({ name: null, size: null });
    setProgress(EMPTY_PROGRESS);
    toast.success('Workspace cleared.');
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 md:px-6 md:py-8">
      <Hero />

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <UploadSection
            isDragging={isDragging}
            isUploading={isUploading}
            selectedFileName={fileMeta.name}
            fileSize={fileMeta.size}
            onDragStateChange={setIsDragging}
            onFileChange={handleFile}
          />
          <VoiceSelector value={selectedVoice} onChange={setSelectedVoice} />
          <ConvertPanel
            disabled={!canGenerate}
            isGenerating={isGenerating}
            progress={progress}
            onGenerate={handleGenerate}
          />
        </div>

        <div className="space-y-6">
          <TextPreview text={text} onTextChange={setText} onCopy={handleCopy} onReset={handleReset} />
          <AudioResult result={audioResult} />
        </div>
      </div>

      {originalText && originalText !== text && (
        <button
          type="button"
          onClick={() => {
            setText(originalText);
            toast.success('Restored the original extracted text.');
          }}
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
        >
          <RefreshCcw className="h-4 w-4" />
          Restore extracted text
        </button>
      )}

      <footer className="rounded-3xl border border-white/10 bg-white/5 px-6 py-5 text-sm text-slate-400 backdrop-blur-xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p>
            {APP_NAME} helps you move from uploaded text to downloadable audio with a minimal, modern workflow.
          </p>
          <p>Built with Next.js, TypeScript, Tailwind CSS, PDF parsing, and realistic TTS.</p>
        </div>
      </footer>
    </main>
  );
}
