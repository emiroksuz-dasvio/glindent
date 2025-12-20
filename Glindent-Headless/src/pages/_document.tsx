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
          {favicon?.id && (
            <link
              rel="shortcut icon"
              href={`${process.env.NEXT_PUBLIC_CDN_URL}images/${favicon.id}/image_180.webp`}
              type="image/webp"
            />
          )}
          <AnalyticsHead />
          <link rel="preconnect" href={process.env.NEXT_PUBLIC_CDN_URL}></link>
          <link
            rel="dns-prefetch"
            href={process.env.NEXT_PUBLIC_CDN_URL}
          ></link>
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
