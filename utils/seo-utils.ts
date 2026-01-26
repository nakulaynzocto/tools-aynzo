import { tools } from '../lib/tools';

/**
 * Programmatic Metadata Generator
 * Ensures every tool has high-quality, keyword-rich SEO tags even if missing in lib/tools.ts
 */
export function generateProgrammaticMetadata(slug: string, locale: string) {
    const tool = tools.find((t: any) => t.slug === slug);
    if (!tool) return null;

    const name = tool.name;
    const category = tool.category;

    // Smart Titles based on category
    const titles: Record<string, string> = {
        'image': `${name} - Free Online Image Converter & Editor`,
        'pdf': `${name} - Convert & Edit PDF Files Free Online`,
        'text': `${name} - Professional Online Text Formatting Tool`,
        'developer': `${name} - Free Developer Utility & Code Formatter`,
        'security': `${name} - Secure Online Generator & Hashing Tool`,
        'youtube': `${name} - Free YouTube Video Growth & SEO Tool`,
        'seo': `${name} - Advanced Web & SEO Analysis Tool`,
    };

    const title = titles[category] || `${name} - Free Online Utility Tool`;

    // Semantic Descriptions
    const descriptions: Record<string, string> = {
        'image': `Use our free online ${name} to process your photos instantly. 100% private, browser-based conversion for JPG, PNG, and WebP. No quality loss guaranteed.`,
        'pdf': `Convert, merge, or split documents with our ${name} tool. Professional-grade PDF processing free for everyone. Fast and secure.`,
        'text': `The easiest way to use ${name} online. Clean, format, and optimize your text content with our real-time text utility. Perfect for writers and editors.`,
        'developer': `Powerful, open-source ${name} for modern developers. Format code snippets, validate data structures, and automate repetitive tasks with zero installation.`,
        'security': `Generate secure assets with our ${name} utility. We prioritize your privacy—all processing happens client-side. No data is stored or shared.`,
        'youtube': `Grow your channel with the Aynzo ${name} utility. Optimized for YouTube SEO and high-performance video marketing. Free for all creators.`,
    };

    const description = descriptions[category] || `Professional online ${name} tool. Fast, secure, and easy to use across all devices. No account or installation required.`;

    // Keyword generation
    const keywords = `${name.toLowerCase()}, online tools, free online ${name.toLowerCase()}, aynzo ${name.toLowerCase()}, ${category} tools online`;

    return {
        title: `${title} | AYNZO TOOLS`,
        description,
        keywords,
    };
}
