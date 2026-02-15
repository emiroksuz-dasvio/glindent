import { observer } from "mobx-react-lite";
import { useStore } from "@ikas/storefront";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

// ========================
// GLINDENT LOGO - Same as main header
// ========================
const GlindentLogo = ({ className = "" }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 280 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ height: '40px', width: 'auto' }}
    >
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
      <g transform="translate(168, 28)">
        <line x1="0" y1="-12" x2="0" y2="12" stroke="white" strokeWidth="2" />
        <line x1="-12" y1="0" x2="12" y2="0" stroke="white" strokeWidth="2" />
        <circle cx="0" cy="0" r="2" fill="white" />
      </g>
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
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

// X Icon
const XIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ========================
// NAV LINKS - Same sections as main header
// ========================
const navLinks = [
  { label: "Home", hash: "#home", index: 0 },
  { label: "About Us", hash: "#about", index: 1 },
  { label: "Products", hash: "#products", index: 2 },
  { label: "FAQ", hash: "#faq", index: 3 },
  { label: "Contact", hash: "#contact", index: 4 },
];

// ========================
// HEADER SECONDARY COMPONENT
// ========================
const HeaderSecondary = observer(() => {
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

  useEffect(() => {
    setIsLoaded(true);
    setMounted(true);

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Navigate to home page with hash for section
  // Maps hash to section index for horizontal scroll on homepage
  const sectionIndexMap: Record<string, number> = {
    '#home': 0,
    '#about': 1,
    '#products': 2,
    '#faq': 3,
    '#contact': 4,
  };

  const handleNavClick = (hash: string) => {
    setMobileMenuOpen(false);
    
    const sectionIndex = sectionIndexMap[hash] ?? 0;
    
    // If we're already on homepage, try to scroll to section
    if (router.pathname === '/') {
      // Dispatch custom event for horizontal layout to handle
      window.dispatchEvent(new CustomEvent('navigateToSection', { 
        detail: { index: sectionIndex } 
      }));
    } else {
      // Navigate to homepage with section index stored
      // Store the target section in sessionStorage so homepage can read it
      sessionStorage.setItem('targetSection', sectionIndex.toString());
      router.push('/');
    }
  };

  const headerContent = (
    <>
      <style jsx global>{`
        .header-secondary-nav {
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
        .header-secondary-nav.scrolled {
          background: rgba(13, 148, 136, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        @media (min-width: 640px) {
          .header-secondary-nav {
            padding: 1.25rem 2rem;
          }
        }
        @media (min-width: 768px) {
          .header-secondary-nav {
            padding: 1.5rem 4rem;
          }
        }
        
        .nav-link-btn-secondary {
          position: relative;
          font-size: 0.875rem;
          font-weight: 500;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          color: rgba(255, 255, 255, 0.8);
          transition: color 0.2s ease;
        }
        .nav-link-btn-secondary:hover {
          color: white;
        }
        
        .mobile-menu-btn-secondary {
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
        
        .mobile-panel-secondary {
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
        
        .mobile-nav-link-secondary {
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
          color: rgba(255, 255, 255, 0.8);
        }
        .mobile-nav-link-secondary:hover {
          color: white;
          background: rgba(255, 255, 255, 0.1);
        }

        @media (min-width: 1024px) {
          .desktop-nav-secondary {
            display: flex !important;
          }
          .desktop-right-secondary {
            display: flex !important;
          }
          .mobile-right-secondary {
            display: none !important;
          }
        }
        @media (max-width: 1023px) {
          .mobile-overlay-secondary {
            display: block;
          }
        }
        @media (min-width: 1024px) {
          .mobile-overlay-secondary {
            display: none !important;
          }
        }
      `}</style>

      <nav
        className={`header-secondary-nav ${isScrolled ? 'scrolled' : ''}`}
        style={{ 
          opacity: isLoaded ? 1 : 0,
        }}
      >
        {/* Logo */}
        <Link href="/">
          <a
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              minHeight: "2.75rem",
              transition: "transform 0.2s ease",
            }}
          >
            <img
              src="/logo.png"
              alt="Glindent Logo"
              style={{ height: "28px", width: "auto" }}
            />
          </a>
        </Link>

        {/* Desktop Navigation */}
        <div
          style={{
            display: "none",
            alignItems: "center",
            gap: "1.5rem",
          }}
          className="desktop-nav-secondary"
        >
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.hash)}
              className="nav-link-btn-secondary"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Desktop Right Side */}
        <div
          className="desktop-right-secondary"
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
          className="mobile-right-secondary"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="mobile-menu-btn-secondary"
            aria-label="Open menu"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu-secondary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 60,
            }}
            className="mobile-overlay-secondary"
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
              className="mobile-panel-secondary"
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
                  <img
                    src="/logo.png"
                    alt="Glindent Logo"
                    style={{ height: "28px", width: "auto" }}
                  />
                </div>

                {/* Navigation Links */}
                <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {navLinks.map((link, index) => (
                    <button
                      key={link.label}
                      onClick={() => handleNavClick(link.hash)}
                      className="mobile-nav-link-secondary"
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            fontFamily: "monospace",
                            color: "rgba(255,255,255,0.4)",
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

                {/* Bottom section - Auth */}
                <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {isLoggedIn ? (
                    <Link href="/account">
                      <a
                        onClick={() => setMobileMenuOpen(false)}
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "1rem",
                          background: "white",
                          color: "#007A72",
                          borderRadius: "1rem",
                          fontWeight: 600,
                          textAlign: "center",
                          textDecoration: "none",
                          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
                        }}
                      >
                        My Account
                      </a>
                    </Link>
                  ) : (
                    <>
                      <Link href="/account/login">
                        <a
                          onClick={() => setMobileMenuOpen(false)}
                          style={{
                            display: "block",
                            width: "100%",
                            padding: "1rem",
                            background: "white",
                            color: "#007A72",
                            borderRadius: "1rem",
                            fontWeight: 600,
                            textAlign: "center",
                            textDecoration: "none",
                            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
                          }}
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
                    {isLoggedIn ? `Welcome, ${customer?.firstName || "User"}` : "Join Glindent today"}
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
    </>
  );

  // Use portal to render header
  if (mounted && typeof document !== "undefined") {
    return createPortal(headerContent, document.body);
  }
  
  return headerContent;
});

HeaderSecondary.displayName = "HeaderSecondary";

export default HeaderSecondary;
