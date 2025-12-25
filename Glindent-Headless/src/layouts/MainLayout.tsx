import React, { useEffect } from "react";

/**
 * MainLayout - Horizontal Scroll Layout for Homepage
 * 
 * This layout is used ONLY for the homepage with horizontal scroll navigation.
 * It wraps the page content with proper overflow handling for horizontal scroll.
 */

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // Set body styles when MainLayout mounts
  useEffect(() => {
    // Enhanced platform detection
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // Calculate proper viewport height for mobile with platform-specific handling
    const setViewportHeight = () => {
      // iOS Safari specific viewport calculation
      const vh = isIOS ? window.innerHeight * 0.01 : window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      
      // Set platform-specific CSS custom properties
      document.documentElement.style.setProperty('--platform-height', 
        isIOS ? 'env(safe-area-inset-top, 0px)' : '0px'
      );
    };
    
    setViewportHeight();
    
    // Enhanced event listeners for better cross-platform support
    const events = ['resize', 'orientationchange'];
    if (isIOS) events.push('pageshow', 'pagehide');
    
    events.forEach(event => {
      window.addEventListener(event, setViewportHeight, { passive: true });
    });
    
    // Platform-specific layout settings
    if (isMobile) {
      const height = isIOS ? 'calc(var(--vh, 1vh) * 100)' : 'calc(var(--vh, 1vh) * 100)';
      
      // iOS Safari specific fixes
      if (isIOS) {
        (document.documentElement.style as any).webkitTextSizeAdjust = '100%';
        (document.documentElement.style as any).webkitTapHighlightColor = 'transparent';
        (document.documentElement.style as any).webkitOverflowScrolling = 'touch';
      }
      
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.height = height;
      document.documentElement.style.width = "100vw";
      document.documentElement.style.touchAction = "pan-y pinch-zoom";
      document.body.style.overflow = "hidden";
      document.body.style.height = height;
      document.body.style.width = "100vw";
      document.body.style.touchAction = "pan-y pinch-zoom";
      
      // Android specific fixes
      if (isAndroid) {
        (document.body.style as any).overscrollBehavior = 'none';
      }
    } else {
      // Desktop layout with browser-specific optimizations
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.height = "100vh";
      document.documentElement.style.width = "100vw";
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
      document.body.style.width = "100vw";
      
      // Firefox specific fixes
      if (userAgent.includes('Firefox')) {
        (document.documentElement.style as any).scrollbarWidth = 'none';
      }
    }
    
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    
    // Cleanup on unmount
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, setViewportHeight);
      });
      
      // Reset all platform-specific styles
      const elementsToReset = [document.documentElement, document.body];
      const propertiesToReset = [
        'overflow', 'height', 'width', 'touchAction', 'margin', 'padding',
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
      <div className="main-layout">
        {children}
      </div>

      <style jsx global>{`
        /* CSS Custom Properties for cross-platform viewport */
        :root {
          --vh: 1vh;
          --platform-height: 0px;
          --safe-area-inset-top: env(safe-area-inset-top, 0px);
          --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
          --safe-area-inset-left: env(safe-area-inset-left, 0px);
          --safe-area-inset-right: env(safe-area-inset-right, 0px);
        }
        
        /* Horizontal Layout Specific Styles */
        .main-layout {
          position: relative;
          height: 100vh;
          height: calc(var(--vh, 1vh) * 100);
          width: 100vw;
          overflow: hidden;
          touch-action: pan-x pinch-zoom;
          /* Vendor prefixes for cross-browser support */
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        /* Hide scrollbars across all browsers */
        .main-layout ::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
        
        .main-layout * {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Cross-platform mobile improvements */
        @media (max-width: 768px) {
          .main-layout {
            touch-action: pan-x pinch-zoom;
            -webkit-overflow-scrolling: touch;
            overscroll-behavior: none;
            /* iOS Safari specific */
            -webkit-backface-visibility: hidden;
            -moz-backface-visibility: hidden;
            backface-visibility: hidden;
          }
          
          /* Prevent zoom on double tap across platforms */
          * {
            touch-action: manipulation;
            -webkit-touch-callout: none;
            -webkit-tap-highlight-color: transparent;
          }
        }
        
        /* iOS Safari specific fixes */
        @supports (-webkit-touch-callout: none) {
          .main-layout {
            height: -webkit-fill-available;
            min-height: -webkit-fill-available;
            /* Address bar handling */
            height: calc(var(--vh, 1vh) * 100);
            min-height: calc(var(--vh, 1vh) * 100);
          }
        }
        
        /* Android specific fixes */
        @media screen and (-webkit-min-device-pixel-ratio: 0) {
          .main-layout {
            position: fixed;
            overscroll-behavior-x: none;
            overscroll-behavior-y: none;
          }
        }
        
        /* Firefox specific */
        @-moz-document url-prefix() {
          .main-layout {
            scrollbar-width: none;
          }
        }
        
        /* Edge/IE specific */
        @supports (-ms-overflow-style: none) {
          .main-layout {
            -ms-overflow-style: none;
          }
        }
      `}</style>
    </>
  );
};

export default MainLayout;
