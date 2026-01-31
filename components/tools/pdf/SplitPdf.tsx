"use client";
import { useState, useRef } from 'react';
import { Upload, Download, FileText, X, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useTranslations } from 'next-intl';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';

export function SplitPdf() {
    const tActions = useTranslations('ToolActions');
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [splitMode, setSplitMode] = useState<'all' | 'range'>('all');
    const [pageRange, setPageRange] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (selectedFile: File) => {
        if (selectedFile.type !== 'application/pdf') {
            setError('Please select a PDF file');
            return;
        }
        setFile(selectedFile);
        setError(null);
        setDownloadUrl(null);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) handleFileSelect(droppedFile);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const processSplit = async () => {
        if (!file) return;

        setProcessing(true);
        setError(null);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            const totalPages = pdf.getPageCount();

            if (totalPages === 0) {
                setError('PDF has no pages');
                setProcessing(false);
                return;
            }

            const zip = new JSZip();

            if (splitMode === 'all') {
                // Split into individual pages
                for (let i = 0; i < totalPages; i++) {
                    const newPdf = await PDFDocument.create();
                    const [copiedPage] = await newPdf.copyPages(pdf, [i]);
                    newPdf.addPage(copiedPage);
                    const pdfBytes = await newPdf.save();
                    zip.file(`page-${i + 1}.pdf`, pdfBytes);
                }
            } else {
                // Split by range
                const ranges = pageRange.split(',').map(r => r.trim());
                
                for (let rangeIndex = 0; rangeIndex < ranges.length; rangeIndex++) {
                    const range = ranges[rangeIndex];
                    const match = range.match(/(\d+)(?:-(\d+))?/);
                    
                    if (!match) {
                        setError(`Invalid range format: ${range}`);
                        setProcessing(false);
                        return;
                    }

                    const start = parseInt(match[1]) - 1;
                    const end = match[2] ? parseInt(match[2]) - 1 : start;

                    if (start < 0 || end >= totalPages || start > end) {
                        setError(`Invalid page range: ${range} (PDF has ${totalPages} pages)`);
                        setProcessing(false);
                        return;
                    }

                    const newPdf = await PDFDocument.create();
                    const pageIndices = Array.from({ length: end - start + 1 }, (_, i) => start + i);
                    const copiedPages = await newPdf.copyPages(pdf, pageIndices);
                    copiedPages.forEach((page: any) => newPdf.addPage(page));
                    
                    const pdfBytes = await newPdf.save();
                    zip.file(`split-${rangeIndex + 1}-pages-${start + 1}-${end + 1}.pdf`, pdfBytes);
                }
            }

            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(zipBlob);
            setDownloadUrl(url);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to split PDF');
        } finally {
            setProcessing(false);
        }
    };

    const handleDownload = () => {
        if (downloadUrl) {
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = splitMode === 'all' ? 'split-pages.zip' : 'split-ranges.zip';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    const handleClear = () => {
        setFile(null);
        setError(null);
        setDownloadUrl(null);
        setPageRange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-6">
            {/* File Upload Area */}
            {!file ? (
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="border-2 border-dashed border-border rounded-2xl p-12 text-center hover:border-primary transition-colors cursor-pointer bg-muted/20"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Upload className="mx-auto mb-4 text-primary" size={48} />
                    <p className="text-lg font-bold text-foreground mb-2">
                        {tActions('chooseFile') || 'Choose File'}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                        Drag and drop your PDF file here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Supported format: PDF
                    </p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,application/pdf"
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                handleFileSelect(e.target.files[0]);
                            }
                        }}
                    />
                </div>
            ) : (
                <div className="space-y-4">
                    {/* File Info */}
                    <div className="bg-card rounded-2xl border-2 border-border p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <FileText className="text-primary" size={24} />
                                <div>
                                    <p className="font-bold text-foreground">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleClear}
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Split Mode Selection */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-bold text-foreground mb-2 block">Split Mode</label>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setSplitMode('all')}
                                        className={cn(
                                            "flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all",
                                            splitMode === 'all'
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-background text-foreground border border-border hover:bg-muted"
                                        )}
                                    >
                                        Split All Pages
                                    </button>
                                    <button
                                        onClick={() => setSplitMode('range')}
                                        className={cn(
                                            "flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all",
                                            splitMode === 'range'
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-background text-foreground border border-border hover:bg-muted"
                                        )}
                                    >
                                        Split by Range
                                    </button>
                                </div>
                            </div>

                            {splitMode === 'range' && (
                                <div>
                                    <label className="text-sm font-bold text-foreground mb-2 block">
                                        Page Range (e.g., "1-5, 10-15, 20")
                                    </label>
                                    <input
                                        type="text"
                                        value={pageRange}
                                        onChange={(e) => setPageRange(e.target.value)}
                                        placeholder="1-5, 10-15, 20"
                                        className="w-full px-4 py-2 bg-background border-2 border-border rounded-xl text-sm font-bold text-foreground focus:border-primary focus:outline-none"
                                    />
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Enter page ranges separated by commas. Example: "1-3, 5, 7-10"
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {!downloadUrl && (
                        <button
                            onClick={processSplit}
                            disabled={processing || (splitMode === 'range' && !pageRange.trim())}
                            className={cn(
                                "w-full py-3 px-6 rounded-xl font-bold text-sm transition-all",
                                processing || (splitMode === 'range' && !pageRange.trim())
                                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                            )}
                        >
                            {processing ? 'Splitting PDF...' : 'Split PDF'}
                        </button>
                    )}

                    {downloadUrl && (
                        <div className="space-y-4">
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3">
                                <CheckCircle2 className="text-emerald-500" size={24} />
                                <div className="flex-1">
                                    <p className="font-bold text-emerald-500">Split Complete!</p>
                                    <p className="text-xs text-muted-foreground">Your split PDF files are ready to download as a ZIP.</p>
                                </div>
                            </div>
                            <button
                                onClick={handleDownload}
                                className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                            >
                                <Download size={20} />
                                {tActions('download') || 'Download ZIP'}
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

