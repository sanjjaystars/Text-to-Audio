import { NextResponse } from 'next/server';

import { readAudio } from '@/lib/audio-store';

export const runtime = 'nodejs';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const record = await readAudio(id);

  if (!record) {
    return NextResponse.json({ error: 'Audio file not found or expired.' }, { status: 404 });
  }

  const url = new URL(request.url);
  const shouldDownload = url.searchParams.get('download') === '1';

  return new NextResponse(record.buffer, {
    headers: {
      'Content-Type': record.mimeType,
      'Content-Length': String(record.buffer.byteLength),
      'Cache-Control': 'private, max-age=300',
      'Content-Disposition': shouldDownload
        ? `attachment; filename="${record.fileName}"`
        : `inline; filename="${record.fileName}"`,
    },
  });
}
