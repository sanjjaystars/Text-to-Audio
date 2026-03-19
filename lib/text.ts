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

function splitLongSegment(segment: string, limit: number) {
  if (segment.length <= limit) {
    return [segment];
  }

  const words = segment.split(/\s+/).filter(Boolean);
  const chunks: string[] = [];
  let current = '';

  for (const word of words) {
    if (word.length > limit) {
      if (current) {
        chunks.push(current);
        current = '';
      }

      for (let index = 0; index < word.length; index += limit) {
        chunks.push(word.slice(index, index + limit));
      }

      continue;
    }

    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= limit) {
      current = candidate;
      continue;
    }

    if (current) {
      chunks.push(current);
    }
    current = word;
  }

  if (current) {
    chunks.push(current);
  }

  return chunks;
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
      const normalizedSentence = sentence.trim();
      if (!normalizedSentence) {
        continue;
      }

      const sentenceCandidate = sentenceChunk
        ? `${sentenceChunk} ${normalizedSentence}`
        : normalizedSentence;

      if (sentenceCandidate.length <= limit) {
        sentenceChunk = sentenceCandidate;
        continue;
      }

      if (sentenceChunk) {
        chunks.push(sentenceChunk);
        sentenceChunk = '';
      }

      const fallbackChunks = splitLongSegment(normalizedSentence, limit);
      if (fallbackChunks.length === 1) {
        sentenceChunk = fallbackChunks[0];
        continue;
      }

      const precedingChunks = fallbackChunks.slice(0, -1);
      const lastChunk = fallbackChunks.at(-1) ?? '';
      chunks.push(...precedingChunks);
      sentenceChunk = lastChunk;
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
