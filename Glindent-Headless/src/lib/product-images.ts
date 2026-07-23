/**
 * Product Image Utilities
 * Works exclusively with IKAS images - no fallback to Cloudinary
 */

/**
 * Image widths the ikas CDN actually serves.
 * Mirrors the ladder in next.config.js `images.deviceSizes`; anything outside
 * this set 404s on cdn.myikas.com.
 */
const IKAS_CDN_SIZES = [180, 360, 540, 720, 900, 1080, 1296] as const;

/**
 * ikas encodes the width directly in the CDN path. Two shapes exist, matching
 * IkasImageFunctions.getSrc() in @ikas/storefront-model-functions:
 *   .../{imageId}/image_1080.webp        (no original filename)
 *   .../{imageId}/1080/dsc01143.webp     (original filename preserved)
 */
const SIZED_IMAGE_RE = /\/image_(\d+)\.webp$/;
const SIZED_NAMED_RE = /\/(\d+)\/([^/]+)\.webp$/;

/**
 * Snap a requested width up to the nearest width the CDN can serve.
 */
function snapToCdnSize(size: number): number {
  return IKAS_CDN_SIZES.find(s => s >= size) ?? IKAS_CDN_SIZES[IKAS_CDN_SIZES.length - 1];
}

/**
 * Rewrite an ikas CDN URL to a smaller rendition.
 *
 * `IkasImage.src` always resolves to the 1080px variant (it delegates to
 * getDefaultSrc), which is heavily oversized for grid cards and thumbnails.
 * Non-ikas URLs — local assets, the logo fallback — are returned untouched.
 */
export function resizeIkasImage(url: string, size: number): string {
  if (!url) return url;

  const target = snapToCdnSize(size);

  if (SIZED_IMAGE_RE.test(url)) {
    return url.replace(SIZED_IMAGE_RE, `/image_${target}.webp`);
  }

  if (SIZED_NAMED_RE.test(url)) {
    return url.replace(SIZED_NAMED_RE, `/${target}/$2.webp`);
  }

  return url;
}

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
 *
 * @param size Rendered width in CSS pixels. Omit to keep the URL as-is.
 */
export function getProductMainImage(ikasImageUrl?: string | null, size?: number): string {
  if (isValidImageUrl(ikasImageUrl)) {
    return size ? resizeIkasImage(ikasImageUrl!, size) : ikasImageUrl!;
  }
  return '/glindent-logo.png';
}

/**
 * Get gallery images from IKAS
 * Returns only valid IKAS images, empty array if none found
 *
 * @param size Rendered width in CSS pixels. Omit to keep the URLs as-is.
 */
export function getProductGalleryImages(ikasImages: string[], size?: number): string[] {
  const valid = ikasImages.filter(isValidImageUrl);
  return size ? valid.map(url => resizeIkasImage(url, size)) : valid;
}
