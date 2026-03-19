import { Mp3Encoder } from 'lamejs';

const DEFAULT_SAMPLE_RATE = 24_000;
const CHANNELS = 1;
const BIT_RATE = 128;
const WAV_HEADER_SIZE = 44;
const MP3_FRAME_SIZE = 1152;

type ParsedWav = {
  pcm: Buffer;
  sampleRate: number;
};

function parseWavBuffer(buffer: Buffer): ParsedWav {
  const hasRiff = buffer.subarray(0, 4).toString('ascii') === 'RIFF';
  if (!hasRiff) {
    return { pcm: buffer, sampleRate: DEFAULT_SAMPLE_RATE };
  }

  if (buffer.byteLength < WAV_HEADER_SIZE) {
    throw new Error('Received an incomplete WAV audio chunk from the TTS provider.');
  }

  const sampleRate = buffer.readUInt32LE(24);
  const bitsPerSample = buffer.readUInt16LE(34);
  const channels = buffer.readUInt16LE(22);

  if (bitsPerSample !== 16) {
    throw new Error(`Unsupported WAV bit depth: ${bitsPerSample}. Expected 16-bit PCM.`);
  }

  if (channels !== CHANNELS) {
    throw new Error(`Unsupported WAV channel count: ${channels}. Expected mono audio.`);
  }

  return {
    pcm: buffer.subarray(WAV_HEADER_SIZE),
    sampleRate,
  };
}

function toInt16Array(buffer: Buffer) {
  return new Int16Array(buffer.buffer, buffer.byteOffset, Math.floor(buffer.byteLength / 2));
}

export function mergeAudioBuffersToMp3(buffers: Buffer[]) {
  if (buffers.length === 0) {
    throw new Error('No audio chunks were generated.');
  }

  const parsedBuffers = buffers.map(parseWavBuffer);
  const sampleRate = parsedBuffers[0]?.sampleRate ?? DEFAULT_SAMPLE_RATE;

  for (const parsedBuffer of parsedBuffers) {
    if (parsedBuffer.sampleRate !== sampleRate) {
      throw new Error('Audio chunks returned inconsistent sample rates and cannot be merged safely.');
    }
  }

  const pcmBuffer = Buffer.concat(parsedBuffers.map(({ pcm }) => pcm));
  const samples = toInt16Array(pcmBuffer);
  const encoder = new Mp3Encoder(CHANNELS, sampleRate, BIT_RATE);
  const mp3Chunks: Buffer[] = [];

  for (let i = 0; i < samples.length; i += MP3_FRAME_SIZE) {
    const chunk = samples.subarray(i, i + MP3_FRAME_SIZE);
    const mp3buf = encoder.encodeBuffer(chunk);
    if (mp3buf.length > 0) {
      mp3Chunks.push(Buffer.from(mp3buf));
    }
  }

  const end = encoder.flush();
  if (end.length > 0) {
    mp3Chunks.push(Buffer.from(end));
  }

  return Buffer.concat(mp3Chunks);
}
