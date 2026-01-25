"use client";
import { useState, useRef, useEffect } from 'react';
import { Upload, Image as ImageIcon, Settings, X, RefreshCw, Wand2, FileArchive, CheckCircle2, ChevronRight, Zap, Lock } from 'lucide-react';
import { cn } from '@/utils/cn';
import { toast } from 'sonner';

import { v4 as uuidv4 } from 'uuid';
import { useTranslations } from 'next-intl';
import JSZip from 'jszip';

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

    const isBatchSupported = ['image-compressor', 'jpg-to-png', 'png-to-jpg', 'webp-converter', 'image-format-converter', 'webp-to-jpg', 'webp-to-png', 'jpg-to-webp', 'png-to-webp', 'svg-to-png'].includes(type);

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
        } else {
            setFiles(prev => [...prev, ...newBatch]);
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
    };

    const processSingleFile = async (pf: ProcessedFile): Promise<Blob | string> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let w = img.width;
                let h = img.height;

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
                    if (type === 'grayscale-image') ctx.filter = 'grayscale(100%)';
                    else if (type === 'sepia-converter') ctx.filter = 'sepia(100%)';
                    else if (type === 'invert-image') ctx.filter = 'invert(100%)';
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

                let mime = pf.file.type;
                if (['jpg-to-png', 'webp-to-png'].includes(type) || targetFormat === 'png') mime = 'image/png';
                if (['png-to-jpg', 'webp-to-jpg'].includes(type) || targetFormat === 'jpg') mime = 'image/jpeg';
                if (['webp-converter', 'jpg-to-webp', 'png-to-webp'].includes(type) || targetFormat === 'webp') mime = 'image/webp';

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
                        const ext = mime.split('/')[1] || (isString ? 'txt' : 'png');
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
                    const ext = (res as Blob).type.split('/')[1] || 'png';
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

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <input id="image-input" type="file" multiple={isBatchSupported} className="hidden" accept="image/*" onChange={(e) => addFiles(e.target.files)} />
            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">

                <div className="p-8">
                    {files.length === 0 ? (
                        <div
                            onDragOver={handleDrag} onDragEnter={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
                            onClick={() => document.getElementById('image-input')?.click()}
                            className={cn(
                                "min-h-[400px] border-4 border-dashed rounded-[2rem] flex flex-col items-center justify-center transition-all cursor-pointer group hover:border-accent hover:bg-accent/5",
                                dragActive ? "border-accent bg-accent/5 scale-[0.99]" : "border-border bg-muted/20"
                            )}
                        >
                            <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-2xl mb-8 group-hover:scale-110 transition-transform">
                                <Upload className="w-12 h-12 text-white" />
                            </div>
                            <h2 className="text-3xl font-black text-foreground mb-4">
                                {isBatchSupported ? t('selectMultiple') : t('selectImage')}
                            </h2>
                            <p className="text-muted-foreground text-lg mb-10 text-center px-8 font-medium">
                                {t.rich ? t.rich('dragDrop', {
                                    b: (chunks) => <span className="text-accent font-bold">{chunks}</span>
                                }) : t('dragDrop')}
                                <br /><span className="text-sm opacity-60">{t('supports')}</span>
                            </p>
                            {/* Base64 Input for Base64 to Image */}
                            {type === 'base64-to-image' && (
                                <div className="space-y-4" onClick={e => e.stopPropagation()}>
                                    <label className="block text-sm font-bold text-foreground uppercase tracking-widest">{tActions('pasteBase64')}</label>
                                    <textarea
                                        value={base64Input}
                                        onChange={(e) => setBase64Input(e.target.value)}
                                        className="w-full h-32 p-4 border-2 border-border rounded-2xl bg-input font-mono text-xs text-foreground focus:border-accent outline-none resize-none"
                                        placeholder="data:image/png;base64,..."
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
                                        className="w-full py-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold shadow-xl hover:scale-[1.02] transition-all"
                                    >
                                        {tActions('convertTo', { format: 'Image' })}
                                    </button>
                                </div>
                            )}
                            <div className="flex gap-4">
                                <div className="px-5 py-2.5 bg-card border border-border rounded-full text-xs font-bold text-muted-foreground flex items-center gap-2 shadow-sm">
                                    <CheckCircle2 size={14} className="text-emerald-500" /> {t('privacyGuaranteed')}
                                </div>
                                <div className="px-5 py-2.5 bg-card border border-border rounded-full text-xs font-bold text-muted-foreground flex items-center gap-2 shadow-sm">
                                    <Zap size={14} className="text-amber-500" /> {t('lightningFast')}
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

                                {/* File Grid */}
                                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
                                    {files.map((file) => (
                                        <div key={file.id} className="bg-card p-4 rounded-2xl border-2 border-border flex items-center gap-4 group hover:border-accent transition-all relative overflow-hidden shadow-sm">
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
                                                <button onClick={() => removeFile(file.id)} className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors">
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
                                                <Upload size={20} />
                                            </div>
                                            <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">{t('addMore')}</span>
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
            {base64Output && (
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
            )}
        </div>
    );
}
