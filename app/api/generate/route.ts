import { NextResponse } from 'next/server';

import { mergeAudioBuffersToMp3 } from '@/lib/audio';
import { saveAudio } from '@/lib/audio-store';
import { estimateAudioDuration } from '@/lib/utils';
import { getOpenAIClient } from '@/lib/openai';
import { ensureTextWithinLimits, normalizeText, splitTextIntoChunks } from '@/lib/text';
import type { VoiceOption } from '@/types/book2audio';

export const runtime = 'nodejs';

const voiceMap: Record<VoiceOption, string> = {
  male: 'fable',
  female: 'nova',
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { text?: string; voice?: VoiceOption };
    const voice = body.voice ?? 'female';
    if (!['male', 'female'].includes(voice)) {
      return NextResponse.json({ error: 'Invalid voice selection.' }, { status: 400 });
    }

    const text = ensureTextWithinLimits(normalizeText(body.text ?? ''));
    const chunks = splitTextIntoChunks(text);
    const openai = getOpenAIClient();
    const model = process.env.OPENAI_TTS_MODEL ?? 'gpt-4o-mini-tts';

    const audioBuffers: Buffer[] = [];

    for (const chunk of chunks) {
      // We request WAV so we can stitch uniform PCM chunks together before encoding one MP3.
      const response = await openai.audio.speech.create({
        model,
        voice: voiceMap[voice],
        input: chunk,
        format: 'wav',
      });

      audioBuffers.push(Buffer.from(await response.arrayBuffer()));
    }

    const mergedMp3 = mergeAudioBuffersToMp3(audioBuffers);
    const { id, expiresAt } = await saveAudio(mergedMp3);
    const duration = estimateAudioDuration(text);

    return NextResponse.json({
      audioId: id,
      audioUrl: `/api/audio/${id}`,
      downloadUrl: `/api/audio/${id}?download=1`,
      expiresAt,
      durationEstimate: duration.label,
      byteLength: mergedMp3.byteLength,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Audio generation failed.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
