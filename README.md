# Book2Audio

Book2Audio is a production-ready MVP that turns uploaded PDF and TXT files into browser-playable, downloadable MP3 audio using a modern Next.js stack.

## Features

- Upload `.pdf` and `.txt` files with drag-and-drop support
- Extract readable text from supported uploads
- Paste or edit text manually before conversion
- Preview extracted text in a scrollable editor
- Choose exactly two voice presets: male and female
- Generate audio with loading states, progress feedback, and toast notifications
- Stream generated audio directly in the browser
- Download the generated audio as MP3
- Temporary server-side audio storage with expiring download links
- Responsive premium dark UI with glassmorphism styling
- Character count, word count, estimated audio duration, copy, reset, and restore helpers

## Tech Stack

- **Frontend:** Next.js App Router, React, TypeScript, Tailwind CSS
- **Backend:** Next.js Route Handlers running on the Node.js runtime
- **PDF extraction:** `pdf-parse`
- **TTS provider:** OpenAI text-to-speech API
- **Audio merging:** WAV chunk stitching + MP3 encoding via `lamejs`
- **UI polish:** `lucide-react` icons and `sonner` toast notifications

## Project Structure

```text
.
├── app/
│   ├── api/
│   │   ├── audio/[id]/route.ts
│   │   ├── extract/route.ts
│   │   └── generate/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── audio-result.tsx
│   ├── convert-panel.tsx
│   ├── hero.tsx
│   ├── text-preview.tsx
│   ├── ui.tsx
│   ├── upload-section.tsx
│   └── voice-selector.tsx
├── lib/
│   ├── audio-store.ts
│   ├── audio.ts
│   ├── constants.ts
│   ├── file-validation.ts
│   ├── openai.ts
│   ├── pdf.ts
│   ├── text.ts
│   └── utils.ts
├── types/
│   ├── book2audio.ts
│   └── lamejs.d.ts
├── .env.example
├── next.config.ts
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values.

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
| --- | --- | --- |
| `OPENAI_API_KEY` | Yes | API key for OpenAI text-to-speech generation |
| `OPENAI_TTS_MODEL` | No | TTS model name, defaults to `gpt-4o-mini-tts` |
| `MAX_UPLOAD_SIZE_MB` | No | Max upload size in MB, defaults to `15` |
| `AUDIO_RETENTION_MINUTES` | No | How long generated audio stays available on disk |

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000).

## How It Works

1. A user uploads a PDF or TXT file or pastes text manually.
2. `/api/extract` validates the file and extracts text.
3. The extracted text is shown in the preview editor for optional cleanup.
4. `/api/generate` normalizes and chunks the text for long-form TTS generation.
5. The server requests TTS audio per chunk, stitches the chunks together, and encodes a single MP3.
6. The MP3 is temporarily saved in `.tmp/audio` and served through `/api/audio/[id]` for streaming or downloading.

## Validation and Safety Notes

- Uploads are limited by extension, MIME type, and max size.
- Empty uploads or unreadable PDFs return user-friendly errors.
- Long text is chunked before TTS generation to reduce failures.
- Generated audio links are random UUID-backed endpoints and expire after the configured retention window.
- Server routes use the Node.js runtime because PDF parsing and file I/O require it.

## Production Notes

- For persistent storage in production, replace the in-memory file index with Redis, a database, or object storage.
- If your TTS provider returns a different sample rate, update `lib/audio.ts` to match it before encoding MP3 output.
- If you deploy to a serverless environment, move temporary audio storage to object storage such as S3, R2, or GCS.

## Scripts

- `npm run dev` — Start the development server
- `npm run build` — Build the production bundle
- `npm run start` — Run the production server
- `npm run lint` — Run Next.js linting
- `npm run typecheck` — Run TypeScript checks
