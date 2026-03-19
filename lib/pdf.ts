import pdfParse from 'pdf-parse';

export async function extractPdfText(buffer: Buffer) {
  const { text } = await pdfParse(buffer);
  const normalized = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n');

  if (!normalized) {
    throw new Error('No readable text was found in the PDF.');
  }

  return normalized;
}
