/**
 * Product Image Utilities
 * Works exclusively with IKAS images - no fallback to Cloudinary
 */

/**
 * Check if an image URL is valid (not a placeholder or data URI)
 */
function isValidImageUrl(url?: string | null): boolean {
  if (!url) return false;
  if (url.includes('data:image')) return false;
  if (url === '/placeholder.svg') return false;
  if (url.length < 10) return false;
  return true;
}

/**
 * Get main image URL from IKAS
 * Returns Glindent logo if no valid IKAS image found
 */
export function getProductMainImage(ikasImageUrl?: string | null): string {
  if (isValidImageUrl(ikasImageUrl)) {
    return ikasImageUrl!;
  }
  return '/glindent-logo.png';
}

/**
 * Get gallery images from IKAS
 * Returns only valid IKAS images, empty array if none found
 */
export function getProductGalleryImages(ikasImages: string[]): string[] {
  return ikasImages.filter(isValidImageUrl);
}
