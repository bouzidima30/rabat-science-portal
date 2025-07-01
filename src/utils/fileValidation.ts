
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

  // Enhanced dangerous file extension checks
  const dangerousExtensions = [
    '.exe', '.bat', '.cmd', '.scr', '.pif', '.com', '.js', '.vbs', '.jar', '.app',
    '.msi', '.deb', '.rpm', '.dmg', '.iso', '.sh', '.ps1', '.php', '.asp', '.jsp'
  ];
  const fileName = file.name.toLowerCase();
  
  if (dangerousExtensions.some(ext => fileName.endsWith(ext))) {
    throw new Error('Type de fichier non autorisé pour des raisons de sécurité');
  }

  // Check for suspicious file name patterns
  const suspiciousPatterns = [
    /\.exe\./i, /\.bat\./i, /\.scr\./i, /autorun/i, /setup/i, /install/i,
    /\.(php|asp|jsp|cgi)\./i, /script/i, /payload/i, /malware/i
  ];
  
  if (suspiciousPatterns.some(pattern => pattern.test(fileName))) {
    throw new Error('Nom de fichier suspect détecté');
  }

  // Check file size anomalies (files that are too small for their type)
  if (type === 'image' && file.size < 100) {
    throw new Error('Fichier image trop petit - potentiellement suspect');
  }

  return true;
};

// Advanced file content validation
export const validateFileContent = async (file: File): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      const bytes = new Uint8Array(arrayBuffer.slice(0, 16)); // Read first 16 bytes
      
      // Check file signatures (magic numbers)
      const signatures = {
        jpeg: [0xFF, 0xD8, 0xFF],
        png: [0x89, 0x50, 0x4E, 0x47],
        gif: [0x47, 0x49, 0x46],
        pdf: [0x25, 0x50, 0x44, 0x46],
        webp: [0x52, 0x49, 0x46, 0x46],
      };
      
      const isValidSignature = Object.values(signatures).some(signature => 
        signature.every((byte, index) => bytes[index] === byte)
      );
      
      // For image files, verify the signature matches the declared MIME type
      if (file.type.startsWith('image/') && !isValidSignature) {
        reject(new Error('Signature de fichier invalide - fichier potentiellement corrompu ou malveillant'));
        return;
      }
      
      resolve(true);
    };
    
    reader.onerror = () => {
      reject(new Error('Impossible de lire le fichier'));
    };
    
    reader.readAsArrayBuffer(file.slice(0, 16));
  });
};

export const sanitizeFileName = (fileName: string): string => {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscore
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
    .toLowerCase();
};
