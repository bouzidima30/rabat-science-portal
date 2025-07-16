import { validateFile, validateFileContent } from './fileValidation';

// Advanced file validation with quarantine system
export const performAdvancedFileValidation = async (file: File) => {
  // Basic validation first
  validateFile(file);
  
  // Content validation
  await validateFileContent(file);
  
  // Advanced checks
  await checkForMaliciousPatterns(file);
  
  return true;
};

// Check for malicious patterns in file content
const checkForMaliciousPatterns = async (file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      // Check for suspicious patterns
      const maliciousPatterns = [
        /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
        /javascript:/gi,
        /vbscript:/gi,
        /onload\s*=/gi,
        /onerror\s*=/gi,
        /eval\s*\(/gi,
        /document\.write/gi,
        /window\.location/gi,
        /%3cscript/gi,
        /%3e%3cscript/gi,
        /base64,.*(?:PHNjcmlwdA|c2NyaXB0|dmFyIA)/gi, // Encoded script tags
      ];
      
      const suspiciousPatterns = maliciousPatterns.filter(pattern => 
        pattern.test(content)
      );
      
      if (suspiciousPatterns.length > 0) {
        reject(new Error('Contenu de fichier suspect détecté - fichier mis en quarantaine'));
        return;
      }
      
      // Check file size vs content ratio (detect padding attacks)
      const contentRatio = content.length / file.size;
      if (contentRatio < 0.1 && file.size > 1024) { // Less than 10% readable content
        reject(new Error('Structure de fichier suspecte détectée'));
        return;
      }
      
      resolve();
    };
    
    reader.onerror = () => {
      reject(new Error('Impossible d\'analyser le contenu du fichier'));
    };
    
    // Read file as text for pattern matching
    if (file.type.startsWith('text/') || file.name.endsWith('.txt')) {
      reader.readAsText(file);
    } else {
      // For binary files, read as data URL and check for encoded content
      reader.readAsDataURL(file);
    }
  });
};

// File quarantine system
export const quarantineFile = async (file: File, reason: string) => {
  try {
    // In a real implementation, this would upload to a quarantine bucket
    console.warn(`File quarantined: ${file.name} - Reason: ${reason}`);
    
    // Log the quarantine event
    const event = {
      action: 'file_quarantined',
      severity: 'high' as const,
      category: 'file_security',
      details: `File ${file.name} was quarantined: ${reason}`,
      metadata: {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        quarantineReason: reason
      }
    };
    
    // This would typically call a security monitoring system
    console.log('Security event logged:', event);
    
    return {
      quarantined: true,
      reason,
      fileId: `quarantine_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  } catch (error) {
    console.error('Failed to quarantine file:', error);
    throw new Error('Échec de la mise en quarantaine du fichier');
  }
};

// Enhanced file upload with security checks
export const secureFileUpload = async (
  file: File, 
  uploadFunction: (file: File) => Promise<any>
) => {
  try {
    // Perform all security validations
    await performAdvancedFileValidation(file);
    
    // If validation passes, proceed with upload
    return await uploadFunction(file);
  } catch (error: any) {
    // If validation fails, quarantine the file
    await quarantineFile(file, error.message);
    throw error;
  }
};

// Calculate file checksum for integrity verification
export const calculateFileChecksum = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};