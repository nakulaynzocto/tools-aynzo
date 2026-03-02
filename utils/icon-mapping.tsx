import { 
    ImageIcon, FileText, Lock, Code, Search, Youtube, 
    Link as LinkIcon, RefreshCw, Shuffle, CreditCard, Wand2 
} from 'lucide-react';

export const getCategoryIcon = (category: string) => {
    const lower = category.toLowerCase();
    if (lower.includes('image')) return ImageIcon;
    if (lower.includes('pdf') || lower.includes('text')) return FileText;
    if (lower.includes('security') || lower.includes('crypto')) return Lock;
    if (lower.includes('developer') || lower.includes('code') || lower.includes('json')) return Code;
    if (lower.includes('seo') || lower.includes('web')) return Search;
    if (lower.includes('youtube')) return Youtube;
    if (lower.includes('social') || lower.includes('link')) return LinkIcon;
    if (lower.includes('converter')) return RefreshCw;
    if (lower.includes('random')) return Shuffle;
    if (lower.includes('utility')) return CreditCard;
    return Wand2;
};
