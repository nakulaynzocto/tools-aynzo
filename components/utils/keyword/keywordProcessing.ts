export const generateSlug = (text: string): string => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

export const cleanKeywords = (keywords: string): string => {
    return keywords
        .split(/[,\n]/)
        .map(k => k.trim())
        .filter(k => k.length > 0)
        .join(', ');
};

export const generateLongTailKeywords = (seed: string): string[] => {
    const modifiers = [
        'how to', 'best', 'top', 'guide to', 'tips for', 'ways to',
        'what is', 'why', 'when to', 'where to', 'complete guide',
        'ultimate', 'essential', 'advanced', 'beginner', 'professional'
    ];
    
    return modifiers.map(mod => `${mod} ${seed}`.trim());
};

export const calculateKeywordDensity = (text: string, keyword: string): { density: number; count: number } => {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const keywordLower = keyword.toLowerCase();
    const count = words.filter(w => w === keywordLower).length;
    const density = words.length > 0 ? (count / words.length) * 100 : 0;
    
    return {
        density: Number(density.toFixed(2)),
        count
    };
};

