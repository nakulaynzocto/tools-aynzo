import { ProcessedFile } from '@/components/types/image/types';

export const base64ToBlob = (base64: string): Blob => {
    // Clean the base64 string (remove whitespace, newlines)
    const cleaned = base64.trim().replace(/\s/g, '');
    
    let base64Data = cleaned;
    let mimeType = 'image/png'; // Default
    
    // Check if it's a data URI
    if (cleaned.startsWith('data:')) {
        const parts = cleaned.split(';base64,');
        if (parts.length === 2) {
            mimeType = parts[0].split(':')[1] || 'image/png';
            base64Data = parts[1];
        } else {
            throw new Error('Invalid data URI format');
        }
    }
    
    // Decode base64
    try {
        const raw = window.atob(base64Data);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);
        for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }
        return new Blob([uInt8Array], { type: mimeType });
    } catch (e) {
        throw new Error('Invalid Base64 string');
    }
};

export const downloadFile = (content: Blob | string, name: string) => {
    const url = typeof content === 'string' ? content : URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (typeof content !== 'string') {
        URL.revokeObjectURL(url);
    }
};

export const extractBase64String = (dataUri: string): string => {
    if (dataUri.startsWith('data:')) {
        const base64Match = dataUri.match(/^data:image\/[^;]+;base64,(.+)$/);
        if (base64Match && base64Match[1]) {
            return base64Match[1];
        } else {
            // Fallback: try to extract after comma
            const commaIndex = dataUri.indexOf(',');
            return commaIndex > -1 ? dataUri.substring(commaIndex + 1) : dataUri;
        }
    }
    return dataUri;
};

export const getMimeType = (type: string, fileType: string): string => {
    let mime = fileType || 'image/png';
    
    if (type === 'image-compressor') {
        if (mime === 'image/png' || mime === 'image/svg+xml') {
            mime = 'image/jpeg';
        }
    } else {
        if (['jpg-to-png', 'webp-to-png', 'svg-to-png'].includes(type)) mime = 'image/png';
        if (['png-to-jpg', 'webp-to-jpg'].includes(type)) mime = 'image/jpeg';
        if (['webp-converter', 'jpg-to-webp', 'png-to-webp'].includes(type)) mime = 'image/webp';
        if (['png-to-svg', 'jpg-to-svg', 'webp-to-svg'].includes(type)) mime = 'image/svg+xml';
    }
    
    return mime;
};

export const getFileExtension = (mime: string, isString: boolean = false): string => {
    let ext = mime.split('/')[1] || (isString ? 'txt' : 'png');
    if (ext === 'svg+xml') ext = 'svg';
    if (ext === 'jpeg') ext = 'jpg';
    return ext;
};
