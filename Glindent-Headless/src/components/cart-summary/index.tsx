import { observer } from "mobx-react-lite";
import { useStore } from "@ikas/storefront";
import Link from "next/link";
import { useState, CSSProperties } from "react";

// ========================
// IKAS PROPS INTERFACE
// ========================
interface CartSummaryProps {
  title?: string;
  subtotalLabel?: string;
  shippingLabel?: string;
  freeShippingText?: string;
  totalLabel?: string;
  checkoutButtonText?: string;
  couponPlaceholder?: string;
  applyButtonText?: string;
  freeShippingThreshold?: number;
  shippingCost?: number;
}

// ========================
// SVG ICONS
// ========================
const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
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

const PackageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const TagIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ========================
// STYLES
// ========================
const styles: { [key: string]: CSSProperties } = {
  section: {
    width: "100%",
  },
  card: {
    background: "white",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
    paddingBottom: "16px",
    borderBottom: "1px solid #f3f4f6",
  },
  headerTitle: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#111827",
    margin: 0,
  },
  itemCount: {
    fontSize: "14px",
    color: "#6b7280",
    background: "#f3f4f6",
    padding: "4px 12px",
    borderRadius: "20px",
  },
  freeShipping: {
    background: "#f0fdfa",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "20px",
  },
  freeShippingText: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    color: "#0d9488",
    marginBottom: "10px",
  },
  progressBar: {
    height: "6px",
    background: "#ccfbf1",
    borderRadius: "9999px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #0d9488 0%, #06b6d4 100%)",
    borderRadius: "9999px",
    transition: "width 0.3s ease",
  },
  couponSection: {
    marginBottom: "20px",
    paddingBottom: "20px",
    borderBottom: "1px solid #f3f4f6",
  },
  couponInputGroup: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#f9fafb",
    borderRadius: "12px",
    padding: "8px 12px",
  },
  couponIcon: {
    color: "#9ca3af",
    flexShrink: 0,
  },
  couponInput: {
    flex: 1,
    border: "none",
    background: "transparent",
    fontSize: "14px",
    color: "#111827",
    outline: "none",
    minWidth: 0,
  },
  couponBtn: {
    padding: "8px 16px",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: 600,
    color: "white",
    background: "#0d9488",
    cursor: "pointer",
    transition: "background 0.15s ease",
    flexShrink: 0,
  },
  couponBtnDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  couponError: {
    fontSize: "12px",
    color: "#ef4444",
    margin: "8px 0 0 0",
  },
  appliedCoupon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "12px",
    padding: "10px 12px",
    background: "#f0fdfa",
    borderRadius: "8px",
  },
  appliedCouponText: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#0d9488",
    fontWeight: 500,
  },
  removeCouponBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "24px",
    height: "24px",
    border: "none",
    background: "transparent",
    color: "#6b7280",
    cursor: "pointer",
    borderRadius: "50%",
    transition: "all 0.15s ease",
  },
  summaryLines: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    marginBottom: "16px",
    paddingBottom: "16px",
    borderBottom: "1px solid #f3f4f6",
  },
  summaryLine: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    color: "#6b7280",
  },
  freeShippingBadge: {
    color: "#10b981",
    fontWeight: 600,
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  totalLabel: {
    fontSize: "16px",
    fontWeight: 500,
    color: "#374151",
  },
  totalPrice: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#111827",
    letterSpacing: "-0.02em",
  },
  checkoutBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "56px",
    borderRadius: "14px",
    fontSize: "16px",
    fontWeight: 600,
    color: "white",
    background: "linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #06b6d4 100%)",
    textDecoration: "none",
    transition: "all 0.2s ease",
    marginBottom: "24px",
  },
  trustBadges: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: "20px",
    borderTop: "1px solid #f3f4f6",
  },
  trustBadge: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "6px",
  },
  trustIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#f0fdfa",
    color: "#0d9488",
  },
  trustLabel: {
    fontSize: "11px",
    fontWeight: 600,
    color: "#6b7280",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  },
  trustDivider: {
    width: "1px",
    height: "40px",
    background: "#e5e7eb",
  },
};

// ========================
// MAIN COMPONENT
// ========================
const CartSummary: React.FC<CartSummaryProps> = (props) => {
  const {
    title = "Order Summary",
    subtotalLabel = "Subtotal",
    shippingLabel = "Shipping",
    freeShippingText = "FREE",
    totalLabel = "Total",
    checkoutButtonText = "Proceed to Checkout",
    couponPlaceholder = "Enter coupon code",
    applyButtonText = "Apply",
    freeShippingThreshold = 100,
    shippingCost = 5.99
  } = props;

  const store = useStore();
  const cart = store.cartStore.cart;
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [isCheckoutHovered, setIsCheckoutHovered] = useState(false);

  const items = cart?.orderLineItems || [];
  const itemCount = cart?.itemQuantity || 0;
  const totalPrice = cart?.totalFinalPrice || 0;
  const formattedSubtotal = cart?.formattedTotalFinalPrice || "£0.00";
  const checkoutUrl = store.cartStore.checkoutUrl || "/checkout";
  
  // Calculate shipping
  const isFreeShipping = totalPrice >= freeShippingThreshold;
  const actualShipping = isFreeShipping ? 0 : shippingCost;
  const grandTotal = totalPrice + actualShipping;
  const progressToFreeShipping = Math.min((totalPrice / freeShippingThreshold) * 100, 100);
  const amountToFreeShipping = freeShippingThreshold - totalPrice;

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

  // Don't render if cart is empty
  if (items.length === 0) {
    return null;
  }

  return (
    <section style={styles.section}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.headerTitle}>{title}</h2>
          <span style={styles.itemCount}>{itemCount} items</span>
        </div>

        {/* Free Shipping Progress */}
        {!isFreeShipping && (
          <div style={styles.freeShipping}>
            <div style={styles.freeShippingText}>
              <TruckIcon />
              <span>Add £{amountToFreeShipping.toFixed(2)} more for free shipping</span>
            </div>
            <div style={styles.progressBar}>
              <div 
                style={{
                  ...styles.progressFill,
                  width: `${progressToFreeShipping}%`
                }}
              />
            </div>
          </div>
        )}

        {/* Coupon Code */}
        <div style={styles.couponSection}>
          <div style={styles.couponInputGroup}>
            <span style={styles.couponIcon}><TagIcon /></span>
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder={couponPlaceholder}
              style={styles.couponInput}
            />
            <button
              onClick={handleApplyCoupon}
              disabled={isApplyingCoupon || !couponCode.trim()}
              style={{
                ...styles.couponBtn,
                ...(isApplyingCoupon || !couponCode.trim() ? styles.couponBtnDisabled : {}),
              }}
            >
              {isApplyingCoupon ? "..." : applyButtonText}
            </button>
          </div>
          {couponError && <p style={styles.couponError}>{couponError}</p>}
          
          {/* Applied Coupon */}
          {cart?.couponCode && (
            <div style={styles.appliedCoupon}>
              <span style={styles.appliedCouponText}>
                <TagIcon /> {cart.couponCode}
              </span>
              <button onClick={handleRemoveCoupon} style={styles.removeCouponBtn}>
                <XIcon />
              </button>
            </div>
          )}
        </div>

        {/* Summary Lines */}
        <div style={styles.summaryLines}>
          <div style={styles.summaryLine}>
            <span>{subtotalLabel}</span>
            <span>{formattedSubtotal}</span>
          </div>
          <div style={styles.summaryLine}>
            <span>{shippingLabel}</span>
            <span style={isFreeShipping ? styles.freeShippingBadge : {}}>
              {isFreeShipping ? freeShippingText : `£${actualShipping.toFixed(2)}`}
            </span>
          </div>
        </div>

        {/* Total */}
        <div style={styles.totalRow}>
          <span style={styles.totalLabel}>{totalLabel}</span>
          <span style={styles.totalPrice}>£{grandTotal.toFixed(2)}</span>
        </div>

        {/* Checkout Button */}
        <a 
          href={checkoutUrl}
          style={{
            ...styles.checkoutBtn,
            ...(isCheckoutHovered ? { transform: "translateY(-2px)", boxShadow: "0 8px 24px rgba(13, 148, 136, 0.35)" } : {}),
          }}
          onMouseEnter={() => setIsCheckoutHovered(true)}
          onMouseLeave={() => setIsCheckoutHovered(false)}
        >
          {checkoutButtonText}
        </a>

        {/* Trust Badges */}
        <div style={styles.trustBadges}>
          <div style={styles.trustBadge}>
            <div style={styles.trustIcon}>
              <ShieldIcon />
            </div>
            <span style={styles.trustLabel}>Secure</span>
          </div>
          <div style={styles.trustDivider} />
          <div style={styles.trustBadge}>
            <div style={styles.trustIcon}>
              <TruckIcon />
            </div>
            <span style={styles.trustLabel}>Fast Delivery</span>
          </div>
          <div style={styles.trustDivider} />
          <div style={styles.trustBadge}>
            <div style={styles.trustIcon}>
              <PackageIcon />
            </div>
            <span style={styles.trustLabel}>Quality</span>
          </div>
        </div>
      </div>
    </section>
  );
};

CartSummary.displayName = "CartSummary";

export default observer(CartSummary);
