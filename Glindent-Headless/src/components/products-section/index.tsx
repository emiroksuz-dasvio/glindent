import { observer } from "mobx-react-lite";
import { IkasProduct, useStore } from "@ikas/storefront";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

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

interface ProductsSectionProps {
  productList?: {
    data: IkasProduct[];
    hasNext?: boolean;
    hasPrev?: boolean;
    getNext?: () => void;
    getPrev?: () => void;
  };
}

const ProductCard = observer(({ product, index }: { product: IkasProduct; index: number }) => {
  const store = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const variant = product.selectedVariant;
  const imageUrl = variant?.mainImage?.image?.src || (product as any).mainImage?.image?.src || "/placeholder.svg";

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!variant) return;
    
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: Math.min(index * 0.05, 0.3),
        ease: "easeOut",
      }}
    >
      <Link href={product.href || "#"}>
        <a className="product-card">
          <div className="product-image-wrapper">
            <Image
              src={imageUrl}
              alt={product.name}
              layout="fill"
              objectFit="cover"
              className="product-image"
            />
            {/* Add to Cart Button */}
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
          </div>
          <div className="product-info">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-description">
              {product.shortDescription || "Premium dental supply"}
            </p>
            <div className="product-footer">
              <span className="product-price">
                {variant?.price?.formattedBuyPrice || (variant as any)?.formattedPrice || "Contact for price"}
              </span>
              <span className="view-link">View →</span>
            </div>
          </div>
        </a>
      </Link>
    </motion.div>
  );
});

const ProductsSection: React.FC<ProductsSectionProps> = (props) => {
  const { productList } = props;
  const products = productList?.data || [];

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-30%" });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.shortDescription || "").toLowerCase().includes(searchQuery.toLowerCase());
    // For now, category filter is simplified - can be enhanced based on ikas category structure
    return matchesSearch;
  });

  // Get unique categories from products (simplified)
  const categories = [
    { value: "zirconia", label: "Zirconia" },
    { value: "composites", label: "Composites" },
    { value: "x-ray", label: "X-Ray" },
  ];

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

        .category-filters {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .category-btn {
          border-radius: 0.75rem;
          padding: 0.5rem 1rem;
          font-size: 0.75rem;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .category-btn.active {
          background: white;
          color: #007a72;
        }
        .category-btn:not(.active) {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
        }
        .category-btn:not(.active):hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .products-grid-wrapper {
          flex: 1;
          overflow-y: auto;
          padding-right: 0.5rem;
          scrollbar-width: thin;
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

        .product-card {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border-radius: 1rem;
          background: white;
          text-align: left;
          text-decoration: none;
          transition: all 0.2s ease;
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

        .product-name {
          font-size: 1rem;
          font-weight: 500;
          color: #111827;
          margin: 0 0 0.25rem 0;
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

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          text-align: center;
        }

        .empty-text {
          color: rgba(255, 255, 255, 0.6);
          font-size: 1.125rem;
          margin: 0;
        }

        .clear-filters {
          margin-top: 0.5rem;
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

        .pagination {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
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
        .pagination-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>

      <div style={{ display: "flex", height: "100%", width: "100%", flexDirection: "column" }}>
        {/* Header */}
        <motion.div
          className="products-header"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Title and Filters Row */}
          <h2 className="products-title">Products</h2>

          {/* Search and Filter */}
          <motion.div
            className="filters-row"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
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

            {/* Category Filter */}
            <div className="category-filters">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`category-btn ${selectedCategory === "all" ? "active" : ""}`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`category-btn ${selectedCategory === cat.value ? "active" : ""}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Products Grid */}
        <div className="products-grid-wrapper">
          <AnimatePresence exitBeforeEnter>
            {filteredProducts.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="empty-state"
              >
                <p className="empty-text">No products found</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="clear-filters"
                >
                  Clear filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={`${selectedCategory}-${searchQuery}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="products-grid"
              >
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {productList && (productList.hasPrev || productList.hasNext) && (
          <div className="pagination">
            {productList.hasPrev && (
              <button onClick={() => productList.getPrev?.()} className="pagination-btn">
                ← Previous
              </button>
            )}
            {productList.hasNext && (
              <button onClick={() => productList.getNext?.()} className="pagination-btn">
                Next →
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default observer(ProductsSection);
