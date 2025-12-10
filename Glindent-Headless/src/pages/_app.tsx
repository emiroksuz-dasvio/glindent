import * as React from "react";
import { AppProps } from "next/app";
import { IkasStorefrontConfig } from "@ikas/storefront-config";

import Config from "config.json";

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
      
      {/* Main Content */}
      <Component {...pageProps} />
    </>
  );
};

export default IkasThemeApp;
