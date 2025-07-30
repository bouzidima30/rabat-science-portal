// Security headers utility for enhanced protection
export const SECURITY_HEADERS = {
  'Content-Security-Policy': 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: blob: https:; " +
    "connect-src 'self' https://swxpidinkniuvtusjtrh.supabase.co wss://swxpidinkniuvtusjtrh.supabase.co; " +
    "frame-ancestors 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self'; " +
    "upgrade-insecure-requests; " +
    "block-all-mixed-content;",
  
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), autoplay=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Expect-CT': 'max-age=86400, enforce',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin'
};

// Apply security headers to responses
export const applySecurityHeaders = (response: Response): Response => {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
};

// Validate request for security threats
export const validateRequest = (request: Request): boolean => {
  const url = new URL(request.url);
  const suspiciousPatterns = [
    /[<>\"']/,  // XSS attempts
    /\.\./,     // Path traversal
    /union.*select/i,  // SQL injection
    /javascript:/i,    // JS injection
    /data:.*base64/i,  // Data URI attacks
  ];
  
  // Check URL for suspicious patterns
  if (suspiciousPatterns.some(pattern => pattern.test(url.pathname + url.search))) {
    return false;
  }
  
  // Check headers for suspicious content
  const userAgent = request.headers.get('user-agent') || '';
  if (userAgent.includes('<') || userAgent.includes('script')) {
    return false;
  }
  
  return true;
};