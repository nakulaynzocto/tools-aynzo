import { TextStats, KeywordDensity } from '@/components/types/text/types';

export const calculateTextStats = (input: string): TextStats => {
    const words = input.trim() === '' ? 0 : input.trim().split(/\s+/).length;
    const chars = input.length;
    const charsNoSpace = input.replace(/\s/g, '').length;
    const sentences = input.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = input.split(/\n\n+/).filter(p => p.trim().length > 0).length;
    const lines = input.split(/\n/).length;
    const readingTime = Math.ceil(words / 200);
    
    return { words, chars, charsNoSpace, sentences, paragraphs, lines, readingTime };
};

export const calculateKeywordDensity = (input: string, words: number): KeywordDensity[] => {
    if (words === 0) return [];
    
    const wordsArray = input.toLowerCase().match(/\b\w+\b/g) || [];
    const wordCount: { [key: string]: number } = {};
    wordsArray.forEach(word => {
        if (word.length > 3) {
            wordCount[word] = (wordCount[word] || 0) + 1;
        }
    });

    return Object.entries(wordCount)
        .map(([word, count]) => ({
            word,
            count,
            percentage: Number(((count / words) * 100).toFixed(2))
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);
};

export const transformText = (input: string, action: string): string => {
    let result = input;

    switch (action) {
        case 'sentence':
            result = input.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, l => l.toUpperCase());
            break;
        case 'lowercase':
            result = input.toLowerCase();
            break;
        case 'uppercase':
            result = input.toUpperCase();
            break;
        case 'title':
            const smallWords = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'in', 'of'];
            result = input.toLowerCase().replace(/\b\w+/g, (word, index) => {
                if (index === 0 || !smallWords.includes(word)) {
                    return word.charAt(0).toUpperCase() + word.slice(1);
                }
                return word;
            });
            break;
        case 'remove-line-breaks':
        case 'remove-breaks':
            result = input.replace(/(\r\n|\n|\r)/gm, " ");
            break;
        case 'reverse-text':
            result = input.split('').reverse().join('');
            break;
        case 'clean-spaces':
            result = input.replace(/\s+/g, ' ').trim();
            break;
    }
    
    return result;
};

export const findReplace = (input: string, findText: string, replaceText: string): string => {
    if (!findText) return input;
    const regex = new RegExp(findText, 'g');
    return input.replace(regex, replaceText);
};

