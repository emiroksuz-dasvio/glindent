import { observer } from "mobx-react-lite";
import { useStore } from "@ikas/storefront";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigation } from "../horizontal-layout";

// GlindentLogo Component (inline SVG as in original)
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

const Header: React.FC = () => {
  const store = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Use navigation context for horizontal slider
  const { currentSection, scrollToSection: navigateToSection } = useNavigation();

  const cartQuantity = store.cartStore.cart?.itemQuantity ?? 0;

  useEffect(() => {
    setIsLoaded(true);
    setMounted(true);
  }, []);

  // Navigation links with section indices
  // Order based on ikas component rendering: Hero(0), About(1), Contact(2), FAQ(3), Products(4)
  const navLinks = [
    { label: "Home", index: 0 },
    { label: "About Us", index: 1 },
    { label: "Products", index: 4 },
    { label: "FAQ", index: 3 },
    { label: "Contact", index: 2 },
  ];

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
          transition: opacity 0.7s ease;
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
        className="header-nav"
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
          <GlindentLogo className="h-7 sm:h-8 md:h-9 w-auto" />
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
          {navLinks.map((link, index) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(index)}
              className="nav-link-btn"
              style={{
                color: currentSection === index ? "white" : "rgba(255, 255, 255, 0.8)",
              }}
            >
              {link.label}
              <span
                className="underline-indicator"
                style={{
                  width: currentSection === index ? "100%" : "0",
                }}
              />
            </button>
          ))}
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
          <button
            onClick={() => handleNavClick(2)}
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
            }}
          >
            Shop Now
          </button>
          <Link href="/cart">
            <a className="cart-button">
              <ShoppingBagIcon />
              {cartQuantity > 0 && (
                <span className="cart-badge">
                  {cartQuantity > 9 ? "9+" : cartQuantity}
                </span>
              )}
            </a>
          </Link>
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
          <Link href="/cart">
            <a className="cart-button">
              <ShoppingBagIcon />
              {cartQuantity > 0 && (
                <span className="cart-badge">
                  {cartQuantity > 9 ? "9+" : cartQuantity}
                </span>
              )}
            </a>
          </Link>
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
                  <button
                    onClick={() => handleNavClick(2)}
                    className="shop-now-btn"
                  >
                    Shop Now
                  </button>
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: "0.75rem",
                      color: "rgba(255, 255, 255, 0.4)",
                    }}
                  >
                    Scroll to navigate sections
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
};

Header.displayName = "Header";

export default observer(Header);
