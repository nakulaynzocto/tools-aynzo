"use client";
import { useState, useRef } from 'react';
import { Upload, Download, FileText, X, CheckCircle2, Type } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';
export function PdfToWord() {
    const tActions = useTranslations('ToolActions');
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [mode, setMode] = useState<'selectable' | null>(null);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (selectedFile: File) => {
        if (selectedFile.type !== 'application/pdf') {
            setError('Please select a PDF file');
            return;
        }
        setFile(selectedFile);
        setError(null);
        setDownloadUrl(null);
        setMode('selectable');
        setProgress(0);

        // Auto-start conversion
        processPdfSelectable(selectedFile);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) handleFileSelect(droppedFile);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const processPdfSelectable = async (targetFile?: File) => {
        const fileToProcess = targetFile || file;
        if (!fileToProcess) return;
        setProcessing(true);
        setError(null);
        setProgress(10);

        try {
            const pdfjsLib = await import('pdfjs-dist');
            pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

            const arrayBuffer = await fileToProcess.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

            const paragraphs: Paragraph[] = [];
            let isLandscape = false;

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 1.0 });
                if (i === 1) isLandscape = viewport.width > viewport.height;
                const textContent = await page.getTextContent();
                // Don't trim here, we need the spaces if they are separate items
                const items = textContent.items.filter((item: any) => 'str' in item);

                if (items.length === 0 && pdf.numPages === 1) {
                    setError('No selectable text found in this PDF.');
                    setProcessing(false);
                    return;
                }

                // Sort by Y (top to bottom) then X (left to right)
                items.sort((a: any, b: any) => b.transform[5] - a.transform[5] || a.transform[4] - b.transform[4]);

                let currentLine: any[] = [];
                let lastY = items[0]?.transform[5] ?? 0;

                const pushLine = (lineItems: any[]) => {
                    if (lineItems.length === 0) return;

                    // Sort items in the line left-to-right
                    lineItems.sort((a, b) => a.transform[4] - b.transform[4]);

                    let lineText = "";
                    for (let i = 0; i < lineItems.length; i++) {
                        const item = lineItems[i];
                        const s = item.str;

                        // Ignore standalone pipes or separators often found in PDF artifacts
                        if (s === '|' || s === '｜' || s === '¦') continue;

                        lineText += s;

                        // Gap detection
                        if (i < lineItems.length - 1) {
                            const nextItem = lineItems[i + 1];
                            const itemWidth = item.width || 0;
                            const currentRight = item.transform[4] + itemWidth;
                            const nextLeft = nextItem.transform[4];
                            const gap = nextLeft - currentRight;

                            const fontSize = Math.abs(item.transform[0]);
                            // Be more conservative with gaps (0.3 instead of 0.25)
                            if (gap > fontSize * 0.32 && !s.endsWith(' ') && !nextItem.str.startsWith(' ')) {
                                lineText += " ";
                            }
                        }
                    }

                    const text = lineText.replace(/\s+/g, ' ').trim();
                    if (!text) return;

                    const minX = lineItems[0].transform[4];
                    const maxX = lineItems[lineItems.length - 1].transform[4] + (lineItems[lineItems.length - 1].width || 0);
                    const centerX = minX + (maxX - minX) / 2;
                    const pageCenter = viewport.width / 2;

                    let alignment: any = AlignmentType.LEFT;
                    if (Math.abs(centerX - pageCenter) < viewport.width * 0.12) {
                        alignment = AlignmentType.CENTER;
                    }

                    // Font size: convert to half-pts and add a slight buffer to prevent clipping
                    const rawFontSize = Math.abs(lineItems[0].transform[0]);
                    const fontSize = Math.round(rawFontSize * 2);

                    paragraphs.push(
                        new Paragraph({
                            alignment,
                            children: [
                                new TextRun({
                                    text,
                                    size: Math.max(20, fontSize),
                                    font: 'Times New Roman'
                                })
                            ],
                            spacing: {
                                before: 180,  // Added spacing to prevent top clipping
                                after: 140,
                                line: 320     // Increased line height to prevent vertical cutting
                            },
                        })
                    );
                };

                items.forEach((item: any) => {
                    const y = item.transform[5];
                    // If the Y difference is small, it's the same line
                    if (Math.abs(y - lastY) > 5) {
                        pushLine(currentLine);
                        currentLine = [];
                        lastY = y;
                    }
                    currentLine.push(item);
                });

                pushLine(currentLine);

                if (i < pdf.numPages) paragraphs.push(new Paragraph({ pageBreakBefore: true }));

                setProgress(Math.round((i / pdf.numPages) * 95));
            }

            finishConversion(paragraphs, isLandscape);
        } catch (err: any) {
            setError(err.message || 'Failed to process PDF');
            setProcessing(false);
        }
    };

    const processPdfWithOCR = async () => {
        // OCR mode removed
    };

    const finishConversion = async (paragraphs: Paragraph[], isLandscape: boolean) => {
        if (paragraphs.length === 0) {
            setError('No text found in the PDF.');
            setProcessing(false);
            return;
        }

        const doc = new Document({
            sections: [
                {
                    properties: isLandscape
                        ? { page: { size: { width: 16838, height: 11906, orientation: 'landscape' } } }
                        : {},
                    children: paragraphs,
                },
            ],
        });

        const blob = await Packer.toBlob(doc);
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        setProcessing(false);
        setProgress(100);
    };

    const handleDownload = () => {
        if (!downloadUrl || !file) return;
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = file.name.replace(/\.pdf$/i, '.docx') || 'converted.docx';
        a.click();
        a.remove();
    };

    const handleClear = () => {
        setFile(null);
        setError(null);
        setDownloadUrl(null);
        setMode(null);
        setProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="space-y-6">
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
                        Drag and drop your PDF here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">Supported: PDF (selectable text)</p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                    />
                </div>
            ) : (
                <div className="bg-card rounded-2xl border border-border p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <FileText className="text-primary" size={24} />
                            <div>
                                <p className="font-bold text-foreground">{file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        </div>
                        <button onClick={handleClear} className="p-2 hover:bg-muted rounded-lg">
                            <X size={20} />
                        </button>
                    </div>

                    {!downloadUrl && !processing && (
                        <div className="py-12 text-center">
                            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-muted-foreground animate-pulse">Initializing conversion...</p>
                        </div>
                    )}

                    {processing && (
                        <div className="py-10 text-center space-y-5">
                            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
                            <div>
                                <h3 className="font-bold text-lg">Extracting text...</h3>
                                <p className="text-sm text-muted-foreground mt-2">Preserving layout</p>
                                <div className="w-full max-w-xs mx-auto bg-muted rounded-full h-2.5 mt-4 overflow-hidden">
                                    <div
                                        className="bg-primary h-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {downloadUrl && (
                        <div className="space-y-5 animate-in fade-in zoom-in duration-300">
                            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 flex items-center gap-4">
                                <CheckCircle2 className="text-emerald-600" size={28} />
                                <div>
                                    <p className="font-bold text-emerald-700">Conversion Complete!</p>
                                    <p className="text-sm text-muted-foreground">Your Word document is ready</p>
                                </div>
                            </div>

                            <button
                                onClick={handleDownload}
                                className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-3 shadow-md"
                            >
                                <Download size={24} />
                                {tActions('download') || 'Download'}
                            </button>

                            <button
                                onClick={handleClear}
                                className="text-muted-foreground hover:text-foreground text-sm underline w-full"
                            >
                                Convert another file
                            </button>
                        </div>
                    )}

                    {error && (
                        <div className="mt-6 p-4 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive text-center">
                            {error}
                        </div>
                    )}


                </div>
            )}
        </div>
    );
}