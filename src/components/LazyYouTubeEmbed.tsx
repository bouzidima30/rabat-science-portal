import { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';

interface LazyYouTubeEmbedProps {
  url: string;
  title: string;
  className?: string;
}

const LazyYouTubeEmbed = ({ url, title, className = '' }: LazyYouTubeEmbedProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Extract video ID from URL
  const getVideoId = (videoUrl: string): string => {
    const match = videoUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/);
    return match ? match[1] : '';
  };

  // Use Intersection Observer to detect when video enters viewport
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsIntersecting(entry.isIntersecting);
        });
      },
      { 
        rootMargin: '50px', // Start loading slightly before entering viewport
        threshold: 0.1 
      }
    );

    observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const videoId = getVideoId(url);
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  const handleClick = () => {
    setIsLoaded(true);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {!isLoaded ? (
        isIntersecting ? (
          <button
            onClick={handleClick}
            className="w-full h-full relative group cursor-pointer"
            aria-label={`Play ${title}`}
          >
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <div className="bg-red-600 rounded-full p-4 group-hover:bg-red-700 transition-colors">
                <Play className="w-12 h-12 text-white fill-white" />
              </div>
            </div>
          </button>
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <div className="bg-red-600 rounded-full p-4">
              <Play className="w-12 h-12 text-white fill-white" />
            </div>
          </div>
        )
      ) : (
        <iframe
          className="w-full h-full"
          src={`${embedUrl}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
};

export default LazyYouTubeEmbed;
