export interface SeoToolProps {
    type:
    | 'meta-tag-generator'
    | 'open-graph-generator'
    | 'twitter-card-generator'
    | 'robots-txt-generator'
    | 'xml-sitemap-generator';
}

export interface MetaData {
    title: string;
    description: string;
    keywords: string;
    author: string;
    viewport: boolean;
}

export interface OpenGraphData {
    title: string;
    type: string;
    url: string;
    image: string;
    description: string;
    siteName: string;
}

export interface TwitterCardData {
    card: string;
    site: string;
    title: string;
    description: string;
    image: string;
}

export interface RobotsData {
    allAgents: boolean;
    allow: string;
    disallow: string;
    sitemap: string;
}

export interface SitemapData {
    urls: string;
    frequency: string;
    priority: string;
}

