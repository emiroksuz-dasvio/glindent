/**
 * Performance Utilities
 * Helper functions for optimizing component performance
 */

// ========================
// IMAGE OPTIMIZATION
// ========================

/**
 * Generate optimized Cloudinary URL with transformations
 */
export function getOptimizedCloudinaryUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
    fit?: 'fill' | 'scale' | 'fit' | 'pad' | 'crop';
  } = {}
): string {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    fit = 'fill',
  } = options;

  // Build transformation string
  const transforms: string[] = [];
  
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  transforms.push(`q_${quality}`);
  transforms.push(`f_${format}`);
  transforms.push(`c_${fit}`);

  const transformString = transforms.join(',');

  // Insert transformations into URL
  // Cloudinary URL format: .../upload/[transformations]/[path]
  return url.replace('/upload/', `/upload/${transformString}/`);
}

/**
 * Get responsive image srcSet for different screen sizes
 */
export function getResponsiveSrcSet(
  url: string,
  sizes: number[] = [320, 640, 960, 1280, 1920]
): string {
  if (!url || !url.includes('cloudinary.com')) {
    return '';
  }

  return sizes
    .map(size => {
      const optimizedUrl = getOptimizedCloudinaryUrl(url, { width: size });
      return `${optimizedUrl} ${size}w`;
    })
    .join(', ');
}

/**
 * Image sizes attribute for responsive images
 */
export const IMAGE_SIZES = {
  productCard: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',
  productModal: '(max-width: 768px) 100vw, 50vw',
  hero: '100vw',
  thumbnail: '80px',
};

// ========================
// INTERSECTION OBSERVER
// ========================

/**
 * Create a reusable intersection observer for lazy loading
 */
export function createLazyLoadObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }

  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '100px',
    threshold: 0.1,
    ...options,
  };

  return new IntersectionObserver((entries) => {
    entries.forEach(callback);
  }, defaultOptions);
}

// ========================
// DEBOUNCE & THROTTLE
// ========================

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for scroll events
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ========================
// PRELOAD UTILITIES
// ========================

/**
 * Preload an image for faster display
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Preload multiple images
 */
export function preloadImages(srcs: string[]): Promise<void[]> {
  return Promise.all(srcs.map(preloadImage));
}

/**
 * Preload critical resources
 */
export function preloadCriticalResources(): void {
  if (typeof window === 'undefined') return;

  // Preload fonts
  const fontLinks = [
    'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap',
  ];

  fontLinks.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    document.head.appendChild(link);
  });
}

// ========================
// MEMORY MANAGEMENT
// ========================

/**
 * Clean up blob URLs to prevent memory leaks
 */
export function revokeBlobUrl(url: string): void {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

/**
 * Request idle callback with fallback
 */
export function requestIdleCallbackPolyfill(
  callback: () => void,
  options?: { timeout?: number }
): void {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    (window as any).requestIdleCallback(callback, options);
  } else {
    setTimeout(callback, options?.timeout || 1);
  }
}

// ========================
// BUNDLE SIZE HELPERS
// ========================

/**
 * Dynamic import wrapper for code splitting
 */
export async function lazyImport<T>(
  importFn: () => Promise<{ default: T }>
): Promise<T> {
  const module = await importFn();
  return module.default;
}

// ========================
// PERFORMANCE METRICS
// ========================

/**
 * Measure component render time (dev only)
 */
export function measureRenderTime(componentName: string): () => void {
  if (process.env.NODE_ENV !== 'development') {
    return () => {};
  }

  const start = performance.now();
  return () => {
    const end = performance.now();
    console.log(`[Performance] ${componentName} rendered in ${(end - start).toFixed(2)}ms`);
  };
}

/**
 * Report Web Vitals
 */
export function reportWebVitals(metric: any): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}: ${metric.value}`);
  }
  
  // Send to analytics in production
  // analytics.track('web_vitals', metric);
}
