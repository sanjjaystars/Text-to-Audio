import { MAX_TEXT_LENGTH, TTS_CHUNK_LIMIT } from '@/lib/constants';

export function normalizeText(raw: string) {
  return raw.replace(/\u0000/g, '').replace(/\r\n/g, '\n').trim();
}

export function ensureTextWithinLimits(text: string) {
  if (!text.trim()) {
    throw new Error('Please provide some text to convert.');
  }

  if (text.length > MAX_TEXT_LENGTH) {
    throw new Error(`Text is too long. Please keep it under ${MAX_TEXT_LENGTH.toLocaleString()} characters.`);
  }

  return text;
}

export function splitTextIntoChunks(text: string, limit = TTS_CHUNK_LIMIT) {
  const cleanText = normalizeText(text);
  const paragraphs = cleanText.split(/\n{2,}/);
  const chunks: string[] = [];
  let current = '';

  for (const paragraph of paragraphs) {
    const candidate = current ? `${current}\n\n${paragraph}` : paragraph;
    if (candidate.length <= limit) {
      current = candidate;
      continue;
    }

    if (current) {
      chunks.push(current);
      current = '';
    }

    if (paragraph.length <= limit) {
      current = paragraph;
      continue;
    }

    const sentences = paragraph.match(/[^.!?]+[.!?]?/g) ?? [paragraph];
    let sentenceChunk = '';

    for (const sentence of sentences) {
      const sentenceCandidate = sentenceChunk ? `${sentenceChunk} ${sentence.trim()}` : sentence.trim();
      if (sentenceCandidate.length <= limit) {
        sentenceChunk = sentenceCandidate;
      } else {
        if (sentenceChunk) chunks.push(sentenceChunk);
        sentenceChunk = sentence.trim();
      }
    }

    if (sentenceChunk) {
      current = sentenceChunk;
    }
  }

  if (current) {
    chunks.push(current);
  }

  return chunks.filter(Boolean);
}
