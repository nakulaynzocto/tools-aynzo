"use client";
import { Image as ImageIcon, FileArchive, Wand2, Upload, RotateCw, MoveHorizontal, Sliders, FileText, Hash, Type, MoveVertical, RefreshCw } from 'lucide-react';
import { ScrollableNav } from '@/components/common/components/ScrollableNav';
import { Base64Tools } from './Base64Tools';
import { ImageOptimizeTools } from './ImageOptimizeTools';
import { ImageConvertTools } from './ImageConvertTools';
import { ImageEditTools } from './ImageEditTools';
import { ImageFilterTools } from './ImageFilterTools';
import { ImageToolProps } from '@/components/types/image/types';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

const TextTools = dynamic(() => import('@/components/tools/text/Index'));

export default function ImageToolsIndex({ type }: ImageToolProps) {
    const tTools = useTranslations('Tools');
    const tTextTools = useTranslations('TextTools');
    
    // Helper function to get translated tool name
    const getToolLabel = (toolId: string, fallback: string): string => {
        try {
            const translated = tTools(`${toolId}.name`);
            // If translation exists and is not the key itself, use it
            if (translated && translated !== `${toolId}.name`) {
                return translated;
            }
            return fallback;
        } catch {
            return fallback;
        }
    };
    
    // Helper function to get translated category name
    const getCategoryLabel = (categoryKey: string): string => {
        // Map category keys to translation keys or use fallback
        const categoryTranslations: Record<string, string> = {
            'ANALYSIS': 'ANALYSIS',
            'MANIPULATION': 'MANIPULATION',
            'OPTIMIZE': 'OPTIMIZE',
            'CONVERT': 'CONVERT',
            'BASE64': 'BASE64',
            'EDIT': 'EDIT',
            'FILTERS': 'FILTERS'
        };
        return categoryTranslations[categoryKey] || categoryKey;
    };
    
    // Navigation tools configuration with translations
    const imageNavTools = [
        {
            category: getCategoryLabel('OPTIMIZE'),
            tools: [
                { id: 'image-compressor', label: getToolLabel('image-compressor', 'Image Compressor'), icon: FileArchive },
                { id: 'image-resizer', label: getToolLabel('image-resizer', 'Image Resizer'), icon: Sliders },
                { id: 'image-enlarger', label: getToolLabel('image-enlarger', 'Image Enlarger'), icon: Sliders },
            ]
        },
        {
            category: getCategoryLabel('CONVERT'),
            tools: [
                { id: 'jpg-to-png', label: getToolLabel('jpg-to-png', 'JPG to PNG'), icon: ImageIcon },
                { id: 'png-to-jpg', label: getToolLabel('png-to-jpg', 'PNG to JPG'), icon: ImageIcon },
                { id: 'webp-converter', label: getToolLabel('webp-converter', 'WebP Converter'), icon: ImageIcon },
                { id: 'svg-to-png', label: getToolLabel('svg-to-png', 'SVG to PNG'), icon: ImageIcon },
                { id: 'png-to-svg', label: getToolLabel('png-to-svg', 'PNG to SVG'), icon: ImageIcon },
                { id: 'webp-to-jpg', label: getToolLabel('webp-to-jpg', 'WebP to JPG'), icon: ImageIcon },
                { id: 'webp-to-png', label: getToolLabel('webp-to-png', 'WebP to PNG'), icon: ImageIcon },
                { id: 'jpg-to-webp', label: getToolLabel('jpg-to-webp', 'JPG to WebP'), icon: ImageIcon },
                { id: 'png-to-webp', label: getToolLabel('png-to-webp', 'PNG to WebP'), icon: ImageIcon }
            ]
        },
        {
            category: getCategoryLabel('BASE64'),
            tools: [
                { id: 'image-to-base64', label: getToolLabel('image-to-base64', 'Image to Base64'), icon: FileArchive },
                { id: 'base64-to-image', label: getToolLabel('base64-to-image', 'Base64 to Image'), icon: FileArchive }
            ]
        },
        {
            category: getCategoryLabel('EDIT'),
            tools: [
                { id: 'image-cropper', label: getToolLabel('image-cropper', 'Image Cropper'), icon: Upload },
                { id: 'rotate-image', label: getToolLabel('rotate-image', 'Rotate Image'), icon: RotateCw },
                { id: 'flip-image', label: getToolLabel('flip-image', 'Flip Image'), icon: MoveHorizontal },
                { id: 'image-border', label: getToolLabel('image-border', 'Add Border'), icon: Wand2 }
            ]
        },
        {
            category: getCategoryLabel('FILTERS'),
            tools: [
                { id: 'grayscale-image', label: getToolLabel('grayscale-image', 'Grayscale'), icon: Wand2 },
                { id: 'sepia-converter', label: getToolLabel('sepia-converter', 'Sepia'), icon: Wand2 },
                { id: 'invert-image', label: getToolLabel('invert-image', 'Invert'), icon: Wand2 },
                { id: 'blur-image', label: getToolLabel('blur-image', 'Blur'), icon: Wand2 },
                { id: 'image-brightness', label: getToolLabel('image-brightness', 'Brightness'), icon: Wand2 },
                { id: 'image-contrast', label: getToolLabel('image-contrast', 'Contrast'), icon: Wand2 },
                { id: 'saturate-image', label: getToolLabel('saturate-image', 'Saturate'), icon: Wand2 },
                { id: 'hue-rotate-image', label: getToolLabel('hue-rotate-image', 'Hue Rotate'), icon: Wand2 },
                { id: 'image-opacity', label: getToolLabel('image-opacity', 'Opacity'), icon: Wand2 },
                { id: 'round-corners-image', label: getToolLabel('round-corners-image', 'Round Corners'), icon: Wand2 },
                { id: 'image-shadow', label: getToolLabel('image-shadow', 'Add Shadow'), icon: Wand2 },
                { id: 'pixelate-image', label: getToolLabel('pixelate-image', 'Pixelate'), icon: Wand2 }
            ]
        },
        {
            category: getCategoryLabel('ANALYSIS'),
            tools: [
                { id: 'word-counter', label: getToolLabel('word-counter', 'Word Count'), icon: FileText },
                { id: 'character-counter', label: getToolLabel('character-counter', 'Character Counter'), icon: Hash },
            ]
        },
        {
            category: getCategoryLabel('MANIPULATION'),
            tools: [
                { id: 'text-case-converter', label: getToolLabel('text-case-converter', 'Text Case Converter'), icon: Type },
                { id: 'remove-line-breaks', label: getToolLabel('remove-line-breaks', 'Remove Line Breaks'), icon: MoveVertical },
                { id: 'reverse-text', label: (() => {
                    try {
                        return tTextTools('reverseText');
                    } catch {
                        return getToolLabel('reverse-text', 'Reverse Text');
                    }
                })(), icon: RefreshCw },
            ]
        }
    ];

    const activeCategory = imageNavTools.find(cat =>
        cat.tools.some(t => t.id === type)
    );

    const isImageTool = imageNavTools.some(cat =>
        cat.tools.some(t => t.id === type)
    );

    // Route text tools (Analysis & Manipulation)
    const textTools = [
        'word-counter', 'character-counter', 'text-case-converter',
        'remove-line-breaks', 'reverse-text'
    ];
    
    // If it's a text tool, show navigation and route to TextTools
    if (textTools.includes(type)) {
        return (
            <div className="max-w-6xl mx-auto space-y-3 sm:space-y-4 px-2 sm:px-4">
                {isImageTool && activeCategory && (
                    <ScrollableNav
                        items={[{ category: activeCategory.category, tools: activeCategory.tools }]}
                        activeToolId={type}
                    />
                )}
                <TextTools type={type as any} hideNavigation={true} />
            </div>
        );
    }

    // Route base64 tools to dedicated component
    const [quality] = [80]; // Default quality for base64 tools
    if (type === 'image-to-base64' || type === 'base64-to-image') {
        return (
            <div className="max-w-6xl mx-auto space-y-3 sm:space-y-4 px-2 sm:px-4">
                {isImageTool && activeCategory && (
                    <ScrollableNav
                        items={[{ category: activeCategory.category, tools: activeCategory.tools }]}
                        activeToolId={type}
                    />
                )}
                <Base64Tools type={type} quality={quality} />
            </div>
        );
    }

    // Route optimize tools
    if (type === 'image-compressor' || type === 'image-resizer' || type === 'image-enlarger') {
        return (
            <div className="max-w-6xl mx-auto space-y-3 sm:space-y-4 px-2 sm:px-4">
                {isImageTool && activeCategory && (
                    <ScrollableNav
                        items={[{ category: activeCategory.category, tools: activeCategory.tools }]}
                        activeToolId={type}
                    />
                )}
                <ImageOptimizeTools type={type} />
            </div>
        );
    }

    // Route convert tools
    const convertTools = [
        'jpg-to-png', 'png-to-jpg', 'webp-converter', 'jpg-to-webp',
        'png-to-webp', 'webp-to-jpg', 'webp-to-png', 'svg-to-png',
        'png-to-svg', 'jpg-to-svg', 'webp-to-svg'
    ];
    if (convertTools.includes(type)) {
        return (
            <div className="max-w-6xl mx-auto space-y-3 sm:space-y-4 px-2 sm:px-4">
                {isImageTool && activeCategory && (
                    <ScrollableNav
                        items={[{ category: activeCategory.category, tools: activeCategory.tools }]}
                        activeToolId={type}
                    />
                )}
                <ImageConvertTools type={type as any} />
            </div>
        );
    }

    // Route edit tools
    if (type === 'image-cropper' || type === 'rotate-image' || type === 'flip-image' || type === 'image-border') {
        return (
            <div className="max-w-6xl mx-auto space-y-3 sm:space-y-4 px-2 sm:px-4">
                {isImageTool && activeCategory && (
                    <ScrollableNav
                        items={[{ category: activeCategory.category, tools: activeCategory.tools }]}
                        activeToolId={type}
                    />
                )}
                <ImageEditTools type={type as any} />
            </div>
        );
    }

    // Route filter tools
    const filterTools = [
        'grayscale-image', 'sepia-converter', 'invert-image', 'blur-image',
        'image-brightness', 'image-contrast', 'saturate-image',
        'hue-rotate-image', 'image-opacity', 'round-corners-image',
        'image-shadow', 'pixelate-image'
    ];
    if (filterTools.includes(type)) {
        return (
            <div className="max-w-6xl mx-auto space-y-3 sm:space-y-4 px-2 sm:px-4">
                {isImageTool && activeCategory && (
                    <ScrollableNav
                        items={[{ category: activeCategory.category, tools: activeCategory.tools }]}
                        activeToolId={type}
                    />
                )}
                <ImageFilterTools type={type as any} />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-3 sm:space-y-4 px-2 sm:px-4">
            {isImageTool && activeCategory && (
                <ScrollableNav
                    items={[{ category: activeCategory.category, tools: activeCategory.tools }]}
                    activeToolId={type}
                />
            )}

            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">
                <div className="p-3 sm:p-4 md:p-6">
                    <div className="text-center text-muted-foreground py-12">
                        <p className="text-lg font-bold mb-2">Tool not found</p>
                        <p className="text-sm">The tool type "{type}" is not recognized.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

