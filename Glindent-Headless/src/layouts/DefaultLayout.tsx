import React from "react";
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
  return (
    <>
      <div style={styles.container} className="default-layout">
        <div style={styles.content} className="default-layout-content">
          {children}
        </div>
      </div>

      <style jsx global>{`
        /* Default Layout Specific Styles */
        html,
        body {
          overflow-x: hidden;
          overflow-y: auto;
          height: auto;
          min-height: 100vh;
          margin: 0;
          padding: 0;
        }

        .default-layout {
          background: transparent;
        }

        .default-layout-content {
          padding-top: 0;
        }

        /* Fix scrolling on default pages */
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
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </>
  );
};

export default DefaultLayout;
