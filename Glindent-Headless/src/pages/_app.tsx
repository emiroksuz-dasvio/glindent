import * as React from "react";
import { AppProps } from "next/app";
import { IkasStorefrontConfig } from "@ikas/storefront-config";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";

import Config from "config.json";
import { NavigationProvider } from "src/components/horizontal-layout";
import MainLayout from "src/layouts/MainLayout";
import DefaultLayout from "src/layouts/DefaultLayout";
import { ToothParticles } from "src/components/tooth-particles";
import { WelcomeModal } from "src/components/welcome-modal";
import { useFirstVisit } from "src/hooks/use-first-visit";

// Import global styles
import "src/styles/global.css";
import "src/styles/globals.css";

IkasStorefrontConfig.init({
  ...Config,
  apiUrl: process.env.NEXT_PUBLIC_GQL_URL,
  cdnUrl: process.env.NEXT_PUBLIC_CDN_URL,
});

// Page transition variants for non-homepage pages
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

/**
 * Main App Component
 * 
 * Layout Logic:
 * - Homepage (/) → MainLayout + NavigationProvider (horizontal scroll)
 * - All other pages → DefaultLayout (standard vertical scroll)
 * 
 * Background elements (animated background, grain, tooth particles) are shown on all pages
 * 
 * Performance Optimizations:
 * - ToothParticles lazy loaded (client-side only)
 * - WelcomeModal shown only on first visit
 */
const IkasThemeApp: React.FC<AppProps> = (props) => {
  const { Component, pageProps } = props;
  const router = useRouter();
  const { isFirstVisit, hasChecked } = useFirstVisit();
  
  // Determine if we're on homepage
  const isHomePage = router.pathname === "/" || router.pathname === "/index";
  
  // Determine if we're on checkout (ikas default, minimal decoration)
  const isCheckoutPage = router.pathname.startsWith("/checkout");

  return (
    <>
      {/* Welcome Modal - Show only on first visit and homepage */}
      {hasChecked && (
        <WelcomeModal
          videoUrl="/videos/welcome.mp4"
          videoMp4Url="/videos/welcome.mp4"
          videoWebmUrl="/videos/welcome.webm"
          videoOgvUrl="/videos/welcome.ogv"
          title="Welcome to Glindent"
          subtitle="Discover premium dental supplies"
          enableAutoplay={true}
          showOnlyFirstVisit={true}
          isOpen={isFirstVisit && isHomePage}
          onClose={() => {}}
        />
      )}

      {/* Background Elements - Shown on all pages */}
      <div className="animated-background">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="overlay" />
      </div>
      
      {/* Grain Overlay */}
      <div className="grain-overlay" />
      
      {/* Tooth Particles Overlay - Lazy loaded, hide on checkout */}
      {!isCheckoutPage && <ToothParticles />}
      
      {/* Main Content - Different layouts for different pages */}
      <AnimatePresence exitBeforeEnter initial={false}>
        {isHomePage ? (
          // HOMEPAGE: Horizontal scroll layout with navigation
          <MainLayout key="home-layout">
            <NavigationProvider>
              <Component {...pageProps} />
            </NavigationProvider>
          </MainLayout>
        ) : (
          // OTHER PAGES: Standard vertical scroll layout
          <DefaultLayout key="default-layout">
            <motion.div
              key={router.asPath}
              initial="initial"
              animate="enter"
              exit="exit"
              variants={pageVariants}
              style={{ width: "100%", minHeight: "100vh" }}
            >
              <Component {...pageProps} />
            </motion.div>
          </DefaultLayout>
        )}
      </AnimatePresence>
    </>
  );
};

export default IkasThemeApp;
