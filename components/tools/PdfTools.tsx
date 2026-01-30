"use client";
import { useState, useEffect } from 'react';
import { Upload, FileText, X, Settings, CheckCircle2, RefreshCw, Wand2, FileArchive, Download, Copy, Trash2, Lock } from 'lucide-react';
import { cn } from '@/utils/cn';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import JSZip from 'jszip';
// @ts-ignore
import { PDFDocument } from 'pdf-lib/dist/pdf-lib.min.js';
import { ScrollableNav } from '@/components/ScrollableNav';

interface PdfToolProps {
    type: 'pdf-to-word' | 'merge-pdf' | 'split-pdf' | 'word-to-pdf';
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
    const tTools = useTranslations('Tools');

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

        if (type === 'split-pdf' || type === 'pdf-to-word' || type === 'word-to-pdf') {
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

    const processWordToPdf = async () => {
        try {
            const mammoth = await import('mammoth');
            const { jsPDF } = await import('jspdf');

            const updatedFiles = [...files];

            for (let i = 0; i < updatedFiles.length; i++) {
                const pf = updatedFiles[i];
                pf.status = 'processing';
                setFiles([...updatedFiles]);

                try {
                    const arrayBuffer = await pf.file.arrayBuffer();
                    // Extract text using mammoth
                    const result = await mammoth.extractRawText({ arrayBuffer });
                    const text = result.value;

                    // Create PDF using jsPDF
                    const doc = new jsPDF();

                    // Add Title
                    doc.setFontSize(18);
                    doc.text(pf.file.name.replace(/\.[^/.]+$/, ""), 15, 20);

                    // Add Body Text with word wrap
                    doc.setFontSize(11);
                    const splitText = doc.splitTextToSize(text, 180);
                    let y = 30;

                    for (let line of splitText) {
                        if (y > 280) {
                            doc.addPage();
                            y = 20;
                        }
                        doc.text(line, 15, y);
                        y += 6;
                    }

                    const pdfBlob = doc.output('blob');
                    pf.resultBlob = pdfBlob;
                    pf.resultName = pf.file.name.replace(/\.[^/.]+$/, "") + ".pdf";
                    pf.status = 'done';

                    download(pdfBlob, pf.resultName);
                    toast.success(`Converted: ${pf.file.name}`);

                } catch (error) {
                    console.error('Word processing error:', error);
                    pf.status = 'error';
                    toast.error(`Error converting: ${pf.file.name}`);
                }
            }
            setFiles([...updatedFiles]);
        } catch (error) {
            console.error('Initialization error:', error);
            toast.error('Failed to initialize converter.');
        }
    };

    const processAll = async () => {
        setProcessing(true);
        try {
            if (type === 'merge-pdf') await processMerge();
            else if (type === 'split-pdf') await processSplit();
            else if (type === 'pdf-to-word') await processPdfToWord();
            else if (type === 'word-to-pdf') await processWordToPdf();
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
                { id: 'word-to-pdf', label: 'Word to PDF', icon: FileText },
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

    const activeCategory = pdfNavTools.find((cat: any) => (cat.tools as any[]).some((t: any) => t.id === type));

    return (
        <div className="max-w-6xl mx-auto space-y-4">
            {/* PDF Tools Navigation */}
            {activeCategory && (
                <ScrollableNav items={[{ category: activeCategory.category, tools: activeCategory.tools }]} activeToolId={type} />
            )}

            <input
                id="pdf-input"
                type="file"
                multiple
                className="hidden"
                accept={type === 'word-to-pdf' ? ".doc,.docx" : ".pdf"}
                onChange={(e) => addFiles(e.target.files)}
            />

            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">
                <div className="p-4 md:p-6">
                    {files.length === 0 ? (
                        <div
                            onDragOver={handleDrag} onDragEnter={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
                            className={cn(
                                "min-h-[200px] flex flex-col items-center justify-center transition-all py-6 px-4 relative",
                                dragActive ? "bg-accent/5" : "bg-transparent"
                            )}
                        >
                            <div className="relative z-10 text-center">
                                <button
                                    onClick={() => document.getElementById('pdf-input')?.click()}
                                    className="px-12 py-6 bg-primary text-white dark:bg-gradient-to-r dark:from-sky-500 dark:to-blue-600 dark:border-none text-2xl font-black rounded-2xl shadow-[0_20px_40px_-15px_rgba(var(--primary-rgb),0.4)] dark:shadow-[0_0_30px_-5px_rgba(14,165,233,0.4)] hover:scale-[1.05] hover:shadow-[0_25px_50px_-12px_rgba(var(--primary-rgb),0.5)] dark:hover:shadow-[0_0_40px_-5px_rgba(14,165,233,0.5)] active:scale-95 transition-all duration-300"
                                >
                                    {tActions('chooseFile')}
                                </button>
                                <div className="mt-6 text-muted-foreground font-bold text-sm uppercase tracking-[0.2em] opacity-40">
                                    or drop files here
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-[1fr,350px] gap-8 items-stretch lg:h-[500px] h-auto">
                            {/* Main File Management Area */}
                            <div className="flex flex-col gap-6 h-full min-h-0">
                                {/* Batch Info Header */}
                                <div className="flex items-center justify-between bg-muted/50 px-6 py-4 rounded-2xl border border-border">
                                    <div className="flex items-center gap-4">
                                        <div className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                            {files.length} {tActions('filesSelected', { count: files.length })}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => document.getElementById('pdf-input')?.click()} className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-2">
                                            <Upload size={14} /> Add More
                                        </button>
                                        <button onClick={() => setFiles([])} className="text-[10px] font-black uppercase tracking-widest text-destructive hover:underline uppercase">{tActions('clearAll')}</button>
                                    </div>
                                </div>

                                {/* File List - Internal Scroll */}
                                <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pr-1 space-y-3">
                                    {files.map((file) => (
                                        <div key={file.id} className={cn("p-5 bg-card rounded-2xl border-2 border-border transition-all flex items-center gap-5 group hover:border-primary/30", file.status === 'done' ? "border-emerald-500/30 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.05)]" : "shadow-sm")}>
                                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-lg", file.status === 'done' ? "bg-emerald-500 text-white scale-110" : "bg-primary text-white")}>
                                                <FileText size={24} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-base truncate text-foreground">{file.file.name}</p>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-[10px] font-black text-muted-foreground uppercase opacity-40">{(file.file.size / 1024).toFixed(0)} KB</span>
                                                    {file.status === 'done' && <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Ready</span>}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {file.status === 'processing' && <RefreshCw className="w-5 h-5 animate-spin text-primary" />}
                                                {file.status === 'done' && <CheckCircle2 className="w-6 h-6 text-emerald-500 animate-in zoom-in-50" />}
                                                <button onClick={() => removeFile(file.id)} className="p-2.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-xl transition-all opacity-0 group-hover:opacity-100"><Trash2 size={18} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sidebar Options */}
                            <div className="h-full flex flex-col gap-6">
                                <div className="bg-card flex-1 p-8 rounded-[2.5rem] border border-border shadow-2xl flex flex-col">
                                    <div className="flex-1 space-y-8 overflow-y-auto no-scrollbar pr-1">
                                        <div className="flex items-center gap-3 text-primary border-b border-border pb-6">
                                            <Settings className="w-5 h-5" />
                                            <h4 className="font-black uppercase tracking-[0.2em] text-[13.5px] leading-none">Process Config</h4>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="p-6 bg-muted/50 rounded-2xl border border-border space-y-3">
                                                <div className="text-[11px] font-black uppercase tracking-widest text-primary">{type === 'merge-pdf' ? 'Merge Sequence' : 'Process Logic'}</div>
                                                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                                                    {type === 'merge-pdf' && "Combined files appear in the exact order as the physical list on the left."}
                                                    {type === 'split-pdf' && "Extracting every single page into individual standalone documents."}
                                                    {type === 'pdf-to-word' && "Optimizing document layers for maximum editability in Word files."}
                                                    {type === 'word-to-pdf' && "Executing high-fidelity PDF render with full CSS text mapping."}
                                                </p>
                                            </div>

                                            <div className="p-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 space-y-2">
                                                <div className="flex items-center gap-2 text-emerald-500">
                                                    <Lock size={14} />
                                                    <span className="text-[11px] font-black uppercase tracking-widest">Encrypted Tunnel</span>
                                                </div>
                                                <p className="text-[9px] text-muted-foreground leading-relaxed font-medium opacity-60">
                                                    Your documents are processed locally in-browser and never stored on any cloud server.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 mt-auto space-y-4 border-t border-border">
                                        <button onClick={processAll} disabled={processing || files.length === 0} className="w-full py-5 bg-primary text-primary-foreground dark:bg-gradient-to-r dark:from-sky-500 dark:to-blue-600 dark:border-none rounded-2xl font-black text-lg shadow-[0_20px_40px_-15px_rgba(var(--primary-rgb),0.4)] dark:shadow-[0_0_30px_-5px_rgba(14,165,233,0.4)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-3 border border-white/10">
                                            {processing ? (
                                                <RefreshCw className="w-6 h-6 animate-spin" />
                                            ) : (
                                                <>
                                                    {type === 'merge-pdf' ? <FileArchive size={24} /> : <Wand2 size={24} />}
                                                    <span className="uppercase tracking-[0.05em]">{type === 'merge-pdf' ? 'Merge Now' : type === 'split-pdf' ? 'Split Now' : (type === 'word-to-pdf' ? 'Create PDF' : 'Convert Now')}</span>
                                                </>
                                            )}
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
        </div >
    );
}
