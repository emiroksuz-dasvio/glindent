import React, { useRef, useEffect, useState, createContext, useContext, ReactNode, useCallback } from "react";
import { motion, useMotionValue, useSpring, animate } from "framer-motion";

// Context for sharing navigation state
interface NavigationContextType {
  currentSection: number;
  scrollToSection: (index: number) => void;
  totalSections: number;
  isInsideProvider: boolean; // Flag to indicate we're inside the provider
}

const NavigationContext = createContext<NavigationContextType>({
  currentSection: 0,
  scrollToSection: () => {},
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
  return {
    currentSection: localSection,
    scrollToSection: (index: number) => {
      if (globalScrollToSection) {
        globalScrollToSection(index);
      } else {
        // Dispatch event as last resort
        window.dispatchEvent(new CustomEvent(NAVIGATION_EVENT, { detail: { section: index, action: "scrollTo" } }));
      }
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

  // Listen for navigateToSection event (from header-secondary and other pages)
  useEffect(() => {
    const handleExternalNavigation = (e: CustomEvent) => {
      if (typeof e.detail?.index === "number") {
        scrollToSection(e.detail.index);
      }
    };
    window.addEventListener("navigateToSection" as any, handleExternalNavigation);
    return () => window.removeEventListener("navigateToSection" as any, handleExternalNavigation);
  }, [scrollToSection]);

  // Check sessionStorage for target section on mount (when navigating from other pages)
  useEffect(() => {
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
  }, [scrollToSection, totalSections]);

  // Touch gesture navigation
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchStartX.current - touchEndX;
      const deltaY = touchStartY.current - touchEndY;

      // Horizontal swipe detected
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0 && currentSection < totalSections - 1) {
          scrollToSection(currentSection + 1);
        } else if (deltaX < 0 && currentSection > 0) {
          scrollToSection(currentSection - 1);
        }
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("touchstart", handleTouchStart, { passive: true });
      container.addEventListener("touchend", handleTouchEnd, { passive: true });
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchend", handleTouchEnd);
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
    <NavigationContext.Provider value={{ currentSection, scrollToSection, totalSections, isInsideProvider: true }}>
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
          html,
          body {
            overflow: hidden !important;
            height: 100vh;
            width: 100vw;
            margin: 0;
            padding: 0;
          }

          .horizontal-main {
            position: relative;
            height: 100vh;
            width: 100vw;
            overflow: hidden;
          }

          .horizontal-container {
            position: relative;
            z-index: 10;
            display: flex;
            flex-direction: row !important;
            height: 100vh;
            opacity: 0;
            transition: opacity 0.7s ease;
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
            min-height: 100vh;
          }

          /* Each section should be full viewport width */
          .horizontal-section {
            min-width: 100vw;
            width: 100vw;
            min-height: 100vh;
            height: 100vh;
            flex-shrink: 0;
            overflow: hidden;
          }

          /* Hide scrollbars */
          ::-webkit-scrollbar {
            display: none;
          }
          
          * {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </main>
    </NavigationContext.Provider>
  );
}

// Keep backward compatibility
export const HorizontalLayout = NavigationProvider;
export default NavigationProvider;
