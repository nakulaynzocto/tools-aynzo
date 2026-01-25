"use client";
import { useState } from 'react';
import { Upload, FileText, X, Settings, CheckCircle2, RefreshCw, Wand2, FileArchive, Download } from 'lucide-react';
import { cn } from '@/utils/cn';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import JSZip from 'jszip';
// @ts-ignore
import { PDFDocument } from 'pdf-lib/dist/pdf-lib.min.js';

interface PdfToolProps {
    type: 'pdf-to-word' | 'merge-pdf' | 'split-pdf';
}

interface ProcessedFile {
    id: string;
    file: File;
    status: 'pending' | 'processing' | 'done' | 'error';
    resultBlob?: Blob;
    resultName?: string;
}

export default function PdfTools({ type }: PdfToolProps) {
    const t = useTranslations('Common');
    const tActions = useTranslations('ToolActions');
    const [files, setFiles] = useState<ProcessedFile[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [processing, setProcessing] = useState(false);

    // Settings
    const [mergeSequence, setMergeSequence] = useState(true); // Default true for now

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        setDragActive(e.type === "dragenter" || e.type === "dragover");
    };

    const addFiles = (newFiles: FileList | null) => {
        if (!newFiles) return;
        const newBatch: ProcessedFile[] = Array.from(newFiles).map(f => ({
            id: Math.random().toString(36).substring(7),
            file: f,
            status: 'pending'
        }));

        if (type === 'split-pdf' || type === 'pdf-to-word') {
            // Single file mode for these typically, but let's allow multiple for pdf-to-word batch?
            // Split usually one at a time to keep UI simple, but can support batch.
            // Let's stick to accumulating files.
            setFiles(prev => [...prev, ...newBatch]);
        } else {
            // Merge supports multiple obviously
            setFiles(prev => [...prev, ...newBatch]);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        setDragActive(false);
        addFiles(e.dataTransfer.files);
    };

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(item => item.id !== id));
    };

    const processMerge = async () => {
        try {
            const mergedPdf = await PDFDocument.create();

            for (const file of files) {
                const arrayBuffer = await file.file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page: any) => mergedPdf.addPage(page));
            }

            const pdfBytes = await mergedPdf.save();
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });

            // For merge, we update all files to 'done' but really we just have one result.
            // But to fit our UI model, maybe we just trigger download immediately?
            // Or we can add a "Result" section.
            // Let's download immediately for simplicity or show a success toast.
            download(blob, `merged-document-${Date.now()}.pdf`);

            setFiles(files.map(f => ({ ...f, status: 'done' })));
            toast.success('PDFs merged successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to merge PDFs');
            setFiles(files.map(f => ({ ...f, status: 'error' })));
        }
    };

    const processSplit = async () => {
        // For split, we take each file, split it into pages, and zip them?
        // Or if single file, just zip pages.
        const zip = new JSZip();
        let hasFiles = false;

        for (let i = 0; i < files.length; i++) {
            const pf = files[i];
            pf.status = 'processing';
            setFiles([...files]); // Update status UI

            try {
                const arrayBuffer = await pf.file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const pageIndices = pdf.getPageIndices();

                const fileFolder = zip.folder(pf.file.name.replace('.pdf', ''));

                for (const idx of pageIndices) {
                    const subDoc = await PDFDocument.create();
                    const [copiedPage] = await subDoc.copyPages(pdf, [idx]);
                    subDoc.addPage(copiedPage);
                    const pdfBytes = await subDoc.save();
                    fileFolder?.file(`page-${idx + 1}.pdf`, pdfBytes);
                }

                pf.status = 'done';
                hasFiles = true;
            } catch (err) {
                pf.status = 'error';
            }
        }
        setFiles([...files]);

        if (hasFiles) {
            const content = await zip.generateAsync({ type: 'blob' });
            download(content, 'split-pdfs.zip');
            toast.success('PDFs split successfully!');
        }
    };

    const processPdfToWord = async () => {
        // Placeholder for PDF to Word
        // This is complex client-side. 
        // We will simulate a "processing" and then maybe fail or show informative toast.

        toast.error("Client-side PDF to Word conversion is limited. Please connect a backend API.");

        // Mark as error to show feedback
        setFiles(files.map(f => ({ ...f, status: 'error' })));
    };

    const processAll = async () => {
        setProcessing(true);
        try {
            if (type === 'merge-pdf') await processMerge();
            else if (type === 'split-pdf') await processSplit();
            else if (type === 'pdf-to-word') await processPdfToWord();
        } catch (e) {
            toast.error('An unexpected error occurred');
        } finally {
            setProcessing(false);
        }
    };

    const download = (content: Blob, name: string) => {
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url; a.download = name;
        document.body.appendChild(a); a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <input
                id="pdf-input"
                type="file"
                multiple
                className="hidden"
                accept=".pdf"
                onChange={(e) => addFiles(e.target.files)}
            />

            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">
                <div className="p-8">
                    {files.length === 0 ? (
                        <div
                            onDragOver={handleDrag} onDragEnter={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
                            onClick={() => document.getElementById('pdf-input')?.click()}
                            className={cn(
                                "min-h-[400px] border-4 border-dashed rounded-[2rem] flex flex-col items-center justify-center transition-all cursor-pointer group hover:border-accent hover:bg-accent/5",
                                dragActive ? "border-accent bg-accent/5 scale-[0.99]" : "border-border bg-muted/20"
                            )}
                        >
                            <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl mb-8 group-hover:scale-110 transition-transform">
                                <FileText className="w-12 h-12 text-white" />
                            </div>
                            <h2 className="text-3xl font-black text-foreground mb-4">
                                {tActions('chooseFile')}
                            </h2>
                            <p className="text-muted-foreground text-lg mb-10 text-center px-8 font-medium">
                                {t.rich ? t.rich('dragDrop', {
                                    b: (chunks) => <span className="text-accent font-bold">{chunks}</span>
                                }) : t('dragDrop')}
                                <br /><span className="text-sm opacity-60">Supports PDF</span>
                            </p>

                            <div className="flex gap-4">
                                <div className="px-5 py-2.5 bg-card border border-border rounded-full text-xs font-bold text-muted-foreground flex items-center gap-2 shadow-sm">
                                    <CheckCircle2 size={14} className="text-emerald-500" /> {t('privacyGuaranteed')}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-3 gap-8 items-start">
                            <div className="lg:col-span-2 space-y-6">
                                {/* Summary Header */}
                                <div className="bg-muted/30 p-6 rounded-2xl border-2 border-border flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-red-500/10 rounded-xl">
                                            <FileText className="text-red-500 w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-lg text-foreground">{tActions('filesSelected', { count: files.length })}</h3>
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{tActions('batchReady')}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setFiles([])} className="text-sm font-black text-destructive hover:bg-destructive/10 px-5 py-2.5 rounded-xl transition-all border border-transparent hover:border-destructive/20">
                                        {tActions('clearAll')}
                                    </button>
                                </div>

                                {/* File List */}
                                <div className="space-y-3">
                                    {files.map((file, idx) => (
                                        <div key={file.id} className="bg-card p-4 rounded-xl border border-border flex items-center gap-4 group hover:border-accent transition-all relative overflow-hidden shadow-sm">
                                            <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center border border-red-100 flex-shrink-0">
                                                <FileText className="text-red-500 w-6 h-6" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm truncate text-foreground">{file.file.name}</p>
                                                <p className="text-[10px] text-muted-foreground flex items-center gap-2 uppercase tracking-tight font-black">
                                                    {(file.file.size / 1024).toFixed(0)} KB
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {file.status === 'processing' && <RefreshCw className="w-4 h-4 animate-spin text-accent" />}
                                                {file.status === 'done' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                                                {file.status === 'error' && <X className="w-4 h-4 text-destructive" />}
                                                <button onClick={() => removeFile(file.id)} className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                            {/* Order badge for merge */}
                                            {type === 'merge-pdf' && (
                                                <div className="absolute left-0 top-0 bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground rounded-br-lg border-r border-b border-border">
                                                    #{idx + 1}
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    <button
                                        onClick={() => document.getElementById('pdf-input')?.click()}
                                        className="w-full border-2 border-dashed border-border rounded-xl flex items-center justify-center p-4 hover:bg-muted/50 hover:border-accent group transition-all"
                                    >
                                        <div className="flex items-center gap-2 text-muted-foreground group-hover:text-accent">
                                            <Upload size={16} />
                                            <span className="text-xs font-black uppercase tracking-widest">{t('addMore')}</span>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="lg:sticky lg:top-8 space-y-6">
                                <div className="bg-card p-8 rounded-[2rem] border-2 border-border shadow-2xl relative overflow-hidden">
                                    <h3 className="text-xl font-black mb-8 flex items-center gap-3 text-foreground">
                                        <Settings className="text-accent" /> {t('settings')}
                                    </h3>

                                    <div className="space-y-8">

                                        {/* Dynamic content based on type */}
                                        <div className="p-5 bg-muted/50 rounded-2xl border-2 border-border">
                                            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                                                {type === 'merge-pdf' && "All files will be merged in the order shown."}
                                                {type === 'split-pdf' && "Each page will be saved as a separate PDF file."}
                                                {type === 'pdf-to-word' && "Files will be converted to Docx format."}
                                            </p>
                                        </div>

                                        <button
                                            onClick={processAll}
                                            disabled={processing || files.length === 0}
                                            className="w-full py-5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl font-black shadow-xl hover:scale-[1.01] hover:shadow-red-500/20 transition-all flex flex-col items-center justify-center gap-1 disabled:opacity-50 border border-white/10"
                                        >
                                            <div className="flex items-center gap-3 text-lg">
                                                {processing ? (
                                                    <RefreshCw className="w-6 h-6 animate-spin" />
                                                ) : (
                                                    <Wand2 className="w-6 h-6" />
                                                )}
                                                {processing ? tActions('processing') : type === 'merge-pdf' ? 'Merge PDFs' : type === 'split-pdf' ? 'Split PDF' : 'Convert to Word'}
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
