import React, { useState, useEffect, useRef } from 'react';
import { ImageIcon } from 'lucide-react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  placeholderClassName?: string;
  fallbackIcon?: React.ReactNode;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  wrapperClassName = '',
  placeholderClassName = '',
  fallbackIcon,
  ...props
}) => {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If IntersectionObserver is unavailable, load immediately
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '200px 0px', // preload 200px before scrolling into viewport
        threshold: 0.01,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${wrapperClassName}`}
    >
      {/* Loading Skeleton Shimmer */}
      {!isLoaded && !hasError && (
        <div
          className={`absolute inset-0 bg-slate-200/80 animate-pulse flex items-center justify-center z-10 ${placeholderClassName}`}
          aria-hidden="true"
        >
          <ImageIcon className="w-5 h-5 text-slate-300" />
        </div>
      )}

      {/* Fallback state if image fails */}
      {hasError ? (
        <div className="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center text-slate-400 p-2 text-center z-10">
          {fallbackIcon || <ImageIcon className="w-5 h-5 text-slate-300 mb-1" />}
          <span className="text-[10px] text-slate-400 font-medium">Image unavailable</span>
        </div>
      ) : isInView ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`${className} transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...props}
        />
      ) : null}
    </div>
  );
};
