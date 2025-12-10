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

export const useNavigation = () => useContext(NavigationContext);

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

  // Wheel navigation with smooth transitions
  useEffect(() => {
    let wheelTimeout: NodeJS.Timeout | null = null;
    let accumulatedDelta = 0;

    const handleWheel = (e: WheelEvent) => {
      // Don't prevent default for hero section's internal slider
      const target = e.target as HTMLElement;
      const isInsideHeroSlider = target.closest('.hero-swiper') !== null;
      
      if (!isInsideHeroSlider) {
        e.preventDefault();
      } else {
        // Let hero slider handle vertical scroll
        return;
      }

      // Ignore wheel events during animation
      if (isAnimating.current) return;

      // Accumulate scroll delta
      accumulatedDelta += e.deltaY;

      // Clear existing timeout
      if (wheelTimeout) {
        clearTimeout(wheelTimeout);
      }

      // After user stops scrolling for 150ms, decide direction
      wheelTimeout = setTimeout(() => {
        const threshold = 50;

        if (accumulatedDelta > threshold && currentSection < totalSections - 1) {
          scrollToSection(currentSection + 1);
        } else if (accumulatedDelta < -threshold && currentSection > 0) {
          scrollToSection(currentSection - 1);
        }

        accumulatedDelta = 0;
      }, 150);
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
      if (wheelTimeout) {
        clearTimeout(wheelTimeout);
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
