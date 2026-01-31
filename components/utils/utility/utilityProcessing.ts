export const generateLoremIpsum = (paragraphs: number = 3, sentencesPerParagraph: number = 5): string => {
    const words = [
        'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
        'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
        'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation',
        'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat'
    ];
    
    const generateSentence = () => {
        const sentenceLength = Math.floor(Math.random() * 10) + 8;
        const sentenceWords = [];
        for (let i = 0; i < sentenceLength; i++) {
            sentenceWords.push(words[Math.floor(Math.random() * words.length)]);
        }
        return sentenceWords.join(' ').charAt(0).toUpperCase() + sentenceWords.join(' ').slice(1) + '.';
    };
    
    const result = [];
    for (let p = 0; p < paragraphs; p++) {
        const paragraph = [];
        for (let s = 0; s < sentencesPerParagraph; s++) {
            paragraph.push(generateSentence());
        }
        result.push(paragraph.join(' '));
    }
    
    return result.join('\n\n');
};

