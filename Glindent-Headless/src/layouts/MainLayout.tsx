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
    // Disable vertical scrolling for horizontal layout
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.height = "100vh";
    document.documentElement.style.width = "100vw";
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
    document.body.style.width = "100vw";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    
    // Cleanup on unmount
    return () => {
      // Reset to defaults (will be overridden by DefaultLayout if navigating away)
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
      document.documentElement.style.width = "";
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.body.style.width = "";
      document.body.style.margin = "";
      document.body.style.padding = "";
    };
  }, []);

  return (
    <>
      <div className="main-layout">
        {children}
      </div>

      <style jsx global>{`
        /* Horizontal Layout Specific Styles */
        .main-layout {
          position: relative;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
        }

        /* Hide scrollbars in horizontal layout */
        .main-layout ::-webkit-scrollbar {
          display: none;
        }
        
        .main-layout * {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

export default MainLayout;
