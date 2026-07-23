import { observer } from "mobx-react-lite";
import { useStore, IkasOrderLineItem } from "@ikas/storefront";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getProductMainImage } from "src/lib/product-images";

// Icons
const MinusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const ShoppingBagIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const TruckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const PackageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

// GlindentLogo Component
const GlindentLogo = ({ className = "" }: { className?: string }) => {
  return (
    <svg
      width="180"
      height="36"
      viewBox="0 0 180 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <text
        x="0"
        y="24"
        fill="white"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="28"
        fontWeight="700"
        letterSpacing="-0.02em"
      >
        glindent
      </text>
      <text
        x="0"
        y="34"
        fill="rgba(255,255,255,0.7)"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="8"
        fontWeight="400"
        letterSpacing="0.15em"
      >
        WAY TO DENTISTRY
      </text>
    </svg>
  );
};

// Cart Item Component
const CartItem = observer(({ item, onRemove, onUpdateQuantity }: {
  item: IkasOrderLineItem;
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Try multiple image sources
  const ikasImageUrl = 
    item.variant?.mainImage?.src ||
    (item.variant?.mainImage as any)?.image?.src ||
    (item.variant as any)?.images?.[0]?.src ||
    (item.variant as any)?.images?.[0]?.image?.src;
  
  // Use ikas image if available and no error, otherwise use placeholder
  const imageUrl = imageError || !ikasImageUrl ? getProductMainImage(null) : ikasImageUrl;
  
  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    setIsUpdating(true);
    await onUpdateQuantity(newQuantity);
    setIsUpdating(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="cart-item"
    >
      <div className={`cart-item-image ${imageUrl === '/glindent-logo.png' ? 'logo-fallback' : ''}`}>
        <Image
          src={imageUrl}
          alt={item.variant?.name || "Product"}
          layout="fill"
          objectFit={imageUrl === '/glindent-logo.png' ? "contain" : "cover"}
          unoptimized
          onError={() => setImageError(true)}
        />
      </div>
      
      <div className="cart-item-details">
        <div className="cart-item-header">
          <div>
            <h3 className="cart-item-name">{item.variant?.name || "Product"}</h3>
            {item.options && item.options.length > 0 && (
              <p className="cart-item-variant">
                {item.options.map(opt => opt.values?.map(v => v.name).join(", ")).join(", ")}
              </p>
            )}
          </div>
          <button
            onClick={onRemove}
            className="cart-item-remove"
            aria-label="Remove item"
          >
            <TrashIcon />
          </button>
        </div>
        
        <div className="cart-item-footer">
          <div className="quantity-selector">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1}
              className="quantity-btn"
            >
              <MinusIcon />
            </button>
            <span className="quantity-value">{item.quantity}</span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isUpdating}
              className="quantity-btn"
            >
              <PlusIcon />
            </button>
          </div>
          
          <div className="cart-item-price">
            {item.formattedFinalPriceWithQuantity || item.formattedPriceWithQuantity}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// Main Cart Page Component
const CartPage: React.FC = () => {
  const store = useStore();
  const cart = store.cartStore.cart;
  const [isLoaded, setIsLoaded] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleRemoveItem = async (item: IkasOrderLineItem) => {
    await store.cartStore.removeItem(item);
  };

  const handleUpdateQuantity = async (item: IkasOrderLineItem, quantity: number) => {
    await store.cartStore.changeItemQuantity(item, quantity);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    setCouponError("");
    
    const result = await store.cartStore.saveCouponCode(couponCode);
    if (!result.success) {
      setCouponError("Invalid coupon code");
    } else {
      setCouponCode("");
    }
    setIsApplyingCoupon(false);
  };

  const handleRemoveCoupon = async () => {
    await store.cartStore.removeCouponCode();
  };

  const items = cart?.orderLineItems || [];
  const itemCount = cart?.itemQuantity || 0;
  const totalPrice = cart?.totalFinalPrice || 0;
  const formattedTotal = cart?.formattedTotalFinalPrice || "£0.00";
  
  // Calculate shipping (free over £100)
  const shippingThreshold = 100;
  const shippingCost = totalPrice >= shippingThreshold ? 0 : 5.99;
  const grandTotal = totalPrice + shippingCost;

  return (
    <main className="cart-page">
      <style jsx global>{`
        .cart-page {
          min-height: 100vh;
          width: 100%;
          background: linear-gradient(165deg, #0d9488 0%, #0891b2 50%, #06b6d4 100%);
          position: relative;
        }
        
        .cart-grain-overlay {
          position: absolute;
          inset: 0;
          opacity: 0.03;
          pointer-events: none;
          z-index: 1;
        }
        
        .cart-header-nav {
          position: fixed;
          left: 0;
          right: 0;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          background: rgba(13, 148, 136, 0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: opacity 0.7s ease;
        }
        
        @media (min-width: 640px) {
          .cart-header-nav {
            padding: 1.25rem 2rem;
          }
        }
        
        @media (min-width: 768px) {
          .cart-header-nav {
            padding: 1.5rem 4rem;
          }
        }
        
        .cart-content {
          position: relative;
          z-index: 10;
          min-height: 100vh;
          padding: 7rem 1.5rem 3rem;
        }
        
        @media (min-width: 640px) {
          .cart-content {
            padding: 8rem 2rem 3rem;
          }
        }
        
        @media (min-width: 768px) {
          .cart-content {
            padding: 9rem 4rem 4rem;
          }
        }
        
        @media (min-width: 1024px) {
          .cart-content {
            padding: 9rem 5rem 4rem;
          }
        }
        
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
          font-weight: 500;
          transition: color 0.2s ease;
          margin-bottom: 1rem;
          text-decoration: none;
        }
        
        .back-link:hover {
          color: white;
        }
        
        .cart-title {
          font-size: 2rem;
          font-weight: 300;
          color: white;
          margin-bottom: 2rem;
          letter-spacing: -0.02em;
        }
        
        @media (min-width: 640px) {
          .cart-title {
            font-size: 2.5rem;
          }
        }
        
        @media (min-width: 768px) {
          .cart-title {
            font-size: 3rem;
            margin-bottom: 3rem;
          }
        }
        
        .cart-grid {
          display: grid;
          gap: 1.5rem;
        }
        
        @media (min-width: 1024px) {
          .cart-grid {
            grid-template-columns: 1fr 400px;
            gap: 2.5rem;
          }
        }
        
        @media (min-width: 1280px) {
          .cart-grid {
            grid-template-columns: 1fr 440px;
          }
        }
        
        .cart-items-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .cart-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .cart-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        }
        
        .cart-item-image {
          position: relative;
          width: 100px;
          height: 100px;
          border-radius: 0.75rem;
          overflow: hidden;
          flex-shrink: 0;
          background: #f3f4f6;
        }
        
        @media (min-width: 640px) {
          .cart-item-image {
            width: 120px;
            height: 120px;
          }
        }
        
        .cart-item-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-width: 0;
        }
        
        .cart-item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.5rem;
        }
        
        .cart-item-name {
          font-size: 0.9375rem;
          font-weight: 600;
          color: #111827;
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        
        .cart-item-variant {
          font-size: 0.75rem;
          color: #6b7280;
          margin-top: 0.25rem;
        }
        
        .cart-item-remove {
          padding: 0.5rem;
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          transition: color 0.2s ease;
          flex-shrink: 0;
        }
        
        .cart-item-remove:hover {
          color: #ef4444;
        }
        
        .cart-item-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.75rem;
        }
        
        .quantity-selector {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f3f4f6;
          border-radius: 9999px;
          padding: 0.25rem;
        }
        
        .quantity-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1.75rem;
          height: 1.75rem;
          border-radius: 9999px;
          background: white;
          border: none;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .quantity-btn:hover {
          background: #0d9488;
          color: white;
        }
        
        .quantity-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: white;
          color: #374151;
        }
        
        .quantity-value {
          font-size: 0.875rem;
          font-weight: 600;
          color: #111827;
          min-width: 1.5rem;
          text-align: center;
        }
        
        .cart-item-price {
          font-size: 1rem;
          font-weight: 700;
          color: #111827;
        }
        
        /* Order Summary */
        .order-summary {
          position: sticky;
          top: 6rem;
          height: fit-content;
        }
        
        .summary-card {
          background: white;
          border-radius: 1.5rem;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        .summary-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .summary-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .summary-title-icon {
          color: #0d9488;
        }
        
        .item-count-badge {
          font-size: 0.75rem;
          color: #6b7280;
          background: #f3f4f6;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
        }
        
        .summary-body {
          padding: 1.5rem;
        }
        
        .coupon-section {
          margin-bottom: 1.5rem;
        }
        
        .coupon-input-group {
          display: flex;
          gap: 0.5rem;
        }
        
        .coupon-input {
          flex: 1;
          padding: 0.75rem 1rem;
          background: #f3f4f6;
          border: none;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          color: #111827;
          transition: all 0.2s ease;
        }
        
        .coupon-input:focus {
          outline: none;
          background: white;
          box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.2);
        }
        
        .coupon-btn {
          padding: 0.75rem 1.25rem;
          background: #0d9488;
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .coupon-btn:hover {
          background: #0f766e;
        }
        
        .coupon-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          background: #0d9488;
        }
        
        .coupon-error {
          margin-top: 0.5rem;
          font-size: 0.75rem;
          color: #ef4444;
        }
        
        .coupon-applied {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          background: #ecfdf5;
          border-radius: 0.75rem;
          border: 1px solid #a7f3d0;
        }
        
        .coupon-applied-text {
          font-size: 0.875rem;
          color: #047857;
          font-weight: 500;
        }
        
        .coupon-remove-btn {
          font-size: 0.75rem;
          color: #6b7280;
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: underline;
        }
        
        .coupon-remove-btn:hover {
          color: #374151;
        }
        
        .summary-divider {
          height: 1px;
          background: #f3f4f6;
          margin: 1rem 0;
        }
        
        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
        }
        
        .summary-label {
          font-size: 0.875rem;
          color: #6b7280;
        }
        
        .summary-value {
          font-size: 0.875rem;
          color: #111827;
          font-weight: 500;
        }
        
        .summary-value-free {
          font-size: 0.875rem;
          color: #059669;
          font-weight: 500;
        }
        
        .shipping-hint {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: #ecfdf5;
          border-radius: 0.75rem;
          margin-top: 0.75rem;
        }
        
        .shipping-hint-icon {
          color: #059669;
          flex-shrink: 0;
        }
        
        .shipping-hint-text {
          font-size: 0.75rem;
          color: #374151;
        }
        
        .summary-total {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding-top: 1rem;
          border-top: 1px solid #f3f4f6;
          margin-top: 1rem;
        }
        
        .total-label {
          font-size: 1rem;
          font-weight: 500;
          color: #111827;
        }
        
        .total-value {
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.02em;
        }
        
        .checkout-btn {
          display: block;
          width: 100%;
          padding: 1rem;
          margin-top: 1.5rem;
          background: linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #06b6d4 100%);
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-size: 1rem;
          font-weight: 600;
          text-align: center;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .checkout-btn:hover {
          transform: scale(1.02);
          opacity: 0.95;
        }
        
        .checkout-btn:active {
          transform: scale(1);
        }
        
        /* Trust Badges */
        .trust-badges {
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 1rem;
          background: white;
          border-radius: 1rem;
          margin-top: 1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        .trust-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        
        .trust-badge-icon {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 9999px;
          background: #ecfdf5;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0d9488;
        }
        
        .trust-badge-text {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 500;
        }
        
        .trust-divider {
          width: 1px;
          height: 2.5rem;
          background: #e5e7eb;
        }
        
        /* Empty Cart */
        .empty-cart {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          margin: 0 auto;
        }
        
        .empty-cart-icon {
          width: 5rem;
          height: 5rem;
          border-radius: 9999px;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          color: #9ca3af;
        }
        
        .empty-cart-title {
          font-size: 1.5rem;
          font-weight: 300;
          color: #111827;
          margin-bottom: 0.75rem;
        }
        
        .empty-cart-text {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 2rem;
          line-height: 1.6;
        }
        
        .browse-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          background: linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #06b6d4 100%);
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease;
          text-decoration: none;
        }
        
        .browse-btn:hover {
          transform: scale(1.05);
        }
      `}</style>

      {/* Grain Overlay */}
      <div className="cart-grain-overlay" />

      {/* Header */}
      <nav className="cart-header-nav" style={{ opacity: isLoaded ? 1 : 0 }}>
        <Link href="/">
          <a style={{ display: "flex", alignItems: "center" }}>
            <img
              src="/logo.png"
              alt="Glindent Logo"
              style={{ height: "36px", width: "auto" }}
            />
          </a>
        </Link>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.5rem 1rem",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "9999px",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}>
          <ShieldIcon />
          <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "white" }}>Secure Checkout</span>
        </div>
      </nav>

      {/* Content */}
      <div className="cart-content">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link href="/">
            <a className="back-link">
              <ArrowLeftIcon />
              Continue Shopping
            </a>
          </Link>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="cart-title"
        >
          Shopping Cart
        </motion.h1>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="empty-cart"
          >
            <div className="empty-cart-icon">
              <ShoppingBagIcon />
            </div>
            <h2 className="empty-cart-title">Your cart is empty</h2>
            <p className="empty-cart-text">
              Looks like you haven't added any products yet. Browse our collection of premium dental supplies.
            </p>
            <Link href="/">
              <a className="browse-btn">
                Browse Products
              </a>
            </Link>
          </motion.div>
        ) : (
          <div className="cart-grid">
            {/* Cart Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="cart-items-container"
            >
              <AnimatePresence exitBeforeEnter>
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onRemove={() => handleRemoveItem(item)}
                    onUpdateQuantity={(quantity) => handleUpdateQuantity(item, quantity)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="order-summary"
            >
              <div className="summary-card">
                <div className="summary-header">
                  <h2 className="summary-title">
                    <span className="summary-title-icon"><PackageIcon /></span>
                    Order Summary
                  </h2>
                  <span className="item-count-badge">{itemCount} items</span>
                </div>

                <div className="summary-body">
                  {/* Coupon Section */}
                  <div className="coupon-section">
                    {cart?.couponCode ? (
                      <div className="coupon-applied">
                        <span className="coupon-applied-text">
                          Coupon: {cart.couponCode}
                        </span>
                        <button onClick={handleRemoveCoupon} className="coupon-remove-btn">
                          Remove
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="coupon-input-group">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="Coupon code"
                            className="coupon-input"
                          />
                          <button
                            onClick={handleApplyCoupon}
                            disabled={isApplyingCoupon || !couponCode.trim()}
                            className="coupon-btn"
                          >
                            {isApplyingCoupon ? "..." : "Apply"}
                          </button>
                        </div>
                        {couponError && (
                          <p className="coupon-error">{couponError}</p>
                        )}
                      </>
                    )}
                  </div>

                  <div className="summary-divider" />

                  {/* Subtotal */}
                  <div className="summary-row">
                    <span className="summary-label">Subtotal</span>
                    <span className="summary-value">{formattedTotal}</span>
                  </div>

                  {/* Shipping */}
                  <div className="summary-row">
                    <span className="summary-label" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <TruckIcon />
                      Shipping
                    </span>
                    <span className={shippingCost === 0 ? "summary-value-free" : "summary-value"}>
                      {shippingCost === 0 ? "Free" : `£${shippingCost.toFixed(2)}`}
                    </span>
                  </div>

                  {/* Shipping Hint */}
                  {totalPrice < shippingThreshold && (
                    <div className="shipping-hint">
                      <span className="shipping-hint-icon"><TruckIcon /></span>
                      <span className="shipping-hint-text">
                        Add £{(shippingThreshold - totalPrice).toFixed(2)} more for free shipping
                      </span>
                    </div>
                  )}

                  {/* Total */}
                  <div className="summary-total">
                    <span className="total-label">Total</span>
                    <span className="total-value">£{grandTotal.toFixed(2)}</span>
                  </div>

                  {/* Checkout Button */}
                  <Link href="/checkout">
                    <a className="checkout-btn">
                      Proceed to Checkout
                    </a>
                  </Link>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="trust-badges">
                <div className="trust-badge">
                  <div className="trust-badge-icon">
                    <ShieldIcon />
                  </div>
                  <span className="trust-badge-text">Secure</span>
                </div>
                <div className="trust-divider" />
                <div className="trust-badge">
                  <div className="trust-badge-icon">
                    <TruckIcon />
                  </div>
                  <span className="trust-badge-text">Fast Delivery</span>
                </div>
                <div className="trust-divider" />
                <div className="trust-badge">
                  <div className="trust-badge-icon">
                    <PackageIcon />
                  </div>
                  <span className="trust-badge-text">Quality</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </main>
  );
};

export default observer(CartPage);
