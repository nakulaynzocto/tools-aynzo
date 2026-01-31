"use client";
import { RefreshCw, Play, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { YouTubeToolProps } from '@/components/types/youtube/types';

interface YouTubeInputFormProps {
    type: YouTubeToolProps['type'];
    input: string;
    setInput: (value: string) => void;
    loading: boolean;
    setLoading: (value: boolean) => void;
}

export function YouTubeInputForm({ type, input, setInput, loading, setLoading }: YouTubeInputFormProps) {
    const t = useTranslations('YouTubeTools');

    return (
        <div className="min-h-[300px] flex flex-col items-center justify-center transition-all py-12 px-4 relative">
            <div className="relative z-10 w-full max-w-2xl text-center space-y-8">
                <div className="space-y-4">
                    <label className="block text-xs font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">
                        {type === 'youtube-tag-generator' || type === 'youtube-title-generator'
                            ? t('enterTopic')
                            : t('videoUrl')}
                    </label>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={type.includes('generator') && !type.includes('embed') && !type.includes('link')
                            ? t('topicPlaceholder')
                            : t('urlPlaceholder')}
                        className="w-full p-6 text-xl border-2 border-border rounded-3xl bg-input hover:border-primary focus:border-primary outline-none transition-all text-foreground font-medium text-center shadow-inner"
                    />
                </div>

                <button
                    onClick={() => {
                        if (input.trim()) {
                            setLoading(true);
                            setTimeout(() => setLoading(false), 800);
                        }
                    }}
                    className="px-12 py-5 bg-primary text-white dark:bg-gradient-to-r dark:from-sky-500 dark:to-blue-600 dark:border-none text-xl font-black rounded-2xl shadow-[0_20px_40px_-15px_rgba(var(--primary-rgb),0.4)] dark:shadow-[0_0_30px_-5px_rgba(14,165,233,0.4)] hover:scale-[1.05] hover:shadow-[0_25px_50px_-12px_rgba(var(--primary-rgb),0.5)] dark:hover:shadow-[0_0_40px_-5px_rgba(14,165,233,0.5)] active:scale-95 transition-all duration-300"
                >
                    {loading ? <RefreshCw className="w-6 h-6 animate-spin mx-auto" /> : t('analyze')}
                </button>

                <div className="pt-8 flex justify-center gap-8 border-t border-border/50">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">
                        <Play size={14} className="text-red-500" /> Fast Extract
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">
                        <CheckCircle2 size={14} className="text-emerald-500" /> 100% Free
                    </div>
                </div>
            </div>
        </div>
    );
}

