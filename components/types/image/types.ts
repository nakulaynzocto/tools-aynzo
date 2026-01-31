export interface ProcessedFile {
    id: string;
    file: File;
    status: 'pending' | 'processing' | 'done' | 'error';
    resultBlob?: Blob | string;
    resultSize?: number;
    preview?: string;
}

export interface ImageToolProps {
    type: string;
}

export type ToolCategory = 
    | 'base64' 
    | 'optimize' 
    | 'convert' 
    | 'edit' 
    | 'filter';

export const TOOL_CATEGORIES: Record<string, ToolCategory> = {
    // Base64 tools
    'image-to-base64': 'base64',
    'base64-to-image': 'base64',
    
    // Optimize tools
    'image-compressor': 'optimize',
    'image-resizer': 'optimize',
    'image-enlarger': 'optimize',
    
    // Convert tools
    'jpg-to-png': 'convert',
    'png-to-jpg': 'convert',
    'webp-converter': 'convert',
    'jpg-to-webp': 'convert',
    'png-to-webp': 'convert',
    'webp-to-png': 'convert',
    'webp-to-jpg': 'convert',
    'svg-to-png': 'convert',
    'png-to-svg': 'convert',
    'jpg-to-svg': 'convert',
    'webp-to-svg': 'convert',
    
    // Edit tools
    'image-cropper': 'edit',
    'rotate-image': 'edit',
    'flip-image': 'edit',
    'image-border': 'edit',
    
    // Filter tools
    'grayscale-image': 'filter',
    'sepia-converter': 'filter',
    'invert-image': 'filter',
    'blur-image': 'filter',
    'image-brightness': 'filter',
    'image-contrast': 'filter',
    'saturate-image': 'filter',
    'hue-rotate-image': 'filter',
    'image-opacity': 'filter',
    'round-corners-image': 'filter',
    'image-shadow': 'filter',
    'pixelate-image': 'filter',
};
