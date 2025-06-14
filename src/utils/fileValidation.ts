
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp'
];

export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export const validateFile = (file: File, type: 'image' | 'document' = 'document') => {
  const allowedTypes = type === 'image' ? ALLOWED_IMAGE_TYPES : [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES];
  const maxSize = type === 'image' ? MAX_IMAGE_SIZE : MAX_FILE_SIZE;

  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Type de fichier non autorisé. Types acceptés: ${allowedTypes.join(', ')}`);
  }

  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    throw new Error(`Le fichier est trop volumineux. Taille maximale: ${maxSizeMB}MB`);
  }

  // Check for potentially dangerous file extensions
  const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com', '.js', '.vbs'];
  const fileName = file.name.toLowerCase();
  
  if (dangerousExtensions.some(ext => fileName.endsWith(ext))) {
    throw new Error('Type de fichier non autorisé pour des raisons de sécurité');
  }

  return true;
};

export const sanitizeFileName = (fileName: string): string => {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscore
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
    .toLowerCase();
};
