"use client";
import { Settings, Wand2, Lock, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { YouTubeToolProps, YouTubeSettings } from '@/components/types/youtube/types';

interface YouTubeSettingsPanelProps {
    type: YouTubeToolProps['type'];
    input: string;
    setInput: (value: string) => void;
    settings: YouTubeSettings;
    setSettings: (settings: YouTubeSettings) => void;
}

export function YouTubeSettingsPanel({ type, input, setInput, settings, setSettings }: YouTubeSettingsPanelProps) {
    const t = useTranslations('YouTubeTools');

    const renderSettings = () => {
        if (type === 'youtube-embed-code-generator') {
            return (
                <div className="flex flex-wrap gap-4 mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings.autoplay}
                            onChange={(e) => setSettings({ ...settings, autoplay: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span>{t('autoplay')}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings.loop}
                            onChange={(e) => setSettings({ ...settings, loop: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span>{t('loop')}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={!settings.controls}
                            onChange={(e) => setSettings({ ...settings, controls: !e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span>{t('hideControls')}</span>
                    </label>
                </div>
            );
        }
        if (type === 'youtube-timestamp-link-generator') {
            return (
                <div className="mb-4">
                    <label className="block text-sm font-medium text-foreground mb-1">{t('startTime')}</label>
                    <input
                        type="text"
                        value={settings.startTime}
                        onChange={(e) => setSettings({ ...settings, startTime: e.target.value })}
                        placeholder={t('startTimePlaceholder')}
                        className="w-full p-2 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-input text-foreground"
                    />
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-card flex-1 p-8 rounded-[2.5rem] border border-border shadow-2xl flex flex-col">
            <div className="flex-1 space-y-8 overflow-y-auto no-scrollbar pr-1">
                <div className="flex items-center gap-3 text-primary border-b border-border pb-6">
                    <Settings className="w-5 h-5" />
                    <h4 className="font-black uppercase tracking-[0.2em] text-xs leading-none">Parameters</h4>
                </div>

                <div className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Input URL / ID</label>
                        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="w-full p-4 border-2 border-border rounded-xl bg-muted focus:border-primary outline-none transition-all text-xs font-bold" />
                    </div>

                    <div className="space-y-4">
                        {renderSettings()}
                    </div>
                </div>

                <div className="p-6 bg-blue-500/5 rounded-2xl border border-blue-500/10 space-y-2">
                    <div className="flex items-center gap-2 text-blue-500">
                        <Wand2 size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Growth Expert Tip</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
                        {t('tipText')}
                    </p>
                </div>
            </div>

            <div className="pt-8 mt-auto space-y-4 border-t border-border">
                <div className="flex items-center justify-center gap-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/30">
                    <div className="flex items-center gap-1.5"><Lock size={12} /> Secure</div>
                    <div className="flex items-center gap-1.5"><RefreshCw size={12} /> Real-time</div>
                </div>
            </div>
        </div>
    );
}

