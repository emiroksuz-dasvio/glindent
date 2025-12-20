import { observer } from "mobx-react-lite";
import { IkasProduct, IkasProductList, useStore } from "@ikas/storefront";
import Image from "next/image";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { useProductsWithFilters, Category } from "src/hooks/use-all-products";

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
// PRODUCT DETAIL MODAL
// ============================================

interface ProductDetailModalProps {
  product: IkasProduct | null;
  isOpen: boolean;
  onClose: () => void;
  allProducts?: IkasProduct[];
}

const ProductDetailModal = observer(({ product, isOpen, onClose, allProducts = [] }: ProductDetailModalProps) => {
  const store = useStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!product || !mounted) return null;

  const variant = product.selectedVariant;
  
  // Get all images from variant or product
  const allImages: string[] = [];
  if (variant?.mainImage?.image?.src) {
    allImages.push(variant.mainImage.image.src);
  }
  if (variant?.images?.length) {
    variant.images.forEach((img: any) => {
      if (img?.image?.src && !allImages.includes(img.image.src)) {
        allImages.push(img.image.src);
      }
    });
  }
  if ((product as any).mainImage?.image?.src && !allImages.includes((product as any).mainImage.image.src)) {
    allImages.push((product as any).mainImage.image.src);
  }

  const currentImage = allImages[selectedImageIndex] || "/placeholder.svg";

  const priceDisplay = variant?.price?.formattedBuyPrice || 
    variant?.price?.formattedSellPrice || 
    "Contact for price";

  const originalPrice = variant?.price?.formattedSellPrice;
  const hasDiscount = variant?.price?.discountPrice && 
    variant.price.discountPrice < (variant.price.buyPrice || variant.price.sellPrice || 0);

  const handleAddToCart = async () => {
    if (!variant || !product.isAddToCartEnabled) return;
    
    setIsAdding(true);
    try {
      await store.cartStore.addItem(variant, product, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
    setIsAdding(false);
  };

  // Related products
  const relatedProducts = allProducts
    .filter(p => {
      if (p.id === product.id) return false;
      const productCats = (product as any).categories || [];
      const pCats = (p as any).categories || [];
      return pCats.some((pc: any) => 
        productCats.some((c: any) => c.id === pc.id)
      );
    })
    .slice(0, 4);

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
              />
            </div>
            
            {allImages.length > 1 && (
              <div className="product-modal-thumbnails">
                {allImages.map((src, idx) => (
                  <button
                    key={idx}
                    className={`product-modal-thumb ${selectedImageIndex === idx ? 'active' : ''}`}
                    onClick={() => setSelectedImageIndex(idx)}
                  >
                    <Image
                      src={src}
                      alt={`${product.name} ${idx + 1}`}
                      width={64}
                      height={64}
                      objectFit="cover"
                      unoptimized
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

            {/* Description */}
            {product.shortDescription && (
              <p className="product-modal-desc">{product.shortDescription}</p>
            )}

            {/* Stock Status */}
            <div className="product-modal-stock">
              {product.hasStock ? (
                <span className="stock-available">
                  <CheckIcon /> In Stock
                </span>
              ) : (
                <span className="stock-unavailable">Out of Stock</span>
              )}
            </div>

            {/* SKU */}
            {variant?.sku && (
              <div className="product-modal-meta">
                <span className="meta-label">SKU:</span>
                <span className="meta-value">{variant.sku}</span>
              </div>
            )}

            {/* Categories */}
            {(product as any).categories?.length > 0 && (
              <div className="product-modal-meta">
                <span className="meta-label">Category:</span>
                <span className="meta-value">
                  {(product as any).categories.map((c: any) => c.name).join(", ")}
                </span>
              </div>
            )}

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
                      <span>Added to Cart!</span>
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

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="product-modal-related">
            <h3 className="related-heading">Related Products</h3>
            <div className="related-products-grid">
              {relatedProducts.map(p => {
                const pImage = p.selectedVariant?.mainImage?.image?.src || 
                  (p as any).mainImage?.image?.src || 
                  "/placeholder.svg";
                const pPrice = p.selectedVariant?.price?.formattedBuyPrice || 
                  p.selectedVariant?.price?.formattedSellPrice || "";
                
                return (
                  <div key={p.id} className="related-product-card">
                    <div className="related-product-image">
                      <Image
                        src={pImage}
                        alt={p.name}
                        layout="fill"
                        objectFit="cover"
                        unoptimized
                      />
                    </div>
                    <div className="related-product-info">
                      <h4 className="related-product-name">{p.name}</h4>
                      <span className="related-product-price">{pPrice}</span>
                    </div>
                  </div>
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
}

const ProductCard = observer(({ product, index, onOpenModal }: ProductCardProps) => {
  const store = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const variant = product.selectedVariant;
  
  const imageUrl = 
    variant?.mainImage?.image?.src || 
    (product as any).mainImage?.image?.src || 
    "/placeholder.svg";

  const priceDisplay = variant?.price?.formattedBuyPrice || 
    variant?.price?.formattedSellPrice ||
    "Contact for price";

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), Math.min(index * 30, 200));
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
// CATEGORY SIDEBAR ITEM
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
  const [isExpanded, setIsExpanded] = useState(true);
  const hasSubcategories = category.subcategories && category.subcategories.length > 0;
  const isSelected = selectedCategory === category.id;
  const count = getCategoryProductCount(category.id);

  return (
    <div className="category-item-wrapper">
      <button
        className={`category-item ${isSelected ? 'active' : ''}`}
        style={{ paddingLeft: `${0.75 + level * 0.75}rem` }}
        onClick={() => onSelect(isSelected ? null : category.id)}
      >
        <span className="category-name">{category.name}</span>
        <span className="category-count">({count})</span>
        {hasSubcategories && (
          <button 
            className="expand-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            <ChevronDownIcon isOpen={isExpanded} />
          </button>
        )}
      </button>
      
      {hasSubcategories && isExpanded && (
        <div className="subcategories">
          {category.subcategories!.map(sub => (
            <CategoryItem
              key={sub.id}
              category={sub}
              selectedCategory={selectedCategory}
              onSelect={onSelect}
              getCategoryProductCount={getCategoryProductCount}
              level={level + 1}
            />
          ))}
        </div>
      )}
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
          <div className="categories-list">
            <button
              className={`category-item ${!selectedCategory ? 'active' : ''}`}
              onClick={() => setSelectedCategory(null)}
            >
              <span className="category-name">All Products</span>
              <span className="category-count">({totalCount})</span>
            </button>
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
          <div className="categories-list">
            <button
              className={`category-item ${!selectedCategory ? 'active' : ''}`}
              onClick={() => setSelectedCategory(null)}
            >
              <span className="category-name">All Products</span>
              <span className="category-count">({totalCount})</span>
            </button>
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
      />
    </section>
  );
});

ProductsSection.displayName = "ProductsSection";

export default ProductsSection;
