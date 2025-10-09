// Image optimization utilities
export const optimizeImageUrl = (url: string, width?: number, height?: number, quality = 85) => {
  if (!url || url.startsWith('data:')) return url;
  
  // Check if it's an external image
  if (url.includes('unsplash.com')) {
    const baseUrl = url.split('?')[0];
    const params = new URLSearchParams();
    
    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    params.set('q', quality.toString());
    params.set('fm', 'webp');
    params.set('fit', 'crop');
    
    return `${baseUrl}?${params.toString()}`;
  }
  
  // Handle Supabase storage images with transformation API
  if (url.includes('supabase.co/storage')) {
    try {
      // Use the render/image endpoint for transformations
      const transformUrl = url.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');
      const params = new URLSearchParams();
      
      // Supabase transformation API requires at least one dimension to trigger format conversion
      // Apply dimensions if provided - this reduces file size significantly
      if (width) params.set('width', width.toString());
      if (height) params.set('height', height.toString());
      
      // If no dimensions provided, use a reasonable default to ensure transformation triggers
      // This is critical for WebP conversion to work
      if (!width && !height) {
        params.set('width', '1200'); // Default max width for responsive images
      }
      
      // Critical: Use WebP format for 30-40% better compression than JPEG
      // WebP provides superior compression while maintaining quality
      params.set('format', 'webp');
      
      // Use higher quality for better encoding (85 is optimal balance)
      // This ensures the image looks good while still being compressed
      params.set('quality', quality.toString());
      
      // Add resize mode to ensure proper cropping
      params.set('resize', 'cover');
      
      const optimizedUrl = params.toString() ? `${transformUrl}?${params.toString()}` : transformUrl;
      return optimizedUrl;
    } catch (e) {
      console.warn('Image optimization failed, using original URL:', e);
      return url;
    }
  }
  
  return url;
};

// Get responsive image sizes based on context
export const getResponsiveImageSizes = (context: 'card' | 'hero' | 'thumbnail' | 'full' | 'logo') => {
  switch (context) {
    case 'card':
      return { width: 398, height: 224 }; // Exact display size from audit
    case 'hero':
      return { width: 1152, height: 512 }; // Exact display size from audit  
    case 'thumbnail':
      return { width: 200, height: 150 };
    case 'logo':
      return { width: 135, height: 64 }; // Exact FSR logo size from audit
    case 'full':
      return { width: 800, height: 600 };
    default:
      return { width: 398, height: 224 };
  }
};

export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

export const preloadImages = async (urls: string[]): Promise<void> => {
  await Promise.all(urls.map(preloadImage));
};