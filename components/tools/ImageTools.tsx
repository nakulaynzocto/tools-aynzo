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
                const isConverter = type === 'image-format-converter';
                if (['jpg-to-png', 'webp-to-png', 'svg-to-png'].includes(type) || (isConverter && targetFormat === 'png')) mime = 'image/png';
                if (['png-to-jpg', 'webp-to-jpg'].includes(type) || (isConverter && targetFormat === 'jpg')) mime = 'image/jpeg';
                if (['webp-converter', 'jpg-to-webp', 'png-to-webp'].includes(type) || (isConverter && targetFormat === 'webp')) mime = 'image/webp';

                canvas.toBlob((blob) => {
                    if (blob) {
                        if (type === 'image-to-base64') {
                            const reader = new FileReader();
                            reader.readAsDataURL(blob);
                            reader.onloadend = () => resolve(reader.result as string);
                        } else resolve(blob);
                    } else reject('Blob failed');
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
                const result = await processSingleFile(fileToPreview);
                if (result instanceof Blob) {
                    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
                    setPreviewUrl(URL.createObjectURL(result));
                } else setPreviewUrl(result);
            } catch (e) { }
        };
        const timeout = setTimeout(generatePreview, 200);
        return () => clearTimeout(timeout);
    }, [files, selectedFileId, rotation, flipH, flipV, filterValue, color, size, width, height, maintainAspectRatio, targetFormat, type]);

    const imageNavTools = [
        { category: 'Edit', tools: [{ id: 'image-compressor', label: 'Compress', icon: FileArchive }, { id: 'image-resizer', label: 'Resize', icon: Sliders }, { id: 'image-cropper', label: 'Crop', icon: Upload }, { id: 'rotate-image', label: 'Rotate', icon: RotateCw }, { id: 'flip-image', label: 'Flip', icon: MoveHorizontal }] },
        { category: 'Convert', tools: [{ id: 'jpg-to-png', label: 'JPG to PNG', icon: ImageIcon }, { id: 'png-to-jpg', label: 'PNG to JPG', icon: ImageIcon }, { id: 'webp-converter', label: 'WebP', icon: ImageIcon }, { id: 'svg-to-png', label: 'SVG to PNG', icon: ImageIcon }, { id: 'image-to-base64', label: 'Base64', icon: FileArchive }] },
        { category: 'Effects', tools: [{ id: 'blur-image', label: 'Blur', icon: Wand2 }, { id: 'grayscale-image', label: 'Grayscale', icon: Wand2 }, { id: 'round-corners-image', label: 'Round', icon: CheckCircle2 }, { id: 'image-brightness', label: 'Bright', icon: Zap }] }
    ];

    const isImageTool = imageNavTools.some(cat => cat.tools.some(t => t.id === type));

    return (
        <div className="max-w-6xl mx-auto space-y-4">
            {isImageTool && <ScrollableNav items={imageNavTools} activeToolId={type} />}
            <input id="image-input" type="file" multiple={isBatchSupported} className="hidden" accept="image/*" onChange={(e) => addFiles(e.target.files)} />

            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">
                <div className="p-4 md:p-6">
                    {files.length === 0 ? (
                        <div onDragOver={handleDrag} onDragEnter={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop} className={cn("min-h-[250px] flex flex-col items-center justify-center transition-all py-8 px-4 relative", dragActive ? "bg-accent/5" : "bg-transparent")}>
                            <div className="relative z-10 text-center">
                                <button onClick={() => document.getElementById('image-input')?.click()} className="px-12 py-6 bg-primary text-white dark:bg-gradient-to-r dark:from-sky-500 dark:to-blue-600 dark:border-none text-2xl font-black rounded-2xl shadow-[0_20px_40px_-15px_rgba(var(--primary-rgb),0.4)] dark:shadow-[0_0_30px_-5px_rgba(14,165,233,0.4)] hover:scale-[1.05] hover:shadow-[0_25px_50px_-12px_rgba(var(--primary-rgb),0.5)] dark:hover:shadow-[0_0_40px_-5px_rgba(14,165,233,0.5)] active:scale-95 transition-all duration-300">
                                    {tActions('chooseFile')}
                                </button>
                                <div className="mt-6 text-muted-foreground font-bold text-sm uppercase tracking-[0.2em] opacity-40">or drop images here</div>
                            </div>
                            {type === 'base64-to-image' && (
                                <div className="mt-8 w-full max-w-xl px-4" onClick={e => e.stopPropagation()}>
                                    <textarea value={base64Input} onChange={(e) => setBase64Input(e.target.value)} className="w-full h-24 p-3 border-2 border-border rounded-xl bg-input font-mono text-xs text-foreground focus:border-accent outline-none resize-none" placeholder={tActions('pasteBase64')} />
                                    <button onClick={() => { try { const blob = base64ToBlob(base64Input); const file = new File([blob], "image.png", { type: blob.type }); addFiles([file] as unknown as FileList); } catch (e) { } }} className="w-full mt-2 py-3 bg-primary text-white rounded-xl font-bold transition-all text-sm">{tActions('convertTo', { format: 'Image' })}</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-[1fr,350px] gap-8 items-stretch lg:h-[500px] h-auto">
                            {/* Main Workspace Area */}
                            <div className="flex flex-col gap-6 h-full min-h-0">
                                {/* Compact Control Header */}
                                <div className="flex items-center justify-between px-6 py-4 bg-muted/50 rounded-2xl border border-border">
                                    <div className="flex items-center gap-4">
                                        <div className="flex px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                            {files.length} {t('imagesSelected', { count: files.length })}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => document.getElementById('image-input')?.click()} className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-2">
                                            <Upload size={14} /> {tActions('addMore')}
                                        </button>
                                        <button onClick={() => setFiles([])} className="text-[10px] font-black uppercase tracking-widest text-destructive hover:underline">{tActions('clearAll')}</button>
                                    </div>
                                </div>

                                {/* Preview Zone - Takes remaining space */}
                                <div className="flex-1 min-h-0 bg-muted/10 p-4 rounded-3xl border-2 border-border shadow-inner relative flex flex-col">
                                    <div className="flex-1 relative rounded-2xl overflow-hidden checkered-bg border border-border flex items-center justify-center">
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain p-4 drop-shadow-2xl animate-in zoom-in-95 duration-500" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-4 opacity-20">
                                                <ImageIcon size={64} />
                                                <span className="font-black uppercase tracking-[0.2em] text-xs">Generating Preview...</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Horizontal File Strip */}
                                <div className="h-32 flex-shrink-0 bg-muted/20 p-2 rounded-2xl border-2 border-border flex items-center gap-3 overflow-x-auto no-scrollbar mask-fade-right">
                                    {files.map((file) => (
                                        <div key={file.id} onClick={() => setSelectedFileId(file.id)} className={cn("h-full aspect-square rounded-xl border-2 transition-all cursor-pointer relative group overflow-hidden flex-shrink-0", selectedFileId === file.id ? "border-primary shadow-lg ring-2 ring-primary/20" : "border-border hover:border-primary/50")}>
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
                            </div>

                            {/* Sidebar Settings Area */}
                            <div className="h-full flex flex-col gap-6">
                                <div className="bg-card flex-1 p-8 rounded-[2.5rem] border border-border shadow-2xl flex flex-col">
                                    <div className="flex-1 space-y-8 overflow-y-auto no-scrollbar pr-1">
                                        <div className="flex items-center gap-3 text-primary border-b border-border pb-6">
                                            <Settings className="w-5 h-5" />
                                            <h4 className="font-black uppercase tracking-[0.2em] text-[13.5px] leading-none">Global Config</h4>
                                        </div>

                                        <div className="space-y-8">
                                            {(type === 'image-compressor' || isBatchSupported) && (
                                                <div className="space-y-5">
                                                    <div className="flex justify-between items-end">
                                                        <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground opacity-60">{t('quality')}</label>
                                                        <span className="text-xl font-black text-primary">{quality}%</span>
                                                    </div>
                                                    <input type="range" min="5" max="100" value={quality} onChange={(e) => setQuality(parseInt(e.target.value))} className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary" />
                                                </div>
                                            )}

                                            {type === 'image-format-converter' && (
                                                <div className="space-y-4">
                                                    <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground opacity-60">To Format</label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {['png', 'jpg', 'webp', 'svg'].map((fmt) => (
                                                            <button key={fmt} onClick={() => setTargetFormat(fmt)} className={cn("py-3 rounded-xl text-[11px] font-black transition-all border uppercase tracking-widest", targetFormat === fmt ? "bg-primary text-primary-foreground border-primary shadow-lg" : "bg-muted text-muted-foreground border-border hover:bg-muted/80")}>{fmt}</button>
                                                        ))}
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
