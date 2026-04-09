/**
 * Tool-specific OG Image Utilities
 * Generates category-based Open Graph images for better social media CTR
 */

export type ToolCategory = 
  | 'image' 
  | 'pdf' 
  | 'text' 
  | 'advancedtext'
  | 'formatter'
  | 'converter'
  | 'generator'
  | 'dev'
  | 'security'
  | 'utility'
  | 'crypto'
  | 'regex'
  | 'youtube'
  | 'seo'
  | 'keyword'
  | 'web'
  | 'social'
  | 'tech'
  | 'calculator';

interface OGImageConfig {
  url: string;
  width: number;
  height: number;
  alt: string;
}

const DEFAULT_OG_IMAGE: OGImageConfig = {
  url: 'https://tools.aynzo.com/og-image.png',
  width: 1200,
  height: 630,
  alt: 'Aynzo Tools - 100+ Free Professional Online Tools'
};

// Category-specific OG images with different colors/themes
const CATEGORY_OG_IMAGES: Record<ToolCategory, OGImageConfig> = {
  image: {
    url: 'https://tools.aynzo.com/og-image.png',
    width: 1200,
    height: 630,
    alt: 'Image Tools - Compress, Convert & Edit Images Online'
  },
  pdf: {
    url: 'https://tools.aynzo.com/og-image.png',
    width: 1200,
    height: 630,
    alt: 'PDF Tools - Convert & Edit PDFs Online'
  },
  text: {
    url: 'https://tools.aynzo.com/og-image.png',
    width: 1200,
    height: 630,
    alt: 'Text Tools - Word Counter & Text Formatting'
  },
  advancedtext: {
    url: 'https://tools.aynzo.com/og-image.png',
    width: 1200,
    height: 630,
    alt: 'Advanced Text Tools - Format & Transform Text'
  },
  formatter: {
    url: 'https://tools.aynzo.com/og-image.png',
    width: 1200,
    height: 630,
    alt: 'Code Formatter - Format JSON, CSS, HTML & More'
  },
  converter: {
    url: 'https://tools.aynzo.com/og-image.png',
    width: 1200,
    height: 630,
    alt: 'Unit Converter - Convert Units & Measurements'
  },
  generator: {
    url: 'https://tools.aynzo.com/og-image.png',
    width: 1200,
    height: 630,
    alt: 'Generator Tools - QR Codes, Passwords & More'
  },
  dev: {
    url: 'https://tools.aynzo.com/og-image.png',
    width: 1200,
    height: 630,
    alt: 'Developer Tools - JSON Formatter & URL Encoder'
  },
  security: {
    url: 'https://tools.aynzo.com/og-image.png',
    width: 1200,
    height: 630,
    alt: 'Security Tools - Password Generator & Hash Tools'
  },
  utility: {
    url: 'https://tools.aynzo.com/og-image.png',
    width: 1200,
    height: 630,
    alt: 'Utility Tools - Online Utilities & Calculators'
  },
  crypto: {
    url: 'https://tools.aynzo.com/og-image.png',
    width: 1200,
    height: 630,
    alt: 'Crypto Tools - Encrypt & Decrypt Data'
  },
  regex: {
    url: 'https://tools.aynzo.com/og-image.png',
    width: 1200,
    height: 630,
    alt: 'Regex Tools - Test & Validate Regular Expressions'
  },
  youtube: {
    url: 'https://tools.aynzo.com/og-image.png',
    width: 1200,
    height: 630,
    alt: 'YouTube Tools - Thumbnail Downloader & Tag Generator'
  },
  seo: {
    url: 'https://tools.aynzo.com/og-image.png',
    width: 1200,
    height: 630,
    alt: 'SEO Tools - Meta Tags, Sitemap & SERP Simulator'
  },
  keyword: {
    url: 'https://tools.aynzo.com/og-image.png',
    width: 1200,
    height: 630,
    alt: 'Keyword Tools - Research & Analyze Keywords'
  },
  web: {
    url: 'https://tools.aynzo.com/og-image.png',
    width: 1200,
    height: 630,
    alt: 'Web Tools - Analyze & Optimize Websites'
  },
  social: {
    url: 'https://tools.aynzo.com/og-image.png',
    width: 1200,
    height: 630,
    alt: 'Social Media Tools - Generate Bio & Links'
  },
  tech: {
    url: 'https://tools.aynzo.com/og-image.png',
    width: 1200,
    height: 630,
    alt: 'Tech Tools - Calculators & Utilities'
  },
  calculator: {
    url: 'https://tools.aynzo.com/og-image.png',
    width: 1200,
    height: 630,
    alt: 'Calculator Tools - Financial & Math Calculators'
  }
};

/**
 * Get tool-specific OG image based on category
 * Falls back to default if category not found
 */
export function getToolOGImage(category: string, toolName?: string): OGImageConfig {
  const ogImage = CATEGORY_OG_IMAGES[category as ToolCategory];
  
  if (!ogImage) {
    return {
      ...DEFAULT_OG_IMAGE,
      alt: toolName ? `${toolName} - Aynzo Tools` : DEFAULT_OG_IMAGE.alt
    };
  }
  
  return {
    ...ogImage,
    alt: toolName ? `${toolName} - ${ogImage.alt}` : ogImage.alt
  };
}

/**
 * Get generic OG image for non-tool pages
 */
export function getGenericOGImage(pageType: 'home' | 'blog' | 'about' | 'contact' | 'tools'): OGImageConfig {
  const pageImages: Record<string, OGImageConfig> = {
    home: DEFAULT_OG_IMAGE,
    blog: {
      url: 'https://tools.aynzo.com/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Aynzo Blog - SEO Tips & Tool Guides'
    },
    about: {
      url: 'https://tools.aynzo.com/og-image.png',
      width: 1200,
      height: 630,
      alt: 'About Aynzo - Free Online Tools Platform'
    },
    contact: {
      url: 'https://tools.aynzo.com/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Contact Aynzo - Get in Touch'
    },
    tools: {
      url: 'https://tools.aynzo.com/og-image.png',
      width: 1200,
      height: 630,
      alt: 'All Tools - 100+ Free Online Tools'
    }
  };
  
  return pageImages[pageType] || DEFAULT_OG_IMAGE;
}
