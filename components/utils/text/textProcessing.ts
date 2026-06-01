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

// Advanced text transformations
export const transformAdvancedText = (input: string, action: string): string => {
    if (!input) return input;

    switch (action) {
        case 'italic-text':
            // Unicode italic characters
            return input.split('').map(char => {
                const code = char.charCodeAt(0);
                if (code >= 65 && code <= 90) return String.fromCodePoint(code + 120205); // A-Z
                if (code >= 97 && code <= 122) return String.fromCodePoint(code + 120211); // a-z
                return char;
            }).join('');
        
        case 'bold-text':
            // Unicode bold characters
            return input.split('').map(char => {
                const code = char.charCodeAt(0);
                if (code >= 65 && code <= 90) return String.fromCodePoint(code + 120211); // A-Z
                if (code >= 97 && code <= 122) return String.fromCodePoint(code + 120205); // a-z
                if (code >= 48 && code <= 57) return String.fromCodePoint(code + 120764); // 0-9
                return char;
            }).join('');
        
        case 'strikethrough-text':
            return input.split('').map(char => char + '\u0336').join('');
        
        case 'underline-text':
            return input.split('').map(char => char + '\u0332').join('');
        
        case 'double-underline-text':
            return input.split('').map(char => char + '\u0333').join('');
        
        case 'small-text':
            // Unicode small caps / subscript
            return input.split('').map(char => {
                const code = char.charCodeAt(0);
                if (code >= 65 && code <= 90) return String.fromCharCode(code + 7424); // A-Z to small caps
                if (code >= 97 && code <= 122) return String.fromCharCode(code - 32 + 7424); // a-z to small caps
                return char;
            }).join('');
        
        case 'upside-down-text':
            const upsideDownMap: { [key: string]: string } = {
                'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ',
                'i': 'ᴉ', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd',
                'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x',
                'y': 'ʎ', 'z': 'z', 'A': '∀', 'B': 'ᗺ', 'C': 'Ɔ', 'D': 'ᗡ', 'E': 'Ǝ', 'F': 'Ⅎ',
                'G': 'פ', 'H': 'H', 'I': 'I', 'J': 'ſ', 'K': 'ʞ', 'L': '˥', 'M': 'W', 'N': 'N',
                'O': 'O', 'P': 'Ԁ', 'Q': 'Q', 'R': 'ᴿ', 'S': 'S', 'T': '┴', 'U': '∩', 'V': 'Λ',
                'W': 'M', 'X': 'X', 'Y': '⅄', 'Z': 'Z', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ',
                '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6', '0': '0'
            };
            return input.split('').reverse().map(char => upsideDownMap[char] || char).join('');
        
        case 'mirror-text':
            return input.split('').reverse().join('');
        
        case 'cursive-text':
            // Unicode cursive/script characters
            const cursiveMap: { [key: string]: string } = {
                'a': '𝒶', 'b': '𝒷', 'c': '𝒸', 'd': '𝒹', 'e': '𝑒', 'f': '𝒻', 'g': '𝑔', 'h': '𝒽',
                'i': '𝒾', 'j': '𝒿', 'k': '𝓀', 'l': '𝓁', 'm': '𝓂', 'n': '𝓃', 'o': '𝑜', 'p': '𝓅',
                'q': '𝓆', 'r': '𝓇', 's': '𝓈', 't': '𝓉', 'u': '𝓊', 'v': '𝓋', 'w': '𝓌', 'x': '𝓍',
                'y': '𝓎', 'z': '𝓏', 'A': '𝒜', 'B': 'ℬ', 'C': '𝒞', 'D': '𝒟', 'E': 'ℰ', 'F': 'ℱ',
                'G': '𝒢', 'H': 'ℋ', 'I': 'ℐ', 'J': '𝒥', 'K': '𝒦', 'L': 'ℒ', 'M': 'ℳ', 'N': '𝒩',
                'O': '𝒪', 'P': '𝒫', 'Q': '𝒬', 'R': 'ℛ', 'S': '𝒮', 'T': '𝒯', 'U': '𝒰', 'V': '𝒱',
                'W': '𝒲', 'X': '𝒳', 'Y': '𝒴', 'Z': '𝒵'
            };
            return input.split('').map(char => cursiveMap[char] || char).join('');
        
        case 'remove-duplicate-lines':
            const lines = input.split('\n');
            const seen = new Set<string>();
            return lines.filter(line => {
                const trimmed = line.trim();
                if (trimmed && !seen.has(trimmed)) {
                    seen.add(trimmed);
                    return true;
                }
                return !trimmed; // Keep empty lines
            }).join('\n');
        
        case 'sort-alphabetically':
            return input.split('\n').sort((a, b) => a.localeCompare(b)).join('\n');
        
        case 'remove-extra-spaces':
            return input.replace(/\s+/g, ' ').trim();
        
        default:
            return input;
    }
};

