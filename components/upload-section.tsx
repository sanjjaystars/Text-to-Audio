'use client';

import { LoaderCircle, UploadCloud } from 'lucide-react';
import { useMemo } from 'react';

import { ACCEPTED_EXTENSIONS, DEFAULT_MAX_UPLOAD_SIZE_MB } from '@/lib/constants';
import { formatBytes } from '@/lib/utils';
import { SectionCard, SectionHeading } from '@/components/ui';

export function UploadSection({
  isDragging,
  isUploading,
  selectedFileName,
  fileSize,
  onDragStateChange,
  onFileChange,
}: {
  isDragging: boolean;
  isUploading: boolean;
  selectedFileName: string | null;
  fileSize: number | null;
  onDragStateChange: (isDragging: boolean) => void;
  onFileChange: (file: File | null) => void;
}) {
  const helperText = useMemo(
    () => `${ACCEPTED_EXTENSIONS.join(', ')} • up to ${DEFAULT_MAX_UPLOAD_SIZE_MB} MB`,
    [],
  );

  return (
    <SectionCard>
      <div className="space-y-5">
        <SectionHeading
          eyebrow="Upload"
          title="Import a PDF or TXT file"
          description="Drag and drop a supported file to extract its text, or click to browse your device."
        />

        <label
          onDragOver={(event) => {
            event.preventDefault();
            onDragStateChange(true);
          }}
          onDragLeave={() => onDragStateChange(false)}
          onDrop={(event) => {
            event.preventDefault();
            onDragStateChange(false);
            const file = event.dataTransfer.files?.[0] ?? null;
            onFileChange(file);
          }}
          className={`group flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed px-6 py-10 text-center transition duration-200 ${
            isDragging
              ? 'border-violet-400 bg-violet-500/10'
              : 'border-white/15 bg-slate-900/60 hover:border-violet-400/40 hover:bg-white/5'
          }`}
        >
          <input
            type="file"
            accept=".pdf,.txt"
            className="hidden"
            onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
          />
          <div className="mb-4 rounded-2xl bg-violet-500/15 p-4 text-violet-200 transition group-hover:scale-105">
            {isUploading ? <LoaderCircle className="h-8 w-8 animate-spin" /> : <UploadCloud className="h-8 w-8" />}
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-white">
              {isUploading ? 'Extracting text…' : 'Drop your file here or click to upload'}
            </p>
            <p className="text-sm text-slate-400">{helperText}</p>
            {selectedFileName && (
              <p className="text-sm text-violet-200">
                Loaded: {selectedFileName}
                {fileSize ? ` (${formatBytes(fileSize)})` : ''}
              </p>
            )}
          </div>
        </label>
      </div>
    </SectionCard>
  );
}
