export interface TextToolProps {
    type: 'word-counter' | 'character-counter' | 'text-case-converter' | 'remove-line-breaks' | 'reverse-text';
    hideNavigation?: boolean;
}

export interface AdvancedTextToolProps {
    type: 'italic-text' | 'strikethrough-text' | 'underline-text' | 'small-text' | 'upside-down-text' | 'mirror-text' | 'duplicate-line-remover' | 'sort-alphabetically' | 'whitespace-remover' | 'word-frequency' | 'find-replace' | 'bold-text' | 'cursive-text' | 'double-underline-text';
}

export interface TextStats {
    words: number;
    chars: number;
    charsNoSpace: number;
    sentences: number;
    paragraphs: number;
    lines: number;
    readingTime: number;
}

export interface KeywordDensity {
    word: string;
    count: number;
    percentage: number;
}

