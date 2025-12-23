import { observer } from "mobx-react-lite";
import { CSSProperties } from "react";
import { useRouter } from "next/router";

/**
 * Header Wrapper Component
 * 
 * This wrapper ensures the header behaves correctly on different pages:
 * - Homepage: Fixed position for horizontal scroll
 * - Other pages: Fixed position for standard scroll
 */

interface HeaderWrapperProps {
  children: React.ReactNode;
}

const styles: { [key: string]: CSSProperties } = {
  headerContainer: {
    position: "fixed" as "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
};

const HeaderWrapper: React.FC<HeaderWrapperProps> = ({ children }) => {
  const router = useRouter();
  const isHomePage = router.pathname === "/" || router.pathname === "/index";

  return (
    <>
      <header 
        style={styles.headerContainer} 
        className={`header-wrapper ${isHomePage ? "header-homepage" : "header-standard"}`}
      >
        {children}
      </header>

      <style jsx global>{`
        .header-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          transition: transform 0.3s ease;
        }

        /* Homepage specific header styles */
        .header-homepage {
          /* Header is part of horizontal scroll */
        }

        /* Standard pages header styles */
        .header-standard {
          /* Header stays fixed while content scrolls */
          background: rgba(13, 148, 136, 0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        /* Add padding to body for fixed header on standard pages */
        .default-layout .default-layout-content {
          padding-top: 80px; /* Adjust based on header height */
        }

        @media (max-width: 768px) {
          .default-layout .default-layout-content {
            padding-top: 70px;
          }
        }
      `}</style>
    </>
  );
};

export default observer(HeaderWrapper);
