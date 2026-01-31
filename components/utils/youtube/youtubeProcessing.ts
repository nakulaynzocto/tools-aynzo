import { YouTubeSettings, YouTubeThumbnails } from '@/components/types/youtube/types';

export const extractVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

export const generateThumbnails = (videoId: string): YouTubeThumbnails => {
    return {
        max: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        hd: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
        hq: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        mq: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    };
};

export const generateTags = (input: string): string => {
    const keywords = input.split(' ');
    const tags = [
        ...keywords,
        `${input} tutorial`,
        `how to ${input}`,
        `best ${input}`,
        `${input} 2024`,
        `${input} guide`,
        `${input} review`,
        `${input} for beginners`,
        `learn ${input}`,
        `${input} tips`,
        `${input} tricks`,
        `${input} explained`
    ].join(', ');
    return tags;
};

export const generateTitles = (input: string): string[] => {
    return [
        `How to Master ${input} in just 10 Minutes`,
        `The Ultimate Guide to ${input} (2024 Edition)`,
        `7 Secrets About ${input} No One Tells You`,
        `Why ${input} is the Future of Everything`,
        `Stop Doing ${input} Wrong! (Watch This)`,
        `I tried ${input} for 30 Days - Here's What Happened`,
        `${input} 101: Everything You Need to Know`,
        `The Best Way to Learn ${input} Fast`
    ];
};

export const generateEmbedCode = (videoId: string, settings: YouTubeSettings): string => {
    let src = `https://www.youtube.com/embed/${videoId}?`;
    if (settings.autoplay) src += '&autoplay=1';
    if (settings.loop) src += '&loop=1';
    if (!settings.controls) src += '&controls=0';

    return `<iframe width="560" height="315" src="${src}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
};

export const generateTimestampLink = (videoId: string, startTime: string): string => {
    const timeStr = startTime || '0';
    return `https://youtu.be/${videoId}?t=${timeStr}`;
};


