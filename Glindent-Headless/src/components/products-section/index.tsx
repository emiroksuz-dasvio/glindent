import { observer } from "mobx-react-lite";
import { IkasProduct, IkasProductList, useStore } from "@ikas/storefront";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { useProductsWithFilters, Category } from "src/hooks/use-all-products";
import { getProductMainImage, getProductGalleryImages } from "src/lib/product-images";

// ============================================
// TRANSLATION HELPERS
// ============================================

// Turkish to English translations for variant types and values
const variantTranslations: Record<string, string> = {
  // Variant Types
  'renk': 'Color',
  'boyut': 'Size',
  'beden': 'Size',
  'ebat': 'Size',
  'ölçü': 'Dimension',
  'hacim': 'Volume',
  'ağırlık': 'Weight',
  'miktar': 'Quantity',
  'paket': 'Package',
  'ton': 'Shade',
  'numara': 'Number',
  'çap': 'Diameter',
  'kalınlık': 'Thickness',
  'uzunluk': 'Length',
  'genişlik': 'Width',
  'yükseklik': 'Height',
  'kapasite': 'Capacity',
  'malzeme': 'Material',
  'tip': 'Type',
  'model': 'Model',
  'şekil': 'Shape',
  'desen': 'Pattern',
  // Common color names
  'beyaz': 'White',
  'siyah': 'Black',
  'kırmızı': 'Red',
  'mavi': 'Blue',
  'yeşil': 'Green',
  'sarı': 'Yellow',
  'turuncu': 'Orange',
  'mor': 'Purple',
  'pembe': 'Pink',
  'gri': 'Gray',
  'kahverengi': 'Brown',
  'bej': 'Beige',
  'lacivert': 'Navy',
  'turkuaz': 'Turquoise',
  'altın': 'Gold',
  'gümüş': 'Silver',
  'şeffaf': 'Transparent',
  'doğal': 'Natural',
};

// Translate Turkish text to English
const translateToEnglish = (text: string): string => {
  if (!text) return text;
  const lowerText = text.toLowerCase().trim();
  return variantTranslations[lowerText] || text;
};

// ============================================
// ICONS
// ============================================

const FilterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const GridIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const ListIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const CartPlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    <line x1="12" y1="9" x2="12" y2="15" />
    <line x1="9" y1="12" x2="15" y2="12" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const MinusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ChevronDownIcon = ({ isOpen }: { isOpen?: boolean }) => (
  <svg 
    width="14" 
    height="14" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ============================================
// LOADING SPINNER
// ============================================

const LoadingSpinner = () => (
  <div className="spinner-container">
    <div className="spinner" />
  </div>
);

// ============================================
// TOAST NOTIFICATION
// ============================================

interface ToastState {
  show: boolean;
  message: string;
  type: 'error' | 'success' | 'warning';
}

const Toast = ({ toast, onClose }: { toast: ToastState; onClose: () => void }) => {
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.show, onClose]);

  if (!toast.show) return null;

  const bgColor = toast.type === 'error' ? '#ef4444' : 
                  toast.type === 'warning' ? '#f59e0b' : '#10b981';

  return (
    <div style={{
      position: 'fixed',
      top: '100px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 10000,
      animation: 'slideDown 0.3s ease-out',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px 24px',
        background: bgColor,
        color: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        fontWeight: 500,
        fontSize: '14px',
      }}>
        {toast.type === 'error' && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        )}
        {toast.type === 'warning' && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        )}
        {toast.type === 'success' && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        )}
        <span>{toast.message}</span>
        <button 
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'white',
            marginLeft: '8px',
          }}
        >
          <XIcon />
        </button>
      </div>
      <style jsx global>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

// ============================================
// RELATED PRODUCT CARD (with image error handling)
// ============================================

interface RelatedProductCardProps {
  product: IkasProduct;
  imageUrl: string;
  price: string;
  onClose: () => void;
  onOpenModal?: (product: IkasProduct) => void;
}

const RelatedProductCard = ({ product, imageUrl, price, onClose, onOpenModal }: RelatedProductCardProps) => {
  const [imgError, setImgError] = useState(false);
  const fallbackImg = getProductMainImage(null, product.selectedVariant?.sku || product.variants?.[0]?.sku, product.name);
  
  const displayImage = imgError ? fallbackImg : imageUrl;
  
  return (
    <div 
      className="related-product-card"
      onClick={() => {
        onClose();
        setTimeout(() => onOpenModal?.(product), 150);
      }}
      role="button"
      tabIndex={0}
    >
      <div className="related-product-image">
        <Image
          src={displayImage}
          alt={product.name}
          layout="fill"
          objectFit="cover"
          unoptimized
          onError={() => setImgError(true)}
        />
      </div>
      <div className="related-product-info">
        <h4 className="related-product-name">{product.name}</h4>
        <span className="related-product-price">{price}</span>
      </div>
    </div>
  );
};

// ============================================
// PRODUCT DETAIL MODAL
// ============================================

interface ProductDetailModalProps {
  product: IkasProduct | null;
  isOpen: boolean;
  onClose: () => void;
  allProducts?: IkasProduct[];
  onShowToast?: (message: string, type: 'error' | 'success' | 'warning') => void;
  onOpenModal?: (product: IkasProduct) => void;
}

const ProductDetailModal = observer(({ product, isOpen, onClose, allProducts = [], onShowToast, onOpenModal }: ProductDetailModalProps) => {
  const store = useStore();
  const router = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'details'>('description');
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset image errors when product changes
  useEffect(() => {
    if (product && isOpen) {
      setImageErrors(new Set());
    }
  }, [product, isOpen]);

  // Debug: Log product data when modal opens
  useEffect(() => {
    if (product && isOpen) {
      console.log('=== Product Modal Debug ===');
      console.log('Product name:', product.name);
      console.log('Description:', product.description);
      console.log('Short Description:', product.shortDescription);
      console.log('Has variants:', product.hasVariant);
      console.log('Variants count:', product.variants?.length);
      console.log('VariantTypes:', product.variantTypes);
      console.log('DisplayedVariantTypes:', product.displayedVariantTypes);
      console.log('Selected Variant:', product.selectedVariant);
      console.log('Categories:', (product as any).categories);
    }
  }, [product, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setSelectedImageIndex(0);
      setQuantity(1);
      setAddedToCart(false);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, product]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Use ikas's built-in selectedVariant (updated when user selects variant values)
  const variant = product?.selectedVariant;
  
  // Handle variant value selection using ikas's selectVariantValue method
  const handleVariantValueSelect = useCallback((variantValue: any) => {
    if (product) {
      // Use ikas's built-in method to select variant
      product.selectVariantValue(variantValue, true); // disableRoute=true to prevent navigation
      // Reset image to first when variant changes
      setSelectedImageIndex(0);
    }
  }, [product]);

  // Get displayed variant types from ikas (properly formatted for UI)
  const displayedVariantTypes = useMemo(() => {
    if (!product) return [];
    
    // Use ikas's displayedVariantTypes getter if available
    const dvt = product.displayedVariantTypes;
    if (dvt && dvt.length > 0) {
      console.log('Using displayedVariantTypes:', dvt);
      return dvt;
    }
    
    // Fallback: manually build from variantTypes and variants
    if (!product.variantTypes || !product.variants) {
      return [];
    }
    
    const result = product.variantTypes.map((vt: any) => {
      const displayedVariantValues: any[] = [];
      const seenValues = new Set<string>();
      
      product.variants.forEach((v: any) => {
        if (v.variantValues) {
          v.variantValues.forEach((vv: any) => {
            if (vv.variantTypeId === vt.id && !seenValues.has(vv.id)) {
              seenValues.add(vv.id);
              displayedVariantValues.push({
                variant: v,
                variantValue: vv,
                hasStock: v.stock > 0,
                isSelected: product.selectedVariantValues?.some((sv: any) => sv.id === vv.id) || false
              });
            }
          });
        }
      });
      
      return {
        variantType: vt,
        displayedVariantValues
      };
    }).filter((vt: any) => vt.displayedVariantValues.length > 0);
    
    console.log('Fallback variantTypes:', result);
    return result;
  }, [product, product?.selectedVariantValues]);
  
  // Get fallback images from Cloudinary
  const fallbackImages: string[] = useMemo(() => {
    if (!product) return [];
    return getProductGalleryImages([], variant?.sku, product.name);
  }, [variant?.sku, product]);
  
  // Get all images from variant or product with fallback to Cloudinary
  // This updates automatically when variant changes (variant is product.selectedVariant)
  const allImages: string[] = useMemo(() => {
    if (!product) return [];
    
    const ikasImages: string[] = [];
    
    // PRIORITY 1: Selected variant's images (when user selects a color/size)
    const currentVariant = product.selectedVariant;
    if (currentVariant?.mainImage?.image?.src) {
      ikasImages.push(currentVariant.mainImage.image.src);
    }
    if (currentVariant?.images?.length) {
      currentVariant.images.forEach((img: any) => {
        if (img?.image?.src && !ikasImages.includes(img.image.src)) {
          ikasImages.push(img.image.src);
        }
      });
    }
    
    // PRIORITY 2: Product main image (if different from variant)
    if ((product as any).mainImage?.image?.src && !ikasImages.includes((product as any).mainImage.image.src)) {
      ikasImages.push((product as any).mainImage.image.src);
    }
    
    // PRIORITY 3: All other variant images (for gallery completeness)
    if (product.variants) {
      product.variants.forEach((v: any) => {
        if (v.mainImage?.image?.src && !ikasImages.includes(v.mainImage.image.src)) {
          ikasImages.push(v.mainImage.image.src);
        }
      });
    }
    
    // If we have ikas images, return them
    if (ikasImages.length > 0) {
      return ikasImages;
    }
    
    // Use fallback if no ikas images
    return fallbackImages;
  }, [product, product?.selectedVariant, fallbackImages]);

  // Handle image error - get fallback for that index
  const handleImageError = useCallback((index: number) => {
    setImageErrors(prev => new Set(prev).add(index));
  }, []);

  // Get actual image to display (considering errors)
  const getDisplayImage = useCallback((index: number): string => {
    if (imageErrors.has(index) && fallbackImages.length > 0) {
      return fallbackImages[Math.min(index, fallbackImages.length - 1)];
    }
    return allImages[index] || fallbackImages[0] || '/placeholder.svg';
  }, [allImages, fallbackImages, imageErrors]);

  const currentImage = useMemo(() => {
    return getDisplayImage(selectedImageIndex);
  }, [getDisplayImage, selectedImageIndex]);

  const priceDisplay = useMemo(() => {
    return variant?.price?.formattedBuyPrice || 
      variant?.price?.formattedSellPrice || 
      "Contact for price";
  }, [variant?.price]);

  const originalPrice = variant?.price?.formattedSellPrice;
  const hasDiscount = variant?.price?.discountPrice && 
    variant.price.discountPrice < (variant.price.buyPrice || variant.price.sellPrice || 0);

  // Check if user is logged in
  const customer = store.customerStore.customer;
  const isLoggedIn = !!customer;

  const handleAddToCart = useCallback(async () => {
    // Check if user is logged in
    if (!isLoggedIn) {
      onShowToast?.("Please log in to add items to cart", "warning");
      onClose();
      router.push('/account/login');
      return;
    }
    
    if (!variant || !product?.isAddToCartEnabled) return;
    
    setIsAdding(true);
    try {
      await store.cartStore.addItem(variant, product, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
    setIsAdding(false);
  }, [isLoggedIn, variant, product, quantity, store.cartStore, onShowToast, onClose, router]);

  // Related products
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    
    return allProducts
      .filter(p => {
        if (p.id === product.id) return false;
        const productCats = (product as any).categories || [];
        const pCats = (p as any).categories || [];
        return pCats.some((pc: any) => 
          productCats.some((c: any) => c.id === pc.id)
        );
      })
      .slice(0, 4);
  }, [allProducts, product]);

  // Early return AFTER all hooks
  if (!product || !mounted) return null;

  // Get selected value name for each variant type
  const getSelectedValueName = (dvt: any) => {
    const values = dvt.displayedVariantValues || dvt.values || [];
    const selected = values.find((dv: any) => dv.isSelected);
    if (selected) {
      const variantValue = selected.variantValue || selected;
      return translateToEnglish(variantValue.name);
    }
    return null;
  };

  const modalContent = (
    <div 
      className={`product-modal-overlay ${isOpen ? 'open' : ''}`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="product-modal-container" ref={modalRef} onClick={e => e.stopPropagation()}>
        {/* Close Button */}
        <button className="product-modal-close" onClick={onClose} aria-label="Close modal">
          <CloseIcon />
        </button>

        <div className="product-modal-content">
          {/* Left Side - Image Gallery */}
          <div className="product-modal-gallery">
            <div className="product-modal-main-image">
              {!product.hasStock && (
                <div className="product-modal-badge">Out of Stock</div>
              )}
              <Image
                src={currentImage}
                alt={product.name}
                layout="fill"
                objectFit="contain"
                unoptimized
                priority
                onError={() => handleImageError(selectedImageIndex)}
              />
            </div>
            
            {allImages.length > 1 && (
              <div className="product-modal-thumbnails">
                {allImages.slice(0, 6).map((src, idx) => (
                  <button
                    key={idx}
                    className={`product-modal-thumb ${selectedImageIndex === idx ? 'active' : ''}`}
                    onClick={() => setSelectedImageIndex(idx)}
                  >
                    <Image
                      src={getDisplayImage(idx)}
                      alt={`${product.name} ${idx + 1}`}
                      width={64}
                      height={64}
                      objectFit="cover"
                      unoptimized
                      onError={() => handleImageError(idx)}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Product Details */}
          <div className="product-modal-details">
            {/* Brand */}
            {product.brand && (
              <span className="product-modal-brand">{product.brand.name}</span>
            )}
            
            {/* Title */}
            <h2 className="product-modal-title">{product.name}</h2>
            
            {/* Price */}
            <div className="product-modal-price-row">
              <span className="product-modal-price">{priceDisplay}</span>
              {hasDiscount && originalPrice && (
                <span className="product-modal-old-price">{originalPrice}</span>
              )}
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="product-modal-short-desc">{product.shortDescription}</p>
            )}

            {/* Variant Selection - Using Dropdown Selects for cleaner UI */}
            {displayedVariantTypes.length > 0 && (
              <div className="product-modal-variants">
                {displayedVariantTypes.map((dvt: any) => {
                  const typeName = translateToEnglish(dvt.variantType?.name || dvt.name);
                  const availableValues = (dvt.displayedVariantValues || dvt.values || []).filter((dv: any) => dv.hasStock !== false);
                  
                  if (availableValues.length === 0) return null;
                  
                  const selectedName = getSelectedValueName(dvt);
                  
                  // Use dropdown for more than 4 options, chips for 4 or less
                  const useDropdown = availableValues.length > 4;
                  
                  return (
                    <div key={dvt.variantType?.id || dvt.id} className="variant-selector-group">
                      <label className="variant-selector-label">{typeName}</label>
                      
                      {useDropdown ? (
                        <div className="variant-select-wrapper">
                          <select
                            className="variant-select"
                            value={selectedName || ''}
                            onChange={(e) => {
                              const selectedValue = availableValues.find((dv: any) => {
                                const vv = dv.variantValue || dv;
                                return translateToEnglish(vv.name) === e.target.value;
                              });
                              if (selectedValue) {
                                handleVariantValueSelect(selectedValue.variantValue || selectedValue);
                              }
                            }}
                          >
                            {availableValues.map((dv: any) => {
                              const variantValue = dv.variantValue || dv;
                              const valueName = translateToEnglish(variantValue.name);
                              return (
                                <option key={variantValue.id} value={valueName}>
                                  {valueName}
                                </option>
                              );
                            })}
                          </select>
                          <ChevronDownIcon />
                        </div>
                      ) : (
                        <div className="variant-chips-row">
                          {availableValues.map((dv: any) => {
                            const variantValue = dv.variantValue || dv;
                            const isSelected = dv.isSelected || false;
                            const valueName = translateToEnglish(variantValue.name);
                            
                            return (
                              <button
                                key={variantValue.id}
                                className={`variant-chip-small ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleVariantValueSelect(variantValue)}
                              >
                                {valueName}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Product Meta Info */}
            <div className="product-modal-meta-section">
              {/* Stock Status */}
              <div className="meta-row">
                <span className="meta-icon">
                  {product.hasStock ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" y1="9" x2="9" y2="15"/>
                      <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                  )}
                </span>
                <span className={`meta-text ${product.hasStock ? 'in-stock' : 'out-of-stock'}`}>
                  {product.hasStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {/* SKU */}
              {variant?.sku && (
                <div className="meta-row">
                  <span className="meta-label-inline">SKU:</span>
                  <span className="meta-text">{variant.sku}</span>
                </div>
              )}

              {/* Category */}
              {(product as any).categories?.length > 0 && (
                <div className="meta-row">
                  <span className="meta-label-inline">Category:</span>
                  <span className="meta-text">{(product as any).categories.map((c: any) => c.name).join(", ")}</span>
                </div>
              )}
            </div>

            {/* Add to Cart Section */}
            {product.hasStock && (
              <div className="product-modal-actions">
                {/* Quantity */}
                <div className="product-modal-quantity">
                  <button 
                    className="qty-btn"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    <MinusIcon />
                  </button>
                  <span className="qty-value">{quantity}</span>
                  <button 
                    className="qty-btn"
                    onClick={() => setQuantity(q => q + 1)}
                  >
                    <PlusIcon />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button 
                  className={`product-modal-cart-btn ${addedToCart ? 'added' : ''}`}
                  onClick={handleAddToCart}
                  disabled={isAdding || !variant || !product.isAddToCartEnabled}
                >
                  {addedToCart ? (
                    <>
                      <CheckIcon />
                      <span>Added!</span>
                    </>
                  ) : isAdding ? (
                    <span>Adding...</span>
                  ) : (
                    <>
                      <CartPlusIcon />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Product Description Tabs */}
        {(product.description || product.shortDescription) && (
          <div className="product-modal-tabs">
            <div className="tabs-header">
              <button 
                className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button 
                className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
                onClick={() => setActiveTab('details')}
              >
                Specifications
              </button>
            </div>
            <div className="tabs-content">
              {activeTab === 'description' && (
                <div className="tab-panel description-panel">
                  {product.description ? (
                    <div 
                      className="product-full-description"
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                  ) : product.shortDescription ? (
                    <p className="product-short-description">{product.shortDescription}</p>
                  ) : (
                    <p className="product-no-description">No description available.</p>
                  )}
                </div>
              )}
              {activeTab === 'details' && (
                <div className="tab-panel details-panel">
                  <table className="details-table">
                    <tbody>
                      {variant?.sku && (
                        <tr>
                          <td className="detail-label">SKU</td>
                          <td className="detail-value">{variant.sku}</td>
                        </tr>
                      )}
                      {product.brand && (
                        <tr>
                          <td className="detail-label">Brand</td>
                          <td className="detail-value">{product.brand.name}</td>
                        </tr>
                      )}
                      {(product as any).categories?.length > 0 && (
                        <tr>
                          <td className="detail-label">Category</td>
                          <td className="detail-value">
                            {(product as any).categories.map((c: any) => c.name).join(", ")}
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td className="detail-label">Availability</td>
                        <td className="detail-value">
                          {product.hasStock ? 'In Stock' : 'Out of Stock'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="product-modal-related">
            <h3 className="related-heading">Related Products</h3>
            <div className="related-products-grid">
              {relatedProducts.map(p => {
                const variantImage = p.selectedVariant?.mainImage?.image?.src;
                const productImage = (p as any).mainImage?.image?.src;
                const firstVariantImage = p.variants?.[0]?.mainImage?.image?.src;
                const ikasImage = variantImage || productImage || firstVariantImage;
                const pImage = ikasImage || getProductMainImage(null, p.selectedVariant?.sku || p.variants?.[0]?.sku, p.name);
                const pPrice = p.selectedVariant?.price?.formattedBuyPrice || 
                  p.selectedVariant?.price?.formattedSellPrice || "";
                
                return (
                  <RelatedProductCard
                    key={p.id}
                    product={p}
                    imageUrl={pImage}
                    price={pPrice}
                    onClose={onClose}
                    onOpenModal={onOpenModal}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
});

// ============================================
// PRODUCT CARD
// ============================================

interface ProductCardProps {
  product: IkasProduct;
  index: number;
  onOpenModal: (product: IkasProduct) => void;
  onShowToast?: (message: string, type: 'error' | 'success' | 'warning') => void;
}

const ProductCard = observer(({ product, index, onOpenModal, onShowToast }: ProductCardProps) => {
  const store = useStore();
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [imageError, setImageError] = useState(false);

  const variant = product.selectedVariant;
  
  // Get image with fallback to Cloudinary
  const ikasImageUrl = variant?.mainImage?.image?.src || (product as any).mainImage?.image?.src;
  const fallbackImage = getProductMainImage(null, variant?.sku, product.name);
  const imageUrl = imageError ? fallbackImage : (ikasImageUrl || fallbackImage);

  const priceDisplay = variant?.price?.formattedBuyPrice || 
    variant?.price?.formattedSellPrice ||
    "Contact for price";

  // Check if user is logged in
  const customer = store.customerStore.customer;
  const isLoggedIn = !!customer;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), Math.min(index * 30, 200));
    return () => clearTimeout(timer);
  }, [index]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is logged in
    if (!isLoggedIn) {
      onShowToast?.("Please log in to add items to cart", "warning");
      router.push('/account/login');
      return;
    }
    
    if (!variant || !product.isAddToCartEnabled) return;
    
    setIsAdding(true);
    try {
      await store.cartStore.addItem(variant, product, 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
    setIsAdding(false);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onOpenModal(product);
  };

  return (
    <div
      className={`product-card-wrapper ${isVisible ? "visible" : ""}`}
      style={{ transitionDelay: `${Math.min(index * 30, 200)}ms` }}
    >
      <div className="product-card" onClick={handleCardClick} role="button" tabIndex={0}>
        <div className="product-image-wrapper">
          <Image
            src={imageUrl}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="product-image"
            unoptimized
            onError={() => setImageError(true)}
          />
          {!product.hasStock && (
            <div className="out-of-stock-badge">Out of Stock</div>
          )}
          {product.isAddToCartEnabled && product.hasStock && (
            <button
              onClick={handleAddToCart}
              disabled={isAdding || !variant}
              className={`add-to-cart-btn ${justAdded ? "added" : ""}`}
              aria-label="Add to cart"
            >
              {justAdded ? (
                <span className="added-text">Added!</span>
              ) : isAdding ? (
                <span className="adding-spinner" />
              ) : (
                <CartPlusIcon />
              )}
            </button>
          )}
        </div>
        <div className="product-info">
          {product.brand && (
            <span className="product-brand">{product.brand.name}</span>
          )}
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">
            {product.shortDescription || "Premium dental supply"}
          </p>
          <div className="product-footer">
            <span className="product-price">{priceDisplay}</span>
            <span className="view-link">Quick View →</span>
          </div>
        </div>
      </div>
    </div>
  );
});

// ============================================
// CATEGORY SIDEBAR ITEM (Accordion Style)
// ============================================

interface CategoryItemProps {
  category: Category;
  selectedCategory: string | null;
  onSelect: (categoryId: string | null) => void;
  getCategoryProductCount: (id: string) => number;
  level?: number;
}

const CategoryItem = ({ 
  category, 
  selectedCategory, 
  onSelect, 
  getCategoryProductCount,
  level = 0 
}: CategoryItemProps) => {
  const isSelected = selectedCategory === category.id;
  const count = getCategoryProductCount(category.id);

  const handleCategoryClick = () => {
    if (isSelected) {
      onSelect(null);
    } else {
      onSelect(category.id);
    }
  };

  return (
    <div>
      <div 
        className={`category-accordion-header ${isSelected ? 'active' : ''}`}
        onClick={handleCategoryClick}
        style={{ cursor: 'pointer' }}
      >
        <div className="category-info">
          <span className="category-label">{category.name}</span>
        </div>
        <span className="category-badge">{count}</span>
      </div>
      {/* Subcategories hidden - user requested only 3 main categories */}
    </div>
  );
};

// ============================================
// MAIN PRODUCTS SECTION
// ============================================

interface ProductsSectionProps {
  productList?: IkasProductList;
}

const ProductsSection: React.FC<ProductsSectionProps> = observer((props) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc'>('name');
  const [displayCount, setDisplayCount] = useState(24);
  
  // Modal state
  const [selectedProduct, setSelectedProduct] = useState<IkasProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Toast state
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'error' });
  
  const showToast = useCallback((message: string, type: 'error' | 'success' | 'warning') => {
    setToast({ show: true, message, type });
  }, []);
  
  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, show: false }));
  }, []);

  // Use our custom hook - pass initial productList from ikas
  const {
    products: filteredProducts,
    allProducts,
    isLoading,
    totalCount,
    mainCategories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    selectedBrand,
    setSelectedBrand,
    availableBrands,
    getCategoryProductCount,
    clearFilters,
  } = useProductsWithFilters(props.productList);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    sorted.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'price-asc' || sortBy === 'price-desc') {
        const priceA = a.selectedVariant?.price?.buyPrice || a.selectedVariant?.price?.sellPrice || 0;
        const priceB = b.selectedVariant?.price?.buyPrice || b.selectedVariant?.price?.sellPrice || 0;
        return sortBy === 'price-asc' ? priceA - priceB : priceB - priceA;
      }
      return 0;
    });
    return sorted;
  }, [filteredProducts, sortBy]);

  // Displayed products (infinite scroll)
  const displayedProducts = useMemo(() => {
    return sortedProducts.slice(0, displayCount);
  }, [sortedProducts, displayCount]);

  const hasMoreProducts = displayCount < sortedProducts.length;

  // Load more
  const loadMore = useCallback(() => {
    setDisplayCount(prev => Math.min(prev + 24, sortedProducts.length));
  }, [sortedProducts.length]);

  // Reset display count on filter change
  useEffect(() => {
    setDisplayCount(24);
  }, [selectedCategory, selectedBrand, searchQuery]);

  // Modal handlers
  const handleOpenModal = (product: IkasProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 200);
  };

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Active filter count
  const activeFilterCount = [selectedCategory, selectedBrand, searchQuery].filter(Boolean).length;

  // Get selected category name for title
  const selectedCategoryName = useMemo(() => {
    if (!selectedCategory) return "All Products";
    const findCategory = (cats: Category[]): string | null => {
      for (const cat of cats) {
        if (cat.id === selectedCategory) return cat.name;
        if (cat.subcategories) {
          const found = findCategory(cat.subcategories);
          if (found) return found;
        }
      }
      return null;
    };
    return findCategory(mainCategories) || "All Products";
  }, [selectedCategory, mainCategories]);

  return (
    <section id="products" ref={sectionRef} className="products-section horizontal-section">
      {/* Mobile Filter Overlay */}
      <div 
        className={`mobile-filter-overlay ${showFilters ? 'open' : ''}`}
        onClick={() => setShowFilters(false)}
      />

      {/* Mobile Filter Drawer */}
      <div className={`mobile-filter-drawer ${showFilters ? 'open' : ''}`}>
        <div className="mobile-drawer-header">
          <h3 className="mobile-drawer-title">Filters</h3>
          <button className="mobile-drawer-close" onClick={() => setShowFilters(false)}>
            <XIcon />
          </button>
        </div>
        
        {/* Categories */}
        <div className="filter-section">
          <h4 className="filter-section-title">Categories</h4>
          <div className="categories-accordion">
            {/* All Products */}
            <div 
              className={`category-accordion-header all-products ${!selectedCategory ? 'active' : ''}`}
              onClick={() => setSelectedCategory(null)}
            >
              <div className="category-info">
                <span className="category-label">All Products</span>
              </div>
              <span className="category-badge">{totalCount}</span>
            </div>
            
            {/* Category Tree */}
            {mainCategories.map(cat => (
              <CategoryItem
                key={cat.id}
                category={cat}
                selectedCategory={selectedCategory}
                onSelect={setSelectedCategory}
                getCategoryProductCount={getCategoryProductCount}
              />
            ))}
          </div>
        </div>

        {/* Brands */}
        {availableBrands.length > 0 && (
          <div className="filter-section">
            <h4 className="filter-section-title">Brands</h4>
            <div className="brand-chips">
              {availableBrands.map(brand => (
                <button
                  key={brand}
                  className={`brand-chip ${selectedBrand === brand ? 'active' : ''}`}
                  onClick={() => setSelectedBrand(selectedBrand === brand ? null : brand)}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeFilterCount > 0 && (
          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear All Filters ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Desktop Sidebar */}
      <aside className="filter-sidebar">
        {/* Categories */}
        <div className="filter-section">
          <h4 className="filter-section-title">Categories</h4>
          <div className="categories-accordion">
            {/* All Products */}
            <div 
              className={`category-accordion-header all-products ${!selectedCategory ? 'active' : ''}`}
              onClick={() => setSelectedCategory(null)}
            >
              <div className="category-info">
                <span className="category-label">All Products</span>
              </div>
              <span className="category-badge">{totalCount}</span>
            </div>
            
            {/* Category Tree */}
            {mainCategories.map(cat => (
              <CategoryItem
                key={cat.id}
                category={cat}
                selectedCategory={selectedCategory}
                onSelect={setSelectedCategory}
                getCategoryProductCount={getCategoryProductCount}
              />
            ))}
          </div>
        </div>

        {/* Brands */}
        {availableBrands.length > 0 && (
          <div className="filter-section">
            <h4 className="filter-section-title">Brands</h4>
            <div className="brand-chips">
              {availableBrands.map(brand => (
                <button
                  key={brand}
                  className={`brand-chip ${selectedBrand === brand ? 'active' : ''}`}
                  onClick={() => setSelectedBrand(selectedBrand === brand ? null : brand)}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeFilterCount > 0 && (
          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear All Filters ({activeFilterCount})
          </button>
        )}
      </aside>

      {/* Main Content */}
      <div className="products-main">
        {/* Header */}
        <div className="products-header">
          <h2 className={`products-title ${isInView ? "visible" : ""}`}>
            {selectedCategoryName}
          </h2>

          {/* Search */}
          <div className={`filters-row ${isInView ? "visible" : ""}`}>
            <div className="search-wrapper">
              <span className="search-icon">
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="clear-search">
                  <XIcon />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="products-toolbar">
          <div className="toolbar-left">
            <button className="mobile-filter-btn" onClick={() => setShowFilters(true)}>
              <FilterIcon />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="filter-badge">{activeFilterCount}</span>
              )}
            </button>

            <span className="product-count">
              {displayedProducts.length} of {sortedProducts.length} products
              {totalCount > 0 && sortedProducts.length !== totalCount && (
                <span className="total-count"> ({totalCount} total)</span>
              )}
            </span>

            <div className="active-filters">
              {selectedCategory && (
                <span className="active-filter-chip">
                  {selectedCategoryName}
                  <button onClick={() => setSelectedCategory(null)}>
                    <XIcon />
                  </button>
                </span>
              )}
              {selectedBrand && (
                <span className="active-filter-chip">
                  {selectedBrand}
                  <button onClick={() => setSelectedBrand(null)}>
                    <XIcon />
                  </button>
                </span>
              )}
            </div>
          </div>

          <div className="toolbar-right">
            <select 
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="name">Name: A-Z</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>

            <div className="view-toggle">
              <button 
                className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <GridIcon />
              </button>
              <button 
                className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <ListIcon />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-grid-wrapper">
          {isLoading ? (
            <div className="loading-state">
              <LoadingSpinner />
              <p className="loading-text">Loading products...</p>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="empty-state">
              <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="empty-text">No products found</p>
              <p className="empty-subtext">Try adjusting your filters or search terms</p>
              <button onClick={clearFilters} className="clear-filters">
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className={`products-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
                {displayedProducts.map((product, index) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    index={index} 
                    onOpenModal={handleOpenModal}
                    onShowToast={showToast}
                  />
                ))}
              </div>
              
              {/* Load More */}
              {hasMoreProducts && (
                <div className="load-more-container">
                  <button className="load-more-btn" onClick={loadMore}>
                    Load More Products
                    <span className="load-more-count">
                      ({sortedProducts.length - displayCount} remaining)
                    </span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        allProducts={allProducts}
        onShowToast={showToast}
        onOpenModal={handleOpenModal}
      />
      
      {/* Toast Notification */}
      <Toast toast={toast} onClose={hideToast} />
    </section>
  );
});

ProductsSection.displayName = "ProductsSection";

export default ProductsSection;
