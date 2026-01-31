"use client";
import { Image as ImageIcon, FileArchive, Wand2, Upload, RotateCw, MoveHorizontal, Sliders } from 'lucide-react';
import { ScrollableNav } from '@/components/common/components/ScrollableNav';
import { Base64Tools } from './Base64Tools';
import { ImageOptimizeTools } from './ImageOptimizeTools';
import { ImageConvertTools } from './ImageConvertTools';
import { ImageEditTools } from './ImageEditTools';
import { ImageFilterTools } from './ImageFilterTools';
import { ImageToolProps } from '@/components/types/image/types';

export default function ImageToolsIndex({ type }: ImageToolProps) {
    // Route base64 tools to dedicated component
    const [quality] = [80]; // Default quality for base64 tools
    if (type === 'image-to-base64' || type === 'base64-to-image') {
        return <Base64Tools type={type} quality={quality} />;
    }

    // Route optimize tools
    if (type === 'image-compressor' || type === 'image-resizer' || type === 'image-enlarger') {
        return <ImageOptimizeTools type={type} />;
    }

    // Route convert tools
    const convertTools = [
        'jpg-to-png', 'png-to-jpg', 'webp-converter', 'jpg-to-webp',
        'png-to-webp', 'webp-to-jpg', 'webp-to-png', 'svg-to-png',
        'png-to-svg', 'jpg-to-svg', 'webp-to-svg'
    ];
    if (convertTools.includes(type)) {
        return <ImageConvertTools type={type as any} />;
    }

    // Route edit tools
    if (type === 'image-cropper' || type === 'rotate-image' || type === 'flip-image' || type === 'image-border') {
        return <ImageEditTools type={type as any} />;
    }

    // Route filter tools
    const filterTools = [
        'grayscale-image', 'sepia-converter', 'invert-image', 'blur-image',
        'image-brightness', 'image-contrast', 'saturate-image',
        'hue-rotate-image', 'image-opacity', 'round-corners-image',
        'image-shadow', 'pixelate-image'
    ];
    if (filterTools.includes(type)) {
        return <ImageFilterTools type={type as any} />;
    }

    // Navigation tools configuration
    const imageNavTools = [
        {
            category: 'OPTIMIZE',
            tools: [
                { id: 'image-compressor', label: 'Image Compressor', icon: FileArchive },
                { id: 'image-resizer', label: 'Image Resizer', icon: Sliders },
                { id: 'image-enlarger', label: 'Image Enlarger', icon: Sliders },
            ]
        },
        {
            category: 'CONVERT',
            tools: [
                { id: 'jpg-to-png', label: 'JPG to PNG', icon: ImageIcon },
                { id: 'png-to-jpg', label: 'PNG to JPG', icon: ImageIcon },
                { id: 'webp-converter', label: 'WebP Converter', icon: ImageIcon },
                { id: 'svg-to-png', label: 'SVG to PNG', icon: ImageIcon },
                { id: 'png-to-svg', label: 'PNG to SVG', icon: ImageIcon },
                { id: 'webp-to-jpg', label: 'WebP to JPG', icon: ImageIcon },
                { id: 'webp-to-png', label: 'WebP to PNG', icon: ImageIcon },
                { id: 'jpg-to-webp', label: 'JPG to WebP', icon: ImageIcon },
                { id: 'png-to-webp', label: 'PNG to WebP', icon: ImageIcon }
            ]
        },
        {
            category: 'BASE64',
            tools: [
                { id: 'image-to-base64', label: 'Image to Base64', icon: FileArchive },
                { id: 'base64-to-image', label: 'Base64 to Image', icon: FileArchive }
            ]
        },
        {
            category: 'EDIT',
            tools: [
                { id: 'image-cropper', label: 'Image Cropper', icon: Upload },
                { id: 'rotate-image', label: 'Rotate Image', icon: RotateCw },
                { id: 'flip-image', label: 'Flip Image', icon: MoveHorizontal },
                { id: 'image-border', label: 'Add Border', icon: Wand2 }
            ]
        },
        {
            category: 'FILTERS',
            tools: [
                { id: 'grayscale-image', label: 'Grayscale', icon: Wand2 },
                { id: 'sepia-converter', label: 'Sepia', icon: Wand2 },
                { id: 'invert-image', label: 'Invert', icon: Wand2 },
                { id: 'blur-image', label: 'Blur', icon: Wand2 },
                { id: 'image-brightness', label: 'Brightness', icon: Wand2 },
                { id: 'image-contrast', label: 'Contrast', icon: Wand2 },
                { id: 'saturate-image', label: 'Saturate', icon: Wand2 },
                { id: 'hue-rotate-image', label: 'Hue Rotate', icon: Wand2 },
                { id: 'image-opacity', label: 'Opacity', icon: Wand2 },
                { id: 'round-corners-image', label: 'Round Corners', icon: Wand2 },
                { id: 'image-shadow', label: 'Add Shadow', icon: Wand2 },
                { id: 'pixelate-image', label: 'Pixelate', icon: Wand2 }
            ]
        }
    ];

    const activeCategory = imageNavTools.find(cat =>
        cat.tools.some(t => t.id === type)
    );

    const isImageTool = imageNavTools.some(cat =>
        cat.tools.some(t => t.id === type)
    );

    return (
        <div className="max-w-6xl mx-auto space-y-4">
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

