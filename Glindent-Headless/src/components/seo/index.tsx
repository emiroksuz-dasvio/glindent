import Head from "next/head";

// ========================
// SEO COMPONENT
// ========================
// Reusable SEO component for all pages
// Provides Open Graph, Twitter Cards, and standard meta tags

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  noindex?: boolean;
  // Product specific
  productPrice?: string;
  productCurrency?: string;
  productAvailability?: "in stock" | "out of stock" | "preorder";
  // Article specific
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

// Default values
const SITE_NAME = "Glindent";
const DEFAULT_TITLE = "Glindent - Premium Dental Supplies UK";
const DEFAULT_DESCRIPTION = "UK supplier of premium dental supplies including zirconia discs, X-ray films, composites, CAD/CAM materials, and professional dental equipment. Quality products for dental professionals.";
const DEFAULT_KEYWORDS = "dental supplies UK, zirconia discs, dental X-ray film, dental composites, CAD/CAM dental, dental equipment, dental materials, Glindent, dental laboratory supplies";
const DEFAULT_IMAGE = "/og-image.svg";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://glindent.com";
const TWITTER_HANDLE = "@glindent";

export const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  image = DEFAULT_IMAGE,
  url,
  type = "website",
  noindex = false,
  productPrice,
  productCurrency = "GBP",
  productAvailability,
  publishedTime,
  modifiedTime,
  author,
}) => {
  // Construct full title
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  
  // Construct full URL
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL;
  
  // Construct full image URL
  const fullImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_GB" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      
      {/* Product specific meta (for product pages) */}
      {type === "product" && productPrice && (
        <>
          <meta property="product:price:amount" content={productPrice} />
          <meta property="product:price:currency" content={productCurrency} />
          {productAvailability && (
            <meta property="product:availability" content={productAvailability} />
          )}
        </>
      )}
      
      {/* Article specific meta (for blog pages) */}
      {type === "article" && (
        <>
          {publishedTime && (
            <meta property="article:published_time" content={publishedTime} />
          )}
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} />
          )}
          {author && <meta property="article:author" content={author} />}
        </>
      )}
      
      {/* Additional SEO Tags */}
      <meta name="author" content="Glindent" />
      <meta name="publisher" content="Glindent" />
      <meta name="format-detection" content="telephone=yes" />
      <meta name="theme-color" content="#007A72" />
      
      {/* Geo Tags for Local SEO */}
      <meta name="geo.region" content="GB" />
      <meta name="geo.placename" content="United Kingdom" />
    </Head>
  );
};

// ========================
// JSON-LD STRUCTURED DATA
// ========================

export interface OrganizationSchemaProps {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    country?: string;
  };
  socialLinks?: string[];
}

export const OrganizationSchema: React.FC<OrganizationSchemaProps> = ({
  name = "Glindent",
  url = "https://glindent.com",
  logo = "https://glindent.com/glindent-logo.png",
  description = DEFAULT_DESCRIPTION,
  email = "info@glindent.com",
  phone,
  address,
  socialLinks = [],
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    description,
    email,
    ...(phone && { telephone: phone }),
    ...(address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: address.street,
        addressLocality: address.city,
        addressRegion: address.region,
        postalCode: address.postalCode,
        addressCountry: address.country || "GB",
      },
    }),
    ...(socialLinks.length > 0 && { sameAs: socialLinks }),
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
};

export interface ProductSchemaProps {
  name: string;
  description: string;
  image: string;
  sku?: string;
  brand?: string;
  price: string;
  currency?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  url: string;
  category?: string;
}

export const ProductSchema: React.FC<ProductSchemaProps> = ({
  name,
  description,
  image,
  sku,
  brand = "Glindent",
  price,
  currency = "GBP",
  availability = "InStock",
  url,
  category,
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    ...(sku && { sku }),
    brand: {
      "@type": "Brand",
      name: brand,
    },
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: currency,
      availability: `https://schema.org/${availability}`,
      url,
    },
    ...(category && { category }),
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
};

export interface BreadcrumbSchemaProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export const BreadcrumbSchema: React.FC<BreadcrumbSchemaProps> = ({ items }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
};

// ========================
// LOCAL BUSINESS SCHEMA
// ========================
// For local SEO - helps rank for "dental supplies UK", "dental supplies near me"

export interface LocalBusinessSchemaProps {
  name?: string;
  description?: string;
  url?: string;
  logo?: string;
  image?: string;
  telephone?: string;
  email?: string;
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  openingHours?: string[];
  priceRange?: string;
  paymentAccepted?: string[];
  areaServed?: string[];
}

export const LocalBusinessSchema: React.FC<LocalBusinessSchemaProps> = ({
  name = "Glindent - Premium Dental Supplies",
  description = "UK's trusted supplier of premium dental supplies including zirconia discs, X-ray films, dental composites, and CAD/CAM materials. Quality products for dental professionals with fast UK delivery.",
  url = "https://glindent.com",
  logo = "https://glindent.com/glindent-logo.png",
  image = "https://glindent.com/og-image.svg",
  telephone,
  email = "info@glindent.com",
  address,
  geo,
  openingHours = ["Mo-Fr 09:00-17:00"],
  priceRange = "££",
  paymentAccepted = ["Credit Card", "Debit Card", "Bank Transfer"],
  areaServed = ["United Kingdom", "GB", "England", "Scotland", "Wales", "Northern Ireland"],
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Store", "MedicalBusiness"],
    "@id": `${url}/#localbusiness`,
    name,
    description,
    url,
    logo: {
      "@type": "ImageObject",
      url: logo,
    },
    image,
    ...(telephone && { telephone }),
    email,
    ...(address && {
      address: {
        "@type": "PostalAddress",
        ...address,
        addressCountry: address.addressCountry || "GB",
      },
    }),
    ...(geo && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: geo.latitude,
        longitude: geo.longitude,
      },
    }),
    openingHoursSpecification: openingHours.map(hours => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: hours.split(" ")[0],
      opens: hours.split(" ")[1]?.split("-")[0],
      closes: hours.split(" ")[1]?.split("-")[1],
    })),
    priceRange,
    paymentAccepted,
    areaServed: areaServed.map(area => ({
      "@type": "Country",
      name: area,
    })),
    // Additional SEO-rich properties
    knowsAbout: [
      "Dental Supplies",
      "Zirconia Discs",
      "Dental X-Ray Films",
      "Dental Composites",
      "CAD/CAM Dental Materials",
      "Dental Laboratory Equipment",
      "Dental Restorations",
      "Dental Prosthetics",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Dental Supplies Catalog",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "Zirconia Discs",
          description: "Premium zirconia discs for dental restorations",
        },
        {
          "@type": "OfferCatalog",
          name: "Dental X-Ray Films",
          description: "High-quality dental X-ray films for diagnostics",
        },
        {
          "@type": "OfferCatalog",
          name: "Dental Composites",
          description: "Advanced dental composite materials",
        },
        {
          "@type": "OfferCatalog",
          name: "CAD/CAM Materials",
          description: "Digital dentistry materials and supplies",
        },
      ],
    },
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
};

// ========================
// WEBSITE SEARCH SCHEMA
// ========================
// Enables sitelinks search box in Google results

export const WebsiteSearchSchema: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://glindent.com/#website",
    name: "Glindent",
    alternateName: ["Glindent Dental Supplies", "Glindent UK"],
    url: "https://glindent.com",
    description: "Premium dental supplies supplier in the UK - zirconia discs, X-ray films, composites, CAD/CAM materials",
    publisher: {
      "@type": "Organization",
      name: "Glindent",
      logo: {
        "@type": "ImageObject",
        url: "https://glindent.com/glindent-logo.png",
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://glindent.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    // Keywords as about topics
    about: [
      { "@type": "Thing", name: "Dental Supplies" },
      { "@type": "Thing", name: "Dental Equipment" },
      { "@type": "Thing", name: "Zirconia Discs" },
      { "@type": "Thing", name: "Dental Materials UK" },
    ],
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
};

// ========================
// FAQ SCHEMA
// ========================
// Rich snippets for FAQ - great for ranking on question-based searches

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSchemaProps {
  faqs: FAQItem[];
}

export const FAQSchema: React.FC<FAQSchemaProps> = ({ faqs }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
};

// Pre-defined FAQs for dental supplies (SEO-optimized)
export const DENTAL_SUPPLY_FAQS: FAQItem[] = [
  {
    question: "Where can I buy dental supplies in the UK?",
    answer: "Glindent is a leading UK supplier of premium dental supplies. We offer a wide range of products including zirconia discs, dental X-ray films, composites, and CAD/CAM materials with fast delivery across the United Kingdom.",
  },
  {
    question: "What are zirconia discs used for in dentistry?",
    answer: "Zirconia discs are used in CAD/CAM dental milling machines to create dental restorations such as crowns, bridges, and implant abutments. They offer excellent strength, aesthetics, and biocompatibility for long-lasting dental prosthetics.",
  },
  {
    question: "How do I choose the right dental composite material?",
    answer: "When choosing dental composites, consider factors like the restoration location (anterior vs posterior), shade matching requirements, handling properties, and polishability. Glindent offers nano-hybrid composites that provide excellent aesthetics and durability for various clinical applications.",
  },
  {
    question: "What dental X-ray films does Glindent supply?",
    answer: "Glindent supplies high-quality dental X-ray films suitable for intraoral radiography. Our films offer excellent image quality, consistent results, and are compatible with standard dental X-ray equipment used in UK dental practices.",
  },
  {
    question: "Do you deliver dental supplies across the UK?",
    answer: "Yes, Glindent delivers dental supplies throughout the United Kingdom including England, Scotland, Wales, and Northern Ireland. We offer fast and reliable delivery to dental practices, laboratories, and dental professionals nationwide.",
  },
  {
    question: "What CAD/CAM materials are available for digital dentistry?",
    answer: "Glindent offers a comprehensive range of CAD/CAM materials including zirconia discs in various translucencies, glass ceramic blocks, PMMA discs, and wax blanks. These materials are compatible with major CAD/CAM systems used in dental laboratories.",
  },
  {
    question: "Are Glindent dental supplies suitable for NHS dentistry?",
    answer: "Yes, Glindent supplies are suitable for both NHS and private dental practices in the UK. Our products meet quality standards required for professional dental use and offer excellent value for dental professionals.",
  },
  {
    question: "How can I order dental supplies from Glindent?",
    answer: "You can order dental supplies directly from our website at glindent.com. Browse our product catalog, add items to your cart, and checkout securely. We accept various payment methods and offer fast UK delivery.",
  },
];

// ========================
// SERVICE SCHEMA
// ========================
// For service-based searches like "dental supply delivery UK"

export interface ServiceSchemaProps {
  name: string;
  description: string;
  provider?: string;
  areaServed?: string[];
  serviceType?: string;
}

export const ServiceSchema: React.FC<ServiceSchemaProps> = ({
  name,
  description,
  provider = "Glindent",
  areaServed = ["United Kingdom"],
  serviceType = "Dental Supply Distribution",
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: provider,
      url: "https://glindent.com",
    },
    areaServed: areaServed.map(area => ({
      "@type": "Country",
      name: area,
    })),
    serviceType,
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
};

// ========================
// COLLECTION PAGE SCHEMA
// ========================
// For product listing/category pages

export interface CollectionSchemaProps {
  name: string;
  description: string;
  url: string;
  numberOfItems?: number;
}

export const CollectionSchema: React.FC<CollectionSchemaProps> = ({
  name,
  description,
  url,
  numberOfItems,
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    ...(numberOfItems && { numberOfItems }),
    isPartOf: {
      "@type": "WebSite",
      name: "Glindent",
      url: "https://glindent.com",
    },
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
};

export default SEO;
