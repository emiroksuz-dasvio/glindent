import * as React from "react";
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";
import { AnalyticsHead, AnalyticsBody } from "@ikas/storefront";

import { IkasStorefrontConfig } from "@ikas/storefront-config";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }
  render() {
    // Make SDK calls safe during build time
    let favicon = null;
    let locale = "en";
    try {
      favicon = IkasStorefrontConfig.getFavicon?.() ?? null;
      locale = IkasStorefrontConfig.getCurrentLocale?.() ?? "en";
    } catch (e) {
      // SDK not ready during build
    }
    return (
      <Html lang={locale}>
        <Head>
          {/* Charset */}
          <meta charSet="utf-8" />
          
          {/* Cross-platform compatibility meta tags */}
          <meta name="format-detection" content="telephone=yes" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="apple-mobile-web-app-title" content="Glindent" />
          <meta name="msapplication-TileImage" content="/android-chrome-192x192.png" />
          <meta name="msapplication-TileColor" content="#007A72" />
          <meta name="msapplication-navbutton-color" content="#007A72" />
          <meta name="msapplication-starturl" content="/" />
          
          {/* iOS Safari specific */}
          <meta name="apple-touch-fullscreen" content="yes" />
          <link rel="apple-touch-startup-image" href="/apple-touch-icon.png" />
          
          {/* Samsung Internet specific */}
          <meta name="samsung-internet-toolbar-color" content="#007A72" />
          
          {/* UC Browser specific */}
          <meta name="full-screen" content="yes" />
          <meta name="browsermode" content="application" />
          
          {/* QQ Browser specific */}
          <meta name="x5-orientation" content="portrait" />
          <meta name="x5-fullscreen" content="true" />
          <meta name="x5-page-mode" content="app" />
          
          {/* Favicon - Multiple formats for cross-platform compatibility */}
          {favicon?.id && (
            <link
              rel="shortcut icon"
              href={`${process.env.NEXT_PUBLIC_CDN_URL}images/${favicon.id}/image_180.webp`}
              type="image/webp"
            />
          )}
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          
          {/* PWA Manifest */}
          <link rel="manifest" href="/site.webmanifest" />
          <meta name="theme-color" content="#007A72" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="apple-mobile-web-app-title" content="Glindent" />
          
          {/* Default SEO Meta Tags - Keyword Optimized */}
          <meta name="description" content="Glindent - UK's trusted supplier of premium dental supplies. Shop zirconia discs, dental X-ray films, composites & CAD/CAM materials. Fast UK delivery to dental practices & laboratories." />
          <meta name="keywords" content="dental supplies UK, dental supplies, buy dental supplies online, dental equipment UK, zirconia discs, dental zirconia, CAD/CAM dental materials, dental X-ray films, dental composites, nano hybrid composite, dental laboratory supplies, dental restoration materials, Glindent, G-Ceram, G-Dent, professional dental equipment, dental prosthetics UK" />
          <meta name="author" content="Glindent" />
          <meta name="publisher" content="Glindent Ltd" />
          <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
          <meta name="googlebot" content="index, follow" />
          <meta name="bingbot" content="index, follow" />
          
          {/* Geographic & Language Targeting */}
          <meta name="geo.region" content="GB" />
          <meta name="geo.placename" content="United Kingdom" />
          <meta name="language" content="English" />
          <meta name="distribution" content="UK" />
          <meta name="target" content="dental professionals, dentists, dental laboratories, dental practices" />
          <meta name="coverage" content="United Kingdom" />
          
          {/* Open Graph defaults - Enhanced */}
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Glindent - Premium Dental Supplies UK" />
          <meta property="og:locale" content="en_GB" />
          <meta property="og:image" content="https://glindent.com/og-image.svg" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content="Glindent - Premium Dental Supplies UK" />
          
          {/* Twitter defaults - Enhanced */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@glindent" />
          <meta name="twitter:image" content="https://glindent.com/og-image.svg" />
          
          {/* Additional SEO Tags */}
          <meta name="application-name" content="Glindent" />
          <meta name="msapplication-TileColor" content="#007A72" />
          <meta name="msapplication-tooltip" content="Glindent - Premium Dental Supplies UK" />
          <meta httpEquiv="x-ua-compatible" content="IE=edge" />
          
          {/* Preconnect for performance - Critical resources */}
          <AnalyticsHead />
          <link rel="preconnect" href={process.env.NEXT_PUBLIC_CDN_URL}></link>
          <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_CDN_URL}></link>
          <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
          <link rel="dns-prefetch" href="https://res.cloudinary.com" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          
          {/* Google Fonts - Poppins with font-display: swap for better performance */}
          {/* Only the weights actually used in the theme (300-800). No italic is
              used anywhere, and 900 is unused — requesting them would declare
              12 extra @font-face rules for nothing. */}
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
            rel="stylesheet"
          />

          {/* Inline critical CSS */}
          <style dangerouslySetInnerHTML={{ __html: `
            /* Prevent layout shift during font loading */
            body {
              font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            }
            
            /* Critical above-the-fold styles */
            .animated-background {
              position: fixed;
              inset: 0;
              z-index: -1;
              overflow: hidden;
            }
          `}} />
        </Head>
        <body>
          <AnalyticsBody />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
