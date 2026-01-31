export interface YouTubeToolProps {
    type:
    | 'youtube-thumbnail-downloader'
    | 'youtube-tag-generator'
    | 'youtube-title-generator'
    | 'youtube-embed-code-generator'
    | 'youtube-timestamp-link-generator';
}

export interface YouTubeSettings {
    autoplay: boolean;
    loop: boolean;
    controls: boolean;
    startTime: string;
}

export interface YouTubeThumbnails {
    max: string;
    hd: string;
    hq: string;
    mq: string;
}

export type YouTubeResult = YouTubeThumbnails | string | string[];


