import { useState, useEffect } from 'react';
import { YouTubeToolProps, YouTubeSettings, YouTubeResult } from '@/components/types/youtube/types';
import {
    extractVideoId,
    generateThumbnails,
    generateTags,
    generateTitles,
    generateEmbedCode,
    generateTimestampLink,
} from '@/components/utils/youtube/youtubeProcessing';

export const useYouTubeProcessing = (type: YouTubeToolProps['type'], input: string, settings: YouTubeSettings) => {
    const [result, setResult] = useState<YouTubeResult | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!input.trim()) {
            setResult(null);
            return;
        }

        const processTool = () => {
            switch (type) {
                case 'youtube-thumbnail-downloader':
                    const videoId = extractVideoId(input);
                    if (!videoId) {
                        setResult(null);
                        return;
                    }
                    setResult(generateThumbnails(videoId));
                    break;

                case 'youtube-tag-generator':
                    setResult(generateTags(input));
                    break;

                case 'youtube-title-generator':
                    setResult(generateTitles(input));
                    break;

                case 'youtube-embed-code-generator':
                    const embedId = extractVideoId(input);
                    if (!embedId) {
                        setResult(null);
                        return;
                    }
                    setResult(generateEmbedCode(embedId, settings));
                    break;

                case 'youtube-timestamp-link-generator':
                    const timeId = extractVideoId(input);
                    if (!timeId) {
                        setResult(null);
                        return;
                    }
                    setResult(generateTimestampLink(timeId, settings.startTime));
                    break;
            }
        };

        const timeoutId = setTimeout(() => {
            processTool();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [input, type, settings]);

    return { result, loading, setLoading, setResult };
};

