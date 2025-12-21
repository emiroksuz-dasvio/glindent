import * as React from "react";
import { AppProps } from "next/app";
import { IkasStorefrontConfig } from "@ikas/storefront-config";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";

import Config from "config.json";
import { NavigationProvider } from "src/components/horizontal-layout";
import { ToothParticles } from "src/components/tooth-particles";

// Import global styles
import "src/styles/global.css";
import "src/styles/globals.css";

IkasStorefrontConfig.init({
  ...Config,
  apiUrl: process.env.NEXT_PUBLIC_GQL_URL,
  cdnUrl: process.env.NEXT_PUBLIC_CDN_URL,
});

// Page transition variants
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

const IkasThemeApp: React.FC<AppProps> = (props) => {
  const { Component, pageProps } = props;
  const router = useRouter();
  
  // Only use navigation provider on home page
  const isHomePage = router.pathname === "/" || router.pathname === "/index";

  return (
    <>
      {/* Animated Background */}
      <div className="animated-background">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="overlay" />
      </div>
      
      {/* Grain Overlay */}
      <div className="grain-overlay" />
      
      {/* Tooth Particles Overlay */}
      <ToothParticles />
      
      {/* Main Content with Page Transitions */}
      <AnimatePresence exitBeforeEnter initial={false}>
        {isHomePage ? (
          <NavigationProvider key="home">
            <Component {...pageProps} />
          </NavigationProvider>
        ) : (
          <motion.div
            key={router.asPath}
            initial="initial"
            animate="enter"
            exit="exit"
            variants={pageVariants}
            style={{ minHeight: "100vh" }}
          >
            <Component {...pageProps} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default IkasThemeApp;
