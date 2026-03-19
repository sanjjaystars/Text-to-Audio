import fs from 'node:fs/promises';
import path from 'node:path';

import { v4 as uuidv4 } from 'uuid';

const storageDir = path.join(process.cwd(), '.tmp', 'audio');
const retentionMinutes = Number(process.env.AUDIO_RETENTION_MINUTES ?? 60);
const retentionMs = retentionMinutes * 60 * 1000;

type AudioRecord = {
  filePath: string;
  createdAt: number;
  mimeType: string;
  fileName: string;
};

const audioIndex = new Map<string, AudioRecord>();

async function ensureDir() {
  await fs.mkdir(storageDir, { recursive: true });
}

export async function saveAudio(buffer: Buffer, prefix = 'book2audio') {
  await ensureDir();
  await cleanupExpiredAudio();

  const id = uuidv4();
  const fileName = `${prefix}-${id}.mp3`;
  const filePath = path.join(storageDir, fileName);
  await fs.writeFile(filePath, buffer);

  audioIndex.set(id, {
    filePath,
    createdAt: Date.now(),
    mimeType: 'audio/mpeg',
    fileName,
  });

  return {
    id,
    fileName,
    expiresAt: new Date(Date.now() + retentionMs).toISOString(),
  };
}

export async function readAudio(id: string) {
  await cleanupExpiredAudio();
  const record = audioIndex.get(id);
  if (!record) return null;

  try {
    const buffer = await fs.readFile(record.filePath);
    return {
      buffer,
      ...record,
    };
  } catch {
    audioIndex.delete(id);
    return null;
  }
}

export async function cleanupExpiredAudio() {
  const now = Date.now();

  await Promise.all(
    Array.from(audioIndex.entries()).map(async ([id, record]) => {
      if (now - record.createdAt < retentionMs) return;
      audioIndex.delete(id);
      await fs.rm(record.filePath, { force: true });
    }),
  );
}
