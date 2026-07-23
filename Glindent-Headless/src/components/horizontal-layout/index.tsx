import React, { useRef, useEffect, useState, createContext, useContext, ReactNode, useCallback } from "react";
import { motion, useMotionValue, useSpring, animate } from "framer-motion";

// Stable section ids, rendered as the `id` attribute of each `.horizontal-section`.
// Never navigate by a hardcoded index: the section ORDER is decided in the ikas panel
// and can differ from the local theme.json, which silently breaks index-based links.
export type SectionId = "hero" | "about" | "products" | "faq" | "contact";

export const SECTION_IDS: SectionId[] = ["hero", "about", "products", "faq", "contact"];

/**
 * Maps a human label ("About Us", "Shop Now", "#contact") to a section id, so links
 * authored in the ikas panel land on the right section without carrying an index.
 */
export function matchSectionId(label: string): SectionId | null {
  const text = label.toLowerCase();
  if (/home|anasayfa|ana sayfa|hero/.test(text)) return "hero";
  if (/about|hakk|story/.test(text)) return "about";
  if (/product|shop|store|ürün|urun|catalog/.test(text)) return "products";
  if (/faq|question|sss|help/.test(text)) return "faq";
  if (/contact|touch|reach|ileti/.test(text)) return "contact";
  return null;
}

/**
 * Resolves a section id to its live position among the rendered `.horizontal-section`
 * elements. Returns -1 when the DOM isn't available or the section isn't on the page.
 */
export function getSectionIndexById(id: SectionId | string): number {
  if (typeof document === "undefined") return -1;
  const sections = Array.from(document.querySelectorAll(".horizontal-section"));
  return sections.findIndex((el) => el.id === id);
}

// Context for sharing navigation state
interface NavigationContextType {
  currentSection: number;
  scrollToSection: (index: number) => void;
  scrollToId: (id: SectionId | string) => void;
  totalSections: number;
  isInsideProvider: boolean; // Flag to indicate we're inside the provider
}

const NavigationContext = createContext<NavigationContextType>({
  currentSection: 0,
  scrollToSection: () => {},
  scrollToId: () => {},
  totalSections: 5,
  isInsideProvider: false,
});

// Global navigation state (fallback for when context doesn't work in ikas)
let globalCurrentSection = 0;
let globalScrollToSection: ((index: number) => void) | null = null;

// Custom event for cross-component communication
const NAVIGATION_EVENT = "glindent-navigation";

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  const [localSection, setLocalSection] = useState(globalCurrentSection);

  // Listen for navigation events (fallback)
  useEffect(() => {
    const handleNavigationEvent = (e: CustomEvent) => {
      setLocalSection(e.detail.section);
    };

    window.addEventListener(NAVIGATION_EVENT as any, handleNavigationEvent);
    return () => window.removeEventListener(NAVIGATION_EVENT as any, handleNavigationEvent);
  }, []);

  // If inside provider, use context; otherwise use global fallback
  if (context.isInsideProvider) {
    return context;
  }

  // Fallback: use global state
  const scrollToSection = (index: number) => {
    if (globalScrollToSection) {
      globalScrollToSection(index);
    } else {
      // Dispatch event as last resort
      window.dispatchEvent(new CustomEvent(NAVIGATION_EVENT, { detail: { section: index, action: "scrollTo" } }));
    }
  };

  return {
    currentSection: localSection,
    scrollToSection,
    scrollToId: (id: SectionId | string) => {
      const index = getSectionIndexById(id);
      if (index >= 0) scrollToSection(index);
    },
    totalSections: 5,
    isInsideProvider: false,
  };
};

// Standalone NavigationProvider for use in _app.tsx
interface NavigationProviderProps {
  children: ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const totalSections = 5; // Hero, About, Products, FAQ, Contact

  // Framer Motion values for smooth animations
  const x = useMotionValue(0);
  const springX = useSpring(x, {
    stiffness: 300,
    damping: 30,
    mass: 0.8,
  });

  const isAnimating = useRef(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const scrollToSection = useCallback((index: number) => {
    if (index < 0 || index >= totalSections || isAnimating.current) return;

    isAnimating.current = true;
    setCurrentSection(index);
    globalCurrentSection = index;

    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent(NAVIGATION_EVENT, { detail: { section: index } }));

    const targetX = -index * (typeof window !== "undefined" ? window.innerWidth : 0);

    animate(x, targetX, {
      type: "spring",
      stiffness: 300,
      damping: 30,
      mass: 0.8,
      onComplete: () => {
        isAnimating.current = false;
      },
    });
  }, [x, totalSections]);

  const scrollToId = useCallback((id: SectionId | string) => {
    const index = getSectionIndexById(id);
    if (index >= 0) scrollToSection(index);
  }, [scrollToSection]);

  // Set global reference for fallback navigation
  useEffect(() => {
    globalScrollToSection = scrollToSection;
    return () => {
      globalScrollToSection = null;
    };
  }, [scrollToSection]);

  // Listen for navigation events from other components
  useEffect(() => {
    const handleNavigationRequest = (e: CustomEvent) => {
      if (e.detail.action === "scrollTo" && typeof e.detail.section === "number") {
        scrollToSection(e.detail.section);
      }
    };
    window.addEventListener(NAVIGATION_EVENT as any, handleNavigationRequest);
    return () => window.removeEventListener(NAVIGATION_EVENT as any, handleNavigationRequest);
  }, [scrollToSection]);

  // Listen for navigateToSection event (from header-secondary and other pages).
  // `id` is preferred; `index` stays supported for older callers.
  useEffect(() => {
    const handleExternalNavigation = (e: CustomEvent) => {
      if (typeof e.detail?.id === "string") {
        scrollToId(e.detail.id);
      } else if (typeof e.detail?.index === "number") {
        scrollToSection(e.detail.index);
      }
    };
    window.addEventListener("navigateToSection" as any, handleExternalNavigation);
    return () => window.removeEventListener("navigateToSection" as any, handleExternalNavigation);
  }, [scrollToSection, scrollToId]);

  // Check sessionStorage for target section on mount (when navigating from other pages)
  useEffect(() => {
    const targetSectionId = sessionStorage.getItem('targetSectionId');
    if (targetSectionId) {
      // Small delay to ensure the sections are mounted before resolving their order
      setTimeout(() => {
        scrollToId(targetSectionId);
      }, 100);
      sessionStorage.removeItem('targetSectionId');
      return;
    }

    const targetSection = sessionStorage.getItem('targetSection');
    if (targetSection) {
      const sectionIndex = parseInt(targetSection, 10);
      if (!isNaN(sectionIndex) && sectionIndex >= 0 && sectionIndex < totalSections) {
        // Small delay to ensure layout is ready
        setTimeout(() => {
          scrollToSection(sectionIndex);
        }, 100);
      }
      // Clear after use
      sessionStorage.removeItem('targetSection');
    }
  }, [scrollToSection, scrollToId, totalSections]);

  // Enhanced cross-platform touch gesture navigation
  useEffect(() => {
    // Platform detection
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
    
    let touchStartTime = 0;
    let isSwiping = false;
    let touchMoved = false;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      touchStartTime = Date.now();
      isSwiping = false;
      touchMoved = false;
      
      // iOS Safari specific: prevent default bounce behavior
      if (isIOS && isSafari) {
        e.preventDefault();
      }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartX.current || !touchStartY.current) return;
      
      const touchCurrentX = e.touches[0].clientX;
      const touchCurrentY = e.touches[0].clientY;
      const deltaX = touchStartX.current - touchCurrentX;
      const deltaY = touchStartY.current - touchCurrentY;
      
      touchMoved = true;
      
      // Determine if this is a horizontal swipe with platform-specific thresholds
      const threshold = isIOS ? 8 : isAndroid ? 12 : 10;
      
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
        isSwiping = true;
        e.preventDefault(); // Prevent scrolling when swiping horizontally
        
        // Android specific: additional preventDefault for Samsung Internet
        if (isAndroid) {
          e.stopPropagation();
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartX.current || !touchStartY.current || !touchMoved) {
        touchStartX.current = 0;
        touchStartY.current = 0;
        return;
      }
      
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchStartX.current - touchEndX;
      const deltaY = touchStartY.current - touchEndY;
      const touchDuration = Date.now() - touchStartTime;
      
      // Platform-specific swipe sensitivity
      const minDistance = isIOS ? 30 : isAndroid ? 40 : 50;
      const maxDuration = isIOS ? 800 : isAndroid ? 600 : 500;
      
      // Only process swipe if it was a horizontal gesture with appropriate timing
      if (isSwiping && 
          Math.abs(deltaX) > Math.abs(deltaY) && 
          Math.abs(deltaX) > minDistance && 
          touchDuration < maxDuration) {
        
        if (deltaX > 0 && currentSection < totalSections - 1) {
          scrollToSection(currentSection + 1);
        } else if (deltaX < 0 && currentSection > 0) {
          scrollToSection(currentSection - 1);
        }
      }
      
      // Reset
      touchStartX.current = 0;
      touchStartY.current = 0;
      isSwiping = false;
      touchMoved = false;
    };

    // Enhanced touch event options for better cross-platform support
    const touchOptions = {
      passive: false, // Allow preventDefault
      capture: false
    };
    
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("touchstart", handleTouchStart, { passive: true });
      container.addEventListener("touchmove", handleTouchMove, touchOptions);
      container.addEventListener("touchend", handleTouchEnd, { passive: true });
      
      // iOS Safari specific: handle touchcancel
      if (isIOS) {
        container.addEventListener("touchcancel", handleTouchEnd, { passive: true });
      }
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
        container.removeEventListener("touchend", handleTouchEnd);
        if (isIOS) {
          container.removeEventListener("touchcancel", handleTouchEnd);
        }
      }
    };
  }, [currentSection, scrollToSection]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating.current) return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (currentSection < totalSections - 1) {
          scrollToSection(currentSection + 1);
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (currentSection > 0) {
          scrollToSection(currentSection - 1);
        }
      } else if (e.key === "Home") {
        e.preventDefault();
        scrollToSection(0);
      } else if (e.key === "End") {
        e.preventDefault();
        scrollToSection(totalSections - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSection, scrollToSection]);

  return (
    <NavigationContext.Provider value={{ currentSection, scrollToSection, scrollToId, totalSections, isInsideProvider: true }}>
      <main className="horizontal-main">
        {/* Horizontal Scroll Container */}
        <motion.div
          ref={scrollContainerRef}
          style={{ x: springX }}
          className={`horizontal-container ${isLoaded ? "loaded" : ""}`}
        >
          {children}
        </motion.div>

        <style jsx global>{`
          /* CSS Custom Properties for cross-platform viewport */
          :root {
            --vh: 1vh;
            --safe-area-inset-top: env(safe-area-inset-top, 0px);
            --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
            --safe-area-inset-left: env(safe-area-inset-left, 0px);
            --safe-area-inset-right: env(safe-area-inset-right, 0px);
          }
          
          html,
          body {
            overflow: hidden !important;
            height: 100vh;
            height: calc(var(--vh, 1vh) * 100);
            width: 100vw;
            margin: 0;
            padding: 0;
            /* Cross-platform font smoothing */
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
          }

          .horizontal-main {
            position: relative;
            height: 100vh;
            height: calc(var(--vh, 1vh) * 100);
            width: 100vw;
            overflow: hidden;
            touch-action: pan-x pinch-zoom;
            /* Cross-browser hardware acceleration */
            -webkit-transform: translate3d(0, 0, 0);
            -moz-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
            /* Prevent text selection during swipe */
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }

          .horizontal-container {
            position: relative;
            z-index: 10;
            display: flex;
            flex-direction: row !important;
            height: 100vh;
            height: calc(var(--vh, 1vh) * 100);
            opacity: 0;
            transition: opacity 0.7s ease;
            touch-action: pan-x pinch-zoom;
            /* Cross-browser performance optimization */
            -webkit-transform: translate3d(0, 0, 0);
            -moz-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
            will-change: transform;
          }

          .horizontal-container.loaded {
            opacity: 1;
          }

          /* Target the ikas wrapper and make it a horizontal flex container */
          .horizontal-container > div,
          .horizontal-container > div > div {
            display: flex !important;
            flex-direction: row !important;
            height: 100vh;
            height: calc(var(--vh, 1vh) * 100);
            min-height: 100vh;
            min-height: calc(var(--vh, 1vh) * 100);
          }

          /* Each section should be full viewport width */
          .horizontal-section {
            min-width: 100vw;
            width: 100vw;
            min-height: 100vh;
            min-height: calc(var(--vh, 1vh) * 100);
            height: 100vh;
            height: calc(var(--vh, 1vh) * 100);
            flex-shrink: 0;
            overflow: hidden;
            touch-action: pan-y pinch-zoom;
            /* Performance optimization */
            -webkit-transform: translate3d(0, 0, 0);
            -moz-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
          }

          /* Cross-browser scrollbar hiding */
          ::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
          }
          
          * {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          
          /* Cross-platform mobile improvements */
          @media (max-width: 768px) {
            .horizontal-main,
            .horizontal-container {
              -webkit-overflow-scrolling: touch;
              overscroll-behavior-x: none;
              overscroll-behavior-y: auto;
              /* iOS specific optimizations */
              -webkit-backface-visibility: hidden;
              -moz-backface-visibility: hidden;
              backface-visibility: hidden;
            }
            
            .horizontal-section {
              overflow-y: auto;
              -webkit-overflow-scrolling: touch;
              overscroll-behavior: contain;
              /* Prevent bounce on sections */
              -webkit-transform: translate3d(0, 0, 0);
              -moz-transform: translate3d(0, 0, 0);
              transform: translate3d(0, 0, 0);
            }
            
            /* Prevent zoom on double tap */
            * {
              -webkit-tap-highlight-color: transparent;
              -webkit-touch-callout: none;
            }
          }
          
          /* iOS Safari specific fixes */
          @supports (-webkit-touch-callout: none) {
            html, body {
              height: -webkit-fill-available;
              min-height: -webkit-fill-available;
            }
            
            .horizontal-main,
            .horizontal-container,
            .horizontal-section {
              height: -webkit-fill-available;
              min-height: -webkit-fill-available;
            }
            
            /* Address notch on iPhone X+ */
            .horizontal-main {
              padding-top: var(--safe-area-inset-top);
              padding-bottom: var(--safe-area-inset-bottom);
              padding-left: var(--safe-area-inset-left);
              padding-right: var(--safe-area-inset-right);
            }
          }
          
          /* Android Chrome specific fixes */
          @media screen and (-webkit-min-device-pixel-ratio: 0) {
            .horizontal-main {
              position: fixed;
              overscroll-behavior: none;
            }
            
            /* Samsung Internet specific */
            @media screen and (max-width: 768px) {
              .horizontal-container {
                -webkit-transform: translateZ(0);
                -moz-transform: translateZ(0);
                transform: translateZ(0);
              }
            }
          }
          
          /* Firefox specific optimizations */
          @-moz-document url-prefix() {
            .horizontal-main {
              scrollbar-width: none;
            }
            
            .horizontal-container {
              -moz-transform: translate3d(0, 0, 0);
            }
          }
          
          /* Edge/IE specific */
          @supports (-ms-overflow-style: none) {
            .horizontal-main,
            .horizontal-container {
              -ms-overflow-style: none;
              -ms-scroll-chaining: none;
            }
          }
        `}</style>
      </main>
    </NavigationContext.Provider>
  );
}

// Keep backward compatibility
export const HorizontalLayout = NavigationProvider;
export default NavigationProvider;
