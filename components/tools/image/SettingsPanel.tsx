"use client";
import { Settings, Sliders } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useTranslations } from 'next-intl';

interface SettingsPanelProps {
    quality: number;
    onQualityChange: (value: number) => void;
    width?: number;
    height?: number;
    onWidthChange?: (value: number) => void;
    onHeightChange?: (value: number) => void;
    maintainAspectRatio?: boolean;
    onMaintainAspectRatioChange?: (value: boolean) => void;
    filterValue?: number;
    onFilterValueChange?: (value: number) => void;
    rotation?: number;
    onRotationChange?: (value: number) => void;
    flipH?: boolean;
    flipV?: boolean;
    onFlipHChange?: (value: boolean) => void;
    onFlipVChange?: (value: boolean) => void;
    size?: number;
    onSizeChange?: (value: number) => void;
    showQuality?: boolean;
    showDimensions?: boolean;
    showFilters?: boolean;
    showRotation?: boolean;
    showFlip?: boolean;
    showSize?: boolean;
    sizeLabel?: string;
    sizeMin?: number;
    sizeMax?: number;
    filterLabel?: string;
    showBorder?: boolean;
    borderWidth?: number;
    borderColor?: string;
    onBorderWidthChange?: (value: number) => void;
    onBorderColorChange?: (value: string) => void;
    className?: string;
    originalWidth?: number;
    originalHeight?: number;
    onPercentageResize?: (percent: number) => void;
}

export function SettingsPanel({
    quality,
    onQualityChange,
    width,
    height,
    onWidthChange,
    onHeightChange,
    maintainAspectRatio,
    onMaintainAspectRatioChange,
    filterValue,
    onFilterValueChange,
    rotation,
    onRotationChange,
    flipH,
    flipV,
    onFlipHChange,
    onFlipVChange,
    size,
    onSizeChange,
    showQuality = true,
    showDimensions = false,
    showFilters = false,
    showRotation = false,
    showFlip = false,
    showSize = false,
    sizeLabel = 'Size',
    sizeMin = 1,
    sizeMax = 50,
    filterLabel = 'Intensity',
    showBorder = false,
    borderWidth,
    borderColor,
    onBorderWidthChange,
    onBorderColorChange,
    className,
    originalWidth,
    originalHeight,
    onPercentageResize,
}: SettingsPanelProps) {
    const t = useTranslations('Common');

    return (
        <div className={cn("bg-muted/30 rounded-xl p-4 border border-border space-y-4", className)}>
            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-foreground">
                <Settings size={16} />
                {t('settings')}
            </div>

            {showQuality && (
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-foreground">{t('quality')}: {quality}%</label>
                        <span className="text-[10px] text-muted-foreground">{t('tipQuality')}</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="100"
                        value={quality}
                        onChange={(e) => onQualityChange(Number(e.target.value))}
                        className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                </div>
            )}

            {showDimensions && onWidthChange && onHeightChange && onMaintainAspectRatioChange && (
                <div className="space-y-3">
                    {/* Quick Percentage Buttons */}
                    {originalWidth && originalHeight && (
                        <div>
                            <label className="text-xs font-bold text-foreground block mb-2">Quick Resize</label>
                            <div className="grid grid-cols-3 gap-2">
                                {[25, 50, 75, 100, 150, 500].map((percent) => (
                                    <button
                                        key={percent}
                                        type="button"
                                        onClick={() => {
                                            if (onPercentageResize) {
                                                onPercentageResize(percent);
                                            }
                                        }}
                                        className="px-3 py-1.5 text-xs font-bold bg-muted hover:bg-primary hover:text-white rounded-lg border border-border transition-all"
                                    >
                                        {percent}%
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-foreground block mb-1">Width</label>
                            <input
                                type="number"
                                value={width || ''}
                                onChange={(e) => onWidthChange(Number(e.target.value))}
                                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                                placeholder="Auto"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-foreground block mb-1">Height</label>
                            <input
                                type="number"
                                value={height || ''}
                                onChange={(e) => onHeightChange(Number(e.target.value))}
                                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                                placeholder="Auto"
                            />
                        </div>
                    </div>
                    <label className="flex items-center gap-2 text-xs text-foreground">
                        <input
                            type="checkbox"
                            checked={maintainAspectRatio}
                            onChange={(e) => onMaintainAspectRatioChange(e.target.checked)}
                            className="rounded"
                        />
                        Maintain Aspect Ratio
                    </label>
                </div>
            )}

            {showFilters && onFilterValueChange && (
                <div>
                    <label className="text-xs font-bold text-foreground block mb-2">
                        {filterLabel}: {filterValue}{filterLabel === 'Radius' ? 'px' : '%'}
                    </label>
                    <input
                        type="range"
                        min="0"
                        max={filterLabel === 'Radius' ? 200 : 100}
                        value={filterValue}
                        onChange={(e) => onFilterValueChange(Number(e.target.value))}
                        className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                </div>
            )}

            {showRotation && onRotationChange && (
                <div>
                    <label className="text-xs font-bold text-foreground block mb-2">Rotation: {rotation}°</label>
                    <input
                        type="range"
                        min="0"
                        max="360"
                        value={rotation}
                        onChange={(e) => onRotationChange(Number(e.target.value))}
                        className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                </div>
            )}

            {showFlip && onFlipHChange && onFlipVChange && (
                <div className="flex gap-3">
                    <label className="flex items-center gap-2 text-xs text-foreground">
                        <input
                            type="checkbox"
                            checked={flipH}
                            onChange={(e) => onFlipHChange(e.target.checked)}
                            className="rounded"
                        />
                        Flip Horizontal
                    </label>
                    <label className="flex items-center gap-2 text-xs text-foreground">
                        <input
                            type="checkbox"
                            checked={flipV}
                            onChange={(e) => onFlipVChange(e.target.checked)}
                            className="rounded"
                        />
                        Flip Vertical
                    </label>
                </div>
            )}

            {showSize && onSizeChange && (
                <div>
                    <label className="text-xs font-bold text-foreground block mb-2">{sizeLabel}: {size}px</label>
                    <input
                        type="range"
                        min={sizeMin}
                        max={sizeMax}
                        value={size}
                        onChange={(e) => onSizeChange(Number(e.target.value))}
                        className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                </div>
            )}

            {showBorder && onBorderWidthChange && onBorderColorChange && (
                <div className="space-y-3">
                    <div>
                        <label className="text-xs font-bold text-foreground block mb-2">Border Width: {borderWidth}px</label>
                        <input
                            type="range"
                            min="1"
                            max="100"
                            value={borderWidth || 10}
                            onChange={(e) => onBorderWidthChange(Number(e.target.value))}
                            className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-foreground block mb-2">Border Color</label>
                        <div className="flex gap-2 items-center">
                            <input
                                type="color"
                                value={borderColor || '#000000'}
                                onChange={(e) => onBorderColorChange(e.target.value)}
                                className="w-12 h-10 rounded border border-border cursor-pointer"
                            />
                            <input
                                type="text"
                                value={borderColor || '#000000'}
                                onChange={(e) => onBorderColorChange(e.target.value)}
                                className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm"
                                placeholder="#000000"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

