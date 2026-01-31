import { RedirectData, SEOAnalysisResult } from '@/components/types/web/types';

export const generateHtaccessRedirect = (redirect: RedirectData): string => {
    return `# HTTP Redirect\nRedirect ${redirect.type} ${redirect.from} ${redirect.to}`;
};

export const analyzeSEO = async (url: string): Promise<SEOAnalysisResult> => {
    // Normalize URL
    let targetUrl = url.startsWith('http') ? url : `https://${url}`;

    try {
        // Using CORS proxy
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
        const data = await response.json();

        if (!data.contents) throw new Error("Could not fetch page content");

        const html = data.contents;
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        let score = 0;
        const issues: Array<{ type: 'success' | 'warning' | 'error'; title: string; desc: string }> = [];

        // Title Tag Analysis (20 points)
        const title = doc.querySelector('title')?.innerText || '';
        if (title) {
            if (title.length >= 10 && title.length <= 60) {
                score += 20;
                issues.push({ type: 'success', title: 'SEO Title is Optimized', desc: `Great! Title length is ${title.length} chars (Recommended: 10-60).` });
            } else {
                score += 10;
                issues.push({ type: 'warning', title: 'SEO Title Needs Improvement', desc: `Title is present but length (${title.length}) is not optimal. Aim for 30-60 chars.` });
            }
        } else {
            issues.push({ type: 'error', title: 'Missing SEO Title', desc: 'The <title> tag is missing. This is critical for SEO.' });
        }

        // Meta Description (20 points)
        const desc = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
        if (desc) {
            if (desc.length >= 50 && desc.length <= 160) {
                score += 20;
                issues.push({ type: 'success', title: 'Meta Description is Optimized', desc: `Perfect length (${desc.length} chars). Describes page well.` });
            } else {
                score += 10;
                issues.push({ type: 'warning', title: 'Meta Description Issues', desc: `Description exists but length (${desc.length}) is outside recommended 50-160 range.` });
            }
        } else {
            issues.push({ type: 'error', title: 'Missing Meta Description', desc: 'No meta description found. Search engines may not display snippets correctly.' });
        }

        // H1 Header (20 points)
        const h1s = doc.querySelectorAll('h1');
        if (h1s.length === 1) {
            score += 20;
            issues.push({ type: 'success', title: 'H1 Header Optimized', desc: 'Excellent! Exactly one H1 tag found.' });
        } else if (h1s.length === 0) {
            issues.push({ type: 'error', title: 'Missing H1 Header', desc: 'No H1 tag found. Use one main heading per page.' });
        } else {
            score += 10;
            issues.push({ type: 'warning', title: 'Multiple H1 Headers', desc: `Found ${h1s.length} H1 tags. It is best practice to have only one per page.` });
        }

        // Images Alt Attributes (20 points)
        const images = Array.from(doc.querySelectorAll('img'));
        const imagesWithAlt = images.filter(img => img.getAttribute('alt')?.trim());
        const totalImages = images.length;

        if (totalImages === 0) {
            score += 20;
            issues.push({ type: 'warning', title: 'No Images Found', desc: 'Visual content helps engagement. Consider adding images.' });
        } else {
            const altRatio = imagesWithAlt.length / totalImages;
            if (altRatio === 1) {
                score += 20;
                issues.push({ type: 'success', title: 'Image Alt Tags Perfect', desc: 'All images have alt attributes. Great for accessibility and SEO.' });
            } else if (altRatio > 0.5) {
                score += 10;
                issues.push({ type: 'warning', title: 'Missing Some Alt Tags', desc: `${totalImages - imagesWithAlt.length} images are missing alt descriptions. Fix this for better indexing.` });
            } else {
                issues.push({ type: 'error', title: 'Poor Image SEO', desc: 'Most images are missing alt tags. Search engines cannot "see" your images.' });
            }
        }

        // Links Analysis (20 points)
        const links = doc.querySelectorAll('a');
        if (links.length > 0) {
            score += 20;
            issues.push({ type: 'success', title: 'Links Found', desc: `Found ${links.length} internal/external links. Linking structure appears active.` });
        } else {
            issues.push({ type: 'warning', title: 'No Links Found', desc: 'A page without links is a dead end for bots and users.' });
        }

        return {
            score,
            url: targetUrl,
            metrics: {
                meta: { score: (title && desc) ? 95 : 40, status: (title && desc) ? 'good' : 'poor' },
                content: { score: h1s.length === 1 ? 90 : 60, status: h1s.length === 1 ? 'good' : 'avg' },
                mobile: { score: 90, status: 'good' },
                tech: { score: imagesWithAlt.length === totalImages ? 90 : 50, status: 'avg' }
            },
            issues
        };
    } catch (error) {
        return {
            score: 0,
            url: targetUrl,
            metrics: { meta: { score: 0, status: 'error' }, content: { score: 0 }, mobile: { score: 0 }, tech: { score: 0 } },
            issues: [{ type: 'error', title: 'Scan Failed', desc: 'Could not crawl this URL. The site might block automated scanners or allow-scripts. Please try another domain.' }]
        };
    }
};

export const getBrowserInfo = () => {
    return {
        'User Agent': navigator.userAgent,
        'Language': navigator.language,
        'Platform': navigator.platform,
        'Screen Size': `${window.screen.width} x ${window.screen.height}`,
        'Viewport': `${window.innerWidth} x ${window.innerHeight}`,
        'Cookies Enabled': navigator.cookieEnabled ? 'Yes' : 'No',
        'Device Memory': (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB` : 'N/A',
        'CPU Cores': navigator.hardwareConcurrency || 'N/A'
    };
};

export const fetchIPAddress = async (): Promise<string> => {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    return data.ip;
};


