import { useEffect, useRef, useState } from 'react';

interface LazyYouTubeEmbedProps {
  url: string;
  title: string;
  className?: string;
}

const LazyYouTubeEmbed = ({ url, title, className = '' }: LazyYouTubeEmbedProps) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading when within 50px of viewport
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const embedUrl = url.replace('watch?v=', 'embed/');

  return (
    <div ref={containerRef} className={className}>
      {shouldLoad ? (
        <iframe
          className="w-full h-full"
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
          <div className="text-gray-400">Chargement...</div>
        </div>
      )}
    </div>
  );
};

export default LazyYouTubeEmbed;
