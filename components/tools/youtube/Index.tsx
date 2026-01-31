"use client";
import { useState } from 'react';
import { Image, Tags, Type, Code, Clock, Video } from 'lucide-react';
import { ScrollableNav } from '@/components/common/components/ScrollableNav';
import { YouTubeToolProps, YouTubeSettings, YouTubeThumbnails } from '@/components/types/youtube/types';
import { useYouTubeProcessing } from '@/components/hooks/youtube/useYouTubeProcessing';
import { ThumbnailDownloader } from './ThumbnailDownloader';
import { TagGenerator } from './TagGenerator';
import { TitleGenerator } from './TitleGenerator';
import { EmbedCodeGenerator } from './EmbedCodeGenerator';
import { TimestampLinkGenerator } from './TimestampLinkGenerator';
import { YouTubeInputForm } from './YouTubeInputForm';
import { YouTubeSettingsPanel } from './YouTubeSettingsPanel';

export default function YouTubeToolsIndex({ type }: YouTubeToolProps) {
    const youtubeNavTools = [
        {
            category: 'YouTube Tools',
            tools: [
                { id: 'youtube-thumbnail-downloader', label: 'Thumbnail', icon: Image },
                { id: 'youtube-tag-generator', label: 'Tags', icon: Tags },
                { id: 'youtube-title-generator', label: 'Titles', icon: Type },
                { id: 'youtube-embed-code-generator', label: 'Embed', icon: Code },
                { id: 'youtube-timestamp-link-generator', label: 'Timestamp', icon: Clock },
            ]
        }
    ];

    const activeCategory = youtubeNavTools.find(cat => cat.tools.some(t => t.id === type));
    
    const [input, setInput] = useState('');
    const [copied, setCopied] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [settings, setSettings] = useState<YouTubeSettings>({
        autoplay: false,
        loop: false,
        controls: true,
        startTime: '',
    });

    const { result, loading, setLoading, setResult } = useYouTubeProcessing(type, input, settings);

    const copyToClipboard = (text: string, index?: number) => {
        navigator.clipboard.writeText(text);
        if (typeof index === 'number') {
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        } else {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const renderTool = () => {
        if (!result) return null;

        switch (type) {
            case 'youtube-thumbnail-downloader':
                return <ThumbnailDownloader result={result as YouTubeThumbnails} />;
            case 'youtube-tag-generator':
                return <TagGenerator result={result as string} copied={copied} onCopy={() => copyToClipboard(result as string)} />;
            case 'youtube-title-generator':
                return <TitleGenerator result={result as string[]} copiedIndex={copiedIndex} onCopy={copyToClipboard} />;
            case 'youtube-embed-code-generator':
                return <EmbedCodeGenerator result={result as string} copied={copied} onCopy={() => copyToClipboard(result as string)} />;
            case 'youtube-timestamp-link-generator':
                return <TimestampLinkGenerator result={result as string} copied={copied} onCopy={() => copyToClipboard(result as string)} />;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-4">
            {activeCategory && (
                <ScrollableNav items={[{ category: activeCategory.category, tools: activeCategory.tools }]} activeToolId={type} />
            )}

            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">
                <div className="p-4 md:p-6">
                    {!result ? (
                        <YouTubeInputForm type={type} input={input} setInput={setInput} loading={loading} setLoading={setLoading} />
                    ) : (
                        <div className="grid lg:grid-cols-[1fr,350px] gap-8 items-stretch lg:h-[500px] h-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex flex-col gap-6 h-full min-h-0">
                                <div className="flex items-center justify-between px-6 py-4 bg-muted/50 rounded-2xl border border-border">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                            <Video className="w-5 h-5" />
                                        </div>
                                        <div className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                                            {type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                        </div>
                                    </div>
                                    <button onClick={() => { setInput(''); setResult(null); }} className="text-[10px] font-black uppercase tracking-widest text-destructive hover:underline">New Analysis</button>
                                </div>
                                <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pr-1">
                                    {renderTool()}
                                </div>
                            </div>
                            <YouTubeSettingsPanel type={type} input={input} setInput={setInput} settings={settings} setSettings={setSettings} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

