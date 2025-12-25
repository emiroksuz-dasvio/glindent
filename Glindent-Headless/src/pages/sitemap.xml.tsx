import { GetServerSideProps } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://glindent.com';

// Static pages that should always be in sitemap
const staticPages = [
  { url: '/', priority: 1.0, changefreq: 'daily' },
  { url: '/blog', priority: 0.8, changefreq: 'weekly' },
];

// Pages to exclude from sitemap
const excludedPages = [
  '/account',
  '/cart',
  '/checkout',
  '/search',
  '/404',
  '/editor',
];

function generateSiteMap(pages: Array<{ url: string; priority: number; changefreq: string; lastmod?: string }>) {
  const currentDate = new Date().toISOString().split('T')[0];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  ${pages
    .map(
      (page) => `
  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${page.lastmod || currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('')}
</urlset>`;
}

function SiteMap() {
  // getServerSideProps will handle the response
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // Combine static pages
  // In a real implementation, you would fetch products from ikas API here
  // For now, we'll use static pages and let ikas handle product pages
  
  const allPages = [
    ...staticPages,
    // Add more dynamic pages here when available
    // e.g., fetch products from ikas API and add them
  ];

  const sitemap = generateSiteMap(allPages);

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default SiteMap;
