export type VoiceOption = 'male' | 'female';

export interface ExtractResponse {
  text: string;
  fileName: string;
  sourceType: 'pdf' | 'txt' | 'manual';
}

export interface GenerateAudioResponse {
  audioId: string;
  audioUrl: string;
  downloadUrl: string;
  expiresAt: string;
  durationEstimate: string;
  byteLength: number;
}
