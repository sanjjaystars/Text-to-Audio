export const APP_NAME = 'Book2Audio';
export const ACCEPTED_FILE_TYPES = ['application/pdf', 'text/plain'];
export const ACCEPTED_EXTENSIONS = ['.pdf', '.txt'];
export const DEFAULT_MAX_UPLOAD_SIZE_MB = Number(process.env.MAX_UPLOAD_SIZE_MB ?? 15);
export const MAX_TEXT_LENGTH = 120_000;
export const TTS_CHUNK_LIMIT = 3_500;

export const VOICE_OPTIONS = [
  {
    id: 'male',
    label: 'Male voice',
    description: 'Warm, grounded narration for long-form listening.',
    sampleName: 'Fable',
  },
  {
    id: 'female',
    label: 'Female voice',
    description: 'Clear, bright narration suited for articles and books.',
    sampleName: 'Nova',
  },
] as const;
