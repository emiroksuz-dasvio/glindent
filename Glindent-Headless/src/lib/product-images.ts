/**
 * Product Image Fallback Map
 * Maps product SKU prefixes to Cloudinary image URLs
 * Used when ikas doesn't return images properly
 */

export interface ProductImageSet {
  main: string;
  gallery: string[];
}

// Cloudinary base URL
const CLOUDINARY_BASE = 'https://res.cloudinary.com/dwz5qehsf/image/upload';

// Product images by category/product type (SKU prefix match)
export const PRODUCT_IMAGES: Record<string, ProductImageSet> = {
  // G-Ceram Zirconia Discs (SKU: ZRC-*)
  'ZRC': {
    main: `${CLOUDINARY_BASE}/v1766346741/glindent/G-Ceram_Zirconia_Discs/G-Ceram_Zirconia_Discs_1.jpg`,
    gallery: [
      `${CLOUDINARY_BASE}/v1766346741/glindent/G-Ceram_Zirconia_Discs/G-Ceram_Zirconia_Discs_1.jpg`,
      `${CLOUDINARY_BASE}/v1766346742/glindent/G-Ceram_Zirconia_Discs/G-Ceram_Zirconia_Discs_2.jpg`,
      `${CLOUDINARY_BASE}/v1766346743/glindent/G-Ceram_Zirconia_Discs/G-Ceram_Zirconia_Discs_3.png`,
      `${CLOUDINARY_BASE}/v1766346743/glindent/G-Ceram_Zirconia_Discs/G-Ceram_Zirconia_Discs_4.jpg`,
      `${CLOUDINARY_BASE}/v1766346744/glindent/G-Ceram_Zirconia_Discs/G-Ceram_Zirconia_Discs_5.jpg`,
    ]
  },
  
  // G-Ceram Glass Ceramic Blocks (SKU: GB*)
  'GB': {
    main: `${CLOUDINARY_BASE}/v1766346728/glindent/G-Ceram_Glass_Ceramic_Blocks/G-Ceram_Glass_Ceramic_Blocks_1.png`,
    gallery: [
      `${CLOUDINARY_BASE}/v1766346728/glindent/G-Ceram_Glass_Ceramic_Blocks/G-Ceram_Glass_Ceramic_Blocks_1.png`,
      `${CLOUDINARY_BASE}/v1766346729/glindent/G-Ceram_Glass_Ceramic_Blocks/G-Ceram_Glass_Ceramic_Blocks_2.jpg`,
      `${CLOUDINARY_BASE}/v1766346729/glindent/G-Ceram_Glass_Ceramic_Blocks/G-Ceram_Glass_Ceramic_Blocks_3.png`,
      `${CLOUDINARY_BASE}/v1766346730/glindent/G-Ceram_Glass_Ceramic_Blocks/G-Ceram_Glass_Ceramic_Blocks_4.jpg`,
      `${CLOUDINARY_BASE}/v1766346731/glindent/G-Ceram_Glass_Ceramic_Blocks/G-Ceram_Glass_Ceramic_Blocks_5.jpg`,
    ]
  },
  
  // G-Ceram MF Porcelain (SKU starts with MF or product name contains MF Porcelain)
  'MF': {
    main: `${CLOUDINARY_BASE}/v1766346732/glindent/G-Ceram_MF_Porcelain_Powder/G-Ceram_MF_Porcelain_Powder_1.png`,
    gallery: [
      `${CLOUDINARY_BASE}/v1766346732/glindent/G-Ceram_MF_Porcelain_Powder/G-Ceram_MF_Porcelain_Powder_1.png`,
      `${CLOUDINARY_BASE}/v1766346733/glindent/G-Ceram_MF_Porcelain_Powder/G-Ceram_MF_Porcelain_Powder_2.png`,
      `${CLOUDINARY_BASE}/v1766346733/glindent/G-Ceram_MF_Porcelain_Powder/G-Ceram_MF_Porcelain_Powder_3.png`,
      `${CLOUDINARY_BASE}/v1766346734/glindent/G-Ceram_MF_Porcelain_Powder/G-Ceram_MF_Porcelain_Powder_4.jpg`,
      `${CLOUDINARY_BASE}/v1766346735/glindent/G-Ceram_MF_Porcelain_Powder/G-Ceram_MF_Porcelain_Powder_5.jpg`,
    ]
  },
  
  // G-Ceram ZF Porcelain
  'ZF': {
    main: `${CLOUDINARY_BASE}/v1766346738/glindent/G-Ceram_ZF_Porcelain_Powder/G-Ceram_ZF_Porcelain_Powder_1.png`,
    gallery: [
      `${CLOUDINARY_BASE}/v1766346738/glindent/G-Ceram_ZF_Porcelain_Powder/G-Ceram_ZF_Porcelain_Powder_1.png`,
      `${CLOUDINARY_BASE}/v1766346739/glindent/G-Ceram_ZF_Porcelain_Powder/G-Ceram_ZF_Porcelain_Powder_2.png`,
      `${CLOUDINARY_BASE}/v1766346739/glindent/G-Ceram_ZF_Porcelain_Powder/G-Ceram_ZF_Porcelain_Powder_3.png`,
      `${CLOUDINARY_BASE}/v1766346740/glindent/G-Ceram_ZF_Porcelain_Powder/G-Ceram_ZF_Porcelain_Powder_4.jpg`,
      `${CLOUDINARY_BASE}/v1766346741/glindent/G-Ceram_ZF_Porcelain_Powder/G-Ceram_ZF_Porcelain_Powder_5.jpg`,
    ]
  },
  
  // G-Dent Nano Hybrid Composite (SKU: GDNHC*)
  'GDNHC': {
    main: `${CLOUDINARY_BASE}/v1766346751/glindent/G-Dent_Nano_Hybrid_Composite/G-Dent_Nano_Hybrid_Composite_1.jpg`,
    gallery: [
      `${CLOUDINARY_BASE}/v1766346751/glindent/G-Dent_Nano_Hybrid_Composite/G-Dent_Nano_Hybrid_Composite_1.jpg`,
    ]
  },
  
  // G-Dent Nano Hybrid ZR Composite (SKU: GDNZR*)
  'GDNZR': {
    main: `${CLOUDINARY_BASE}/v1766346752/glindent/G-Dent_Nano_Hybrid_ZR_Composite/G-Dent_Nano_Hybrid_ZR_Composite_1.png`,
    gallery: [
      `${CLOUDINARY_BASE}/v1766346752/glindent/G-Dent_Nano_Hybrid_ZR_Composite/G-Dent_Nano_Hybrid_ZR_Composite_1.png`,
    ]
  },

  // Porcelain Teeth
  'PORCELAIN': {
    main: `${CLOUDINARY_BASE}/v1766346763/glindent/Porcelain_Teeth/Porcelain_Teeth_1.png`,
    gallery: [
      `${CLOUDINARY_BASE}/v1766346763/glindent/Porcelain_Teeth/Porcelain_Teeth_1.png`,
    ]
  },

  // G-Plates LC
  'GPLATES': {
    main: `${CLOUDINARY_BASE}/v1766346757/glindent/G-Plates_LC/G-Plates_LC_1.jpg`,
    gallery: [
      `${CLOUDINARY_BASE}/v1766346757/glindent/G-Plates_LC/G-Plates_LC_1.jpg`,
    ]
  },

  // G-Wax
  'GWAX': {
    main: `${CLOUDINARY_BASE}/v1766346758/glindent/G-Wax/G-Wax_1.jpg`,
    gallery: [
      `${CLOUDINARY_BASE}/v1766346758/glindent/G-Wax/G-Wax_1.jpg`,
      `${CLOUDINARY_BASE}/v1766346759/glindent/G-Wax/G-Wax_2.jpg`,
    ]
  },

  // G-Clean
  'GCLEAN': {
    main: `${CLOUDINARY_BASE}/v1766346745/glindent/G-Clean/G-Clean_1.jpg`,
    gallery: [
      `${CLOUDINARY_BASE}/v1766346745/glindent/G-Clean/G-Clean_1.jpg`,
      `${CLOUDINARY_BASE}/v1766346746/glindent/G-Clean/G-Clean_2.jpg`,
    ]
  },

  // G-Dent Liner
  'GDENT-LINER': {
    main: `${CLOUDINARY_BASE}/v1766346750/glindent/G-Dent_Liner/G-Dent_Liner_1.jpg`,
    gallery: [
      `${CLOUDINARY_BASE}/v1766346750/glindent/G-Dent_Liner/G-Dent_Liner_1.jpg`,
    ]
  },

  // G-Dent Temp Fill
  'GDENT-TEMP': {
    main: `${CLOUDINARY_BASE}/v1766346757/glindent/G-Dent_Temp_Fill/G-Dent_Temp_Fill_1.png`,
    gallery: [
      `${CLOUDINARY_BASE}/v1766346757/glindent/G-Dent_Temp_Fill/G-Dent_Temp_Fill_1.png`,
    ]
  },

  // G-ZNO
  'GZNO': {
    main: `${CLOUDINARY_BASE}/v1766346759/glindent/G-ZNO/G-ZNO_1.png`,
    gallery: [
      `${CLOUDINARY_BASE}/v1766346759/glindent/G-ZNO/G-ZNO_1.png`,
    ]
  },

  // G-Dent Dual Cem
  'GDENT-DUAL': {
    main: `${CLOUDINARY_BASE}/v1766346747/glindent/G-Dent_Dual_Cem/G-Dent_Dual_Cem_1.jpg`,
    gallery: [
      `${CLOUDINARY_BASE}/v1766346747/glindent/G-Dent_Dual_Cem/G-Dent_Dual_Cem_1.jpg`,
    ]
  },

  // G-Dent Retraction Cord
  'GDENT-RETRACTION': {
    main: `${CLOUDINARY_BASE}/v1766346756/glindent/G-Dent_Retraction_Cord/G-Dent_Retraction_Cord_1.png`,
    gallery: [
      `${CLOUDINARY_BASE}/v1766346756/glindent/G-Dent_Retraction_Cord/G-Dent_Retraction_Cord_1.png`,
      `${CLOUDINARY_BASE}/v1766346756/glindent/G-Dent_Retraction_Cord/G-Dent_Retraction_Cord_2.jpg`,
    ]
  },

  // G-Dent Gingiva Barrier
  'GDENT-GINGIVA': {
    main: `${CLOUDINARY_BASE}/v1766346748/glindent/G-Dent_Gingiva_Barrier/G-Dent_Gingiva_Barrier_1.jpg`,
    gallery: [
      `${CLOUDINARY_BASE}/v1766346748/glindent/G-Dent_Gingiva_Barrier/G-Dent_Gingiva_Barrier_1.jpg`,
      `${CLOUDINARY_BASE}/v1766346748/glindent/G-Dent_Gingiva_Barrier/G-Dent_Gingiva_Barrier_2.jpg`,
      `${CLOUDINARY_BASE}/v1766346749/glindent/G-Dent_Gingiva_Barrier/G-Dent_Gingiva_Barrier_3.jpg`,
    ]
  },

  // G-Dent Prophylaxis Powder
  'GDENT-PROPHYLAXIS': {
    main: `${CLOUDINARY_BASE}/v1766346754/glindent/G-Dent_Prophylaxis_Powder/G-Dent_Prophylaxis_Powder_1.jpg`,
    gallery: [
      `${CLOUDINARY_BASE}/v1766346754/glindent/G-Dent_Prophylaxis_Powder/G-Dent_Prophylaxis_Powder_1.jpg`,
      `${CLOUDINARY_BASE}/v1766346754/glindent/G-Dent_Prophylaxis_Powder/G-Dent_Prophylaxis_Powder_2.jpg`,
    ]
  },

  // G-Dent Prophy Paste
  'GDENT-PROPHY': {
    main: `${CLOUDINARY_BASE}/v1766346753/glindent/G-Dent_Prophy_Paste/G-Dent_Prophy_Paste_1.jpg`,
    gallery: [
      `${CLOUDINARY_BASE}/v1766346753/glindent/G-Dent_Prophy_Paste/G-Dent_Prophy_Paste_1.jpg`,
    ]
  },

  // GSMedex
  'GSMEDEX': {
    main: `${CLOUDINARY_BASE}/v1766346761/glindent/GSMedex/GSMedex_1.png`,
    gallery: [
      `${CLOUDINARY_BASE}/v1766346761/glindent/GSMedex/GSMedex_1.png`,
    ]
  },
};

// Product name to image mapping (for products without SKU match)
export const PRODUCT_NAME_IMAGES: Record<string, ProductImageSet> = {
  'G-Clean': PRODUCT_IMAGES['GCLEAN'],
  'G-Dent Dual Cem': PRODUCT_IMAGES['GDENT-DUAL'],
  'G-Dent Gingiva Barrier': PRODUCT_IMAGES['GDENT-GINGIVA'],
  'G-Dent Liner': PRODUCT_IMAGES['GDENT-LINER'],
  'G-Dent Nano Hybrid Composite': PRODUCT_IMAGES['GDNHC'],
  'G-Dent Nano Hybrid ZR Composite': PRODUCT_IMAGES['GDNZR'],
  'G-Dent Prophy Paste': PRODUCT_IMAGES['GDENT-PROPHY'],
  'G-Dent Prophylaxis Powder': PRODUCT_IMAGES['GDENT-PROPHYLAXIS'],
  'G-Dent Retraction Cord': PRODUCT_IMAGES['GDENT-RETRACTION'],
  'G-Dent Temp Fill': PRODUCT_IMAGES['GDENT-TEMP'],
  'G-Plates LC': PRODUCT_IMAGES['GPLATES'],
  'G-Wax': PRODUCT_IMAGES['GWAX'],
  'G-ZNO': PRODUCT_IMAGES['GZNO'],
  'GSMedex': PRODUCT_IMAGES['GSMEDEX'],
  'Porcelain Teeth': PRODUCT_IMAGES['PORCELAIN'],
  'G-Ceram Zirconia Disc': PRODUCT_IMAGES['ZRC'],
  'G-Ceram Glass Ceramic Block': PRODUCT_IMAGES['GB'],
  'G-Ceram MF Porcelain Powder': PRODUCT_IMAGES['MF'],
  'G-Ceram ZF Porcelain Powder': PRODUCT_IMAGES['ZF'],
};

/**
 * Get fallback images for a product based on SKU or name
 */
export function getFallbackImages(sku?: string | null, productName?: string | null): ProductImageSet | null {
  // Try SKU prefix match first (most specific)
  if (sku) {
    const skuUpper = sku.toUpperCase();
    
    // Check longer prefixes first (more specific)
    const prefixes = Object.keys(PRODUCT_IMAGES).sort((a, b) => b.length - a.length);
    for (const prefix of prefixes) {
      if (skuUpper.startsWith(prefix)) {
        return PRODUCT_IMAGES[prefix];
      }
    }
  }
  
  // Try exact product name match
  if (productName) {
    for (const [name, images] of Object.entries(PRODUCT_NAME_IMAGES)) {
      if (productName === name || productName.startsWith(name)) {
        return images;
      }
    }
    
    // Try partial name match (for variant products)
    const nameLower = productName.toLowerCase();
    
    if (nameLower.includes('zirconia disc')) {
      return PRODUCT_IMAGES['ZRC'];
    }
    if (nameLower.includes('glass ceramic')) {
      return PRODUCT_IMAGES['GB'];
    }
    if (nameLower.includes('mf porcelain')) {
      return PRODUCT_IMAGES['MF'];
    }
    if (nameLower.includes('zf porcelain')) {
      return PRODUCT_IMAGES['ZF'];
    }
    if (nameLower.includes('nano hybrid zr') || nameLower.includes('nano zr')) {
      return PRODUCT_IMAGES['GDNZR'];
    }
    if (nameLower.includes('nano hybrid')) {
      return PRODUCT_IMAGES['GDNHC'];
    }
    if (nameLower.includes('g-clean') || nameLower === 'gclean') {
      return PRODUCT_IMAGES['GCLEAN'];
    }
    if (nameLower.includes('dual cem')) {
      return PRODUCT_IMAGES['GDENT-DUAL'];
    }
    if (nameLower.includes('gingiva')) {
      return PRODUCT_IMAGES['GDENT-GINGIVA'];
    }
    if (nameLower.includes('liner')) {
      return PRODUCT_IMAGES['GDENT-LINER'];
    }
    if (nameLower.includes('prophy paste')) {
      return PRODUCT_IMAGES['GDENT-PROPHY'];
    }
    if (nameLower.includes('prophylaxis')) {
      return PRODUCT_IMAGES['GDENT-PROPHYLAXIS'];
    }
    if (nameLower.includes('retraction')) {
      return PRODUCT_IMAGES['GDENT-RETRACTION'];
    }
    if (nameLower.includes('temp fill')) {
      return PRODUCT_IMAGES['GDENT-TEMP'];
    }
    if (nameLower.includes('plates lc') || nameLower.includes('g-plates')) {
      return PRODUCT_IMAGES['GPLATES'];
    }
    if (nameLower.includes('g-wax') || nameLower === 'wax') {
      return PRODUCT_IMAGES['GWAX'];
    }
    if (nameLower.includes('g-zno') || nameLower.includes('zinc oxide')) {
      return PRODUCT_IMAGES['GZNO'];
    }
    if (nameLower.includes('gsmedex') || nameLower.includes('speedx')) {
      return PRODUCT_IMAGES['GSMEDEX'];
    }
    if (nameLower.includes('porcelain teeth')) {
      return PRODUCT_IMAGES['PORCELAIN'];
    }
    // Additional matches for common product patterns
    if (nameLower.includes('zirconia') || nameLower.includes('zirkon')) {
      return PRODUCT_IMAGES['ZRC'];
    }
    if (nameLower.includes('composite')) {
      return PRODUCT_IMAGES['GDNHC'];
    }
    if (nameLower.includes('porcelain') || nameLower.includes('porselen')) {
      return PRODUCT_IMAGES['MF'];
    }
    if (nameLower.includes('ceramic') || nameLower.includes('seramik')) {
      return PRODUCT_IMAGES['GB'];
    }
  }
  
  // Debug log for unmatched products
  if (productName || sku) {
    console.log('No image fallback found for:', { sku, productName });
  }
  
  return null;
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
 * Get main image URL with fallback
 */
export function getProductMainImage(
  ikasImageUrl?: string | null,
  sku?: string | null,
  productName?: string | null
): string {
  // If ikas has a valid image, use it
  if (isValidImageUrl(ikasImageUrl)) {
    return ikasImageUrl!;
  }
  
  // Try fallback
  const fallback = getFallbackImages(sku, productName);
  if (fallback) {
    return fallback.main;
  }
  
  // Default placeholder
  return '/placeholder.svg';
}

/**
 * Get gallery images with fallback
 */
export function getProductGalleryImages(
  ikasImages: string[],
  sku?: string | null,
  productName?: string | null
): string[] {
  // Filter out invalid ikas images
  const validIkasImages = ikasImages.filter(isValidImageUrl);
  
  // If we have valid ikas images, use them
  if (validIkasImages.length > 0) {
    return validIkasImages;
  }
  
  // Try fallback
  const fallback = getFallbackImages(sku, productName);
  if (fallback) {
    return fallback.gallery;
  }
  
  // Return main image as single item gallery
  const mainImage = getProductMainImage(null, sku, productName);
  if (mainImage !== '/placeholder.svg') {
    return [mainImage];
  }
  
  // Return empty array
  return [];
}
