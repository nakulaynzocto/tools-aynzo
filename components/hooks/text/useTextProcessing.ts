import { useState, useEffect } from 'react';
import { TextStats, KeywordDensity } from '@/components/types/text/types';
import { calculateTextStats, calculateKeywordDensity } from '@/components/utils/text/textProcessing';

export const useTextProcessing = (input: string) => {
    const [stats, setStats] = useState<TextStats>({
        words: 0,
        chars: 0,
        charsNoSpace: 0,
        sentences: 0,
        paragraphs: 0,
        lines: 0,
        readingTime: 0,
    });
    const [keywordDensity, setKeywordDensity] = useState<KeywordDensity[]>([]);

    useEffect(() => {
        const newStats = calculateTextStats(input);
        setStats(newStats);
        
        const density = calculateKeywordDensity(input, newStats.words);
        setKeywordDensity(density);
    }, [input]);

    return { stats, keywordDensity };
};

