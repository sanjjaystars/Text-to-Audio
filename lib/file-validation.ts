import path from 'node:path';

import { ACCEPTED_EXTENSIONS, ACCEPTED_FILE_TYPES, DEFAULT_MAX_UPLOAD_SIZE_MB } from '@/lib/constants';

export function validateUpload(file: File) {
  const extension = path.extname(file.name).toLowerCase();
  const maxBytes = DEFAULT_MAX_UPLOAD_SIZE_MB * 1024 * 1024;

  const validType = file.type ? ACCEPTED_FILE_TYPES.includes(file.type) : true;

  if (!ACCEPTED_EXTENSIONS.includes(extension) || !validType) {
    throw new Error('Please upload a valid PDF or TXT file.');
  }

  if (file.size > maxBytes) {
    throw new Error(`File is too large. Maximum supported size is ${DEFAULT_MAX_UPLOAD_SIZE_MB} MB.`);
  }

  return {
    extension,
    maxBytes,
  };
}
