"use client";
import { useState, useRef, useEffect } from 'react';
import { Upload, Image as ImageIcon, Settings, X, RefreshCw, Wand2, FileArchive, CheckCircle2, ChevronRight, Zap, Lock, RotateCcw, RotateCw, MoveHorizontal, MoveVertical, Sliders } from 'lucide-react';
import { cn } from '@/utils/cn';

import { v4 as uuidv4 } from 'uuid';
import { useTranslations } from 'next-intl';
import JSZip from 'jszip';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import { ScrollableNav } from '@/components/ScrollableNav';

// Helper for centering crop
function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
    return centerCrop(
        makeAspectCrop({ unit: '%', width: 90 }, aspect, mediaWidth, mediaHeight),
        mediaWidth,
        mediaHeight
    );
}

const base64ToBlob = (base64: string) => {
    const parts = base64.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
};

interface ImageToolProps {
    type: string;
}

interface ProcessedFile {
    id: string;
    file: File;
    status: 'pending' | 'processing' | 'done' | 'error';
    resultBlob?: Blob | string;
    resultSize?: number;
    preview?: string;
}

export default function ImageTools({ type }: ImageToolProps) {
    const t = useTranslations('Common');
    const tActions = useTranslations('ToolActions');
    const [files, setFiles] = useState<ProcessedFile[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [base64Input, setBase64Input] = useState('');
    const [base64Output, setBase64Output] = useState('');
    const [copied, setCopied] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

    // Set default selection when files are added
    useEffect(() => {
        if (files.length > 0 && !selectedFileId) {
            setSelectedFileId(files[0].id);
        } else if (files.length === 0) {
            setSelectedFileId(null);
        }
    }, [files, selectedFileId]);

    // UI states
    const [quality, setQuality] = useState(80);
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);
    const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
    const [targetFormat, setTargetFormat] = useState('png');

    // Filter states (for single mode)
    const [filterValue, setFilterValue] = useState(100);
    const [rotation, setRotation] = useState(0);
    const [flipH, setFlipH] = useState(false);
    const [flipV, setFlipV] = useState(false);
    const [color, setColor] = useState('#000000');
    const [size, setSize] = useState(10);

    // Cropper State
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [aspect, setAspect] = useState<number | undefined>(undefined);
    const imgRef = useRef<HTMLImageElement>(null);

    // Reset crop on file change
    useEffect(() => {
        setCrop(undefined);
        setCompletedCrop(undefined);
        setAspect(undefined);
    }, [selectedFileId, files]);

    // Initialize crop on image load
    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        if (type === 'image-cropper' && !crop) {
            const { width, height } = e.currentTarget;
            setCrop(centerAspectCrop(width, height, 16 / 9));
            setAspect(16 / 9);
        }
    };

    const isBatchSupported = ['image-compressor', 'jpg-to-png', 'png-to-jpg', 'webp-converter', 'image-format-converter', 'webp-to-jpg', 'webp-to-png', 'jpg-to-webp', 'png-to-webp', 'svg-to-png', 'png-to-svg', 'jpg-to-svg', 'webp-to-svg'].includes(type);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        setDragActive(e.type === "dragenter" || e.type === "dragover");
    };

    const addFiles = (newFiles: FileList | null) => {
        if (!newFiles) return;
        const newBatch: ProcessedFile[] = Array.from(newFiles).map(f => ({
            id: Math.random().toString(36).substring(7),
            file: f,
            status: 'pending',
            preview: URL.createObjectURL(f)
        }));

        if (!isBatchSupported) {
            setFiles([newBatch[0]]);
            setSelectedFileId(newBatch[0].id);
        } else {
            setFiles(prev => [...prev, ...newBatch]);
            if (!selectedFileId && newBatch.length > 0) {
                setSelectedFileId(newBatch[0].id);
            }
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        setDragActive(false);
        addFiles(e.dataTransfer.files);
    };

    const removeFile = (id: string) => {
        setFiles(prev => {
            const f = prev.find(item => item.id === id);
            if (f?.preview) URL.revokeObjectURL(f.preview);
            return prev.filter(item => item.id !== id);
        });
        if (selectedFileId === id) {
            setSelectedFileId(null); // Effect will pick new default
        }
    };

    const processSingleFile = async (pf: ProcessedFile): Promise<Blob | string> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let w = img.width;
                let h = img.height;

                // Handle Cropper Special Case
                if (type === 'image-cropper' && completedCrop && imgRef.current) {
                    const scaleX = img.naturalWidth / imgRef.current.width;
                    const scaleY = img.naturalHeight / imgRef.current.height;

                    // If scale is infinite (div by 0), fallback
                    if (!Number.isFinite(scaleX)) return reject('Image scale error');

                    const pixelCrop = completedCrop;
                    canvas.width = pixelCrop.width * scaleX;
                    canvas.height = pixelCrop.height * scaleY;

                    const ctx = canvas.getContext('2d');
                    if (!ctx) return reject('No context');

                    // Draw cropped region
                    ctx.drawImage(
                        img,
                        pixelCrop.x * scaleX,
                        pixelCrop.y * scaleY,
                        pixelCrop.width * scaleX,
                        pixelCrop.height * scaleY,
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );

                    // Handle SVG conversion for cropped images
                    if (['png-to-svg', 'jpg-to-svg', 'webp-to-svg'].includes(type)) {
                        const dataUrl = canvas.toDataURL('image/png'); // Always convert to PNG data URL for embedding
                        const svgString = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
                        <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
                        <svg width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                            <image href="${dataUrl}" width="${canvas.width}" height="${canvas.height}" />
                        </svg>`;
                        const blob = new Blob([svgString], { type: 'image/svg+xml' });
                        resolve(blob);
                        return;
                    }

                    // Generate Blob directly for Cropper to avoid fallthrough to existing filters
                    let mime = pf.file.type;
                    // Default to PNG if input is not supported or for better quality in cropping
                    if (mime === 'image/svg+xml') mime = 'image/png';

                    canvas.toBlob((blob) => {
                        if (blob) resolve(blob);
                        else reject('Blob failed');
                    }, mime, quality / 100);
                    return;
                }

                if (type === 'image-resizer' || type === 'image-enlarger') {
                    if (width > 0 && height > 0) { w = width; h = height; }
                    else if (width > 0) { w = width; h = maintainAspectRatio ? (width / img.width) * img.height : img.height; }
                    else if (height > 0) { h = height; w = maintainAspectRatio ? (height / img.height) * img.width : img.width; }
                }

                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject('No context');

                if (type === 'flip-image' || type === 'rotate-image') {
                    const finalRotation = (rotation % 360 + 360) % 360;
                    if (finalRotation === 90 || finalRotation === 270) {
                        canvas.width = h; canvas.height = w;
                    }
                    ctx.translate(canvas.width / 2, canvas.height / 2);
                    ctx.rotate((finalRotation * Math.PI) / 180);
                    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
                    ctx.drawImage(img, -img.width / 2, -img.height / 2);
                } else {
                    if (type === 'grayscale-image') ctx.filter = `grayscale(${filterValue}%)`;
                    else if (type === 'sepia-converter') ctx.filter = `sepia(${filterValue}%)`;
                    else if (type === 'invert-image') ctx.filter = `invert(${filterValue}%)`;
                    else if (type === 'blur-image') ctx.filter = `blur(${size}px)`;
                    else if (type === 'image-brightness') ctx.filter = `brightness(${filterValue}%)`;
                    else if (type === 'image-contrast') ctx.filter = `contrast(${filterValue}%)`;
                    else if (type === 'saturate-image') ctx.filter = `saturate(${filterValue}%)`;
                    else if (type === 'hue-rotate-image') ctx.filter = `hue-rotate(${filterValue}deg)`;

                    if (type === 'image-opacity') ctx.globalAlpha = filterValue / 100;

                    if (type === 'pixelate-image') {
                        const pixelSize = size || 10;
                        const tempW = w / pixelSize;
                        const tempH = h / pixelSize;
                        ctx.imageSmoothingEnabled = false;
                        ctx.drawImage(img, 0, 0, tempW, tempH);
                        ctx.drawImage(canvas, 0, 0, tempW, tempH, 0, 0, w, h);
                    } else if (type === 'round-corners-image') {
                        const radius = size || 50;
                        ctx.beginPath();
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
                        ctx.clip();
                        ctx.drawImage(img, 0, 0, w, h);
                    } else if (type === 'image-border') {
                        ctx.drawImage(img, 0, 0, w, h);
                        ctx.strokeStyle = color || '#000000';
                        ctx.lineWidth = size || 10;
                        ctx.strokeRect(0, 0, w, h);
                    } else if (type === 'image-shadow') {
                        const shadowSize = size || 20;
                        canvas.width = w + shadowSize * 2;
                        canvas.height = h + shadowSize * 2;
                        const sCtx = canvas.getContext('2d')!;
                        sCtx.shadowBlur = shadowSize;
                        sCtx.shadowColor = color || 'rgba(0,0,0,0.5)';
                        sCtx.shadowOffsetX = 0;
                        sCtx.shadowOffsetY = 0;
                        sCtx.drawImage(img, shadowSize, shadowSize, w, h);
                    } else {
                        ctx.drawImage(img, 0, 0, w, h);
                    }
                }

                if (['png-to-svg', 'jpg-to-svg', 'webp-to-svg'].includes(type)) {
                    const dataUrl = canvas.toDataURL('image/png');
                    const svgString = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
                    <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
                    <svg width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <image href="${dataUrl}" width="${canvas.width}" height="${canvas.height}" />
                    </svg>`;
                    const blob = new Blob([svgString], { type: 'image/svg+xml' });
                    resolve(blob);
                    return;
                }

                let mime = pf.file.type;
                const isConverter = type === 'image-format-converter';

                if (['jpg-to-png', 'webp-to-png', 'svg-to-png'].includes(type) || (isConverter && targetFormat === 'png')) mime = 'image/png';
                if (['png-to-jpg', 'webp-to-jpg'].includes(type) || (isConverter && targetFormat === 'jpg')) mime = 'image/jpeg';
                if (['webp-converter', 'jpg-to-webp', 'png-to-webp'].includes(type) || (isConverter && targetFormat === 'webp')) mime = 'image/webp';

                canvas.toBlob((blob) => {
                    if (blob) {
                        if (type === 'image-to-base64') {
                            const reader = new FileReader();
                            reader.readAsDataURL(blob);
                            reader.onloadend = () => {
                                resolve(reader.result as string);
                            };
                        } else {
                            resolve(blob);
                        }
                    } else {
                        reject('Blob failed');
                    }
                }, mime, quality / 100);
            };
            img.onerror = reject;
            img.src = pf.preview!;
        });
    };

    const processAll = async () => {
        setProcessing(true);
        const updated = [...files];
        try {
            for (let i = 0; i < updated.length; i++) {
                updated[i].status = 'processing';
                setFiles([...updated]);
                try {
                    const result = await processSingleFile(updated[i]);
                    updated[i].status = 'done';
                    updated[i].resultBlob = result;
                    updated[i].resultSize = typeof result === 'string' ? result.length : result.size;
                } catch (e) { updated[i].status = 'error'; }
                setFiles([...updated]);
            }

            if (updated.length > 1) {
                const zip = new JSZip();
                updated.forEach((f, i) => {
                    if (f.resultBlob) {
                        const isString = typeof f.resultBlob === 'string';
                        const mime = isString ? 'text/plain' : (f.resultBlob as Blob).type;
                        let ext = mime.split('/')[1] || (isString ? 'txt' : 'png');
                        if (ext === 'svg+xml') ext = 'svg';
                        if (ext === 'jpeg') ext = 'jpg';
                        zip.file(`${f.file.name.split('.')[0]}-processed.${ext}`, f.resultBlob);
                    }
                });
                const content = await zip.generateAsync({ type: 'blob' });
                download(content, 'processed_images.zip');
            } else if (updated[0].resultBlob) {
                const res = updated[0].resultBlob;
                const isString = typeof res === 'string';
                if (isString) {
                    setBase64Output(res as string);
                } else {
                    let ext = (res as Blob).type.split('/')[1] || 'png';
                    if (ext === 'svg+xml') ext = 'svg';
                    if (ext === 'jpeg') ext = 'jpg';
                    download(res as Blob, `${updated[0].file.name.split('.')[0]}-processed.${ext}`);
                }
            }
        } catch (e) { }
        finally { setProcessing(false); }
    };

    const download = (content: Blob | string, name: string) => {
        let url: string;
        if (typeof content === 'string') {
            url = content;
        } else {
            url = URL.createObjectURL(content);
        }
        const a = document.createElement('a');
        a.href = url; a.download = name;
        document.body.appendChild(a); a.click();
        document.body.removeChild(a);
        if (typeof content !== 'string') URL.revokeObjectURL(url);
    };

    // Preview Generator Effect
    useEffect(() => {
        if (files.length === 0) {
            setPreviewUrl(null);
            return;
        }

        const generatePreview = async () => {
            try {
                // Generate preview for the selected file, or first if none selected
                const fileToPreview = files.find(f => f.id === selectedFileId) || files[0];
                if (!fileToPreview) return;

                const result = await processSingleFile(fileToPreview);
                if (result instanceof Blob) {
                    const url = URL.createObjectURL(result);
                    setPreviewUrl(prev => {
                        if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
                        return url;
                    });
                } else {
                    setPreviewUrl(result);
                }
            } catch (e) {
                console.error("Preview generation failed", e);
            }
        };

        const timeout = setTimeout(generatePreview, 200); // 200ms debounce
        return () => clearTimeout(timeout);
    }, [files, selectedFileId, rotation, flipH, flipV, filterValue, color, size, width, height, maintainAspectRatio, targetFormat, type]);



    // Navigation Tools Configuration
    const imageNavTools = [
        {
            category: 'Edit',
            tools: [
                { id: 'image-compressor', label: 'Compress', icon: FileArchive },
                { id: 'image-resizer', label: 'Resize', icon: Sliders },
                { id: 'image-cropper', label: 'Crop', icon: Upload },
                { id: 'rotate-image', label: 'Rotate', icon: RotateCw },
                { id: 'flip-image', label: 'Flip', icon: MoveHorizontal },
            ]
        },
        {
            category: 'Convert',
            tools: [
                { id: 'jpg-to-png', label: 'JPG to PNG', icon: ImageIcon },
                { id: 'png-to-jpg', label: 'PNG to JPG', icon: ImageIcon },
                { id: 'webp-converter', label: 'WebP', icon: ImageIcon },
                { id: 'svg-to-png', label: 'SVG to PNG', icon: ImageIcon },
                { id: 'image-to-base64', label: 'Base64', icon: FileArchive },
            ]
        },
        {
            category: 'Effects',
            tools: [
                { id: 'blur-image', label: 'Blur', icon: Wand2 },
                { id: 'grayscale-image', label: 'Grayscale', icon: Wand2 },
                { id: 'round-corners-image', label: 'Round', icon: CheckCircle2 },
                { id: 'image-brightness', label: 'Bright', icon: Zap },
            ]
        }
    ];

    const isImageTool = imageNavTools.some(cat => cat.tools.some(t => t.id === type));


    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Image Tools Navigation */}
            {isImageTool && (
                <>
                    {/* Image Tools Navigation - Updated with ScrollableNav */}
                    <ScrollableNav items={imageNavTools} activeToolId={type} />
                </>
            )}

            <input id="image-input" type="file" multiple={isBatchSupported} className="hidden" accept="image/*" onChange={(e) => addFiles(e.target.files)} />
            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">

                <div className="p-8">
                    {files.length === 0 ? (
                        <div
                            onDragOver={handleDrag} onDragEnter={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
                            onClick={() => document.getElementById('image-input')?.click()}
                            className={cn(
                                "min-h-[280px] border-4 border-dashed rounded-[1.5rem] flex flex-col items-center justify-center transition-all cursor-pointer group hover:border-accent hover:bg-accent/5 py-8",
                                dragActive ? "border-accent bg-accent/5 scale-[0.99]" : "border-border bg-muted/20"
                            )}
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform">
                                <Upload className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-lg md:text-2xl font-black text-foreground mb-2 text-center">
                                {isBatchSupported ? t('selectMultiple') : t('selectImage')}
                            </h2>
                            <p className="text-muted-foreground text-sm mb-6 text-center px-4 font-medium max-w-lg mx-auto">
                                {t.rich ? t.rich('dragDrop', {
                                    b: (chunks) => <span className="text-accent font-bold">{chunks}</span>
                                }) : t('dragDrop')}
                                <span className="text-xs opacity-60 block mt-1">{t('supports')}</span>
                            </p>

                            {/* Base64 Input for Base64 to Image */}
                            {type === 'base64-to-image' && (
                                <div className="space-y-4 w-full max-w-xl px-4 mb-4" onClick={e => e.stopPropagation()}>
                                    <textarea
                                        value={base64Input}
                                        onChange={(e) => setBase64Input(e.target.value)}
                                        className="w-full h-24 p-3 border-2 border-border rounded-xl bg-input font-mono text-xs text-foreground focus:border-accent outline-none resize-none"
                                        placeholder={tActions('pasteBase64')}
                                    />
                                    <button
                                        onClick={() => {
                                            try {
                                                const blob = base64ToBlob(base64Input);
                                                const file = new File([blob], "image.png", { type: blob.type });
                                                addFiles([file] as unknown as FileList);
                                            } catch (e) {
                                            }
                                        }}
                                        className="w-full py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-bold shadow-md hover:scale-[1.01] transition-all text-sm"
                                    >
                                        {tActions('convertTo', { format: 'Image' })}
                                    </button>
                                </div>
                            )}

                            <div className="flex flex-wrap justify-center gap-3">
                                <div className="px-4 py-1.5 bg-card border border-border rounded-full text-[10px] font-bold text-muted-foreground flex items-center gap-1.5 shadow-sm whitespace-nowrap">
                                    <CheckCircle2 size={12} className="text-emerald-500" /> {t('privacyGuaranteed')}
                                </div>
                                <div className="px-4 py-1.5 bg-card border border-border rounded-full text-[10px] font-bold text-muted-foreground flex items-center gap-1.5 shadow-sm whitespace-nowrap">
                                    <Zap size={12} className="text-amber-500" /> {t('lightningFast')}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-3 gap-8 items-start">
                            <div className="lg:col-span-2 space-y-6">
                                {/* Summary Header */}
                                <div className="bg-muted/30 p-6 rounded-2xl border-2 border-border flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-accent/10 rounded-xl">
                                            <ImageIcon className="text-accent w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-lg text-foreground">{t('imagesSelected', { count: files.length })}</h3>
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{tActions('batchReady')}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setFiles([])} className="text-sm font-black text-destructive hover:bg-destructive/10 px-5 py-2.5 rounded-xl transition-all border border-transparent hover:border-destructive/20">
                                        {tActions('clearAll')}
                                    </button>
                                </div>

                                {/* Live Preview Section */}
                                {previewUrl && (
                                    <div className="bg-card p-4 rounded-3xl border-2 border-border shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-50" />
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                                                    <Wand2 size={14} />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Live Preview</span>
                                            </div>
                                            <span className="text-[10px] font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded-md truncate max-w-[150px]">
                                                {files.find(f => f.id === selectedFileId)?.file.name || files[0].file.name}
                                            </span>
                                        </div>
                                        <div className={cn("relative rounded-xl overflow-hidden bg-muted/30 border-2 border-border/50 flex items-center justify-center checkered-bg", type === 'image-cropper' ? 'min-h-[400px]' : 'h-[200px]')}>
                                            {type === 'image-cropper' ? (
                                                <ReactCrop
                                                    crop={crop}
                                                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                                                    onComplete={(c) => setCompletedCrop(c)}
                                                    aspect={aspect}
                                                    className="max-w-full max-h-[500px]"
                                                >
                                                    <img
                                                        ref={imgRef}
                                                        src={previewUrl}
                                                        onLoad={onImageLoad}
                                                        alt="Preview"
                                                        className="max-w-full max-h-[500px] object-contain"
                                                    />
                                                </ReactCrop>
                                            ) : (
                                                <img
                                                    src={previewUrl}
                                                    alt="Preview"
                                                    className="w-full h-full object-contain"
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* File Grid */}
                                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
                                    {files.map((file) => (
                                        <div
                                            key={file.id}
                                            onClick={() => setSelectedFileId(file.id)}
                                            className={cn(
                                                "bg-card p-4 rounded-2xl border-2 flex items-center gap-4 transition-all relative overflow-hidden shadow-sm cursor-pointer",
                                                (selectedFileId === file.id || (!selectedFileId && files[0].id === file.id)) ? "border-accent ring-2 ring-accent/20 bg-accent/5" : "border-border hover:border-accent/50"
                                            )}
                                        >
                                            <div className="w-16 h-16 rounded-xl bg-muted flex-shrink-0 overflow-hidden border border-border">
                                                <img src={file.preview} className="w-full h-full object-cover" alt="" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm truncate text-foreground">{file.file.name}</p>
                                                <p className="text-[10px] text-muted-foreground flex items-center gap-2 uppercase tracking-tight font-black">
                                                    {(file.file.size / 1024).toFixed(0)} KB
                                                    {file.resultSize && (
                                                        <span className="text-emerald-500 font-black flex items-center gap-1">
                                                            <ChevronRight size={10} /> {(file.resultSize / 1024).toFixed(0)} KB
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {file.status === 'processing' && <RefreshCw className="w-4 h-4 animate-spin text-accent" />}
                                                {file.status === 'done' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                                                <button onClick={(e) => { e.stopPropagation(); removeFile(file.id); }} className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                            {file.status === 'processing' && <div className="absolute bottom-0 left-0 h-1 bg-accent animate-pulse w-full" />}
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => document.getElementById('image-input')?.click()}
                                        className="border-2 border-dashed border-border rounded-2xl flex items-center justify-center p-8 hover:bg-muted/50 hover:border-accent group transition-all"
                                    >
                                        <div className="text-center">
                                            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center mx-auto mb-2 text-muted-foreground group-hover:text-accent group-hover:scale-110 transition-transform">
                                                {isBatchSupported ? <Upload size={20} /> : <RefreshCw size={20} />}
                                            </div>
                                            <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                                                {isBatchSupported ? t('addMore') : 'Change Image'}
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Controls Sidebar */}
                            <div className="lg:sticky lg:top-8 space-y-6">
                                <div className="bg-card p-8 rounded-[2rem] border-2 border-border shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                                        <Settings size={120} />
                                    </div>

                                    <h3 className="text-xl font-black mb-8 flex items-center gap-3 text-foreground">
                                        <Settings className="text-accent" /> {t('settings')}
                                    </h3>

                                    <div className="space-y-8">
                                        {/* Common Tools */}
                                        {(type === 'image-compressor' || isBatchSupported) && (
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-end">
                                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t('quality')}</label>
                                                    <span className="text-2xl font-black text-accent">{quality}%</span>
                                                </div>
                                                <input
                                                    type="range" min="5" max="100" value={quality}
                                                    onChange={(e) => setQuality(parseInt(e.target.value))}
                                                    className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-accent"
                                                />
                                                <p className="text-[10px] text-muted-foreground leading-relaxed italic font-medium">
                                                    {t('tipQuality')}
                                                </p>
                                            </div>
                                        )}



                                        {type === 'flip-image' && (
                                            <div className="space-y-6">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Flip Direction</label>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <button
                                                        onClick={() => setFlipH(!flipH)}
                                                        className={cn(
                                                            "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                                                            flipH ? "bg-accent text-white border-accent shadow-lg" : "bg-card border-border hover:border-accent/50 text-muted-foreground"
                                                        )}
                                                    >
                                                        <MoveHorizontal size={24} />
                                                        <span className="text-xs font-bold uppercase">Horizontal</span>
                                                    </button>
                                                    <button
                                                        onClick={() => setFlipV(!flipV)}
                                                        className={cn(
                                                            "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                                                            flipV ? "bg-accent text-white border-accent shadow-lg" : "bg-card border-border hover:border-accent/50 text-muted-foreground"
                                                        )}
                                                    >
                                                        <MoveVertical size={24} />
                                                        <span className="text-xs font-bold uppercase">Vertical</span>
                                                    </button>
                                                </div>
                                                <p className="text-[10px] text-muted-foreground leading-relaxed italic font-medium bg-muted/30 p-3 rounded-lg border border-border">
                                                    Toggle buttons to flip the image across the horizontal or vertical axis.
                                                </p>
                                            </div>
                                        )}

                                        {(type === 'grayscale-image' || type === 'sepia-converter' || type === 'invert-image') && (
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-end">
                                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Intensity</label>
                                                    <span className="text-2xl font-black text-accent">{filterValue}%</span>
                                                </div>
                                                <input
                                                    type="range" min="0" max="100" value={filterValue}
                                                    onChange={(e) => setFilterValue(parseInt(e.target.value))}
                                                    className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-accent"
                                                />
                                            </div>
                                        )}

                                        {type === 'image-cropper' && (
                                            <div className="space-y-4">
                                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Aspect Ratio</label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {[
                                                        { label: 'Free', value: undefined },
                                                        { label: '1:1', value: 1 },
                                                        { label: '16:9', value: 16 / 9 },
                                                        { label: '4:3', value: 4 / 3 },
                                                        { label: '3:2', value: 3 / 2 },
                                                        { label: '9:16', value: 9 / 16 },
                                                    ].map((opt) => (
                                                        <button
                                                            key={opt.label}
                                                            onClick={() => {
                                                                setAspect(opt.value);
                                                                if (imgRef.current && opt.value) {
                                                                    setCrop(centerAspectCrop(imgRef.current.width, imgRef.current.height, opt.value));
                                                                } else {
                                                                    setCrop({ unit: '%', width: 90, height: 90, x: 5, y: 5 });
                                                                }
                                                            }}
                                                            className={cn(
                                                                "py-2 rounded-lg text-xs font-bold transition-all border",
                                                                aspect === opt.value
                                                                    ? "bg-accent text-white border-accent"
                                                                    : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
                                                            )}
                                                        >
                                                            {opt.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {type === 'image-contrast' && (
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-end">
                                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Contrast</label>
                                                    <span className="text-2xl font-black text-accent">{filterValue}%</span>
                                                </div>
                                                <input
                                                    type="range" min="0" max="200" value={filterValue}
                                                    onChange={(e) => setFilterValue(parseInt(e.target.value))}
                                                    className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-accent"
                                                />
                                            </div>
                                        )}

                                        {type === 'image-brightness' && (
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-end">
                                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Brightness</label>
                                                    <span className="text-2xl font-black text-accent">{filterValue}%</span>
                                                </div>
                                                <input
                                                    type="range" min="0" max="200" value={filterValue}
                                                    onChange={(e) => setFilterValue(parseInt(e.target.value))}
                                                    className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-accent"
                                                />
                                            </div>
                                        )}

                                        {type === 'saturate-image' && (
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-end">
                                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Saturation</label>
                                                    <span className="text-2xl font-black text-accent">{filterValue}%</span>
                                                </div>
                                                <input
                                                    type="range" min="0" max="200" value={filterValue}
                                                    onChange={(e) => setFilterValue(parseInt(e.target.value))}
                                                    className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-accent"
                                                />
                                            </div>
                                        )}

                                        {type === 'hue-rotate-image' && (
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-end">
                                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Hue Rotate</label>
                                                    <span className="text-2xl font-black text-accent">{filterValue}deg</span>
                                                </div>
                                                <input
                                                    type="range" min="0" max="360" value={filterValue}
                                                    onChange={(e) => setFilterValue(parseInt(e.target.value))}
                                                    className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-accent"
                                                />
                                            </div>
                                        )}

                                        {type === 'blur-image' && (
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-end">
                                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Blur Radius</label>
                                                    <span className="text-2xl font-black text-accent">{size}px</span>
                                                </div>
                                                <input
                                                    type="range" min="0" max="100" value={size}
                                                    onChange={(e) => setSize(parseInt(e.target.value))}
                                                    className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-accent"
                                                />
                                            </div>
                                        )}

                                        {type === 'pixelate-image' && (
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-end">
                                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Pixel Size</label>
                                                    <span className="text-2xl font-black text-accent">{size}px</span>
                                                </div>
                                                <input
                                                    type="range" min="1" max="100" value={size}
                                                    onChange={(e) => setSize(parseInt(e.target.value))}
                                                    className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-accent"
                                                />
                                            </div>
                                        )}

                                        {type === 'image-opacity' && (
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-end">
                                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Opacity</label>
                                                    <span className="text-2xl font-black text-accent">{filterValue}%</span>
                                                </div>
                                                <input
                                                    type="range" min="0" max="100" value={filterValue}
                                                    onChange={(e) => setFilterValue(parseInt(e.target.value))}
                                                    className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-accent"
                                                />
                                            </div>
                                        )}

                                        {(type === 'image-border' || type === 'image-shadow') && (
                                            <div className="space-y-6">
                                                <div className="space-y-4">
                                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Color</label>
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="color"
                                                            value={color}
                                                            onChange={(e) => setColor(e.target.value)}
                                                            className="w-12 h-12 p-1 bg-card rounded-xl border border-border cursor-pointer"
                                                        />
                                                        <span className="text-sm font-mono text-muted-foreground uppercase">{color}</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-end">
                                                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Size</label>
                                                        <span className="text-2xl font-black text-accent">{size}px</span>
                                                    </div>
                                                    <input
                                                        type="range" min="0" max="100" value={size}
                                                        onChange={(e) => setSize(parseInt(e.target.value))}
                                                        className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-accent"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {type === 'round-corners-image' && (
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-end">
                                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Radius</label>
                                                    <span className="text-2xl font-black text-accent">{size}px</span>
                                                </div>
                                                <input
                                                    type="range" min="0" max="500" value={size}
                                                    onChange={(e) => setSize(parseInt(e.target.value))}
                                                    className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-accent"
                                                />
                                            </div>
                                        )}

                                        {(type === 'image-resizer' || type === 'image-enlarger') && (
                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Dimensions</label>
                                                    <button
                                                        onClick={() => setMaintainAspectRatio(!maintainAspectRatio)}
                                                        className={cn(
                                                            "flex items-center gap-2 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all border",
                                                            maintainAspectRatio
                                                                ? "bg-accent/10 text-accent border-accent/20"
                                                                : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
                                                        )}
                                                    >
                                                        {maintainAspectRatio ? <Lock size={12} /> : <Zap size={12} />}
                                                        {maintainAspectRatio ? "Ratio Locked" : "Ratio Unlocked"}
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-end">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Width (px)</label>
                                                        <input
                                                            type="number"
                                                            value={width || ''}
                                                            onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
                                                            placeholder="Auto"
                                                            className="w-full p-3 bg-muted rounded-xl border-2 border-border focus:border-accent outline-none font-mono text-sm font-bold text-center"
                                                        />
                                                    </div>

                                                    <div className="pb-4 text-muted-foreground/30">
                                                        <X size={20} />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Height (px)</label>
                                                        <input
                                                            type="number"
                                                            value={height || ''}
                                                            onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                                                            placeholder="Auto"
                                                            className="w-full p-3 bg-muted rounded-xl border-2 border-border focus:border-accent outline-none font-mono text-sm font-bold text-center"
                                                        />
                                                    </div>
                                                </div>

                                                <p className="text-[10px] text-muted-foreground leading-relaxed italic font-medium bg-muted/30 p-3 rounded-lg border border-border">
                                                    Leave <strong>Width</strong> or <strong>Height</strong> empty/0 to automatically calculate it based on aspect ratio.
                                                </p>
                                            </div>
                                        )}

                                        {type === 'rotate-image' && (
                                            <div className="space-y-6">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Rotation</label>
                                                    <span className="text-lg font-black text-accent bg-accent/10 px-3 py-1 rounded-lg">{(rotation % 360 + 360) % 360}°</span>
                                                </div>

                                                <div className="flex justify-center gap-4">
                                                    <button
                                                        onClick={() => setRotation(r => r - 90)}
                                                        className="p-4 bg-card border-2 border-border hover:border-accent hover:bg-accent/5 text-foreground rounded-2xl transition-all shadow-sm group"
                                                        title="Rotate Left 90°"
                                                    >
                                                        <RotateCcw className="w-6 h-6 group-hover:-rotate-90 transition-transform duration-300" />
                                                    </button>
                                                    <button
                                                        onClick={() => setRotation(r => r + 90)}
                                                        className="p-4 bg-card border-2 border-border hover:border-accent hover:bg-accent/5 text-foreground rounded-2xl transition-all shadow-sm group"
                                                        title="Rotate Right 90°"
                                                    >
                                                        <RotateCw className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-4 gap-2">
                                                    {[0, 90, 180, 270].map((deg) => (
                                                        <button
                                                            key={deg}
                                                            onClick={() => setRotation(deg)}
                                                            className={cn(
                                                                "py-2 rounded-lg text-xs font-bold transition-all border border-transparent",
                                                                (rotation % 360 + 360) % 360 === deg
                                                                    ? "bg-primary text-white shadow-md"
                                                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                                                            )}
                                                        >
                                                            {deg}°
                                                        </button>
                                                    ))}
                                                </div>

                                                <div className="pt-2">
                                                    <input
                                                        type="range" min="0" max="360" value={(rotation % 360 + 360) % 360}
                                                        onChange={(e) => setRotation(parseInt(e.target.value))}
                                                        className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-accent"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {type === 'image-format-converter' && (
                                            <div className="space-y-4">
                                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t('targetFormat')}</label>
                                                <div className="grid grid-cols-3 gap-2 p-1 bg-muted rounded-2xl border-2 border-border">
                                                    {['png', 'jpg', 'webp'].map(fmt => (
                                                        <button
                                                            key={fmt}
                                                            onClick={() => setTargetFormat(fmt)}
                                                            className={cn(
                                                                "py-2.5 rounded-xl font-black text-xs uppercase transition-all",
                                                                targetFormat === fmt ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:bg-card/50"
                                                            )}
                                                        >
                                                            {fmt}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Process Button */}
                                        <button
                                            onClick={processAll}
                                            disabled={processing || files.length === 0}
                                            className="w-full py-5 bg-gradient-to-r from-primary to-accent text-white rounded-2xl font-black shadow-xl hover:scale-[1.01] hover:shadow-primary/20 transition-all flex flex-col items-center justify-center gap-1 disabled:opacity-50 border border-white/10"
                                        >
                                            <div className="flex items-center gap-3 text-lg">
                                                {processing ? (
                                                    <RefreshCw className="w-6 h-6 animate-spin" />
                                                ) : files.length > 1 ? (
                                                    <FileArchive className="w-6 h-6" />
                                                ) : (
                                                    <Wand2 className="w-6 h-6" />
                                                )}
                                                {processing ? tActions('processing') : files.length > 1 ? t('processBatch') : t('applyChanges')}
                                            </div>
                                            {!processing && files.length > 1 && (
                                                <span className="text-[10px] opacity-70 uppercase tracking-widest">{t('downloadsAsZip')}</span>
                                            )}
                                        </button>

                                        <div className="p-5 bg-muted/50 rounded-2xl border-2 border-border">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Lock className="w-4 h-4 text-emerald-500" />
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground">{t('safePrivate')}</h4>
                                            </div>
                                            <p className="text[10px] text-muted-foreground leading-relaxed font-medium">
                                                {t('localProcessing')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Base64 Output Result */}
            {
                base64Output && (
                    <div className="bg-card p-8 rounded-3xl border-2 border-border shadow-2xl space-y-6 animate-in slide-in-from-bottom-5 duration-500">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">{t('base64Output')}</h3>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(base64Output)
                                        .then(() => {
                                            setCopied(true);
                                            setTimeout(() => setCopied(false), 2000);
                                        })
                                        .catch(() => { });
                                }}
                                className={`px-6 py-2.5 border rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${copied ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'}`}
                            >
                                {copied ? <CheckCircle2 size={14} /> : null}
                                {copied ? 'COPIED!' : t('copyString')}
                            </button>
                        </div>
                        <textarea
                            readOnly
                            value={base64Output}
                            className="w-full h-48 p-6 bg-muted rounded-3xl font-mono text-xs break-all resize-none outline-none border-2 border-border focus:border-accent transition-colors shadow-inner"
                        />
                    </div>
                )
            }
        </div >
    );
}
