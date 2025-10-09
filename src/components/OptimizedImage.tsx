
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { optimizeImageUrl, getResponsiveImageSizes } from '@/utils/imageOptimization';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
  context?: 'card' | 'hero' | 'thumbnail' | 'full' | 'logo';
  quality?: number;
}

const OptimizedImage = ({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3C/svg%3E",
  onLoad,
  onError,
  context = 'card',
  quality = 85 // Increased default quality for better encoding
}: OptimizedImageProps) => {
  // Get optimal dimensions if not provided
  const responsiveSizes = getResponsiveImageSizes(context);
  const optimalWidth = width || responsiveSizes.width;
  const optimalHeight = height || responsiveSizes.height;
  
  // Generate srcSet for responsive images
  const generateSrcSet = (baseSrc: string, baseWidth: number, baseHeight: number) => {
    if (baseSrc.includes('supabase.co/storage')) {
      // For Supabase images, create srcset with width descriptors
      const scales = [1, 1.5, 2];
      try {
        const srcSetItems = scales
          .map(scale => {
            const scaledWidth = Math.round(baseWidth * scale);
            const scaledHeight = Math.round(baseHeight * scale);
            // Use optimizeImageUrl to ensure WebP format and proper sizing for each scale
            const optimizedUrl = optimizeImageUrl(baseSrc, scaledWidth, scaledHeight, quality);
            return optimizedUrl ? `${optimizedUrl} ${scaledWidth}w` : null;
          })
          .filter(Boolean);
        
        // Always return a valid srcSet - use optimized src at minimum
        if (srcSetItems.length === 0) {
          const fallbackUrl = optimizeImageUrl(baseSrc, baseWidth, baseHeight, quality);
          return fallbackUrl ? `${fallbackUrl} ${baseWidth}w` : '';
        }
        
        return srcSetItems.join(', ');
      } catch (e) {
        // On error, return single optimized URL as srcSet
        const fallbackUrl = optimizeImageUrl(baseSrc, baseWidth, baseHeight, quality);
        return fallbackUrl ? `${fallbackUrl} ${baseWidth}w` : '';
      }
    }
    
    if (baseSrc.includes('unsplash.com')) {
      const scales = [0.5, 1, 1.5, 2];
      return scales
        .map(scale => {
          const scaledWidth = Math.round(baseWidth * scale);
          const scaledHeight = Math.round(baseHeight * scale);
          const url = baseSrc.replace(/w=\d+/, `w=${scaledWidth}`).replace(/h=\d+/, `h=${scaledHeight}`);
          return `${url} ${scaledWidth}w`;
        })
        .join(', ');
    }
    
    return '';
  };

  // Optimize the image URL
  const optimizedSrc = optimizeImageUrl(src, optimalWidth, optimalHeight, quality);
  const srcSet = generateSrcSet(src, optimalWidth, optimalHeight);
  const sizes = context === 'hero' ? '100vw' : context === 'card' ? '(max-width: 768px) 100vw, 398px' : '(max-width: 768px) 100vw, 200px';
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Use requestAnimationFrame to batch state updates and prevent forced reflows
        if (entry.isIntersecting) {
          requestAnimationFrame(() => {
            setIsInView(true);
          });
          observer.disconnect();
        }
      },
      {
        // Increase root margin and set threshold to reduce intersection calculations
        rootMargin: '100px',
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div
      ref={priority ? undefined : imgRef}
      className={cn('relative overflow-hidden', className)}
      style={{ width, height }}
    >
      {!isInView ? (
        <img
          src={placeholder}
          alt=""
          className="w-full h-full object-cover blur-sm"
        />
      ) : (
        <>
          {!isLoaded && !hasError && !priority && (
            <img
              src={placeholder}
              alt=""
              className="absolute inset-0 w-full h-full object-cover blur-sm"
            />
          )}
          <img
            src={hasError ? placeholder : optimizedSrc}
            srcSet={hasError ? '' : srcSet}
            sizes={hasError ? '' : sizes}
            alt={alt}
            width={optimalWidth}
            height={optimalHeight}
            className={cn(
              'w-full h-full object-cover transition-opacity duration-300',
              priority || isLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
            style={{ aspectRatio: `${optimalWidth}/${optimalHeight}` }}
          />
        </>
      )}
    </div>
  );
};

export default OptimizedImage;
