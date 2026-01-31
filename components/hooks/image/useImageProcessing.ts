import { ProcessedFile } from '@/components/types/image/types';
import { getMimeType, getFileExtension, downloadFile } from '@/components/utils/image/imageProcessing';
import JSZip from 'jszip';

interface ProcessingOptions {
    type: string;
    quality: number;
    width?: number;
    height?: number;
    maintainAspectRatio?: boolean;
    rotation?: number;
    flipH?: boolean;
    flipV?: boolean;
    filterValue?: number;
    size?: number;
    completedCrop?: any;
    imgRef?: React.RefObject<HTMLImageElement>;
    borderWidth?: number;
    borderColor?: string;
}

export const processSingleFile = async (
    pf: ProcessedFile,
    options: ProcessingOptions
): Promise<Blob | string> => {
    const { type, quality, width, height, maintainAspectRatio, rotation, flipH, flipV, filterValue, size, completedCrop, imgRef, borderWidth, borderColor } = options;

    return new Promise((resolve, reject) => {
        const img = new Image();
        if (!pf.preview?.startsWith('blob:')) {
            img.crossOrigin = 'anonymous';
        }
        
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let w = img.width;
            let h = img.height;

            // Handle cropping
            if (type === 'image-cropper' && completedCrop && imgRef?.current) {
                const scaleX = img.naturalWidth / imgRef.current.width;
                const scaleY = img.naturalHeight / imgRef.current.height;
                const pixelCrop = completedCrop;
                canvas.width = pixelCrop.width * scaleX;
                canvas.height = pixelCrop.height * scaleY;
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject('No context');
                ctx.drawImage(
                    img,
                    pixelCrop.x * scaleX,
                    pixelCrop.y * scaleY,
                    pixelCrop.width * scaleX,
                    pixelCrop.height * scaleY,
                    0, 0, canvas.width, canvas.height
                );

                let mime = pf.file.type;
                if (mime === 'image/svg+xml') mime = 'image/png';
                const qualityValue = mime === 'image/png' ? undefined : quality / 100;

                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject('Blob failed');
                }, mime, qualityValue);
                return;
            }

            // Handle resizing
            if (type === 'image-resizer' || type === 'image-enlarger') {
                if (width && width > 0 && height && height > 0) {
                    w = width;
                    h = height;
                } else if (width && width > 0) {
                    w = width;
                    h = maintainAspectRatio ? (width / img.width) * img.height : img.height;
                } else if (height && height > 0) {
                    h = height;
                    w = maintainAspectRatio ? (height / img.height) * img.width : img.width;
                }
            }

            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject('No context');

            // For image-to-base64, just draw the image as-is
            if (type === 'image-to-base64') {
                ctx.drawImage(img, 0, 0, w, h);
            } else if (type === 'flip-image' || type === 'rotate-image') {
                const finalRotation = (rotation! % 360 + 360) % 360;
                if (finalRotation === 90 || finalRotation === 270) {
                    canvas.width = h;
                    canvas.height = w;
                }
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate((finalRotation * Math.PI) / 180);
                ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
                ctx.drawImage(img, -img.width / 2, -img.height / 2);
            } else {
                // Handle border - draw image with border
                if (type === 'image-border' && borderWidth && borderWidth > 0) {
                    // Increase canvas size to accommodate border
                    const borderSize = borderWidth * 2;
                    const newWidth = w + borderSize;
                    const newHeight = h + borderSize;
                    canvas.width = newWidth;
                    canvas.height = newHeight;
                    
                    // Fill background with border color
                    if (borderColor) {
                        ctx.fillStyle = borderColor;
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                    }
                    
                    // Draw image in the center
                    ctx.drawImage(img, borderWidth, borderWidth, w, h);
                } else {
                    // Apply filters
                    if (type === 'grayscale-image') {
                        ctx.filter = `grayscale(${filterValue}%)`;
                        ctx.drawImage(img, 0, 0, w, h);
                    } else if (type === 'sepia-converter') {
                        ctx.filter = `sepia(${filterValue}%)`;
                        ctx.drawImage(img, 0, 0, w, h);
                    } else if (type === 'invert-image') {
                        ctx.filter = `invert(${filterValue}%)`;
                        ctx.drawImage(img, 0, 0, w, h);
                    } else if (type === 'blur-image') {
                        ctx.filter = `blur(${size}px)`;
                        ctx.drawImage(img, 0, 0, w, h);
                    } else if (type === 'image-brightness') {
                        ctx.filter = `brightness(${filterValue}%)`;
                        ctx.drawImage(img, 0, 0, w, h);
                    } else if (type === 'image-contrast') {
                        ctx.filter = `contrast(${filterValue}%)`;
                        ctx.drawImage(img, 0, 0, w, h);
                    } else if (type === 'saturate-image') {
                        ctx.filter = `saturate(${filterValue}%)`;
                        ctx.drawImage(img, 0, 0, w, h);
                    } else if (type === 'hue-rotate-image') {
                        ctx.filter = `hue-rotate(${filterValue}deg)`;
                        ctx.drawImage(img, 0, 0, w, h);
                    } else if (type === 'image-opacity') {
                        ctx.globalAlpha = filterValue! / 100;
                        ctx.drawImage(img, 0, 0, w, h);
                    } else if (type === 'pixelate-image') {
                        // Pixelate effect
                        const pixelSize = size || 10;
                        const smallCanvas = document.createElement('canvas');
                        smallCanvas.width = Math.max(1, Math.floor(w / pixelSize));
                        smallCanvas.height = Math.max(1, Math.floor(h / pixelSize));
                        const smallCtx = smallCanvas.getContext('2d');
                        if (smallCtx) {
                            smallCtx.drawImage(img, 0, 0, smallCanvas.width, smallCanvas.height);
                            ctx.imageSmoothingEnabled = false;
                            ctx.drawImage(smallCanvas, 0, 0, w, h);
                        } else {
                            ctx.drawImage(img, 0, 0, w, h);
                        }
                    } else if (type === 'round-corners-image') {
                        // Round corners effect
                        const radius = filterValue || 20;
                        // Clear canvas first to ensure transparent background
                        ctx.clearRect(0, 0, w, h);
                        ctx.beginPath();
                        // Draw rounded rectangle path
                        ctx.moveTo(radius, 0);
                        ctx.lineTo(w - radius, 0);
                        ctx.quadraticCurveTo(w, 0, w, radius);
                        ctx.lineTo(w, h - radius);
                        ctx.quadraticCurveTo(w, h, w - radius, h);
                        ctx.lineTo(radius, h);
                        ctx.quadraticCurveTo(0, h, 0, h - radius);
                        ctx.lineTo(0, radius);
                        ctx.quadraticCurveTo(0, 0, radius, 0);
                        ctx.closePath();
                        ctx.save();
                        ctx.clip();
                        ctx.drawImage(img, 0, 0, w, h);
                        ctx.restore();
                    } else if (type === 'image-shadow') {
                        // Shadow effect - need to draw on larger canvas
                        const shadowBlur = size || 20;
                        const shadowOffsetX = 10;
                        const shadowOffsetY = 10;
                        const padding = Math.max(shadowBlur, shadowOffsetX, shadowOffsetY) + 10;
                        
                        // Create larger canvas for shadow
                        const shadowCanvas = document.createElement('canvas');
                        shadowCanvas.width = w + padding * 2;
                        shadowCanvas.height = h + padding * 2;
                        const shadowCtx = shadowCanvas.getContext('2d');
                        if (shadowCtx) {
                            shadowCtx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                            shadowCtx.shadowBlur = shadowBlur;
                            shadowCtx.shadowOffsetX = shadowOffsetX;
                            shadowCtx.shadowOffsetY = shadowOffsetY;
                            shadowCtx.drawImage(img, padding, padding, w, h);
                            
                            // Update main canvas size and draw
                            canvas.width = shadowCanvas.width;
                            canvas.height = shadowCanvas.height;
                            ctx.drawImage(shadowCanvas, 0, 0);
                        } else {
                            ctx.drawImage(img, 0, 0, w, h);
                        }
                    } else {
                        ctx.drawImage(img, 0, 0, w, h);
                    }
                }
            }

            const mime = getMimeType(type, pf.file.type);
            const qualityValue = type === 'image-to-base64'
                ? ((mime === 'image/png' || mime === 'image/svg+xml') ? undefined : 1.0)
                : ((mime === 'image/png' || mime === 'image/svg+xml') && type !== 'image-compressor')
                    ? undefined
                    : quality / 100;

            // For image-to-base64, use toDataURL directly
            if (type === 'image-to-base64') {
                try {
                    const dataUrl = canvas.toDataURL(mime, qualityValue);
                    resolve(dataUrl);
                } catch (e) {
                    // Fallback to toBlob method
                    canvas.toBlob((blob) => {
                        if (blob) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                if (reader.result && typeof reader.result === 'string') {
                                    resolve(reader.result);
                                } else {
                                    reject('Failed to read as Data URL');
                                }
                            };
                            reader.onerror = () => reject('FileReader error');
                            reader.readAsDataURL(blob);
                        } else {
                            reject('Blob failed');
                        }
                    }, mime, qualityValue);
                }
                return;
            }

            // Handle SVG conversion
            if (mime === 'image/svg+xml') {
                const scale = Math.max(0.1, quality / 100);
                const rasterW = Math.max(1, Math.round(w * scale));
                const rasterH = Math.max(1, Math.round(h * scale));
                const rasterCanvas = document.createElement('canvas');
                rasterCanvas.width = rasterW;
                rasterCanvas.height = rasterH;
                const rasterCtx = rasterCanvas.getContext('2d');
                if (!rasterCtx) return reject('No context');
                rasterCtx.drawImage(canvas, 0, 0, rasterW, rasterH);
                const base64Image = rasterCanvas.toDataURL('image/png');

                const svgString = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <image xlink:href="${base64Image}" width="${w}" height="${h}" />
</svg>`;

                const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
                resolve(svgBlob);
                return;
            }

            // PNG quality scaling (skip for image-to-base64)
            // For image-compressor, also scale PNG to reduce file size
            if (mime === 'image/png' && type !== 'image-to-base64' && quality < 100) {
                const scale = Math.max(0.1, quality / 100);
                const rasterW = Math.max(1, Math.round(w * scale));
                const rasterH = Math.max(1, Math.round(h * scale));
                const rasterCanvas = document.createElement('canvas');
                rasterCanvas.width = rasterW;
                rasterCanvas.height = rasterH;
                const rasterCtx = rasterCanvas.getContext('2d');
                if (!rasterCtx) return reject('No context');
                rasterCtx.drawImage(canvas, 0, 0, rasterW, rasterH);
                rasterCanvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject('Blob failed');
                }, mime);
                return;
            }

            // Default: use toBlob
            canvas.toBlob((blob) => {
                if (blob) {
                    // Verify blob has valid size
                    if (blob.size > 0) {
                        resolve(blob);
                    } else {
                        reject(new Error('Blob size is 0'));
                    }
                } else {
                    reject(new Error('Blob creation failed'));
                }
            }, mime, qualityValue);
        };

        img.onerror = () => {
            reject(new Error('Failed to load image. Please try uploading again.'));
        };

        if (!pf.preview) {
            reject(new Error('No preview URL available'));
            return;
        }

        img.src = pf.preview;
    });
};

export const processAllFiles = async (
    files: ProcessedFile[],
    options: ProcessingOptions,
    onProgress?: (files: ProcessedFile[]) => void,
    onComplete?: (files: ProcessedFile[]) => void
) => {
    if (files.length === 0) return;

    const updated = [...files];

    for (let i = 0; i < updated.length; i++) {
        updated[i].status = 'processing';
        onProgress?.(updated);

        try {
            const result = await processSingleFile(updated[i], options);
            updated[i].status = 'done';
            updated[i].resultBlob = result;

            // Calculate resultSize immediately
            let calculatedSize = 0;
            if (typeof result === 'string') {
                calculatedSize = result.length;
            } else if (result instanceof Blob) {
                calculatedSize = result.size;
            }
            
            updated[i].resultSize = calculatedSize;
            
            // Double-check: if size is still 0, try to recalculate
            if (calculatedSize === 0) {
                if (result instanceof Blob && result.size > 0) {
                    updated[i].resultSize = result.size;
                    calculatedSize = result.size;
                } else if (typeof result === 'string' && result.length > 0) {
                    updated[i].resultSize = result.length;
                    calculatedSize = result.length;
                }
            }
        } catch (e) {
            updated[i].status = 'error';
            updated[i].resultSize = 0;
        }
        onProgress?.(updated);
    }

    onComplete?.(updated);
};

export const downloadResults = async (
    files: ProcessedFile[],
    type: string,
    isBatchSupported: boolean
) => {
    if (files.length === 0) return;

    if (isBatchSupported && files.length > 1) {
        const zip = new JSZip();
        files.forEach((f) => {
            if (f.resultBlob) {
                const isString = typeof f.resultBlob === 'string';
                const mime = isString ? 'text/plain' : (f.resultBlob as Blob).type;
                const ext = getFileExtension(mime, isString);
                zip.file(`${f.file.name.split('.')[0]}-processed.${ext}`, f.resultBlob);
            }
        });
        const content = await zip.generateAsync({ type: 'blob' });
        downloadFile(content, 'processed_images.zip');
    } else if (files[0]?.resultBlob) {
        const res = files[0].resultBlob;
        if (typeof res === 'string') {
            // For string results, don't download automatically
            return;
        } else {
            const ext = getFileExtension(res.type);
            downloadFile(res, `${files[0].file.name.split('.')[0]}-processed.${ext}`);
        }
    }
};
