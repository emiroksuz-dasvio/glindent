import * as React from "react";
import { AppProps } from "next/app";
import { IkasStorefrontConfig } from "@ikas/storefront-config";
import { useRouter } from "next/router";

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
      
      {/* Tooth Particles Effect */}
      <ToothParticles />
      
      {/* Main Content */}
      {isHomePage ? (
        <NavigationProvider>
          <Component {...pageProps} />
        </NavigationProvider>
      ) : (
        <Component {...pageProps} />
      )}
    </>
  );
};

export default IkasThemeApp;
