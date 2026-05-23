"use client";
import { useState, useRef } from 'react';
import { Upload, Download, FileText, X, CheckCircle2, Plus } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useTranslations } from 'next-intl';
import { PDFDocument } from 'pdf-lib';

export function MergePdf() {
    const tToolNew = useTranslations('Tools.pdfToolsNew');
    const tActions = useTranslations('ToolActions');
    const tPdf = useTranslations('Tools.PdfTools');
    const tCommon = useTranslations('Common');
    const [files, setFiles] = useState<File[]>([]);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (selectedFiles: FileList | null) => {
        if (!selectedFiles) return;

        const pdfFiles = Array.from(selectedFiles).filter(file =>
            file.type === 'application/pdf' || file.name.endsWith('.pdf')
        );

        if (pdfFiles.length === 0) {
            setError(tPdf('pleaseSelectPdf'));
            return;
        }

        setFiles(prev => [...prev, ...pdfFiles]);
        setError(null);
        setDownloadUrl(null);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        handleFileSelect(e.dataTransfer.files);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setDownloadUrl(null);
    };

    const moveFile = (index: number, direction: 'up' | 'down') => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === files.length - 1)
        ) return;

        const newFiles = [...files];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
        setFiles(newFiles);
        setDownloadUrl(null);
    };

    const processMerge = async () => {
        if (files.length === 0) return;
        if (files.length === 1) {
            setError(tPdf('pleaseAddTwo'));
            return;
        }

        setProcessing(true);
        setError(null);

        try {
            const mergedPdf = await PDFDocument.create();

            for (const file of files) {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                pages.forEach((page: any) => mergedPdf.addPage(page));
            }

            const pdfBytes = await mergedPdf.save();
            const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);
        } catch (e) {
            setError(e instanceof Error ? e.message : tPdf('failedMerge'));
        } finally {
            setProcessing(false);
        }
    };

    const handleDownload = () => {
        if (downloadUrl) {
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = 'merged.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    const handleClear = () => {
        setFiles([]);
        setError(null);
        setDownloadUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-6">
            {/* File Upload Area */}
            {files.length === 0 ? (
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="bg-card rounded-3xl border-2 border-dashed border-border shadow-sm overflow-hidden transition-all relative flex flex-col items-center justify-center min-h-[300px] sm:min-h-[360px] hover:border-primary/50 hover:bg-muted/30 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="absolute top-6 right-6 opacity-20 pointer-events-none hidden sm:block">
                        <Upload size={80} />
                    </div>

                    <div className="relative z-10 text-center w-full px-4 flex flex-col items-center justify-center h-full">
                        <div className="mb-6">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                                <Upload size={32} />
                            </div>
                        </div>

                        <div className="px-6 sm:px-10 py-3 sm:py-4 bg-primary text-primary-foreground text-base sm:text-lg font-bold rounded-xl shadow-md hover:scale-[1.02] hover:shadow-lg active:scale-95 transition-all duration-300 flex items-center gap-3 mx-auto">
                            <span>{tActions('chooseFile') || tPdf('chooseFile')}</span>
                        </div>

                        <div className="mt-4 text-muted-foreground font-medium text-sm sm:text-base">
                            {tPdf('dragDrop')}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            {tPdf('selectMultipleMerge')}
                        </p>
                        
                        <div className="mt-8 pt-4 border-t border-border/50 flex items-center justify-center gap-2 text-xs text-muted-foreground font-medium w-full max-w-sm">
                            <span className="text-green-500">🔒</span>
                            <span>{tCommon('secureAndPrivate')}</span>
                        </div>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,application/pdf"
                        multiple
                        className="hidden"
                        onChange={(e) => handleFileSelect(e.target.files)}
                    />
                </div>
            ) : (
                <div className="space-y-4">
                    {/* File List */}
                    <div className="bg-card rounded-2xl border-2 border-border p-6 space-y-3">
                        <div className="flex items-center justify-between mb-4">
                            <p className="font-bold text-foreground">
                                {tPdf('filesSelected').replace('{count}', files.length.toString())}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary/90 transition-all flex items-center gap-2"
                                >
                                    <Plus size={16} />
                                    {tPdf('addMore')}
                                </button>
                                <button
                                    onClick={handleClear}
                                    className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-bold hover:bg-muted/80 transition-all"
                                >
                                    {tPdf('clearAll')}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {files.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-background rounded-lg border border-border"
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <FileText className="text-primary flex-shrink-0" size={20} />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm text-foreground truncate">
                                                {index + 1}. {file.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => moveFile(index, 'up')}
                                            disabled={index === 0}
                                            className={cn(
                                                "px-2 py-1 text-xs font-bold rounded transition-all",
                                                index === 0
                                                    ? "text-muted-foreground cursor-not-allowed"
                                                    : "text-primary hover:bg-primary/10"
                                            )}
                                        >
                                            ↑
                                        </button>
                                        <button
                                            onClick={() => moveFile(index, 'down')}
                                            disabled={index === files.length - 1}
                                            className={cn(
                                                "px-2 py-1 text-xs font-bold rounded transition-all",
                                                index === files.length - 1
                                                    ? "text-muted-foreground cursor-not-allowed"
                                                    : "text-primary hover:bg-primary/10"
                                            )}
                                        >
                                            ↓
                                        </button>
                                        <button
                                            onClick={() => removeFile(index)}
                                            className="p-1 hover:bg-destructive/10 text-destructive rounded transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,application/pdf"
                            multiple
                            className="hidden"
                            onChange={(e) => handleFileSelect(e.target.files)}
                        />
                    </div>

                    {/* Action Buttons */}
                    {!downloadUrl && (
                        <button
                            onClick={processMerge}
                            disabled={processing || files.length < 2}
                            className={cn(
                                "w-full py-3 px-6 rounded-xl font-bold text-sm transition-all",
                                processing || files.length < 2
                                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                            )}
                        >
                            {processing ? tPdf('merging') : tPdf('mergePdfBtn')}
                        </button>
                    )}

                    {downloadUrl && (
                        <div className="space-y-4">
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3">
                                <CheckCircle2 className="text-emerald-500" size={24} />
                                <div className="flex-1">
                                    <p className="font-bold text-emerald-500">{tPdf('mergeComplete')}</p>
                                    <p className="text-xs text-muted-foreground">{tPdf('readyToDownloadMerge')}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleDownload}
                                className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                            >
                                <Download size={20} />
                                {tActions('download') || tPdf('downloadMerged')}
                            </button>
                        </div>
                    )}

                    {error && (
                        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-destructive text-sm font-bold">
                            {error}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

