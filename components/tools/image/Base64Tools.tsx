"use client";
import { useState, useRef, useEffect } from 'react';
import { Upload, FileText, CheckCircle2, Download, RefreshCw, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useTranslations } from 'next-intl';
import { ProcessedFile } from '@/components/types/image/types';
import { useImageFileUpload } from '@/components/hooks/image/useImageFileUpload';
import { processSingleFile, downloadResults } from '@/components/hooks/image/useImageProcessing';
import { extractBase64String, base64ToBlob } from '@/components/utils/image/imageProcessing';

interface Base64ToolsProps {
    type: 'image-to-base64' | 'base64-to-image';
    quality: number;
}

export function Base64Tools({ type, quality }: Base64ToolsProps) {
    const t = useTranslations('Common');
    const tActions = useTranslations('ToolActions');
    
    const {
        files,
        setFiles,
        dragActive,
        setDragActive,
        selectedFileId,
        setSelectedFileId,
        addFiles,
        removeFile,
        clearAll,
    } = useImageFileUpload();

    const [base64Input, setBase64Input] = useState('');
    const [base64Output, setBase64Output] = useState('');
    const [base64StringOnly, setBase64StringOnly] = useState('');
    const [copied, setCopied] = useState(false);
    const [outputFormat, setOutputFormat] = useState<'datauri' | 'base64'>('datauri');
    const [base64Preview, setBase64Preview] = useState<string | null>(null);
    const [base64Error, setBase64Error] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const base64OutputRef = useRef<HTMLDivElement>(null);

    // Scroll to Base64 output when it appears
    useEffect(() => {
        if (base64Output && base64OutputRef.current) {
            setTimeout(() => {
                base64OutputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
    }, [base64Output]);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (type === 'image-to-base64') {
            addFiles(e.dataTransfer.files);
        }
    };

    const processAll = async () => {
        if (type === 'image-to-base64' && files.length === 0) return;
        if (type === 'base64-to-image' && !base64Input.trim()) return;

        setProcessing(true);
        setBase64Output('');
        setBase64StringOnly('');

        try {
            if (type === 'image-to-base64') {
                const updated = [...files];
                for (let i = 0; i < updated.length; i++) {
                    updated[i].status = 'processing';
                    setFiles([...updated]);

                    try {
                        const result = await processSingleFile(updated[i], {
                            type: 'image-to-base64',
                            quality,
                        });

                        updated[i].status = 'done';
                        updated[i].resultBlob = result;

                        if (typeof result === 'string') {
                            updated[i].resultSize = result.length;
                            if (i === 0) {
                                setBase64Output(result);
                                setBase64StringOnly(extractBase64String(result));
                            }
                        }
                    } catch (e) {
                        updated[i].status = 'error';
                    }
                    setFiles([...updated]);
                }
            } else if (type === 'base64-to-image') {
                try {
                    const blob = base64ToBlob(base64Input);
                    const url = URL.createObjectURL(blob);
                    setBase64Preview(url);
                    setBase64Error(null);
                } catch (e) {
                    setBase64Error(e instanceof Error ? e.message : 'Invalid Base64 string');
                }
            }
        } finally {
            setProcessing(false);
        }
    };

    const downloadBase64Image = () => {
        if (!base64Preview) return;
        const a = document.createElement('a');
        a.href = base64Preview;
        a.download = `base64-image-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    if (type === 'image-to-base64') {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 min-h-[600px]">
                {/* Left Side - Input */}
                <div className="flex flex-col bg-card rounded-2xl border-2 border-border shadow-lg overflow-hidden">
                    <div className="px-4 sm:px-6 py-3 sm:py-4 bg-primary/5 border-b border-border flex items-center justify-between">
                        <h3 className="text-sm sm:text-base font-black uppercase tracking-widest text-foreground">Input Image</h3>
                        <div className="text-[10px] sm:text-xs text-muted-foreground font-bold">
                            {files.length} {t('imagesSelected', { count: files.length })}
                        </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col gap-4 p-4 sm:p-6 overflow-y-auto">
                        {/* File Thumbnails */}
                        {files.length > 0 && (
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                                {files.map((file) => {
                                    const isSelected = file.id === selectedFileId;
                                    const isProcessed = file.status === 'done' && file.resultBlob;
                                    return (
                                        <div
                                            key={file.id}
                                            className={cn(
                                                "relative flex-shrink-0 w-24 h-24 rounded-lg border-2 overflow-hidden cursor-pointer transition-all group",
                                                isSelected 
                                                    ? "border-primary ring-2 ring-primary/20 scale-105" 
                                                    : "border-border hover:border-primary/50"
                                            )}
                                        >
                                            <img 
                                                src={file.preview} 
                                                onClick={() => setSelectedFileId(file.id)}
                                                className="w-full h-full object-cover" 
                                                alt="" 
                                            />
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeFile(file.id);
                                                    if (selectedFileId === file.id) {
                                                        const remainingFiles = files.filter(f => f.id !== file.id);
                                                        setSelectedFileId(remainingFiles.length > 0 ? remainingFiles[0].id : null);
                                                    }
                                                    setBase64Output('');
                                                    setBase64StringOnly('');
                                                    setCopied(false);
                                                }}
                                                className="absolute top-1 right-1 w-6 h-6 bg-destructive/90 hover:bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={14} />
                                            </button>
                                            {isProcessed && (
                                                <div className="absolute top-1 left-1 w-3 h-3 bg-primary rounded-full border-2 border-background" />
                                            )}
                                            {isSelected && (
                                                <div className="absolute inset-0 bg-primary/10 border-2 border-primary pointer-events-none" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        
                        {/* Image Preview */}
                        <div className="flex-1 bg-muted/20 rounded-xl border border-border p-4 flex items-center justify-center min-h-[200px]">
                            {(() => {
                                const selectedFile = files.find(f => f.id === selectedFileId) || files[0];
                                return selectedFile?.preview ? (
                                    <img 
                                        src={selectedFile.preview} 
                                        alt="Preview" 
                                        className="max-w-full max-h-full object-contain rounded-lg"
                                    />
                                ) : (
                                    <div
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                        className={cn(
                                            "w-full h-full flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-xl transition-all",
                                            dragActive ? "border-primary bg-primary/5" : "border-border"
                                        )}
                                    >
                                        <Upload size={48} className="text-muted-foreground" />
                                        <div className="text-center">
                                            <p className="text-sm font-bold text-foreground">{t('dragDrop')}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{t('supports')}</p>
                                        </div>
                                        <button
                                            onClick={() => document.getElementById('image-input')?.click()}
                                            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold"
                                        >
                                            {t('selectImage')}
                                        </button>
                                        <input
                                            id="image-input"
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="hidden"
                                            onChange={(e) => e.target.files && addFiles(e.target.files)}
                                        />
                                    </div>
                                );
                            })()}
                        </div>
                        
                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => document.getElementById('image-input')?.click()}
                                className="w-full py-2.5 px-4 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-xs font-bold uppercase tracking-wider transition-all border border-border flex items-center justify-center gap-2"
                            >
                                <Upload size={14} />
                                {tActions('addMore')}
                            </button>
                            <button
                                onClick={() => {
                                    clearAll();
                                    setBase64Output('');
                                    setBase64StringOnly('');
                                    setCopied(false);
                                }}
                                className="w-full py-2.5 px-4 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg text-xs font-bold uppercase tracking-wider transition-all border border-destructive/20"
                            >
                                {tActions('clearAll')}
                            </button>
                        </div>
                        
                        {/* Convert Button */}
                        <button
                            onClick={processAll}
                            disabled={processing || files.length === 0}
                            className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-black text-sm uppercase tracking-widest shadow-lg hover:shadow-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                            {processing ? (
                                <>
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                    {tActions('processing')}
                                </>
                            ) : (
                                <>
                                    <FileText className="w-5 h-5" />
                                    Convert to Base64
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Right Side - Output */}
                <div className="flex flex-col bg-card rounded-2xl border-2 border-border shadow-lg overflow-hidden" ref={base64OutputRef}>
                    <div className="px-4 sm:px-6 py-3 sm:py-4 bg-accent/10 border-b border-border flex items-center justify-between">
                        <h3 className="text-sm sm:text-base font-black uppercase tracking-widest text-foreground">Output Base64</h3>
                        {base64Output && (
                            <button
                                onClick={() => {
                                    const textToCopy = outputFormat === 'datauri' ? base64Output : (base64StringOnly || base64Output);
                                    navigator.clipboard.writeText(textToCopy).then(() => {
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 2000);
                                    });
                                }}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
                                    copied ? "bg-emerald-500 text-white" : "bg-primary text-white hover:bg-primary/90"
                                )}
                            >
                                {copied ? <CheckCircle2 size={16} /> : <FileText size={16} />}
                                {copied ? 'COPIED!' : 'Copy to clipboard'}
                            </button>
                        )}
                    </div>
                    
                    <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-hidden">
                        {base64Output && base64Output.length > 0 ? (
                            <>
                                {/* Format Toggle */}
                                <div className="flex items-center gap-2 mb-4 bg-muted/30 rounded-lg p-1 border border-border">
                                    <button
                                        onClick={() => setOutputFormat('datauri')}
                                        className={cn(
                                            "flex-1 py-2 rounded-md text-[10px] font-black uppercase tracking-wider transition-all",
                                            outputFormat === 'datauri' 
                                                ? "bg-primary text-white shadow-md" 
                                                : "text-muted-foreground hover:text-foreground bg-transparent"
                                        )}
                                    >
                                        Data URI
                                    </button>
                                    <button
                                        onClick={() => setOutputFormat('base64')}
                                        className={cn(
                                            "flex-1 py-2 rounded-md text-[10px] font-black uppercase tracking-wider transition-all",
                                            outputFormat === 'base64' 
                                                ? "bg-primary text-white shadow-md" 
                                                : "text-muted-foreground hover:text-foreground bg-transparent"
                                        )}
                                    >
                                        Base64 Only
                                    </button>
                                </div>
                                
                                {/* Base64 Output */}
                                <div className="flex-1 relative bg-muted/30 rounded-xl border border-border overflow-hidden min-h-[200px]">
                                    <textarea
                                        readOnly
                                        value={outputFormat === 'datauri' ? base64Output : (base64StringOnly || base64Output)}
                                        className="w-full h-full p-4 font-mono text-[10px] sm:text-xs break-all resize-none outline-none bg-transparent text-foreground overflow-auto"
                                    />
                                    <div className="absolute bottom-2 right-2 text-[9px] text-muted-foreground font-bold bg-background/80 backdrop-blur-sm px-2 py-1 rounded z-10">
                                        {(outputFormat === 'datauri' ? base64Output : (base64StringOnly || base64Output)).length.toLocaleString()} chars
                                    </div>
                                </div>
                                
                                {/* Download Button */}
                                <button
                                    onClick={() => {
                                        const textToDownload = outputFormat === 'datauri' ? base64Output : (base64StringOnly || base64Output);
                                        const blob = new Blob([textToDownload], { type: 'text/plain' });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `base64-${Date.now()}.txt`;
                                        document.body.appendChild(a);
                                        a.click();
                                        document.body.removeChild(a);
                                        URL.revokeObjectURL(url);
                                    }}
                                    className="mt-4 w-full py-2.5 px-4 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-xs font-bold uppercase tracking-wider transition-all border border-border flex items-center justify-center gap-2"
                                >
                                    <Download size={16} />
                                    Save as...
                                </button>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                                {processing ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <RefreshCw className="w-6 h-6 animate-spin text-primary" />
                                        <span>{tActions('processing')}</span>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <div>Click "Convert to Base64" to generate output</div>
                                        {files.length > 0 && (
                                            <div className="text-[10px] text-muted-foreground mt-2">
                                                {files.length} image(s) ready
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Base64 to Image
    return (
        <div className="space-y-6">
            <div className="bg-card rounded-2xl border-2 border-border shadow-lg p-6">
                <h3 className="text-sm sm:text-base font-black uppercase tracking-widest text-foreground mb-4">Input Base64</h3>
                <textarea
                    value={base64Input}
                    onChange={(e) => {
                        setBase64Input(e.target.value);
                        setBase64Error(null);
                    }}
                    placeholder="Paste your Base64 string here..."
                    className="w-full h-48 p-4 font-mono text-xs bg-muted/30 rounded-xl border border-border resize-none outline-none focus:ring-2 focus:ring-primary"
                />
                {base64Error && (
                    <p className="text-sm text-destructive mt-2">{base64Error}</p>
                )}
                <button
                    onClick={processAll}
                    disabled={!base64Input.trim() || !!base64Error || processing}
                    className="w-full mt-4 py-3 bg-primary text-white rounded-xl font-bold transition-all text-sm hover:bg-primary/90 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {processing ? (
                        <>
                            <RefreshCw className="w-5 h-5 animate-spin inline mr-2" />
                            {tActions('processing')}
                        </>
                    ) : (
                        `${tActions('convert')} to Image`
                    )}
                </button>
            </div>

            {base64Preview && (
                <div className="bg-card rounded-2xl border-2 border-border shadow-lg p-6">
                    <h3 className="text-sm sm:text-base font-black uppercase tracking-widest text-foreground mb-4">Preview</h3>
                    <div className="bg-muted/20 rounded-xl border border-border p-4 flex items-center justify-center min-h-[300px]">
                        <img 
                            src={base64Preview} 
                            alt="Base64 Preview" 
                            className="max-w-full max-h-[500px] object-contain rounded-lg"
                        />
                    </div>
                    <button
                        onClick={downloadBase64Image}
                        className="w-full mt-4 py-3 bg-primary text-white rounded-xl font-bold transition-all text-sm hover:bg-primary/90 shadow-lg flex items-center justify-center gap-2"
                    >
                        <Download size={20} />
                        Download Image
                    </button>
                </div>
            )}
        </div>
    );
}

