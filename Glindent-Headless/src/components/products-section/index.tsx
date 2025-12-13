import { observer } from "mobx-react-lite";
import { IkasProduct, IkasProductList, IkasDisplayedVariantType, useStore } from "@ikas/storefront";
import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

// Cart Icon for Add to Cart button
const CartPlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    <line x1="12" y1="9" x2="12" y2="15" />
    <line x1="9" y1="12" x2="15" y2="12" />
  </svg>
);

// Search Icon
const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

// X Icon
const XIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

// Close Icon for Modal
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

// Minus Icon for quantity
const MinusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
  </svg>
);

// Plus Icon for quantity
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

// Check Icon
const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// Shopping Bag Icon
const ShoppingBagIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

// ========================
// PRODUCT DETAIL MODAL
// ========================
interface ProductDetailModalProps {
  product: IkasProduct | null;
  isOpen: boolean;
  onClose: () => void;
  allProducts?: IkasProduct[];
}

const ProductDetailModal = observer(({ product, isOpen, onClose, allProducts = [] }: ProductDetailModalProps) => {
  const store = useStore();
  const [quantity, setQuantity] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [imgCentered, setImgCentered] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Track if component is mounted (for createPortal)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset state when product changes
  useEffect(() => {
    setQuantity(1);
    setJustAdded(false);
    setActiveImageIndex(0);
    setImgCentered(false);
  }, [product?.id]);

  // Handle visibility animation
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle scroll for sticky image behavior
  useEffect(() => {
    if (!mounted || !isOpen) return;
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      if (typeof window === 'undefined') return;
      if (window.innerWidth < 1024) return;
      const scrollTop = scrollContainer.scrollTop;
      const threshold = 120;
      setImgCentered(scrollTop > threshold);
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [mounted, isOpen]);

  // ESC key to close
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  // Handle variant selection
  const handleVariantChange = (dVT: IkasDisplayedVariantType, variantValueId: string) => {
    const dVV = dVT.displayedVariantValues.find(v => v.variantValue.id === variantValueId);
    if (dVV) {
      product?.selectVariantValue(dVV.variantValue);
    }
  };

  // Add to cart handler
  const handleAddToCart = async () => {
    if (!product || !product.selectedVariant || !product.isAddToCartEnabled) return;
    
    setIsAdding(true);
    try {
      const existingItem = store.cartStore.findExistingItem(product.selectedVariant, product);
      if (existingItem) {
        await store.cartStore.changeItemQuantity(existingItem, existingItem.quantity + quantity);
      } else {
        await store.cartStore.addItem(product.selectedVariant, product, quantity);
      }
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
    setIsAdding(false);
  };

  // Buy Now handler
  const handleBuyNow = async () => {
    if (!product || !product.selectedVariant || !product.isAddToCartEnabled) return;
    
    setIsAdding(true);
    try {
      await store.cartStore.addItem(product.selectedVariant, product, quantity);
      // Redirect to checkout
      window.location.href = "/checkout";
    } catch (error) {
      console.error("Failed to add to cart:", error);
      setIsAdding(false);
    }
  };

  // Get related products (same category, excluding current)
  const relatedProducts = allProducts
    .filter(p => p.id !== product?.id)
    .slice(0, 3);

  // Early returns after all hooks
  if (!mounted || !isOpen || !product) return null;

  const variant = product.selectedVariant;
  const images = variant?.images || [];
  const mainImage = images[activeImageIndex]?.image?.src || 
    variant?.mainImage?.image?.src || 
    (product as any).mainImage?.image?.src || 
    "/placeholder.svg";

  const priceDisplay = variant?.price?.formattedBuyPrice || 
    variant?.price?.formattedSellPrice ||
    "Contact for price";
  
  const hasDiscount = variant?.price?.buyPrice !== variant?.price?.sellPrice && variant?.price?.buyPrice;
  
  // Calculate total price
  const unitPrice = variant?.price?.buyPrice || variant?.price?.sellPrice || 0;
  const totalPrice = unitPrice * quantity;
  const currency = variant?.price?.currency || "GBP";
  const formattedTotal = new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(totalPrice);

  const modalContent = (
    <div 
      className="modal-overlay"
      onClick={onClose}
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      <div
        ref={modalRef}
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "scale(1) translateY(0)" : "scale(0.98) translateY(8px)",
        }}
      >
        {/* Close Button */}
        <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
          <CloseIcon />
        </button>

        {/* Scrollable Content */}
        <div ref={scrollContainerRef} className="modal-body">
          <div className="modal-grid">
            {/* Left: Product Image */}
            <div 
              className="modal-image-section"
              style={{
                top: imgCentered ? "50%" : "0px",
                transform: imgCentered ? "translateY(-50%)" : "translateY(0)",
              }}
            >
              <div className="modal-main-image">
                <Image
                  src={mainImage}
                  alt={product.name}
                  layout="fill"
                  objectFit="contain"
                  unoptimized
                />
                {/* Out of Stock Badge */}
                {!product.hasStock && (
                  <div className="modal-out-of-stock">Out of Stock</div>
                )}
              </div>
              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="modal-thumbnails">
                  {images.slice(0, 5).map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`modal-thumbnail ${activeImageIndex === idx ? "active" : ""}`}
                    >
                      <Image
                        src={img.image?.src || "/placeholder.svg"}
                        alt={`${product.name} - Image ${idx + 1}`}
                        layout="fill"
                        objectFit="cover"
                        unoptimized
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Details */}
            <div className="modal-details">
              {/* Brand */}
              {product.brand && (
                <span className="modal-brand">{product.brand.name}</span>
              )}
              
              {/* Title */}
              <h2 className="modal-title">{product.name}</h2>
              
              {/* Price */}
              <div className="modal-price-row">
                <span className="modal-price">{priceDisplay}</span>
                {hasDiscount && (
                  <span className="modal-old-price">
                    {variant?.price?.formattedSellPrice}
                  </span>
                )}
              </div>

              {/* Short Description */}
              {product.shortDescription && (
                <p className="modal-short-desc">{product.shortDescription}</p>
              )}

              {/* Description */}
              {product.description && (
                <div 
                  className="modal-description"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              )}

              {/* Variant Selectors */}
              {product.displayedVariantTypes && product.displayedVariantTypes.length > 0 && (
                <div className="modal-variants">
                  {product.displayedVariantTypes.map((dVT) => (
                    <div key={dVT.variantType.id} className="variant-group">
                      <label className="variant-label">{dVT.variantType.name}</label>
                      
                      {dVT.variantType.isColorSelection ? (
                        // Color Swatches
                        <div className="variant-swatches">
                          {dVT.displayedVariantValues.map((dVV) => (
                            <button
                              key={dVV.variantValue.id}
                              onClick={() => handleVariantChange(dVT, dVV.variantValue.id)}
                              className={`variant-swatch ${dVV.isSelected ? "selected" : ""} ${!dVV.hasStock ? "no-stock" : ""}`}
                              title={dVV.variantValue.name}
                            >
                              <div 
                                className="swatch-color"
                                style={{ backgroundColor: dVV.variantValue.colorCode || "#ccc" }}
                              />
                              <span className="swatch-name">{dVV.variantValue.name}</span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        // Select Dropdown or Buttons
                        <div className="variant-options">
                          {dVT.displayedVariantValues.map((dVV) => (
                            <button
                              key={dVV.variantValue.id}
                              onClick={() => handleVariantChange(dVT, dVV.variantValue.id)}
                              disabled={!dVV.hasStock}
                              className={`variant-option ${dVV.isSelected ? "selected" : ""} ${!dVV.hasStock ? "no-stock" : ""}`}
                            >
                              {dVV.variantValue.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Shipping Information */}
              <div className="modal-shipping">
                <h3 className="section-label">Shipping Information</h3>
                <div className="shipping-items">
                  <div className="shipping-item">
                    <span className="shipping-icon">🚚</span>
                    <div>
                      <div className="shipping-title">Standard Delivery</div>
                      <div className="shipping-text">3-5 business days</div>
                    </div>
                  </div>
                  <div className="shipping-item">
                    <span className="shipping-icon">⚡</span>
                    <div>
                      <div className="shipping-title">Express Delivery</div>
                      <div className="shipping-text">1-2 business days</div>
                    </div>
                  </div>
                  <div className="shipping-item">
                    <span className="shipping-icon">🎁</span>
                    <div>
                      <div className="shipping-title">Free Shipping</div>
                      <div className="shipping-text">On orders over £50</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="modal-quantity">
                <h3 className="section-label">Quantity</h3>
                <div className="quantity-row">
                  <div className="quantity-controls">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="quantity-btn"
                    >
                      <MinusIcon />
                    </button>
                    <span className="quantity-value">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                      className="quantity-btn"
                    >
                      <PlusIcon />
                    </button>
                  </div>
                  <span className="quantity-total">
                    Total: <span className="total-price">{formattedTotal}</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="modal-actions">
                {product.hasStock && product.isAddToCartEnabled ? (
                  <>
                    <button
                      onClick={handleBuyNow}
                      disabled={isAdding}
                      className="modal-buy-btn"
                    >
                      <ShoppingBagIcon />
                      <span>Buy Now</span>
                    </button>
                    <button
                      onClick={handleAddToCart}
                      disabled={isAdding}
                      className={`modal-add-btn ${justAdded ? "added" : ""}`}
                    >
                      {justAdded ? (
                        <>
                          <CheckIcon />
                          <span>Added!</span>
                        </>
                      ) : isAdding ? (
                        <>
                          <span className="btn-spinner" />
                          <span>Adding...</span>
                        </>
                      ) : (
                        <>
                          <PlusIcon />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <button disabled className="modal-add-btn disabled">
                    <span>Out of Stock</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="modal-related">
              <h3 className="related-title">You might also like</h3>
              <div className="related-grid">
                {relatedProducts.map((relatedProduct) => (
                  <a
                    key={relatedProduct.id}
                    href={relatedProduct.href || "#"}
                    onClick={onClose}
                    className="related-item"
                  >
                    <div className="related-image">
                      <Image
                        src={
                          relatedProduct.selectedVariant?.mainImage?.image?.src ||
                          (relatedProduct as any).mainImage?.image?.src ||
                          "/placeholder.svg"
                        }
                        alt={relatedProduct.name}
                        layout="fill"
                        objectFit="contain"
                        unoptimized
                      />
                    </div>
                    <div className="related-info">
                      <h4 className="related-name">{relatedProduct.name}</h4>
                      <p className="related-price">
                        {relatedProduct.selectedVariant?.price?.formattedBuyPrice ||
                          relatedProduct.selectedVariant?.price?.formattedSellPrice ||
                          "Contact for price"}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
});

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner" />
  </div>
);

// Props interface - IKAS ProductList prop type
interface ProductsSectionProps {
  productList?: IkasProductList;
}

// Individual Product Card Component
const ProductCard = observer(({ 
  product, 
  index,
  onOpenModal 
}: { 
  product: IkasProduct; 
  index: number;
  onOpenModal: (product: IkasProduct) => void;
}) => {
  const store = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Get the selected variant (first available variant)
  const variant = product.selectedVariant;
  
  // Get image URL from variant or product
  const imageUrl = 
    variant?.mainImage?.image?.src || 
    (product as any).mainImage?.image?.src || 
    "/placeholder.svg";

  // Get price display
  const priceDisplay = variant?.price?.formattedBuyPrice || 
    variant?.price?.formattedSellPrice ||
    "Contact for price";

  // Animate on mount with CSS
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), Math.min(index * 50, 300));
    return () => clearTimeout(timer);
  }, [index]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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
      style={{ transitionDelay: `${Math.min(index * 50, 300)}ms` }}
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
          />
          {/* Out of Stock Badge */}
          {!product.hasStock && (
            <div className="out-of-stock-badge">Out of Stock</div>
          )}
          {/* Add to Cart Button */}
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
          {/* Brand */}
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

// Main Products Section Component
const ProductsSection: React.FC<ProductsSectionProps> = observer((props) => {
  const { productList } = props;
  const sectionRef = useRef<HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isInView, setIsInView] = useState(false);
  
  // Modal state
  const [selectedProduct, setSelectedProduct] = useState<IkasProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal handlers
  const handleOpenModal = (product: IkasProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Delay clearing product to allow close animation
    setTimeout(() => setSelectedProduct(null), 200);
  };

  // Get products from IKAS productList
  const products = productList?.data || [];
  const isLoading = productList?.isLoading || false;
  const hasProducts = products.length > 0;

  // Simple intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Filter products by search (client-side)
  const filteredProducts = products.filter((product) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      (product.shortDescription || "").toLowerCase().includes(query) ||
      (product.brand?.name || "").toLowerCase().includes(query)
    );
  });

  // Handle pagination
  const handlePrevPage = async () => {
    if (productList?.hasPrev) {
      await productList.getPrev();
    }
  };

  const handleNextPage = async () => {
    if (productList?.hasNext) {
      await productList.getNext();
    }
  };

  return (
    <section id="products" ref={sectionRef} className="products-section horizontal-section">
      <style jsx global>{`
        .products-section {
          position: relative;
          display: flex;
          min-height: 100vh;
          height: 100vh;
          min-width: 100vw;
          width: 100vw;
          flex-shrink: 0;
          flex-direction: column;
          padding: 6rem 1.5rem 1.5rem;
          overflow: hidden;
        }
        @media (min-width: 640px) {
          .products-section {
            padding: 7rem 2rem 2rem;
          }
        }
        @media (min-width: 768px) {
          .products-section {
            padding: 10rem 4rem 3rem;
          }
        }
        @media (min-width: 1024px) {
          .products-section {
            padding: 10rem 5rem 3rem;
          }
        }

        .products-title {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(1.875rem, 5vw, 3.75rem);
          font-weight: 300;
          line-height: 1;
          letter-spacing: -0.02em;
          color: white;
          margin: 0;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .products-title.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .products-header {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        @media (min-width: 1024px) {
          .products-header {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 1.5rem;
            margin-bottom: 3rem;
          }
        }

        .filters-row {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s;
        }
        .filters-row.visible {
          opacity: 1;
          transform: translateY(0);
        }
        @media (min-width: 640px) {
          .filters-row {
            flex-direction: row;
            align-items: center;
          }
        }

        .search-wrapper {
          position: relative;
          width: 100%;
        }
        @media (min-width: 640px) {
          .search-wrapper {
            width: auto;
            min-width: 200px;
          }
        }
        @media (min-width: 1024px) {
          .search-wrapper {
            min-width: 250px;
          }
        }

        .search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.4);
        }

        .search-input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.05);
          padding: 0.625rem 2.5rem 0.625rem 2.5rem;
          font-size: 0.875rem;
          color: white;
          transition: border-color 0.2s ease;
        }
        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
        .search-input:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.4);
        }

        .clear-search {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.4);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: color 0.2s ease;
        }
        .clear-search:hover {
          color: white;
        }

        .product-count {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .products-grid-wrapper {
          flex: 1;
          overflow-y: auto;
          padding-right: 0.5rem;
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }
        .products-grid-wrapper::-webkit-scrollbar {
          width: 6px;
        }
        .products-grid-wrapper::-webkit-scrollbar-track {
          background: transparent;
        }
        .products-grid-wrapper::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }

        .products-grid {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(2, 1fr);
        }
        @media (min-width: 640px) {
          .products-grid {
            gap: 1.25rem;
          }
        }
        @media (min-width: 768px) {
          .products-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .products-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        @media (min-width: 1280px) {
          .products-grid {
            grid-template-columns: repeat(5, 1fr);
          }
        }

        .product-card-wrapper {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .product-card-wrapper.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .product-card {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border-radius: 1rem;
          background: white;
          text-align: left;
          text-decoration: none;
          transition: all 0.2s ease;
          height: 100%;
        }
        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .product-image-wrapper {
          position: relative;
          aspect-ratio: 1;
          overflow: hidden;
          background: #f9fafb;
        }

        .product-image {
          transition: transform 0.3s ease;
        }
        .product-card:hover .product-image {
          transform: scale(1.05);
        }

        .out-of-stock-badge {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          padding: 0.25rem 0.75rem;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          font-size: 0.625rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-radius: 9999px;
        }

        /* Add to Cart Button */
        .add-to-cart-btn {
          position: absolute;
          bottom: 0.75rem;
          right: 0.75rem;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 9999px;
          background: linear-gradient(135deg, #0d9488 0%, #0891b2 100%);
          border: none;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: translateY(8px);
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(13, 148, 136, 0.3);
          z-index: 10;
        }
        .product-card:hover .add-to-cart-btn {
          opacity: 1;
          transform: translateY(0);
        }
        .add-to-cart-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(13, 148, 136, 0.4);
        }
        .add-to-cart-btn:active {
          transform: scale(1);
        }
        .add-to-cart-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .add-to-cart-btn.added {
          background: #059669;
          opacity: 1;
          transform: translateY(0);
        }
        .added-text {
          font-size: 0.625rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .adding-spinner {
          width: 1rem;
          height: 1rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 9999px;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .product-info {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 1rem;
        }

        .product-brand {
          font-size: 0.625rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #0d9488;
          margin-bottom: 0.25rem;
        }

        .product-name {
          font-size: 1rem;
          font-weight: 500;
          color: #111827;
          margin: 0 0 0.25rem 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-description {
          font-size: 0.75rem;
          line-height: 1.5;
          color: #6b7280;
          margin: 0 0 0.75rem 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }

        .product-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
        }

        .product-price {
          font-family: monospace;
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
        }

        .view-link {
          font-size: 0.75rem;
          color: #6b7280;
          transition: color 0.2s ease;
        }
        .product-card:hover .view-link {
          color: #0d9488;
        }

        /* Loading State */
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          flex: 1;
        }
        .loading-spinner {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .spinner {
          width: 3rem;
          height: 3rem;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        .loading-text {
          margin-top: 1rem;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.875rem;
        }

        /* Empty State */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          text-align: center;
          flex: 1;
        }
        .empty-icon {
          width: 4rem;
          height: 4rem;
          margin-bottom: 1rem;
          color: rgba(255, 255, 255, 0.3);
        }
        .empty-text {
          color: rgba(255, 255, 255, 0.6);
          font-size: 1.125rem;
          margin: 0 0 0.5rem 0;
        }
        .empty-subtext {
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.875rem;
          margin: 0;
        }
        .clear-filters {
          margin-top: 1rem;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.8);
          background: none;
          border: none;
          text-decoration: underline;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .clear-filters:hover {
          color: white;
        }

        /* Pagination */
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin-top: 2rem;
          padding-bottom: 1rem;
        }
        .pagination-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          font-weight: 500;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .pagination-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.2);
        }
        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .pagination-info {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.6);
        }

        /* ========================
           PRODUCT DETAIL MODAL STYLES
           ======================== */
        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          transition: opacity 0.15s ease-out;
        }

        .modal-content {
          position: relative;
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 72rem;
          max-height: 90vh;
          overflow: hidden;
          border-radius: 1.5rem;
          background: white;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          transition: opacity 0.15s ease-out, transform 0.15s ease-out;
        }

        .modal-close-btn {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          border: 1px solid #e5e7eb;
          background: white;
          color: #9ca3af;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .modal-close-btn:hover {
          background: #f9fafb;
          color: #111827;
          transform: rotate(90deg) scale(1.1);
        }

        .modal-body {
          flex: 1;
          overflow-y: auto;
          padding: 2rem 2rem 3rem;
        }
        @media (min-width: 1024px) {
          .modal-body {
            padding: 3rem;
          }
        }

        /* Modal Grid Layout */
        .modal-grid {
          display: grid;
          gap: 3rem;
        }
        @media (min-width: 1024px) {
          .modal-grid {
            grid-template-columns: auto 1fr;
            align-items: start;
          }
        }

        /* Modal Image Section - Sticky on scroll */
        .modal-image-section {
          position: relative;
          transition: top 0.3s ease, transform 0.3s ease;
        }
        @media (min-width: 1024px) {
          .modal-image-section {
            position: sticky;
          }
        }

        .modal-main-image {
          position: relative;
          overflow: hidden;
          border-radius: 1.5rem;
          background: #f9fafb;
          padding: 2rem;
        }
        .modal-main-image > div {
          aspect-ratio: 1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }
        @media (min-width: 1024px) {
          .modal-main-image > div {
            width: 400px;
          }
        }

        .modal-out-of-stock {
          position: absolute;
          top: 1rem;
          left: 1rem;
          z-index: 5;
          padding: 0.375rem 0.75rem;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-radius: 9999px;
        }

        .modal-thumbnails {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
          overflow-x: auto;
        }

        .modal-thumbnail {
          position: relative;
          flex-shrink: 0;
          width: 3.5rem;
          height: 3.5rem;
          border-radius: 0.5rem;
          overflow: hidden;
          border: 2px solid transparent;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .modal-thumbnail.active {
          border-color: #0d9488;
        }
        .modal-thumbnail:hover:not(.active) {
          border-color: #d1d5db;
        }

        /* Modal Details */
        .modal-details {
          display: flex;
          flex-direction: column;
        }

        .modal-brand {
          display: inline-block;
          font-family: monospace;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #0d9488;
          margin-bottom: 0.75rem;
        }

        .modal-title {
          font-size: 1.875rem;
          font-weight: 300;
          color: #111827;
          margin: 0 0 0.75rem 0;
          line-height: 1.2;
        }
        @media (min-width: 768px) {
          .modal-title {
            font-size: 2.25rem;
          }
        }

        .modal-price-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .modal-price {
          font-family: monospace;
          font-size: 1.875rem;
          font-weight: 600;
          color: #0d9488;
        }

        .modal-old-price {
          font-size: 1rem;
          color: #9ca3af;
          text-decoration: line-through;
        }

        .modal-short-desc {
          font-size: 1rem;
          line-height: 1.6;
          color: #6b7280;
          margin-bottom: 2rem;
        }

        .modal-description {
          font-size: 0.875rem;
          line-height: 1.6;
          color: #6b7280;
          margin-bottom: 2rem;
          max-height: 100px;
          overflow-y: auto;
        }
        .modal-description p {
          margin: 0 0 0.5rem 0;
        }

        /* Section Label */
        .section-label {
          display: block;
          font-family: monospace;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #9ca3af;
          margin-bottom: 0.75rem;
        }

        /* Variant Selectors */
        .modal-variants {
          margin-bottom: 2rem;
        }

        .variant-group {
          margin-bottom: 1.5rem;
        }

        .variant-label {
          display: block;
          font-family: monospace;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #9ca3af;
          margin-bottom: 0.75rem;
        }

        .variant-swatches {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        /* Color Swatch with name label */
        .variant-swatch {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 3.5rem;
          height: 3.5rem;
          border-radius: 0.75rem;
          border: 2px solid transparent;
          background: #f9fafb;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .variant-swatch.selected {
          border-color: #0d9488;
          box-shadow: 0 0 0 2px white, 0 0 0 4px #0d9488;
          background: #f0fdfa;
        }
        .variant-swatch:hover:not(.selected) {
          background: #f3f4f6;
        }
        .variant-swatch.no-stock {
          opacity: 0.4;
          cursor: not-allowed;
        }
        
        .swatch-color {
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          box-shadow: 0 1px 3px rgba(0,0,0,0.15);
        }
        
        .swatch-name {
          margin-top: 0.25rem;
          font-size: 0.625rem;
          font-weight: 500;
          color: #6b7280;
        }

        /* Non-color variant options (size, etc) */
        .variant-options {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .variant-option {
          padding: 0.625rem 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .variant-option:hover:not(.selected):not(.no-stock) {
          border-color: #d1d5db;
          background: #f9fafb;
        }
        .variant-option.selected {
          border-color: #0d9488;
          background: #f0fdfa;
          color: #0d9488;
        }
        .variant-option.no-stock {
          opacity: 0.4;
          cursor: not-allowed;
          text-decoration: line-through;
        }

        .variant-select {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          color: #111827;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .variant-select:focus {
          outline: none;
          border-color: #0d9488;
          box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1);
        }

        /* Shipping Information */
        .modal-shipping {
          margin-bottom: 2rem;
        }
        
        .shipping-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1.5rem;
          background: #f9fafb;
          border-radius: 1rem;
        }
        
        .shipping-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          font-size: 0.875rem;
        }
        
        .shipping-icon {
          font-size: 1.125rem;
          line-height: 1;
        }
        
        .shipping-title {
          font-weight: 500;
          color: #111827;
        }
        
        .shipping-text {
          font-size: 0.75rem;
          color: #6b7280;
          margin-top: 0.125rem;
        }

        /* Quantity Selector */
        .modal-quantity {
          margin-bottom: 2rem;
        }

        .quantity-row {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .quantity-controls {
          display: inline-flex;
          align-items: center;
          border-radius: 0.75rem;
          background: #f9fafb;
          padding: 0.25rem;
        }

        .quantity-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          border: none;
          border-radius: 0.5rem;
          background: transparent;
          color: #9ca3af;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .quantity-btn:hover:not(:disabled) {
          background: white;
          color: #111827;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .quantity-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .quantity-value {
          min-width: 3rem;
          text-align: center;
          font-size: 1.125rem;
          font-weight: 500;
          color: #111827;
        }

        .quantity-total {
          font-size: 0.875rem;
          color: #6b7280;
        }
        
        .total-price {
          font-family: monospace;
          font-size: 1.125rem;
          font-weight: 600;
          color: #0d9488;
          margin-left: 0.5rem;
        }

        /* Modal Actions */
        .modal-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        @media (min-width: 640px) {
          .modal-actions {
            flex-direction: row;
          }
        }

        /* Buy Now Button - Primary */
        .modal-buy-btn {
          position: relative;
          display: flex;
          flex: 1;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          height: 3.5rem;
          padding: 0 1.5rem;
          border: none;
          border-radius: 0.75rem;
          font-size: 1rem;
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #06b6d4 100%);
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .modal-buy-btn:hover:not(:disabled) {
          transform: scale(1.02);
        }
        .modal-buy-btn:active:not(:disabled) {
          transform: scale(1);
        }
        .modal-buy-btn:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }
        .modal-buy-btn::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: translateX(-200%);
          transition: transform 0.7s ease;
        }
        .modal-buy-btn:hover::before {
          transform: translateX(200%);
        }

        /* Add to Cart Button - Secondary */
        .modal-add-btn {
          display: flex;
          flex: 1;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          height: 3.5rem;
          padding: 0 1.5rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
          font-size: 1rem;
          font-weight: 600;
          color: #111827;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .modal-add-btn:hover:not(:disabled) {
          border-color: #0d9488;
          color: #0d9488;
          background: #f0fdfa;
        }
        .modal-add-btn:disabled {
          cursor: not-allowed;
        }
        .modal-add-btn.disabled {
          background: #9ca3af;
          color: white;
          border-color: #9ca3af;
        }
        .modal-add-btn.added {
          border-color: #059669;
          background: #059669;
          color: white;
        }

        .btn-spinner {
          width: 1.25rem;
          height: 1.25rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        /* Related Products Section */
        .modal-related {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid #f3f4f6;
        }
        
        .related-title {
          font-size: 1.125rem;
          font-weight: 500;
          color: #111827;
          margin: 0 0 1rem 0;
        }
        
        .related-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 1rem;
        }
        @media (min-width: 640px) {
          .related-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        
        .related-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
          border-radius: 0.75rem;
          text-decoration: none;
          transition: background 0.2s ease;
        }
        .related-item:hover {
          background: #f9fafb;
        }
        
        .related-image {
          position: relative;
          flex-shrink: 0;
          width: 3.5rem;
          height: 3.5rem;
          border-radius: 0.5rem;
          overflow: hidden;
          background: #f9fafb;
          border: 1px solid #f3f4f6;
        }
        
        .related-info {
          min-width: 0;
          flex: 1;
        }
        
        .related-name {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          transition: color 0.2s ease;
        }
        .related-item:hover .related-name {
          color: #0d9488;
        }
        
        .related-price {
          font-size: 0.75rem;
          font-weight: 600;
          color: #111827;
          margin: 0.125rem 0 0 0;
        }

        .modal-view-link {
          display: block;
          text-align: center;
          font-size: 0.875rem;
          color: #6b7280;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .modal-view-link:hover {
          color: #0d9488;
        }
      `}</style>

      <div style={{ display: "flex", height: "100%", width: "100%", flexDirection: "column" }}>
        {/* Header */}
        <div className="products-header">
          {/* Title */}
          <h2 className={`products-title ${isInView ? "visible" : ""}`}>Products</h2>

          {/* Search */}
          <div className={`filters-row ${isInView ? "visible" : ""}`}>
            {/* Search Input */}
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

            {/* Product count */}
            {hasProducts && (
              <span className="product-count">
                {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
                {searchQuery && ` found`}
              </span>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-grid-wrapper">
          {/* Loading State */}
          {isLoading ? (
            <div className="loading-state">
              <LoadingSpinner />
              <p className="loading-text">Loading products...</p>
            </div>
          ) : !hasProducts ? (
            /* No Products from IKAS */
            <div className="empty-state">
              <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="empty-text">No products available</p>
              <p className="empty-subtext">
                Add a Product List prop in the theme editor to display products here.
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            /* Search returned no results */
            <div className="empty-state">
              <p className="empty-text">No products found</p>
              <p className="empty-subtext">Try adjusting your search terms</p>
              <button onClick={() => setSearchQuery("")} className="clear-filters">
                Clear search
              </button>
            </div>
          ) : (
            /* Products Grid */
            <div className="products-grid">
              {filteredProducts.map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  index={index} 
                  onOpenModal={handleOpenModal}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {productList && (productList.hasPrev || productList.hasNext) && (
          <div className="pagination">
            <button
              onClick={handlePrevPage}
              disabled={!productList.hasPrev || isLoading}
              className="pagination-btn"
            >
              ← Previous
            </button>
            <span className="pagination-info">
              Page {productList.page} of {productList.pageCount || "?"}
            </span>
            <button
              onClick={handleNextPage}
              disabled={!productList.hasNext || isLoading}
              className="pagination-btn"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        allProducts={products}
      />
    </section>
  );
});

ProductsSection.displayName = "ProductsSection";

export default ProductsSection;
