import React from "react";

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
  return (
    <>
      <div className="main-layout">
        {children}
      </div>

      <style jsx global>{`
        /* Horizontal Layout Specific Styles */
        html,
        body {
          overflow: hidden !important;
          height: 100vh;
          width: 100vw;
          margin: 0;
          padding: 0;
        }

        .main-layout {
          position: relative;
          height: 100vh;
          width: 100vw;
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
    </>
  );
};

export default MainLayout;
