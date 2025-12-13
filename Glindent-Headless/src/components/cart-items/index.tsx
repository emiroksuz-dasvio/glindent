import { observer } from "mobx-react-lite";
import { useStore, IkasOrderLineItem, IkasImage } from "@ikas/storefront";
import Link from "next/link";
import Image from "next/image";
import { useState, CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ========================
// IKAS PROPS INTERFACE
// ========================
interface CartItemsProps {
  title?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  continueShoppingText?: string;
  logo?: IkasImage;
}

// ========================
// SVG ICONS
// ========================
const MinusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

// ========================
// STYLES
// ========================
const styles: { [key: string]: CSSProperties } = {
  section: {
    width: "100%",
  },
  emptySection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    gridColumn: "1 / -1",
  },
  emptyCard: {
    background: "white",
    borderRadius: "24px",
    padding: "48px 32px",
    maxWidth: "380px",
    textAlign: "center" as const,
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  },
  emptyIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "96px",
    height: "96px",
    margin: "0 auto 24px",
    borderRadius: "50%",
    background: "#f3f4f6",
    color: "#9ca3af",
  },
  emptyTitle: {
    fontSize: "24px",
    fontWeight: 300,
    color: "#111827",
    margin: "0 0 12px 0",
  },
  emptyDesc: {
    fontSize: "15px",
    color: "#6b7280",
    lineHeight: 1.6,
    margin: "0 0 32px 0",
  },
  browseBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "14px 32px",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: 600,
    color: "white",
    background: "linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #06b6d4 100%)",
    textDecoration: "none",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  backLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "14px",
    fontWeight: 500,
    textDecoration: "none",
    marginBottom: "24px",
  },
  header: {
    display: "flex",
    alignItems: "baseline",
    gap: "12px",
    marginBottom: "24px",
  },
  title: {
    fontSize: "32px",
    fontWeight: 300,
    color: "white",
    margin: 0,
    letterSpacing: "-0.02em",
  },
  itemCount: {
    fontSize: "14px",
    color: "rgba(255, 255, 255, 0.7)",
    background: "rgba(255, 255, 255, 0.15)",
    padding: "6px 14px",
    borderRadius: "20px",
  },
  list: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  },
  item: {
    display: "flex",
    gap: "16px",
    padding: "20px",
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
  },
  itemImage: {
    position: "relative" as const,
    width: "100px",
    height: "100px",
    borderRadius: "12px",
    overflow: "hidden",
    flexShrink: 0,
    background: "#f9fafb",
  },
  itemDetails: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between",
    minWidth: 0,
  },
  itemName: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#111827",
    margin: "0 0 4px 0",
    lineHeight: 1.3,
  },
  itemOptions: {
    fontSize: "13px",
    color: "#6b7280",
    margin: 0,
  },
  itemBottom: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "12px",
  },
  itemActions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  quantitySelector: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    background: "#f3f4f6",
    borderRadius: "10px",
    padding: "4px",
  },
  quantityBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    border: "none",
    background: "transparent",
    color: "#6b7280",
    cursor: "pointer",
    borderRadius: "8px",
    transition: "all 0.15s ease",
  },
  quantityBtnHover: {
    background: "white",
    color: "#111827",
  },
  quantityBtnDisabled: {
    opacity: 0.4,
    cursor: "not-allowed",
  },
  quantityValue: {
    minWidth: "32px",
    textAlign: "center" as const,
    fontSize: "15px",
    fontWeight: 600,
    color: "#111827",
  },
  removeBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    border: "none",
    background: "transparent",
    color: "#9ca3af",
    cursor: "pointer",
    borderRadius: "10px",
    transition: "all 0.15s ease",
  },
  removeBtnHover: {
    background: "#fef2f2",
    color: "#ef4444",
  },
  itemPrice: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#111827",
  },
};

// ========================
// CART ITEM COMPONENT
// ========================
const CartItem = observer(({ 
  item, 
  onRemove, 
  onUpdateQuantity 
}: { 
  item: IkasOrderLineItem; 
  onRemove: (item: IkasOrderLineItem) => void;
  onUpdateQuantity: (item: IkasOrderLineItem, quantity: number) => void;
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoveHovered, setIsRemoveHovered] = useState(false);
  const [isMinusHovered, setIsMinusHovered] = useState(false);
  const [isPlusHovered, setIsPlusHovered] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || isUpdating) return;
    setIsUpdating(true);
    await onUpdateQuantity(item, newQuantity);
    setIsUpdating(false);
  };

  const imageSrc = item.variant?.mainImage?.src || "/placeholder.svg";
  const productName = item.variant?.name || "Product";
  const options = item.options?.map(opt => `${opt.name}: ${opt.values?.join(", ")}`).join(", ") || "";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      style={styles.item}
    >
      <div style={styles.itemImage}>
        <Image
          src={imageSrc}
          alt={productName}
          layout="fill"
          objectFit="cover"
          unoptimized
        />
      </div>
      <div style={styles.itemDetails}>
        <div>
          <h3 style={styles.itemName}>{productName}</h3>
          {options && <p style={styles.itemOptions}>{options}</p>}
        </div>
        <div style={styles.itemBottom}>
          <div style={styles.itemActions}>
            <div style={styles.quantitySelector}>
              <button 
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={isUpdating || item.quantity <= 1}
                onMouseEnter={() => setIsMinusHovered(true)}
                onMouseLeave={() => setIsMinusHovered(false)}
                style={{
                  ...styles.quantityBtn,
                  ...(isMinusHovered && !isUpdating && item.quantity > 1 ? styles.quantityBtnHover : {}),
                  ...(isUpdating || item.quantity <= 1 ? styles.quantityBtnDisabled : {}),
                }}
              >
                <MinusIcon />
              </button>
              <span style={styles.quantityValue}>{item.quantity}</span>
              <button 
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={isUpdating}
                onMouseEnter={() => setIsPlusHovered(true)}
                onMouseLeave={() => setIsPlusHovered(false)}
                style={{
                  ...styles.quantityBtn,
                  ...(isPlusHovered && !isUpdating ? styles.quantityBtnHover : {}),
                  ...(isUpdating ? styles.quantityBtnDisabled : {}),
                }}
              >
                <PlusIcon />
              </button>
            </div>
            <button 
              onClick={() => onRemove(item)}
              onMouseEnter={() => setIsRemoveHovered(true)}
              onMouseLeave={() => setIsRemoveHovered(false)}
              style={{
                ...styles.removeBtn,
                ...(isRemoveHovered ? styles.removeBtnHover : {}),
              }}
            >
              <TrashIcon />
            </button>
          </div>
          <div style={styles.itemPrice}>
            {item.formattedFinalPriceWithQuantity || item.formattedPriceWithQuantity}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// ========================
// MAIN COMPONENT
// ========================
const CartItems: React.FC<CartItemsProps> = (props) => {
  const {
    title = "Shopping Cart",
    emptyTitle = "Your cart is empty",
    emptyDescription = "Looks like you haven't added any products yet. Browse our collection of premium dental supplies.",
    continueShoppingText = "Continue Shopping"
  } = props;

  const store = useStore();
  const cart = store.cartStore.cart;
  const items = cart?.orderLineItems || [];
  const itemCount = cart?.itemQuantity || 0;

  const handleRemoveItem = async (item: IkasOrderLineItem) => {
    await store.cartStore.removeItem(item);
  };

  const handleUpdateQuantity = async (item: IkasOrderLineItem, quantity: number) => {
    await store.cartStore.changeItemQuantity(item, quantity);
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <section style={styles.emptySection}>
        <div style={styles.emptyCard}>
          <div style={styles.emptyIcon}>
            <ShoppingBagIcon />
          </div>
          <h2 style={styles.emptyTitle}>{emptyTitle}</h2>
          <p style={styles.emptyDesc}>{emptyDescription}</p>
          <Link href="/">
            <a style={styles.browseBtn}>{continueShoppingText}</a>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section style={styles.section}>
      {/* Back Link */}
      <Link href="/">
        <a style={styles.backLink}>
          <ArrowLeftIcon />
          <span>{continueShoppingText}</span>
        </a>
      </Link>

      {/* Title */}
      <div style={styles.header}>
        <h1 style={styles.title}>{title}</h1>
        <span style={styles.itemCount}>{itemCount} items</span>
      </div>

      {/* Items List */}
      <div style={styles.list}>
        <AnimatePresence>
          {items.map((item: IkasOrderLineItem) => (
            <CartItem
              key={item.id}
              item={item}
              onRemove={handleRemoveItem}
              onUpdateQuantity={handleUpdateQuantity}
            />
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

CartItems.displayName = "CartItems";

export default observer(CartItems);
