// Image optimization utilities
export const optimizeImageUrl = (url: string, width?: number, height?: number, quality = 80) => {
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
    // For Supabase, we'll try to use the transformation API
    // However, not all Supabase instances support transformation
    // The transformation endpoint supports format conversion and resizing
    try {
      const transformUrl = url.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');
      const params = new URLSearchParams();
      
      // Apply dimensions if provided
      if (width) params.set('width', width.toString());
      if (height) params.set('height', height.toString());
      
      // Critical: Always use WebP format for better compression (565KB savings per audit)
      // This addresses the "Serve images in next-gen formats" SEO issue
      params.set('format', 'webp');
      params.set('quality', quality.toString());
      
      const optimizedUrl = `${transformUrl}?${params.toString()}`;
      // Return the optimized URL
      return optimizedUrl;
    } catch (e) {
      // If transformation fails, return original URL
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