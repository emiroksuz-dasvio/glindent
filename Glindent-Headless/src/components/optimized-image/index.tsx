/**
 * OptimizedImage Component
 * A performance-optimized image component with lazy loading,
 * blur placeholder, and Cloudinary optimization support
 */

import { useState, useEffect, useRef, CSSProperties } from 'react';
import { getOptimizedCloudinaryUrl, getResponsiveSrcSet, IMAGE_SIZES } from 'src/lib/performance';

export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
}

// Simple blur placeholder SVG
const DEFAULT_BLUR_DATA_URL = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+';

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  style = {},
  priority = false,
  sizes = IMAGE_SIZES.productCard,
  quality = 80,
  placeholder = 'blur',
  blurDataURL = DEFAULT_BLUR_DATA_URL,
  onLoad,
  onError,
  fallbackSrc = '/placeholder.svg',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) {
      setIsInView(true);
      return;
    }

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
        rootMargin: '200px',
        threshold: 0.01,
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [priority]);

  // Get optimized image URL
  const optimizedSrc = src?.includes('cloudinary.com')
    ? getOptimizedCloudinaryUrl(src, { width, height, quality })
    : src;

  // Get srcSet for responsive images
  const srcSet = src?.includes('cloudinary.com')
    ? getResponsiveSrcSet(src)
    : undefined;

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const displaySrc = hasError ? fallbackSrc : (isInView ? optimizedSrc : blurDataURL);

  const containerStyle: CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    ...style,
  };

  const imgStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'opacity 0.3s ease, filter 0.3s ease',
    opacity: isLoaded || hasError ? 1 : 0.5,
    filter: isLoaded || hasError ? 'none' : 'blur(10px)',
  };

  return (
    <div className={`optimized-image-container ${className}`} style={containerStyle}>
      {/* Blur placeholder */}
      {placeholder === 'blur' && !isLoaded && !hasError && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${blurDataURL})`,
            backgroundSize: 'cover',
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
          }}
        />
      )}
      
      {/* Main image */}
      <img
        ref={imgRef}
        src={displaySrc}
        srcSet={isInView ? srcSet : undefined}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        style={imgStyle}
      />
    </div>
  );
};

/**
 * ProductImage - Specialized version for product cards
 */
export interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  fallbackSrc?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  className = '',
  style = {},
  fallbackSrc = '/placeholder.svg',
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setImageSrc(src);
    setIsLoading(true);
  }, [src]);

  const handleError = () => {
    if (imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const containerStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
    ...style,
  };

  const imgStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'opacity 0.3s ease',
    opacity: isLoading ? 0 : 1,
  };

  const placeholderStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    transition: 'opacity 0.3s ease',
    opacity: isLoading ? 1 : 0,
    pointerEvents: 'none',
  };

  return (
    <div className={`product-image ${className}`} style={containerStyle}>
      {/* Loading placeholder */}
      <div style={placeholderStyle}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      </div>
      
      {/* Main image */}
      <img
        src={imageSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        style={imgStyle}
      />
    </div>
  );
};

export default OptimizedImage;
