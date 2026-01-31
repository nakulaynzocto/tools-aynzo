import { MetaData, OpenGraphData, TwitterCardData, RobotsData, SitemapData } from '@/components/types/seo/types';

export const generateMetaTags = (meta: MetaData): string => {
    if (!meta.title && !meta.description) return '';
    
    return `<!-- Primary Meta Tags -->
<title>${meta.title}</title>
<meta name="title" content="${meta.title}">
<meta name="description" content="${meta.description}">
<meta name="keywords" content="${meta.keywords}">
<meta name="author" content="${meta.author}">
${meta.viewport ? '<meta name="viewport" content="width=device-width, initial-scale=1.0">' : ''}`;
};

export const generateOpenGraph = (og: OpenGraphData): string => {
    if (!og.title && !og.url) return '';
    
    return `<!-- Open Graph / Facebook -->
<meta property="og:type" content="${og.type}">
<meta property="og:url" content="${og.url}">
<meta property="og:title" content="${og.title}">
<meta property="og:description" content="${og.description}">
<meta property="og:image" content="${og.image}">
<meta property="og:site_name" content="${og.siteName}">`;
};

export const generateTwitterCard = (twitter: TwitterCardData): string => {
    if (!twitter.title && !twitter.site) return '';
    
    return `<!-- Twitter -->
<meta property="twitter:card" content="${twitter.card}">
<meta property="twitter:title" content="${twitter.title}">
<meta property="twitter:description" content="${twitter.description}">
<meta property="twitter:image" content="${twitter.image}">
<meta property="twitter:site" content="${twitter.site}">`;
};

export const generateRobotsTxt = (robots: RobotsData): string => {
    return `User-agent: ${robots.allAgents ? '*' : 'Googlebot'}
Allow: ${robots.allow}
Disallow: ${robots.disallow}

${robots.sitemap ? `Sitemap: ${robots.sitemap}` : ''}`;
};

export const generateSitemap = (sitemap: SitemapData): string => {
    if (!sitemap.urls) return '';
    
    const urlList = sitemap.urls.split('\n').filter(u => u.trim());
    const items = urlList.map(url => `  <url>
    <loc>${url.trim()}</loc>
    <changefreq>${sitemap.frequency}</changefreq>
    <priority>${sitemap.priority}</priority>
  </url>`).join('\n');
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`;
};


