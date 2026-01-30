"use client";
import { useState, useRef, useEffect } from 'react';
import { Upload, Image as ImageIcon, Settings, X, RefreshCw, Wand2, FileArchive, CheckCircle2, ChevronRight, Zap, Lock, RotateCcw, RotateCw, MoveHorizontal, MoveVertical, Sliders, Square, Grid3X3 } from 'lucide-react';
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
    const [sliderPosition, setSliderPosition] = useState(50);

    // Set default selection when files are added
    useEffect(() => {
        if (files.length > 0 && !selectedFileId) {
            setSelectedFileId(files[0].id);
        } else if (files.length === 0) {
            setSelectedFileId(null);
        }
    }, [files, selectedFileId]);

    // Reset slider position when file changes
    useEffect(() => {
        setSliderPosition(50);
    }, [selectedFileId]);

    // UI states
    const [quality, setQuality] = useState(80);
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);
    const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);

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
    const sliderContainerRef = useRef<HTMLDivElement>(null);

    // Reset crop on file change
    useEffect(() => {
        setCrop(undefined);
        setCompletedCrop(undefined);
        setAspect(undefined);
    }, [selectedFileId, files]);

    // Initialize crop on image load
    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        if (type === 'image-cropper') {
            const { width, height } = e.currentTarget;
            // Only initialize if crop doesn't exist
            if (!crop) {
                if (aspect === undefined) {
                    // Default to 16:9 if no aspect is set
                    const defaultAspect = 16 / 9;
                    setAspect(defaultAspect);
                    setCrop(centerAspectCrop(width, height, defaultAspect));
                } else {
                    // Use the current aspect ratio
                    setCrop(centerAspectCrop(width, height, aspect));
                }
            }
        }
    };

    const isBatchSupported = ['image-compressor', 'image-resizer', 'image-enlarger', 'jpg-to-png', 'png-to-jpg', 'webp-converter', 'webp-to-jpg', 'webp-to-png', 'jpg-to-webp', 'png-to-webp', 'svg-to-png', 'png-to-svg', 'jpg-to-svg', 'webp-to-svg'].includes(type);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        setDragActive(e.type === "dragenter" || e.type === "dragover");
    };

    const addFiles = (newFiles: FileList | null) => {
        if (!newFiles || newFiles.length === 0) return;
        const newBatch: ProcessedFile[] = Array.from(newFiles).map(f => ({
            id: Math.random().toString(36).substring(7),
            file: f,
            status: 'pending',
            preview: URL.createObjectURL(f)
        }));

        if (newBatch.length === 0) return;

        if (!isBatchSupported) {
            if (newBatch[0]) {
                setFiles([newBatch[0]]);
                setSelectedFileId(newBatch[0].id);
            }
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
            setSelectedFileId(null);
        }
    };

    const processSingleFile = async (pf: ProcessedFile): Promise<Blob | string> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let w = img.width;
                let h = img.height;

                if (type === 'image-cropper' && completedCrop && imgRef.current) {
                    const scaleX = img.naturalWidth / imgRef.current.width;
                    const scaleY = img.naturalHeight / imgRef.current.height;
                    const pixelCrop = completedCrop;
                    canvas.width = pixelCrop.width * scaleX;
                    canvas.height = pixelCrop.height * scaleY;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return reject('No context');
                    ctx.drawImage(img, pixelCrop.x * scaleX, pixelCrop.y * scaleY, pixelCrop.width * scaleX, pixelCrop.height * scaleY, 0, 0, canvas.width, canvas.height);

                    let mime = pf.file.type;
                    if (mime === 'image/svg+xml') mime = 'image/png';
                    // For PNG, quality doesn't work, so use undefined
                    const qualityValue = mime === 'image/png' ? undefined : quality / 100;
                    canvas.toBlob((blob) => {
                        if (blob) resolve(blob);
                        else reject('Blob failed');
                    }, mime, qualityValue);
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
                    if (finalRotation === 90 || finalRotation === 270) { canvas.width = h; canvas.height = w; }
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
                    ctx.drawImage(img, 0, 0, w, h);
                }

                let mime = pf.file.type;
                
                // For image-compressor, convert PNG to JPEG to enable quality-based compression
                if (type === 'image-compressor') {
                    // Convert PNG/SVG to JPEG for compression, keep JPEG/WebP as is
                    if (mime === 'image/png' || mime === 'image/svg+xml') {
                        mime = 'image/jpeg';
                    }
                    // Keep JPEG and WebP as they support quality compression
                } else {
                    if (['jpg-to-png', 'webp-to-png', 'svg-to-png'].includes(type)) mime = 'image/png';
                    if (['png-to-jpg', 'webp-to-jpg'].includes(type)) mime = 'image/jpeg';
                    if (['webp-converter', 'jpg-to-webp', 'png-to-webp'].includes(type)) mime = 'image/webp';
                    if (['png-to-svg', 'jpg-to-svg', 'webp-to-svg'].includes(type)) mime = 'image/svg+xml';
                }

                // For PNG and SVG formats (non-compressor), quality doesn't work, so use default
                const qualityValue = ((mime === 'image/png' || mime === 'image/svg+xml') && type !== 'image-compressor') ? undefined : quality / 100;

                // Handle SVG conversion separately since canvas cannot export to SVG
                if (mime === 'image/svg+xml') {
                    // Convert canvas to base64 and embed in SVG (use quality as scale)
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
                    
                    // Convert SVG string to Blob
                    const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
                    resolve(svgBlob);
                    return;
                }

                // For PNG outputs, apply quality as scale (PNG has no quality parameter)
                if (mime === 'image/png' && type !== 'image-compressor' && quality < 100) {
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

                canvas.toBlob((blob) => {
                    if (blob) {
                        if (type === 'image-to-base64') {
                            const reader = new FileReader();
                            reader.readAsDataURL(blob);
                            reader.onloadend = () => resolve(reader.result as string);
                        } else resolve(blob);
                    } else reject('Blob failed');
                }, mime, qualityValue);
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
                    // Calculate result size properly
                    if (typeof result === 'string') {
                        updated[i].resultSize = result.length;
                    } else if (result instanceof Blob) {
                        updated[i].resultSize = result.size;
                    } else {
                        updated[i].resultSize = 0;
                    }
                } catch (e) { updated[i].status = 'error'; }
                setFiles([...updated]);
            }

            if (updated.length > 1) {
                const zip = new JSZip();
                updated.forEach((f) => {
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
                if (typeof res === 'string') setBase64Output(res);
                else {
                    let ext = res.type.split('/')[1] || 'png';
                    if (ext === 'svg+xml') ext = 'svg';
                    if (ext === 'jpeg') ext = 'jpg';
                    download(res, `${updated[0].file.name.split('.')[0]}-processed.${ext}`);
                }
            }
        } catch (e) { }
        finally { setProcessing(false); }
    };

    const download = (content: Blob | string, name: string) => {
        const url = typeof content === 'string' ? content : URL.createObjectURL(content);
        const a = document.createElement('a'); a.href = url; a.download = name;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        if (typeof content !== 'string') URL.revokeObjectURL(url);
    };

    useEffect(() => {
        if (files.length === 0) { setPreviewUrl(null); return; }
        const generatePreview = async () => {
            try {
                const fileToPreview = files.find(f => f.id === selectedFileId) || files[0];
                if (!fileToPreview) return;
                // Always process for preview to get updated size when quality changes
                const result = await processSingleFile(fileToPreview);
                
                // Update resultSize for the file
                setFiles(prevFiles => prevFiles.map(f => {
                    if (f.id === fileToPreview.id) {
                        let newSize = 0;
                        if (typeof result === 'string') {
                            newSize = result.length;
                        } else if (result instanceof Blob) {
                            newSize = result.size;
                        }
                        return { ...f, resultSize: newSize };
                    }
                    return f;
                }));
                
                if (result instanceof Blob) {
                    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
                    setPreviewUrl(URL.createObjectURL(result));
                } else setPreviewUrl(result);
            } catch (e) { }
        };
        const timeout = setTimeout(generatePreview, 200);
        return () => clearTimeout(timeout);
    }, [files, selectedFileId, rotation, flipH, flipV, filterValue, color, size, width, height, maintainAspectRatio, type, quality]);

    const imageNavTools = [
        { category: 'OPTIMIZE', tools: [{ id: 'image-compressor', label: 'Image Compressor', icon: FileArchive }, { id: 'image-resizer', label: 'Image Resizer', icon: Sliders }, { id: 'image-enlarger', label: 'Image Enlarger', icon: Sliders }, { id: 'image-brightness', label: 'Brightness', icon: Zap }, { id: 'image-contrast', label: 'Contrast', icon: Zap }, { id: 'blur-image', label: 'Blur', icon: Wand2 }, { id: 'saturate-image', label: 'Saturate', icon: Wand2 }, { id: 'hue-rotate-image', label: 'Hue Rotate', icon: RotateCw }, { id: 'image-opacity', label: 'Opacity', icon: Zap }] },
        { category: 'CONVERT', tools: [{ id: 'jpg-to-png', label: 'JPG to PNG', icon: ImageIcon }, { id: 'png-to-jpg', label: 'PNG to JPG', icon: ImageIcon }, { id: 'webp-converter', label: 'WebP Converter', icon: ImageIcon }, { id: 'svg-to-png', label: 'SVG to PNG', icon: ImageIcon }, { id: 'png-to-svg', label: 'PNG to SVG', icon: ImageIcon }, { id: 'webp-to-jpg', label: 'WebP to JPG', icon: ImageIcon }, { id: 'webp-to-png', label: 'WebP to PNG', icon: ImageIcon }, { id: 'jpg-to-webp', label: 'JPG to WebP', icon: ImageIcon }, { id: 'png-to-webp', label: 'PNG to WebP', icon: ImageIcon }] },
        { category: 'BASE64', tools: [{ id: 'image-to-base64', label: 'Image to Base64', icon: FileArchive }, { id: 'base64-to-image', label: 'Base64 to Image', icon: FileArchive }] },
        { category: 'EDIT', tools: [{ id: 'image-cropper', label: 'Image Cropper', icon: Upload }, { id: 'rotate-image', label: 'Rotate Image', icon: RotateCw }, { id: 'flip-image', label: 'Flip Image', icon: MoveHorizontal }] },
        { category: 'FILTERS', tools: [{ id: 'grayscale-image', label: 'Grayscale', icon: Wand2 }, { id: 'sepia-converter', label: 'Sepia', icon: Wand2 }, { id: 'invert-image', label: 'Invert', icon: Wand2 }, { id: 'round-corners-image', label: 'Round Corners', icon: CheckCircle2 }, { id: 'image-border', label: 'Border', icon: Square }, { id: 'image-shadow', label: 'Shadow', icon: Zap }, { id: 'pixelate-image', label: 'Pixelate', icon: Grid3X3 }] }
    ];

    const activeCategory = imageNavTools.find(cat => cat.tools.some(t => t.id === type));
    const isImageTool = imageNavTools.some(cat => cat.tools.some(t => t.id === type));

    return (
        <div className="max-w-6xl mx-auto space-y-4">
            {isImageTool && activeCategory && (
                <ScrollableNav items={[{ category: activeCategory.category, tools: activeCategory.tools }]} activeToolId={type} />
            )}
            <input id="image-input" type="file" multiple={isBatchSupported} className="hidden" accept="image/*" onChange={(e) => addFiles(e.target.files)} />

            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">
                <div className="p-4 md:p-6">
                    {files.length === 0 ? (
                        <div onDragOver={handleDrag} onDragEnter={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop} className={cn("min-h-[250px] flex flex-col items-center justify-center transition-all py-8 px-4 relative", dragActive ? "bg-accent/5" : "bg-transparent")}>
                            <div className="relative z-10 text-center">
                                <button onClick={() => document.getElementById('image-input')?.click()} className="px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-6 bg-primary text-white dark:bg-gradient-to-r dark:from-sky-500 dark:to-blue-600 dark:border-none text-lg sm:text-xl md:text-2xl font-black rounded-2xl shadow-[0_20px_40px_-15px_rgba(var(--primary-rgb),0.4)] dark:shadow-[0_0_30px_-5px_rgba(14,165,233,0.4)] hover:scale-[1.05] hover:shadow-[0_25px_50px_-12px_rgba(var(--primary-rgb),0.5)] dark:hover:shadow-[0_0_40px_-5px_rgba(14,165,233,0.5)] active:scale-95 transition-all duration-300">
                                    {tActions('chooseFile')}
                                </button>
                                <div className="mt-6 text-muted-foreground font-bold text-sm uppercase tracking-[0.2em] opacity-40">or drop images here</div>
                            </div>
                            {type === 'base64-to-image' && (
                                <div className="mt-8 w-full max-w-xl px-4" onClick={e => e.stopPropagation()}>
                                    <textarea value={base64Input} onChange={(e) => setBase64Input(e.target.value)} className="w-full h-24 p-3 border-2 border-border rounded-xl bg-input font-mono text-xs text-foreground focus:border-accent outline-none resize-none" placeholder={tActions('pasteBase64')} />
                                    <button onClick={() => { try { const blob = base64ToBlob(base64Input); const file = new File([blob], "image.png", { type: blob.type }); addFiles([file] as unknown as FileList); } catch (e) { } }} className="w-full mt-2 py-2 sm:py-3 bg-primary text-white rounded-xl font-bold transition-all text-xs sm:text-sm">{tActions('convert')}</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col lg:grid lg:grid-cols-[1fr,350px] gap-6 lg:gap-8 items-start lg:items-stretch">
                            {/* Main Workspace Area */}
                            <div className="flex flex-col gap-6">
                                {/* Compact Control Header */}
                                <div className="flex items-center justify-between px-6 py-4 bg-muted/50 rounded-2xl border border-border">
                                    <div className="flex items-center gap-4">
                                        <div className="flex px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                            {files.length} {t('imagesSelected', { count: files.length })}
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                                        <button onClick={() => document.getElementById('image-input')?.click()} className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-2">
                                            <Upload size={14} /> {tActions('addMore')}
                                        </button>
                                        <button onClick={() => setFiles([])} className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-destructive hover:underline">{tActions('clearAll')}</button>
                                    </div>
                                </div>

                                {/* Modern Before/After Comparison with Slider */}
                                <div className="flex-1 bg-gradient-to-br from-muted/20 to-muted/5 p-4 lg:p-6 rounded-3xl border-2 border-border shadow-inner relative flex flex-col min-h-[200px]">
                                    {(() => {
                                        const selectedFile = files.find(f => f.id === selectedFileId) || files[0];
                                        // Calculate sizes early for all tools
                                        const originalSize = selectedFile?.file ? (selectedFile.file.size / 1024).toFixed(1) : '0';
                                        const processedSize = selectedFile?.resultSize ? (selectedFile.resultSize / 1024).toFixed(1) : '0';
                                        
                                        // Show comparison for tools that modify the image
                                        const comparisonTools = ['image-compressor', 'image-resizer', 'image-enlarger', 'image-cropper', 'rotate-image', 'flip-image', 'blur-image', 'grayscale-image', 'sepia-converter', 'invert-image', 'image-brightness', 'image-contrast', 'saturate-image', 'hue-rotate-image', 'image-opacity', 'jpg-to-png', 'png-to-jpg', 'webp-converter', 'jpg-to-webp', 'png-to-webp', 'webp-to-jpg', 'webp-to-png', 'svg-to-png', 'png-to-svg'];
                                        const showComparison = previewUrl && selectedFile?.preview && comparisonTools.includes(type);
                                        
                                        // Special handling for Image Cropper - show crop overlay
                                        if (type === 'image-cropper' && selectedFile?.preview) {
                                            return (
                                                <div className="flex-1 flex flex-col gap-4">
                                                    {/* Stats for Cropper */}
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border shadow-sm">
                                                            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Original</div>
                                                            <div className="text-2xl font-black text-foreground">{originalSize} KB</div>
                                                            <div className="text-[11px] text-muted-foreground mt-1">Before crop</div>
                                                        </div>
                                                        <div className="bg-primary/10 border-primary/20 backdrop-blur-sm rounded-xl p-4 border border-primary/30 shadow-sm">
                                                            <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Cropped</div>
                                                            <div className="text-2xl font-black text-primary">{completedCrop ? `${Math.round(completedCrop.width)} × ${Math.round(completedCrop.height)}px` : 'Select area'}</div>
                                                            <div className="text-[11px] text-muted-foreground mt-1">Crop dimensions</div>
                                                        </div>
                                                    </div>

                                                    {/* Cropper Preview with ReactCrop */}
                                                    <div className="flex-1 relative rounded-2xl overflow-hidden checkered-bg border-2 border-border shadow-lg min-h-[200px]">
                                                        <div className="absolute inset-0 flex items-center justify-center p-4">
                                                            <ReactCrop
                                                                key={`crop-${aspect ?? 'free'}`}
                                                                crop={crop}
                                                                onChange={(_, percentCrop) => setCrop(percentCrop)}
                                                                onComplete={(c) => setCompletedCrop(c)}
                                                                {...(aspect !== undefined && { aspect })}
                                                                className="max-w-full max-h-full"
                                                            >
                                                                <img
                                                                    ref={imgRef}
                                                                    src={selectedFile.preview}
                                                                    alt="Crop"
                                                                    onLoad={onImageLoad}
                                                                    className="max-w-full max-h-full object-contain"
                                                                    style={{ maxHeight: '100%' }}
                                                                />
                                                            </ReactCrop>
                                                        </div>
                                                        {!crop && (
                                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                                <div className="bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest">
                                                                    Drag to select crop area
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        }

                                        if (!showComparison) {
                                            // Enhanced preview for tools that don't need comparison
                                            const previewTools = ['image-to-base64', 'base64-to-image', 'round-corners-image', 'image-border', 'image-shadow', 'pixelate-image'];
                                            const showEnhancedPreview = previewUrl && previewTools.includes(type);
                                            
                                            return (
                                                <div className="flex-1 relative rounded-2xl overflow-hidden checkered-bg border-2 border-border shadow-lg flex items-center justify-center min-h-[200px]">
                                                    {previewUrl ? (
                                                        <div className="relative w-full h-full flex items-center justify-center p-4">
                                                            <img 
                                                                src={previewUrl} 
                                                                alt="Preview" 
                                                                className="max-w-full max-h-full object-contain drop-shadow-2xl animate-in zoom-in-95 duration-500" 
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                                            <ImageIcon size={64} />
                                                            <span className="font-black uppercase tracking-[0.2em] text-xs">Generating Preview...</span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        }

                                        const reductionPercent = selectedFile?.file && selectedFile?.resultSize 
                                            ? ((1 - selectedFile.resultSize / selectedFile.file.size) * 100).toFixed(1) 
                                            : '0';

                                        // Tool-specific stats labels
                                        const getStatsLabels = () => {
                                            switch (type) {
                                                case 'image-compressor':
                                                    return {
                                                        left: { title: 'Original', subtitle: 'Before compression' },
                                                        right: { title: 'Compressed', subtitle: parseFloat(reductionPercent) > 0 ? `↓ ${reductionPercent}% smaller` : 'No reduction' }
                                                    };
                                                case 'image-resizer':
                                                case 'image-enlarger':
                                                    return {
                                                        left: { title: 'Original Size', subtitle: 'Original dimensions' },
                                                        right: { title: 'New Size', subtitle: width && height ? `${width} × ${height}px` : 'Processing...' }
                                                    };
                                                case 'jpg-to-png':
                                                case 'png-to-jpg':
                                                case 'webp-converter':
                                                case 'jpg-to-webp':
                                                case 'png-to-webp':
                                                case 'webp-to-jpg':
                                                case 'webp-to-png':
                                                case 'svg-to-png':
                                                    return {
                                                        left: { title: 'Original Format', subtitle: selectedFile.file?.type?.split('/')[1]?.toUpperCase() || 'Unknown' },
                                                        right: { title: 'New Format', subtitle: 'PNG' }
                                                    };
                                                default:
                                                    return {
                                                        left: { title: 'Original', subtitle: `${originalSize} KB` },
                                                        right: { title: 'Processed', subtitle: `${processedSize} KB` }
                                                    };
                                            }
                                        };

                                        const statsLabels = getStatsLabels();
                                        
                                        // Get comparison labels based on tool type
                                        const getComparisonLabels = () => {
                                            switch (type) {
                                                case 'image-compressor':
                                                    return { left: 'Original', right: 'Compressed' };
                                                case 'image-resizer':
                                                case 'image-enlarger':
                                                    return { left: 'Original', right: 'Resized' };
                                                case 'image-cropper':
                                                    return { left: 'Original', right: 'Cropped' };
                                                case 'rotate-image':
                                                    return { left: 'Original', right: 'Rotated' };
                                                case 'flip-image':
                                                    return { left: 'Original', right: 'Flipped' };
                                                case 'jpg-to-png':
                                                case 'png-to-jpg':
                                                case 'webp-converter':
                                                    return { left: 'Original', right: 'Converted' };
                                                default:
                                                    return { left: 'Original', right: 'Processed' };
                                            }
                                        };
                                        
                                        const comparisonLabels = getComparisonLabels();

                                        return (
                                            <div className="flex-1 flex flex-col gap-4">
                                                {/* Stats Bar - Top */}
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border shadow-sm">
                                                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">{statsLabels.left.title}</div>
                                                        {(type === 'image-compressor' || isBatchSupported) ? (
                                                            <>
                                                                <div className="text-2xl font-black text-foreground">{originalSize} KB</div>
                                                                <div className="text-[11px] text-muted-foreground mt-1">{statsLabels.left.subtitle}</div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="text-2xl font-black text-foreground">{originalSize} KB</div>
                                                                <div className="text-[11px] text-muted-foreground mt-1">{statsLabels.left.subtitle}</div>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="bg-primary/10 border-primary/20 backdrop-blur-sm rounded-xl p-4 border border-primary/30 shadow-sm">
                                                        <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">{statsLabels.right.title}</div>
                                                        {(type === 'image-compressor' || isBatchSupported) ? (
                                                            <>
                                                                <div className="text-2xl font-black text-primary">{processedSize} KB</div>
                                                                <div className={cn("text-[11px] font-bold mt-1", parseFloat(reductionPercent) > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")}>
                                                                    {statsLabels.right.subtitle}
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="text-2xl font-black text-primary">{processedSize} KB</div>
                                                                <div className="text-[11px] text-muted-foreground mt-1">{statsLabels.right.subtitle}</div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Split View Comparison - No Slider */}
                                                <div className="flex-1 relative rounded-2xl overflow-hidden checkered-bg border-2 border-border shadow-lg min-h-[200px]">
                                                    <div className="grid grid-cols-2 h-full">
                                                        {/* Original Image (Left Side) */}
                                                        <div className="relative flex items-center justify-center p-4 border-r border-border/30">
                                                            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest pointer-events-none z-10">
                                                                Original
                                                            </div>
                                                            {(type === 'image-resizer' || type === 'image-enlarger') && selectedFile?.preview && (
                                                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest pointer-events-none z-10">
                                                                    {(() => {
                                                                        const img = new Image();
                                                                        img.src = selectedFile.preview;
                                                                        return img.naturalWidth ? `${img.naturalWidth} × ${img.naturalHeight}px` : 'Original';
                                                                    })()}
                                                                </div>
                                                            )}
                                                            <img 
                                                                src={selectedFile.preview} 
                                                                alt="Original" 
                                                                className="max-w-full max-h-full object-contain select-none drop-shadow-lg" 
                                                                draggable={false}
                                                            />
                                                        </div>
                                                        
                                                        {/* Processed Image (Right Side) */}
                                                        <div className="relative flex items-center justify-center p-4">
                                                            <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest pointer-events-none z-10">
                                                                {comparisonLabels.right}
                                                            </div>
                                                            {(type === 'image-resizer' || type === 'image-enlarger') && width > 0 && height > 0 && (
                                                                <div className="absolute bottom-4 right-1/2 translate-x-1/2 bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest pointer-events-none z-10">
                                                                    {width} × {height}px
                                                                </div>
                                                            )}
                                                            <img 
                                                                src={previewUrl} 
                                                                alt="Processed" 
                                                                className="max-w-full max-h-full object-contain select-none drop-shadow-lg" 
                                                                draggable={false}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Filter Effect Indicator */}
                                                    {['blur-image', 'grayscale-image', 'sepia-converter', 'invert-image', 'image-brightness', 'image-contrast', 'saturate-image', 'hue-rotate-image', 'image-opacity'].includes(type) && (
                                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest pointer-events-none">
                                                            {type === 'blur-image' && `Blur: ${size}px`}
                                                            {type === 'grayscale-image' && `Grayscale: ${filterValue}%`}
                                                            {type === 'sepia-converter' && `Sepia: ${filterValue}%`}
                                                            {type === 'invert-image' && `Invert: ${filterValue}%`}
                                                            {type === 'image-brightness' && `Brightness: ${filterValue}%`}
                                                            {type === 'image-contrast' && `Contrast: ${filterValue}%`}
                                                            {type === 'saturate-image' && `Saturation: ${filterValue}%`}
                                                            {type === 'hue-rotate-image' && `Hue: ${filterValue}°`}
                                                            {type === 'image-opacity' && `Opacity: ${filterValue}%`}
                                                        </div>
                                                    )}

                                                    {/* Rotation Indicator */}
                                                    {type === 'rotate-image' && rotation !== 0 && (
                                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest pointer-events-none">
                                                            Rotated: {rotation}°
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Instructions */}
                                                <div className="text-center text-[10px] text-muted-foreground font-medium">
                                                    Compare original and processed images
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>

                                {/* Horizontal File Strip */}
                                <div className="relative group">
                                    {/* Scroll Left Button */}
                                    {files.length > 4 && (
                                        <button 
                                            onClick={() => {
                                                const strip = document.getElementById('file-strip');
                                                if (strip) strip.scrollBy({ left: -150, behavior: 'smooth' });
                                            }}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <ChevronRight className="w-4 h-4 rotate-180" />
                                        </button>
                                    )}
                                    
                                    <div id="file-strip" className="h-32 flex-shrink-0 bg-muted/20 p-2 rounded-2xl border-2 border-border flex items-center gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent hover:scrollbar-thumb-primary/50 scroll-smooth">
                                        {files.map((file) => (
                                            <div key={file.id} onClick={() => setSelectedFileId(file.id)} className={cn("h-full aspect-square rounded-xl border-2 transition-all cursor-pointer relative group overflow-hidden flex-shrink-0 min-w-[100px]", selectedFileId === file.id ? "border-primary shadow-lg ring-2 ring-primary/20" : "border-border hover:border-primary/50")}>
                                                <img src={file.preview} className="w-full h-full object-cover" alt="" />
                                                {file.status === 'processing' && (
                                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                                                        <RefreshCw className="w-5 h-5 animate-spin text-white" />
                                                    </div>
                                                )}
                                                {file.status === 'done' && (
                                                    <div className="absolute top-1 right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-md">
                                                        <CheckCircle2 size={10} />
                                                    </div>
                                                )}
                                                <button onClick={(e) => { e.stopPropagation(); removeFile(file.id); }} className="absolute -top-1 -left-1 p-1 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg scale-75"><X size={12} /></button>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* Scroll Right Button */}
                                    {files.length > 4 && (
                                        <button 
                                            onClick={() => {
                                                const strip = document.getElementById('file-strip');
                                                if (strip) strip.scrollBy({ left: 150, behavior: 'smooth' });
                                            }}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Sidebar Settings Area - Modern Design */}
                            <div className="w-full lg:w-[350px] flex-shrink-0">
                                <div className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm p-4 lg:p-6 rounded-3xl border-2 border-border shadow-2xl">
                                    <div className="space-y-4 lg:space-y-6">
                                        {/* Header */}
                                        <div className="flex items-center gap-3 pb-4 border-b-2 border-border/50">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <Settings className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <h4 className="font-black uppercase tracking-[0.2em] text-sm leading-none text-foreground">Settings</h4>
                                                <p className="text-[10px] text-muted-foreground mt-0.5">Adjust quality & options</p>
                                            </div>
                                        </div>

                                        {/* Settings Content */}
                                        <div className="space-y-6">
                                            {/* Quality Control - For Compressor and Converters */}
                                            {(type === 'image-compressor' || isBatchSupported) && (
                                                <div className="space-y-4 bg-muted/30 p-4 rounded-xl border border-border/50">
                                                    <div className="flex justify-between items-center">
                                                        <label className="text-xs font-bold uppercase tracking-wider text-foreground">{t('quality')}</label>
                                                        <div className="px-3 py-1 bg-primary/10 text-primary rounded-lg border border-primary/20">
                                                            <span className="text-lg font-black">{quality}%</span>
                                                        </div>
                                                    </div>
                                                    <input 
                                                        type="range" 
                                                        min="5" 
                                                        max="100" 
                                                        value={quality} 
                                                        onChange={(e) => setQuality(parseInt(e.target.value))} 
                                                        className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-colors" 
                                                    />
                                                    <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
                                                        <span>Lower Size</span>
                                                        <span>Higher Quality</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Image Resizer Controls */}
                                            {(type === 'image-resizer' || type === 'image-enlarger') && (
                                                <div className="space-y-4 bg-muted/30 p-4 rounded-xl border border-border/50">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <label className="text-xs font-bold uppercase tracking-wider text-foreground">Dimensions</label>
                                                        <button 
                                                            onClick={() => setMaintainAspectRatio(!maintainAspectRatio)}
                                                            className={cn("px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", maintainAspectRatio ? "bg-primary/10 text-primary border border-primary/20" : "bg-muted text-muted-foreground border border-border")}
                                                        >
                                                            {maintainAspectRatio ? "Lock" : "Unlock"}
                                                        </button>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Width (px)</label>
                                                            <input 
                                                                type="number" 
                                                                value={width || ''} 
                                                                onChange={(e) => setWidth(parseInt(e.target.value) || 0)} 
                                                                placeholder="Auto"
                                                                className="w-full px-3 py-2 bg-background border-2 border-border rounded-lg text-sm font-bold focus:border-primary outline-none transition-colors"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Height (px)</label>
                                                            <input 
                                                                type="number" 
                                                                value={height || ''} 
                                                                onChange={(e) => setHeight(parseInt(e.target.value) || 0)} 
                                                                placeholder="Auto"
                                                                className="w-full px-3 py-2 bg-background border-2 border-border rounded-lg text-sm font-bold focus:border-primary outline-none transition-colors"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                                                        {[25, 50, 75, 100, 150, 200].map((percent) => (
                                                            <button
                                                                key={percent}
                                                                onClick={() => {
                                                                    const selectedFile = files.find(f => f.id === selectedFileId) || files[0];
                                                                    if (selectedFile?.preview) {
                                                                        const img = new Image();
                                                                        img.src = selectedFile.preview;
                                                                        img.onload = () => {
                                                                            setWidth(Math.round(img.width * percent / 100));
                                                                            setHeight(Math.round(img.height * percent / 100));
                                                                        };
                                                                    }
                                                                }}
                                                                className="py-2 bg-background border border-border rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-primary/10 hover:border-primary transition-all"
                                                            >
                                                                {percent}%
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Rotate Controls */}
                                            {type === 'rotate-image' && (
                                                <div className="space-y-4 bg-muted/30 p-4 rounded-xl border border-border/50">
                                                    <div className="flex justify-between items-center">
                                                        <label className="text-xs font-bold uppercase tracking-wider text-foreground">Rotation</label>
                                                        <div className="px-3 py-1 bg-primary/10 text-primary rounded-lg border border-primary/20">
                                                            <span className="text-lg font-black">{rotation}°</span>
                                                        </div>
                                                    </div>
                                                    <input 
                                                        type="range" 
                                                        min="0" 
                                                        max="360" 
                                                        value={rotation} 
                                                        onChange={(e) => setRotation(parseInt(e.target.value))} 
                                                        className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-colors" 
                                                    />
                                                    <div className="grid grid-cols-4 gap-2">
                                                        {[0, 90, 180, 270].map((angle) => (
                                                            <button
                                                                key={angle}
                                                                onClick={() => setRotation(angle)}
                                                                className={cn("py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border", rotation === angle ? "bg-primary text-primary-foreground border-primary shadow-lg" : "bg-background text-foreground border-border hover:bg-muted")}
                                                            >
                                                                {angle}°
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Flip Controls */}
                                            {type === 'flip-image' && (
                                                <div className="space-y-4 bg-muted/30 p-4 rounded-xl border border-border/50">
                                                    <label className="text-xs font-bold uppercase tracking-wider text-foreground">Flip Direction</label>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <button
                                                            onClick={() => { setFlipH(!flipH); setFlipV(false); }}
                                                            className={cn("py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all border flex items-center justify-center gap-2", flipH ? "bg-primary text-primary-foreground border-primary shadow-lg" : "bg-background text-foreground border-border hover:bg-muted")}
                                                        >
                                                            <MoveHorizontal size={20} /> Horizontal
                                                        </button>
                                                        <button
                                                            onClick={() => { setFlipV(!flipV); setFlipH(false); }}
                                                            className={cn("py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all border flex items-center justify-center gap-2", flipV ? "bg-primary text-primary-foreground border-primary shadow-lg" : "bg-background text-foreground border-border hover:bg-muted")}
                                                        >
                                                            <MoveVertical size={20} /> Vertical
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Filter Controls - Blur */}
                                            {type === 'blur-image' && (
                                                <div className="space-y-4 bg-muted/30 p-4 rounded-xl border border-border/50">
                                                    <div className="flex justify-between items-center">
                                                        <label className="text-xs font-bold uppercase tracking-wider text-foreground">Blur Intensity</label>
                                                        <div className="px-3 py-1 bg-primary/10 text-primary rounded-lg border border-primary/20">
                                                            <span className="text-lg font-black">{size}px</span>
                                                        </div>
                                                    </div>
                                                    <input 
                                                        type="range" 
                                                        min="0" 
                                                        max="50" 
                                                        value={size} 
                                                        onChange={(e) => setSize(parseInt(e.target.value))} 
                                                        className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-colors" 
                                                    />
                                                    <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
                                                        <span>No Blur</span>
                                                        <span>Maximum Blur</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Filter Controls - Brightness, Contrast, Saturation, etc. */}
                                            {['image-brightness', 'image-contrast', 'saturate-image', 'image-opacity'].includes(type) && (
                                                <div className="space-y-4 bg-muted/30 p-4 rounded-xl border border-border/50">
                                                    <div className="flex justify-between items-center">
                                                        <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                                                            {type === 'image-brightness' ? 'Brightness' : type === 'image-contrast' ? 'Contrast' : type === 'saturate-image' ? 'Saturation' : 'Opacity'}
                                                        </label>
                                                        <div className="px-3 py-1 bg-primary/10 text-primary rounded-lg border border-primary/20">
                                                            <span className="text-lg font-black">{filterValue}%</span>
                                                        </div>
                                                    </div>
                                                    <input 
                                                        type="range" 
                                                        min="0" 
                                                        max="200" 
                                                        value={filterValue} 
                                                        onChange={(e) => setFilterValue(parseInt(e.target.value))} 
                                                        className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-colors" 
                                                    />
                                                    <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
                                                        <span>0%</span>
                                                        <span>100%</span>
                                                        <span>200%</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Filter Controls - Grayscale, Sepia, Invert */}
                                            {['grayscale-image', 'sepia-converter', 'invert-image'].includes(type) && (
                                                <div className="space-y-4 bg-muted/30 p-4 rounded-xl border border-border/50">
                                                    <div className="flex justify-between items-center">
                                                        <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                                                            {type === 'grayscale-image' ? 'Grayscale' : type === 'sepia-converter' ? 'Sepia' : 'Invert'} Intensity
                                                        </label>
                                                        <div className="px-3 py-1 bg-primary/10 text-primary rounded-lg border border-primary/20">
                                                            <span className="text-lg font-black">{filterValue}%</span>
                                                        </div>
                                                    </div>
                                                    <input 
                                                        type="range" 
                                                        min="0" 
                                                        max="100" 
                                                        value={filterValue} 
                                                        onChange={(e) => setFilterValue(parseInt(e.target.value))} 
                                                        className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-colors" 
                                                    />
                                                    <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
                                                        <span>Original</span>
                                                        <span>Full Effect</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Hue Rotate */}
                                            {type === 'hue-rotate-image' && (
                                                <div className="space-y-4 bg-muted/30 p-4 rounded-xl border border-border/50">
                                                    <div className="flex justify-between items-center">
                                                        <label className="text-xs font-bold uppercase tracking-wider text-foreground">Hue Rotation</label>
                                                        <div className="px-3 py-1 bg-primary/10 text-primary rounded-lg border border-primary/20">
                                                            <span className="text-lg font-black">{filterValue}°</span>
                                                        </div>
                                                    </div>
                                                    <input 
                                                        type="range" 
                                                        min="0" 
                                                        max="360" 
                                                        value={filterValue} 
                                                        onChange={(e) => setFilterValue(parseInt(e.target.value))} 
                                                        className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-colors" 
                                                    />
                                                    <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
                                                        <span>0°</span>
                                                        <span>360°</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Cropper Aspect Ratio */}
                                            {type === 'image-cropper' && (
                                                <div className="space-y-4 bg-muted/30 p-4 rounded-xl border border-border/50">
                                                    <label className="text-xs font-bold uppercase tracking-wider text-foreground">Aspect Ratio</label>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {[
                                                            { label: 'Free', value: undefined },
                                                            { label: '1:1', value: 1 },
                                                            { label: '16:9', value: 16 / 9 },
                                                            { label: '4:3', value: 4 / 3 },
                                                            { label: '3:2', value: 3 / 2 },
                                                            { label: '9:16', value: 9 / 16 }
                                                        ].map((ratio) => {
                                                            // Compare aspect ratios with tolerance for floating point
                                                            const isSelected = ratio.value === undefined 
                                                                ? aspect === undefined 
                                                                : aspect !== undefined && Math.abs((aspect || 0) - (ratio.value || 0)) < 0.0001;
                                                            
                                                            return (
                                                                <button
                                                                    key={ratio.label}
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        const newAspect = ratio.value;
                                                                        
                                                                        // Update both aspect and crop together
                                                                        if (imgRef.current) {
                                                                            const img = imgRef.current;
                                                                            const { width, height } = img;
                                                                            
                                                                            if (newAspect !== undefined) {
                                                                                // Set specific aspect ratio crop
                                                                                const newCrop = centerAspectCrop(width, height, newAspect);
                                                                                setAspect(newAspect);
                                                                                setCrop(newCrop);
                                                                            } else {
                                                                                // Free form - create a default crop without aspect constraint
                                                                                const defaultCrop = {
                                                                                    unit: '%' as const,
                                                                                    width: 80,
                                                                                    height: 80,
                                                                                    x: 10,
                                                                                    y: 10
                                                                                };
                                                                                setAspect(undefined);
                                                                                setCrop(defaultCrop);
                                                                            }
                                                                        } else {
                                                                            // If image not loaded yet, just set aspect
                                                                            setAspect(newAspect);
                                                                        }
                                                                    }}
                                                                    className={cn("py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border", isSelected ? "bg-primary text-primary-foreground border-primary shadow-lg" : "bg-background text-foreground border-border hover:bg-muted")}
                                                                >
                                                                    {ratio.label}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-8 mt-auto space-y-4 border-t border-border">
                                        <button onClick={processAll} disabled={processing || files.length === 0} className="w-full py-5 bg-primary text-primary-foreground dark:bg-gradient-to-r dark:from-sky-500 dark:to-blue-600 dark:border-none rounded-2xl font-black text-lg shadow-[0_20px_40px_-15px_rgba(var(--primary-rgb),0.4)] dark:shadow-[0_0_30px_-5px_rgba(14,165,233,0.4)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-3">
                                            {processing ? <RefreshCw className="w-6 h-6 animate-spin" /> : <><Wand2 size={24} />{tActions('runTool')}</>}
                                        </button>
                                        <div className="flex items-center justify-center gap-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/30">
                                            <div className="flex items-center gap-1.5"><Lock size={12} /> Privacy First</div>
                                            <div className="flex items-center gap-1.5"><CheckCircle2 size={12} /> Secure</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {
                base64Output && (
                    <div className="bg-card p-8 rounded-3xl border-2 border-border shadow-2xl space-y-6 animate-in slide-in-from-bottom-5 duration-500 mt-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Base64 Output</h3>
                            <button onClick={() => { navigator.clipboard.writeText(base64Output).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); }} className={cn("px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all", copied ? "bg-emerald-500 text-white" : "bg-primary text-white")}>{copied ? 'COPIED!' : 'Copy String'}</button>
                        </div>
                        <textarea readOnly value={base64Output} className="w-full h-48 p-6 bg-muted rounded-3xl font-mono text-xs break-all resize-none outline-none border-2 border-border focus:border-accent transition-colors shadow-inner" />
                    </div>
                )
            }
        </div >
    );
}
