export const WHATSAPP_NUMBER = "917818073306"; // REPLACE THIS WITH YOUR REAL NUMBER

export const getWhatsAppLink = (rate: string) => {
    const message = `Hi Aynzo Team! I'm interested in the ${rate} website development offer. Can we discuss my project?`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

// Site Configuration
export const SITE_URL = 'https://tools.aynzo.com';
export const SITE_NAME = 'Aynzo Tools';

// OG Image URLs
export const OG_IMAGES = {
    default: `${SITE_URL}/og-image.png`,
    blog: `${SITE_URL}/og-blog.png`,
    tools: `${SITE_URL}/assets/og-image-tools.png`,
    pdf: `${SITE_URL}/assets/og-image-pdf.png`,
    image: `${SITE_URL}/assets/og-image-tools.png`,
    seo: `${SITE_URL}/assets/og-image-seo.png`,
    dev: `${SITE_URL}/assets/og-image-dev.png`,
    youtube: `${SITE_URL}/assets/og-image-youtube.png`,
} as const;

// Default Metadata
export const DEFAULT_METADATA = {
    title: `${SITE_NAME} - 100+ Free Online Tools`,
    description: 'Professional free online tools for developers, designers & creators. 100% private, browser-based.',
    keywords: 'aynzo tools, free online tools, image compressor, pdf converter',
};
