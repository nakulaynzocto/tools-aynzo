"use client";
import { useState, useEffect } from 'react';
import { Upload, FileText, X, Settings, CheckCircle2, RefreshCw, Wand2, FileArchive, Download, Copy } from 'lucide-react';
import { cn } from '@/utils/cn';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import JSZip from 'jszip';
// @ts-ignore
import { PDFDocument } from 'pdf-lib/dist/pdf-lib.min.js';
import { ScrollableNav } from '@/components/ScrollableNav';

interface PdfToolProps {
    type: 'pdf-to-word' | 'merge-pdf' | 'split-pdf';
}

interface ProcessedFile {
    id: string;
    file: File;
    status: 'pending' | 'processing' | 'done' | 'error';
    resultBlob?: Blob;
    resultName?: string;
    extractedText?: string;
}

export default function PdfTools({ type }: PdfToolProps) {
    const t = useTranslations('Common');
    const tActions = useTranslations('ToolActions');
    const [files, setFiles] = useState<ProcessedFile[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [selectedFileId, setSelectedFileId] = useState<string | null>(null); // Added state

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
            setFiles(prev => [...prev, ...newBatch]);
            if (!selectedFileId && newBatch.length > 0) setSelectedFileId(newBatch[0].id);
        } else {
            setFiles(prev => [...prev, ...newBatch]);
            if (!selectedFileId && newBatch.length > 0) setSelectedFileId(newBatch[0].id);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        setDragActive(false);
        addFiles(e.dataTransfer.files);
    };

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(item => item.id !== id));
        if (selectedFileId === id) setSelectedFileId(null);
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

    // PDF.js is loaded via CDN script tag to avoid webpack bundling issues
    // Using jsDelivr CDN with a stable version that's known to work
    const PDFJS_CDN = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build';
    const [pdfjsLoaded, setPdfjsLoaded] = useState(false);

    useEffect(() => {
        // Check if already loaded
        if ((window as any).pdfjsLib) {
            setPdfjsLoaded(true);
            return;
        }

        // Load PDF.js from CDN
        const script = document.createElement('script');
        script.src = `${PDFJS_CDN}/pdf.min.js`;
        script.async = true;
        script.onload = () => {
            // Set worker source
            (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = `${PDFJS_CDN}/pdf.worker.min.js`;
            setPdfjsLoaded(true);
        };
        script.onerror = () => {
            console.error('Failed to load PDF.js');
            toast.error('Failed to load PDF library');
        };
        document.head.appendChild(script);

        return () => {
            // Cleanup if needed
        };
    }, []);

    const processPdfToWord = async () => {
        if (!pdfjsLoaded || !(window as any).pdfjsLib) {
            toast.error('PDF library not loaded. Please refresh the page.');
            return;
        }

        try {
            // Dynamic import for docx library
            const { Document, Packer, Paragraph, TextRun } = await import('docx');
            const pdfjsLib = (window as any).pdfjsLib;

            const updatedFiles = [...files];

            for (let i = 0; i < updatedFiles.length; i++) {
                const pf = updatedFiles[i];
                pf.status = 'processing';
                setFiles([...updatedFiles]);

                try {
                    const arrayBuffer = await pf.file.arrayBuffer();
                    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
                    const numPages = pdf.numPages;
                    const paragraphs: any[] = [];

                    // Process each page
                    for (let j = 1; j <= numPages; j++) {
                        const page = await pdf.getPage(j);
                        const textContent = await page.getTextContent();

                        // Extract and filter text items
                        const textItems = textContent.items
                            .filter((item: any) => item.str && item.str.trim())
                            .map((item: any) => item.str);

                        const pageText = textItems.join(' ');

                        // Accumulate text for copy function
                        if (pageText.trim()) {
                            (pf as any).extractedText = ((pf as any).extractedText || '') + pageText + '\n\n';
                        }

                        // Add page header for multi-page documents
                        if (numPages > 1) {
                            paragraphs.push(new Paragraph({
                                children: [new TextRun({ text: `— Page ${j} —`, bold: true, size: 24 })],
                                spacing: { before: 400, after: 200 }
                            }));
                        }

                        // Add extracted text
                        if (pageText.trim()) {
                            paragraphs.push(new Paragraph({
                                children: [new TextRun({ text: pageText, size: 22 })],
                                spacing: { after: 200 }
                            }));
                        }
                    }

                    // Create Word document
                    const doc = new Document({
                        sections: [{
                            properties: {},
                            children: paragraphs.length > 0 ? paragraphs : [
                                new Paragraph({ children: [new TextRun('No text content found in this PDF.')] })
                            ],
                        }],
                    });

                    const blob = await Packer.toBlob(doc);
                    pf.resultBlob = blob;
                    pf.resultName = pf.file.name.replace('.pdf', '.docx');
                    pf.status = 'done';

                    download(blob, pf.resultName);
                    toast.success(`Successfully converted: ${pf.file.name}`);

                } catch (error) {
                    console.error('PDF processing error:', error);
                    pf.status = 'error';
                    toast.error(`Failed to convert: ${pf.file.name}`);
                }
            }
            setFiles([...updatedFiles]);
        } catch (error) {
            console.error('Conversion error:', error);
            toast.error('Failed to initialize converter. Please try again.');
        }
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


    // Navigation Tools Configuration
    // Navigation Tools Configuration
    const pdfNavTools = [
        {
            category: 'Convert',
            tools: [
                { id: 'pdf-to-word', label: 'PDF to Word', icon: FileText },
            ]
        },
        {
            category: 'Organize',
            tools: [
                { id: 'merge-pdf', label: 'Merge', icon: FileArchive },
                { id: 'split-pdf', label: 'Split', icon: FileArchive },
            ]
        }
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* PDF Tools Navigation */}
            {/* PDF Tools Navigation */}
            {/* PDF Tools Navigation */}
            <ScrollableNav items={pdfNavTools} activeToolId={type} />

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
                                "min-h-[280px] border-4 border-dashed rounded-[1.5rem] flex flex-col items-center justify-center transition-all cursor-pointer group hover:border-accent hover:bg-accent/5 py-8",
                                dragActive ? "border-accent bg-accent/5 scale-[0.99]" : "border-border bg-muted/20"
                            )}
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform">
                                <FileText className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-lg md:text-2xl font-black text-foreground mb-2 text-center">
                                {tActions('chooseFile')}
                            </h2>
                            <p className="text-muted-foreground text-sm mb-6 text-center px-4 font-medium max-w-lg mx-auto">
                                {t.rich ? t.rich('dragDrop', {
                                    b: (chunks) => <span className="text-accent font-bold">{chunks}</span>
                                }) : t('dragDrop')}
                                <span className="text-xs opacity-60 block mt-1">Supports PDF</span>
                            </p>

                            <div className="flex flex-wrap justify-center gap-3">
                                <div className="px-4 py-1.5 bg-card border border-border rounded-full text-[10px] font-bold text-muted-foreground flex items-center gap-1.5 shadow-sm whitespace-nowrap">
                                    <CheckCircle2 size={12} className="text-emerald-500" /> {t('privacyGuaranteed')}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-3 gap-8 items-start">
                            <div className="lg:col-span-2 space-y-6">
                                {/* Summary Header */}
                                <div className="bg-muted/30 p-6 rounded-2xl border-2 border-border flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-primary/10 rounded-xl">
                                            <FileText className="text-primary w-6 h-6" />
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

                                {/* Preview Section */}
                                {(files.find(f => f.id === selectedFileId)?.file || files[0]?.file) && (
                                    <div className="bg-card p-4 rounded-3xl border-2 border-border shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-50" />
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                                                    <FileText size={14} />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">PDF Preview</span>
                                            </div>
                                            <span className="text-[10px] font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded-md truncate max-w-[150px]">
                                                {files.find(f => f.id === selectedFileId)?.file.name || files[0].file.name}
                                            </span>
                                        </div>
                                        <div className="relative rounded-xl overflow-hidden bg-muted/30 border-2 border-border/50 h-[300px] flex items-center justify-center checkered-bg">
                                            <iframe
                                                src={URL.createObjectURL(files.find(f => f.id === selectedFileId)?.file || files[0].file) + "#toolbar=0&view=FitH"}
                                                className="w-full h-full"
                                                title="PDF Preview"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* File List */}
                                <div className="space-y-3">
                                    {files.map((file, idx) => (
                                        <div
                                            key={file.id}
                                            onClick={() => setSelectedFileId(file.id)}
                                            className={cn(
                                                "bg-card p-4 rounded-xl border-2 flex items-center gap-4 transition-all relative overflow-hidden shadow-sm cursor-pointer",
                                                (selectedFileId === file.id || (!selectedFileId && idx === 0)) ? "border-primary ring-2 ring-primary/20 bg-primary/5" : "border-border hover:border-primary/50"
                                            )}
                                        >
                                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 flex-shrink-0">
                                                <FileText className="text-primary w-6 h-6" />
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
                                                {file.status === 'done' && (type === 'pdf-to-word') && (file as any).extractedText && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigator.clipboard.writeText((file as any).extractedText);
                                                            toast.success('Text copied to clipboard');
                                                        }}
                                                        className="p-2 hover:bg-emerald-500/10 text-emerald-500 rounded-lg transition-colors"
                                                        title="Copy Text"
                                                    >
                                                        <Copy size={16} />
                                                    </button>
                                                )}
                                                {file.status === 'error' && <X className="w-4 h-4 text-destructive" />}
                                                <button onClick={(e) => { e.stopPropagation(); removeFile(file.id); }} className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors">
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
                                            className="w-full py-5 bg-gradient-to-r from-primary to-accent text-white rounded-2xl font-black shadow-xl hover:scale-[1.01] hover:shadow-primary/20 transition-all flex flex-col items-center justify-center gap-1 disabled:opacity-50 border border-white/10"
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
