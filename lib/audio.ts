import { Mp3Encoder } from 'lamejs';

const SAMPLE_RATE = 24_000;
const CHANNELS = 1;
const BIT_RATE = 128;
const WAV_HEADER_SIZE = 44;
const MP3_FRAME_SIZE = 1152;

function stripWavHeader(buffer: Buffer) {
  const hasRiff = buffer.subarray(0, 4).toString('ascii') === 'RIFF';
  return hasRiff ? buffer.subarray(WAV_HEADER_SIZE) : buffer;
}

function toInt16Array(buffer: Buffer) {
  return new Int16Array(buffer.buffer, buffer.byteOffset, Math.floor(buffer.byteLength / 2));
}

export function mergeAudioBuffersToMp3(buffers: Buffer[]) {
  const pcmBuffer = Buffer.concat(buffers.map(stripWavHeader));
  const samples = toInt16Array(pcmBuffer);
  const encoder = new Mp3Encoder(CHANNELS, SAMPLE_RATE, BIT_RATE);
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
