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
  
  // Handle Supabase storage images
  if (url.includes('supabase.co/storage')) {
    // Supabase storage doesn't support query parameter transforms by default
    // We'll rely on proper sizing in the component and browser optimization
    return url;
  }
  
  return url;
};

// Get responsive image sizes based on context
export const getResponsiveImageSizes = (context: 'card' | 'hero' | 'thumbnail' | 'full') => {
  switch (context) {
    case 'card':
      return { width: 400, height: 300 };
    case 'hero':
      return { width: 1200, height: 600 };
    case 'thumbnail':
      return { width: 150, height: 150 };
    case 'full':
      return { width: 800, height: 600 };
    default:
      return { width: 400, height: 300 };
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