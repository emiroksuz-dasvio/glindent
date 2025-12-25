import React, { useEffect } from "react";
import { CSSProperties } from "react";

/**
 * DefaultLayout - Standard Vertical Layout
 * 
 * This layout is used for all pages EXCEPT the homepage.
 * It provides a standard vertical scrolling layout with proper spacing.
 * Used for: Cart, Checkout, Product pages, etc.
 */

interface DefaultLayoutProps {
  children: React.ReactNode;
  showBackground?: boolean; // Option to show/hide animated background
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    zIndex: 10,
  },
  content: {
    flex: 1,
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
};

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ 
  children, 
  showBackground = true 
}) => {
  // Reset body styles when DefaultLayout mounts
  useEffect(() => {
    // Enhanced platform detection
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isFirefox = userAgent.includes('Firefox');
    const isEdge = userAgent.includes('Edg');
    
    // Calculate proper viewport height with platform-specific handling
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      
      // iOS Safari specific viewport adjustments
      if (isIOS) {
        const actualVh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--actual-vh', `${actualVh}px`);
      }
    };
    
    setViewportHeight();
    
    // Enhanced event listeners for different platforms
    const events = ['resize', 'orientationchange'];
    if (isIOS) {
      events.push('pageshow', 'pagehide', 'focusin', 'focusout');
    }
    
    events.forEach(event => {
      window.addEventListener(event, setViewportHeight, { passive: true });
    });
    
    // Cross-platform scroll setup
    document.documentElement.style.overflow = "auto";
    document.documentElement.style.overflowX = "hidden";
    document.documentElement.style.height = "auto";
    document.body.style.overflow = "auto";
    document.body.style.overflowX = "hidden";
    document.body.style.height = "auto";
    
    // Platform-specific optimizations
    if (isMobile) {
      const minHeight = isIOS ? 'calc(var(--vh, 1vh) * 100)' : 'calc(var(--vh, 1vh) * 100)';
      document.body.style.minHeight = minHeight;
      document.body.style.touchAction = "pan-y pinch-zoom";
      document.documentElement.style.touchAction = "pan-y pinch-zoom";
      
      // iOS Safari specific
      if (isIOS) {
        (document.documentElement.style as any).webkitTextSizeAdjust = '100%';
        (document.documentElement.style as any).webkitTapHighlightColor = 'transparent';
        (document.body.style as any).webkitOverflowScrolling = 'touch';
      }
      
      // Android specific
      if (isAndroid) {
        (document.body.style as any).overscrollBehavior = 'auto';
        (document.documentElement.style as any).overscrollBehavior = 'auto';
      }
    } else {
      // Desktop optimizations
      document.body.style.minHeight = "100vh";
      
      // Firefox specific
      if (isFirefox) {
        (document.documentElement.style as any).scrollbarWidth = 'thin';
      }
      
      // Safari desktop specific
      if (isSafari && !isMobile) {
        (document.body.style as any).webkitOverflowScrolling = 'auto';
      }
    }
    
    // Cleanup on unmount
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, setViewportHeight);
      });
      
      // Reset all platform-specific styles
      const elementsToReset = [document.documentElement, document.body];
      const propertiesToReset = [
        'overflow', 'overflowX', 'height', 'minHeight', 'touchAction',
        'webkitTextSizeAdjust', 'webkitTapHighlightColor', 'webkitOverflowScrolling',
        'overscrollBehavior', 'scrollbarWidth'
      ];
      
      elementsToReset.forEach(element => {
        propertiesToReset.forEach(property => {
          (element.style as any)[property] = "";
        });
      });
    };
  }, []);

  return (
    <>
      <div style={styles.container} className="default-layout">
        <div style={styles.content} className="default-layout-content">
          {children}
        </div>
      </div>

      <style jsx global>{`
        /* CSS Custom Properties for cross-platform viewport */
        :root {
          --vh: 1vh;
          --actual-vh: 1vh;
          --safe-area-inset-top: env(safe-area-inset-top, 0px);
          --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
        }
        
        /* Default Layout Specific Styles */
        .default-layout {
          background: transparent;
          /* Cross-browser smoothing */
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }

        .default-layout-content {
          padding-top: 0;
          min-height: 100vh;
          min-height: calc(var(--vh, 1vh) * 100);
        }

        /* Cross-browser scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
          /* Vendor prefixes for better support */
          -webkit-border-radius: 4px;
          -moz-border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.5);
        }
        
        /* Firefox scrollbar styling */
        @supports (scrollbar-width: thin) {
          * {
            scrollbar-width: thin;
            scrollbar-color: rgba(0, 0, 0, 0.3) rgba(0, 0, 0, 0.1);
          }
        }
        
        /* Mobile scroll improvements with cross-platform support */
        @media (max-width: 768px) {
          .default-layout {
            -webkit-overflow-scrolling: touch;
            overscroll-behavior: auto;
            /* iOS specific smoothing */
            -webkit-backface-visibility: hidden;
            -moz-backface-visibility: hidden;
            backface-visibility: hidden;
          }
          
          .default-layout-content {
            touch-action: pan-y pinch-zoom;
            /* Prevent bounce scrolling issues */
            -webkit-transform: translate3d(0,0,0);
            -moz-transform: translate3d(0,0,0);
            transform: translate3d(0,0,0);
          }
        }
        
        /* iOS Safari specific fixes */
        @supports (-webkit-touch-callout: none) {
          .default-layout-content {
            min-height: -webkit-fill-available;
            min-height: calc(var(--actual-vh, 1vh) * 100);
            padding-bottom: var(--safe-area-inset-bottom);
          }
        }
        
        /* Android Chrome specific fixes */
        @media screen and (max-width: 768px) and (-webkit-min-device-pixel-ratio: 0) {
          .default-layout {
            overscroll-behavior-y: auto;
          }
        }
        
        /* Desktop browser optimizations */
        @media (min-width: 769px) {
          /* Edge/IE specific */
          @supports (-ms-overflow-style: auto) {
            .default-layout {
              -ms-overflow-style: auto;
            }
          }
          
          /* Firefox desktop specific */
          @-moz-document url-prefix() {
            .default-layout {
              scrollbar-width: thin;
            }
          }
        }
      `}</style>
    </>
  );
};

export default DefaultLayout;
