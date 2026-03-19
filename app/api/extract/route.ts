import path from 'node:path';

import { NextResponse } from 'next/server';

import { validateUpload } from '@/lib/file-validation';
import { extractPdfText } from '@/lib/pdf';
import { normalizeText } from '@/lib/text';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file was uploaded.' }, { status: 400 });
    }

    const { extension } = validateUpload(file);
    const buffer = Buffer.from(await file.arrayBuffer());

    const extractedText =
      extension === '.pdf' ? await extractPdfText(buffer) : buffer.toString('utf-8');

    const text = normalizeText(extractedText);

    if (!text) {
      return NextResponse.json(
        { error: 'We could not find any readable text in that file.' },
        { status: 422 },
      );
    }

    return NextResponse.json({
      text,
      fileName: file.name,
      sourceType: path.extname(file.name).toLowerCase() === '.pdf' ? 'pdf' : 'txt',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to read this file right now.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
