import { observer } from "mobx-react-lite";
import { useStore, IkasImage, IkasNavigationLink } from "@ikas/storefront";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigation } from "../horizontal-layout";
import { useRouter } from "next/router";

// ========================
// IKAS PROPS INTERFACE
// ========================
interface HeaderProps {
  logo?: IkasImage;
  navigationLinks?: IkasNavigationLink[];
}

// GlindentLogo Component - SVG matching original design, all white
const GlindentLogo = ({ className = "" }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 280 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ height: '40px', width: 'auto' }}
    >
      {/* "glindent" - bold italic style */}
      <text
        x="5"
        y="52"
        fill="white"
        fontFamily="'Poppins', 'Arial Black', sans-serif"
        fontSize="52"
        fontWeight="900"
        fontStyle="italic"
        letterSpacing="-2px"
      >
        glindent
      </text>
      
      {/* Sparkle/Star on the dot of 'e' - 4-pointed star */}
      <g transform="translate(168, 28)">
        {/* Vertical line */}
        <line x1="0" y1="-12" x2="0" y2="12" stroke="white" strokeWidth="2" />
        {/* Horizontal line */}
        <line x1="-12" y1="0" x2="12" y2="0" stroke="white" strokeWidth="2" />
        {/* Center glow */}
        <circle cx="0" cy="0" r="2" fill="white" />
      </g>
      
      {/* "WAY TO DENTISTRY" subtitle */}
      <text
        x="138"
        y="72"
        fill="rgba(255,255,255,0.8)"
        fontFamily="'Poppins', Arial, sans-serif"
        fontSize="11"
        fontWeight="400"
        letterSpacing="3px"
      >
        WAY TO DENTISTRY
      </text>
    </svg>
  );
};

// Menu Icon
const MenuIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

// X Icon
const XIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ShoppingBag Icon
const ShoppingBagIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

// Trash Icon
const TrashIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

// Plus Icon
const PlusIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// Minus Icon
const MinusIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// ========================
// CART DROPDOWN COMPONENT
// ========================
const CartDropdown = observer(() => {
  const store = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const cart = store.cartStore.cart;
  const items = cart?.orderLineItems || [];
  const totalItems = cart?.itemQuantity || 0;
  const totalPrice = cart?.formattedTotalFinalPrice || "£0.00";

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleUpdateQuantity = useCallback(async (item: any, newQuantity: number) => {
    if (newQuantity <= 0) {
      setIsUpdating(item.id);
      await store.cartStore.removeItem(item);
      setIsUpdating(null);
    } else {
      setIsUpdating(item.id);
      await store.cartStore.changeItemQuantity(item, newQuantity);
      setIsUpdating(null);
    }
  }, [store.cartStore]);

  const handleRemoveItem = useCallback(async (item: any) => {
    setIsUpdating(item.id);
    await store.cartStore.removeItem(item);
    setIsUpdating(null);
  }, [store.cartStore]);

  return (
    <div className="cart-dropdown-wrapper" ref={menuRef}>
      {/* Cart Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cart-button"
        aria-label="Open cart"
        aria-expanded={isOpen}
      >
        <ShoppingBagIcon />
        {totalItems > 0 && (
          <span className="cart-badge">
            {totalItems > 9 ? "9+" : totalItems}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="cart-dropdown"
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            {/* Header */}
            <div className="cart-dropdown-header">
              <div className="cart-dropdown-title">
                <ShoppingBagIcon className="cart-title-icon" />
                <span>Your Cart</span>
                <span className="cart-count">({items.length} items)</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="cart-close-btn">
                <XIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Items */}
            <div className="cart-dropdown-items">
              {items.length === 0 ? (
                <div className="cart-empty">
                  <ShoppingBagIcon className="cart-empty-icon" />
                  <p className="cart-empty-title">Your cart is empty</p>
                  <p className="cart-empty-subtitle">Add items from the products section</p>
                </div>
              ) : (
                <div className="cart-items-list">
                  {items.map((item: any) => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-image">
                        <Image
                          src={item.variant?.mainImage?.src || "/placeholder.svg"}
                          alt={item.variant?.name || "Product"}
                          layout="fill"
                          objectFit="cover"
                          unoptimized
                        />
                      </div>
                      <div className="cart-item-details">
                        <div className="cart-item-top">
                          <h3 className="cart-item-name">{item.variant?.name || "Product"}</h3>
                          <button
                            onClick={() => handleRemoveItem(item)}
                            disabled={isUpdating === item.id}
                            className="cart-item-remove"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                        {item.options && item.options.length > 0 && (
                          <p className="cart-item-variant">
                            {item.options.map((opt: any) => opt.values?.map((v: any) => v.name).join(", ")).join(", ")}
                          </p>
                        )}
                        <div className="cart-item-bottom">
                          <p className="cart-item-price">
                            {item.formattedFinalPriceWithQuantity || item.formattedPriceWithQuantity}
                          </p>
                          <div className="cart-item-quantity">
                            <button
                              onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                              disabled={isUpdating === item.id}
                              className="quantity-btn"
                            >
                              <MinusIcon />
                            </button>
                            <span className="quantity-value">
                              {isUpdating === item.id ? "..." : item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                              disabled={isUpdating === item.id}
                              className="quantity-btn"
                            >
                              <PlusIcon />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="cart-dropdown-footer">
                <div className="cart-subtotal">
                  <span>Subtotal</span>
                  <span className="cart-total-price">{totalPrice}</span>
                </div>
                <a 
                  href={store.cartStore.checkoutUrl || "/checkout"} 
                  className="cart-checkout-btn" 
                  onClick={() => setIsOpen(false)}
                >
                  Checkout
                </a>
                <Link href="/cart">
                  <a className="cart-view-btn" onClick={() => setIsOpen(false)}>
                    View Cart
                  </a>
                </Link>
                <button
                  onClick={async () => {
                    for (const item of items) {
                      await store.cartStore.removeItem(item);
                    }
                  }}
                  className="cart-clear-btn"
                >
                  Clear cart
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Dropdown Styles */}
      <style jsx global>{`
        .cart-dropdown-wrapper {
          position: relative;
        }

        .cart-dropdown {
          position: absolute;
          right: 0;
          top: calc(100% + 0.5rem);
          width: 20rem;
          border-radius: 1rem;
          background: white;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          overflow: hidden;
          z-index: 100;
        }
        @media (min-width: 640px) {
          .cart-dropdown {
            width: 24rem;
          }
        }

        .cart-dropdown-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          border-bottom: 1px solid #f3f4f6;
        }

        .cart-dropdown-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .cart-title-icon {
          width: 1rem;
          height: 1rem;
          color: #111827;
        }

        .cart-dropdown-title span {
          font-size: 0.875rem;
          font-weight: 500;
          color: #111827;
        }

        .cart-count {
          color: #6b7280 !important;
          font-weight: 400 !important;
        }

        .cart-close-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1.75rem;
          height: 1.75rem;
          border-radius: 9999px;
          border: none;
          background: transparent;
          color: #9ca3af;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .cart-close-btn:hover {
          background: #f3f4f6;
          color: #111827;
        }

        .cart-dropdown-items {
          max-height: 20rem;
          overflow-y: auto;
          padding: 1rem;
          scrollbar-width: thin;
        }

        .cart-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          text-align: center;
        }

        .cart-empty-icon {
          width: 3rem;
          height: 3rem;
          color: #e5e7eb;
          margin-bottom: 0.75rem;
        }

        .cart-empty-title {
          font-size: 0.875rem;
          font-weight: 500;
          color: #111827;
          margin: 0;
        }

        .cart-empty-subtitle {
          font-size: 0.75rem;
          color: #6b7280;
          margin: 0.25rem 0 0 0;
        }

        .cart-items-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .cart-item {
          display: flex;
          gap: 1rem;
          padding: 0.75rem;
          border-radius: 1rem;
          background: white;
          border: 1px solid #f3f4f6;
          transition: all 0.2s ease;
        }
        .cart-item:hover {
          border-color: #e5e7eb;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .cart-item-image {
          position: relative;
          width: 5rem;
          height: 5rem;
          border-radius: 0.75rem;
          overflow: hidden;
          background: #f9fafb;
          flex-shrink: 0;
        }

        .cart-item-details {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 0.125rem 0;
        }

        .cart-item-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .cart-item-name {
          font-size: 0.875rem;
          font-weight: 500;
          color: #111827;
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .cart-item-remove {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          border: none;
          background: transparent;
          color: #d1d5db;
          cursor: pointer;
          transition: color 0.15s ease;
        }
        .cart-item-remove:hover:not(:disabled) {
          color: #ef4444;
        }
        .cart-item-remove:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .cart-item-variant {
          font-size: 0.75rem;
          color: #6b7280;
          margin: 0.125rem 0 0 0;
        }

        .cart-item-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.5rem;
        }

        .cart-item-price {
          font-size: 0.875rem;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }

        .cart-item-quantity {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f9fafb;
          border-radius: 9999px;
          padding: 0.25rem 0.5rem;
          border: 1px solid #f3f4f6;
        }

        .cart-item-quantity .quantity-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.25rem;
          border: none;
          background: transparent;
          color: #9ca3af;
          cursor: pointer;
          transition: color 0.15s ease;
        }
        .cart-item-quantity .quantity-btn:hover:not(:disabled) {
          color: #111827;
        }
        .cart-item-quantity .quantity-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .cart-item-quantity .quantity-value {
          font-size: 0.75rem;
          font-weight: 500;
          color: #111827;
          min-width: 1rem;
          text-align: center;
        }

        .cart-dropdown-footer {
          padding: 1.5rem;
          border-top: 1px solid #f3f4f6;
          background: white;
        }

        .cart-subtotal {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 1.5rem;
        }

        .cart-subtotal span:first-child {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .cart-total-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.025em;
        }

        .cart-checkout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 3rem;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #06b6d4 100%);
          text-decoration: none;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s ease;
        }
        .cart-checkout-btn:hover {
          transform: scale(1.02);
        }
        .cart-checkout-btn:active {
          transform: scale(1);
        }

        .cart-view-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 2.75rem;
          margin-top: 0.5rem;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #6b7280;
          background: #f3f4f6;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .cart-view-btn:hover {
          background: #e5e7eb;
          color: #374151;
        }

        .cart-clear-btn {
          display: block;
          width: 100%;
          margin-top: 0.75rem;
          padding: 0.5rem;
          font-size: 0.75rem;
          color: #9ca3af;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: color 0.15s ease;
        }
        .cart-clear-btn:hover {
          color: #6b7280;
        }
      `}</style>
    </div>
  );
});

const Header: React.FC<HeaderProps> = observer((props) => {
  const { logo, navigationLinks } = props;
  const store = useStore();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Customer authentication state
  const customer = store.customerStore.customer;
  const isLoggedIn = !!customer;
  
  // Use navigation context for horizontal slider
  const { currentSection, scrollToSection: navigateToSection } = useNavigation();

  // Logout handler
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await store.customerStore.logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    setIsLoaded(true);
    setMounted(true);

    // Scroll event listener for mobile background
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Default navigation links (fallback if not provided from IKAS)
  // Order based on ikas component rendering: Hero(0), About(1), Products(2), FAQ(3), Contact(4)
  const defaultNavLinks = [
    { label: "Home", index: 0 },
    { label: "About Us", index: 1 },
    { label: "Products", index: 2 },
    { label: "FAQ", index: 3 },
    { label: "Contact", index: 4 },
  ];

  // Use IKAS navigation links if provided, otherwise use defaults
  const navLinks = navigationLinks && navigationLinks.length > 0
    ? navigationLinks.map((link, index) => ({
        label: link.label || `Link ${index + 1}`,
        href: link.href || "#",
        index,
      }))
    : defaultNavLinks;

  const handleNavClick = (index: number) => {
    navigateToSection(index);
    setMobileMenuOpen(false);
  };

  const headerContent = (
    <>
      <style jsx global>{`
        .header-nav {
          position: fixed;
          left: 0;
          right: 0;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          background: transparent;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          transition: all 0.3s ease;
        }
        .header-nav.scrolled {
          background: rgba(13, 148, 136, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        @media (min-width: 640px) {
          .header-nav {
            padding: 1.25rem 2rem;
          }
        }
        @media (min-width: 768px) {
          .header-nav {
            padding: 1.5rem 4rem;
          }
        }
        
        .nav-link-btn {
          position: relative;
          font-size: 0.875rem;
          font-weight: 500;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: color 0.2s ease;
        }
        
        .nav-link-btn .underline-indicator {
          position: absolute;
          bottom: -4px;
          left: 0;
          height: 2px;
          background: white;
          transition: width 0.3s ease;
        }
        
        .cart-button {
          position: relative;
          display: flex;
          height: 2.5rem;
          width: 2.5rem;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        .cart-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        
        .cart-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          display: flex;
          height: 1.25rem;
          width: 1.25rem;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          background: white;
          font-size: 0.75rem;
          font-weight: 600;
          color: black;
        }
        
        .mobile-menu-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          min-height: 2.75rem;
          min-width: 2.75rem;
          background: none;
          border: none;
          cursor: pointer;
          color: white;
        }
        
        .mobile-panel {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 300px;
          overflow: hidden;
          background: linear-gradient(165deg, #0d9488 0%, #0891b2 50%, #06b6d4 100%);
          border-left: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: -10px 0 40px rgba(0, 0, 0, 0.4);
        }
        
        .mobile-nav-link {
          display: block;
          width: 100%;
          text-align: left;
          padding: 1rem;
          border-radius: 1rem;
          font-size: 1rem;
          font-weight: 500;
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        
        .mobile-nav-link.active {
          color: white;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .mobile-nav-link:not(.active) {
          color: rgba(255, 255, 255, 0.8);
        }
        .mobile-nav-link:not(.active):hover {
          color: white;
          background: rgba(255, 255, 255, 0.1);
        }
        
        .section-indicator {
          height: 0.5rem;
          border-radius: 9999px;
          transition: all 0.2s ease;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        .section-indicator.active {
          width: 2rem;
          background: white;
        }
        .section-indicator:not(.active) {
          width: 0.5rem;
          background: rgba(255, 255, 255, 0.3);
        }
        .section-indicator:not(.active):hover {
          background: rgba(255, 255, 255, 0.5);
        }
        
        .shop-now-btn {
          width: 100%;
          padding: 1rem;
          background: white;
          color: #007A72;
          border-radius: 1rem;
          font-weight: 600;
          text-align: center;
          border: none;
          cursor: pointer;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          transition: transform 0.1s ease;
        }
        .shop-now-btn:active {
          transform: scale(0.98);
        }
      `}</style>

      <nav
        className={`header-nav ${isScrolled ? 'scrolled' : ''}`}
        style={{ opacity: isLoaded ? 1 : 0 }}
      >
        {/* Logo */}
        <button
          onClick={() => handleNavClick(0)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            minHeight: "2.75rem",
            transition: "transform 0.2s ease",
          }}
        >
          {logo?.src ? (
            <Image
              src={logo.src}
              alt="Glindent Logo"
              width={140}
              height={36}
              objectFit="contain"
              unoptimized
            />
          ) : (
            <GlindentLogo className="h-7 sm:h-8 md:h-9 w-auto" />
          )}
        </button>

        {/* Desktop Navigation */}
        <div
          style={{
            display: "none",
            alignItems: "center",
            gap: "1.5rem",
          }}
          className="desktop-nav"
        >
          {navLinks.map((link, index) => {
            const isActive = currentSection === index;
            return (
              <button
                key={link.label}
                onClick={() => handleNavClick(index)}
                className="nav-link-btn"
                style={{
                  color: isActive ? "white" : "rgba(255, 255, 255, 0.8)",
                }}
              >
                {link.label}
                <span
                  className="underline-indicator"
                  style={{
                    width: isActive ? "100%" : "0",
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* Desktop Right Side */}
        <div
          className="desktop-right"
          style={{
            display: "none",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          {isLoggedIn ? (
            <>
              <Link href="/account">
                <a
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "rgba(255, 255, 255, 0.8)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    minHeight: "2.75rem",
                    padding: "0 1rem",
                    transition: "color 0.2s ease",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  My Account
                </a>
              </Link>
              <CartDropdown />
            </>
          ) : (
            <>
              <Link href="/account/login">
                <a
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "rgba(255, 255, 255, 0.8)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    minHeight: "2.75rem",
                    padding: "0 1rem",
                    transition: "color 0.2s ease",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Login
                </a>
              </Link>
              <Link href="/account/register">
                <a
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#0d9488",
                    background: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    minHeight: "2.5rem",
                    padding: "0 1.25rem",
                    transition: "all 0.2s ease",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  Register
                </a>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Right Side */}
        <div
          className="mobile-right"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          {isLoggedIn && <CartDropdown />}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="mobile-menu-btn"
            aria-label="Open menu"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence exitBeforeEnter>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 60,
            }}
            className="mobile-overlay"
          >
            {/* Backdrop */}
            <motion.div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(8px)",
              }}
              onClick={() => setMobileMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Slide-out Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="mobile-panel"
            >
              {/* Glass overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to bottom, rgba(255,255,255,0.1), transparent, rgba(0,0,0,0.2))",
                  pointerEvents: "none",
                }}
              />

              {/* Close button */}
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  position: "absolute",
                  top: "1.25rem",
                  right: "1.25rem",
                  zIndex: 10,
                  padding: "0.75rem",
                  borderRadius: "9999px",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  cursor: "pointer",
                  color: "white",
                  transition: "transform 0.1s ease",
                }}
                aria-label="Close menu"
              >
                <XIcon className="w-5 h-5" />
              </button>

              {/* Menu content */}
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  paddingTop: "5rem",
                  paddingBottom: "2rem",
                  paddingLeft: "1.25rem",
                  paddingRight: "1.25rem",
                  overflowY: "auto",
                }}
              >
                {/* Logo */}
                <div style={{ marginBottom: "2rem", paddingLeft: "0.5rem", opacity: 0.9 }}>
                  <GlindentLogo className="h-7 w-auto" />
                </div>

                {/* Navigation Links */}
                <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {navLinks.map((link, index) => (
                    <button
                      key={link.label}
                      onClick={() => handleNavClick(index)}
                      className={`mobile-nav-link ${currentSection === index ? "active" : ""}`}
                    >
                      {/* Active indicator */}
                      {currentSection === index && (
                        <div
                          style={{
                            position: "absolute",
                            left: 0,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: "4px",
                            height: "1.5rem",
                            background: "white",
                            borderRadius: "9999px",
                          }}
                        />
                      )}
                      <span style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            fontFamily: "monospace",
                            color: currentSection === index ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.4)",
                          }}
                        >
                          0{index + 1}
                        </span>
                        {link.label}
                      </span>
                    </button>
                  ))}
                </nav>

                {/* Divider */}
                <div
                  style={{
                    margin: "1.5rem 0",
                    height: "1px",
                    background: "rgba(255, 255, 255, 0.15)",
                  }}
                />

                {/* Section indicator */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.75rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {[0, 1, 2, 3, 4].map((idx) => (
                      <button
                        key={idx}
                        onClick={() => handleNavClick(idx)}
                        className={`section-indicator ${currentSection === idx ? "active" : ""}`}
                      />
                    ))}
                  </div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontFamily: "monospace",
                      color: "rgba(255, 255, 255, 0.5)",
                    }}
                  >
                    {String(currentSection + 1).padStart(2, "0")}/05
                  </span>
                </div>

                {/* Bottom section */}
                <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {isLoggedIn ? (
                    <Link href="/account">
                      <a
                        onClick={() => setMobileMenuOpen(false)}
                        className="shop-now-btn"
                        style={{ display: "block", textDecoration: "none" }}
                      >
                        My Account
                      </a>
                    </Link>
                  ) : (
                    <>
                      <Link href="/account/login">
                        <a
                          onClick={() => setMobileMenuOpen(false)}
                          className="shop-now-btn"
                          style={{ display: "block", textDecoration: "none" }}
                        >
                          Login
                        </a>
                      </Link>
                      <Link href="/account/register">
                        <a
                          onClick={() => setMobileMenuOpen(false)}
                          style={{
                            display: "block",
                            width: "100%",
                            padding: "1rem",
                            background: "rgba(255, 255, 255, 0.15)",
                            color: "white",
                            borderRadius: "1rem",
                            fontWeight: 600,
                            textAlign: "center",
                            border: "1px solid rgba(255, 255, 255, 0.3)",
                            textDecoration: "none",
                            transition: "all 0.2s ease",
                          }}
                        >
                          Register
                        </a>
                      </Link>
                    </>
                  )}
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: "0.75rem",
                      color: "rgba(255, 255, 255, 0.4)",
                    }}
                  >
                    {isLoggedIn ? `Welcome, ${customer?.firstName || "User"}` : "Scroll to navigate sections"}
                  </p>
                </div>
              </div>

              {/* Decorative glows */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "10rem",
                  height: "10rem",
                  background: "rgba(34, 211, 238, 0.15)",
                  borderRadius: "9999px",
                  filter: "blur(3rem)",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "5rem",
                  left: 0,
                  width: "8rem",
                  height: "8rem",
                  background: "rgba(45, 212, 191, 0.1)",
                  borderRadius: "9999px",
                  filter: "blur(3rem)",
                  pointerEvents: "none",
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Additional styles for responsive desktop nav */}
      <style jsx global>{`
        @media (min-width: 1024px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-right {
            display: flex !important;
          }
          .mobile-right {
            display: none !important;
          }
        }
        @media (max-width: 1023px) {
          .mobile-overlay {
            display: block;
          }
        }
        @media (min-width: 1024px) {
          .mobile-overlay {
            display: none !important;
          }
        }
      `}</style>
    </>
  );

  // Use portal to render header outside of any transform containers
  // This prevents the fixed header from being affected by parent transforms
  if (mounted && typeof document !== "undefined") {
    return createPortal(headerContent, document.body);
  }
  
  // SSR fallback - render normally
  return headerContent;
});

Header.displayName = "Header";

export default Header;
