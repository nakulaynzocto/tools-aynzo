"use client";
import { useState, useRef } from 'react';
import { Upload, Download, FileText, X, CheckCircle2, ScanText, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';

export function PdfToWord() {
    const tActions = useTranslations('ToolActions');
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [statusMsg, setStatusMsg] = useState('');
    const [isOcr, setIsOcr] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (selectedFile: File) => {
        if (selectedFile.type !== 'application/pdf') {
            setError('Please select a PDF file');
            return;
        }
        setFile(selectedFile);
        setError(null);
        setDownloadUrl(null);
        setProgress(0);
        setIsOcr(false);
        setStatusMsg('');
        processFile(selectedFile);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) handleFileSelect(droppedFile);
    };

    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); };

    /** STEP 1: Try text-based extraction. If all pages have no text → fallback to OCR. */
    const processFile = async (targetFile: File) => {
        setProcessing(true);
        setError(null);
        setStatusMsg('Reading PDF…');
        setProgress(5);

        try {
            const pdfjsLib = await import('pdfjs-dist');
            pdfjsLib.GlobalWorkerOptions.workerSrc =
                `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

            const arrayBuffer = await targetFile.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

            // Check if any page has selectable text
            let totalItems = 0;
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const tc = await page.getTextContent();
                totalItems += tc.items.filter((it: any) => 'str' in it && it.str.trim()).length;
            }

            if (totalItems > 0) {
                // Text-based path
                await extractTextBased(pdf, targetFile);
            } else {
                // OCR path
                setIsOcr(true);
                setStatusMsg('No selectable text found. Running OCR…');
                await extractWithOCR(pdf, targetFile);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to process PDF');
            setProcessing(false);
        }
    };

    /** Text-based extraction (fast, preserves layout) */
    const extractTextBased = async (pdf: any, targetFile: File) => {
        const paragraphs: Paragraph[] = [];
        let isLandscape = false;

        for (let i = 1; i <= pdf.numPages; i++) {
            setStatusMsg(`Extracting text — page ${i} of ${pdf.numPages}…`);
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 1.0 });
            if (i === 1) isLandscape = viewport.width > viewport.height;

            const textContent = await page.getTextContent();
            const items = textContent.items.filter((it: any) => 'str' in it && 'transform' in it);
            items.sort((a: any, b: any) => b.transform[5] - a.transform[5] || a.transform[4] - b.transform[4]);

            let currentLine: any[] = [];
            let lastY = items[0]?.transform[5] ?? 0;

            const pushLine = (lineItems: any[]) => {
                if (!lineItems.length) return;
                lineItems.sort((a: any, b: any) => a.transform[4] - b.transform[4]);

                let lineText = '';
                for (let j = 0; j < lineItems.length; j++) {
                    const item = lineItems[j];
                    if (item.str === '|' || item.str === '｜' || item.str === '¦') continue;
                    lineText += item.str;
                    if (j < lineItems.length - 1) {
                        const next = lineItems[j + 1];
                        const gap = next.transform[4] - (item.transform[4] + (item.width || 0));
                        const fs = Math.abs(item.transform[0]);
                        if (gap > fs * 0.32 && !item.str.endsWith(' ') && !next.str.startsWith(' ')) {
                            lineText += ' ';
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
                if (Math.abs(centerX - pageCenter) < viewport.width * 0.12) alignment = AlignmentType.CENTER;

                const rawFontSize = Math.abs(lineItems[0].transform[0]);
                const fontSize = Math.round(rawFontSize * 2);

                paragraphs.push(new Paragraph({
                    alignment,
                    children: [new TextRun({ text, size: Math.max(20, fontSize), font: 'Times New Roman' })],
                    spacing: { before: 180, after: 140, line: 320 },
                }));
            };

            items.forEach((item: any) => {
                if (Math.abs(item.transform[5] - lastY) > 5) {
                    pushLine(currentLine);
                    currentLine = [];
                    lastY = item.transform[5];
                }
                currentLine.push(item);
            });
            pushLine(currentLine);

            if (i < pdf.numPages) paragraphs.push(new Paragraph({ pageBreakBefore: true }));
            setProgress(Math.round((i / pdf.numPages) * 90));
        }

        await finishConversion(paragraphs, isLandscape, targetFile);
    };

    /** OCR-based extraction for scanned PDFs */
    const extractWithOCR = async (pdf: any, targetFile: File) => {
        try {
            const { createWorker } = await import('tesseract.js');
            const worker = await createWorker('eng', 1, {
                logger: (m: any) => {
                    if (m.status === 'recognizing text') {
                        // Update inner OCR progress within each page's range
                    }
                }
            });

            const paragraphs: Paragraph[] = [];
            let isLandscape = false;

            for (let i = 1; i <= pdf.numPages; i++) {
                setStatusMsg(`OCR processing page ${i} of ${pdf.numPages}…`);
                const page = await pdf.getPage(i);
                const scale = 2.5; // Higher scale = better OCR accuracy
                const viewport = page.getViewport({ scale });
                if (i === 1) isLandscape = viewport.width > viewport.height;

                // Render page to canvas
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const ctx = canvas.getContext('2d')!;
                await page.render({ canvasContext: ctx, viewport }).promise;

                // Run OCR on the canvas image
                const imageDataUrl = canvas.toDataURL('image/png');
                const { data } = await worker.recognize(imageDataUrl);

                // Split OCR result into paragraphs
                const lines = data.text.split('\n').filter((l: string) => l.trim());
                lines.forEach((line: string) => {
                    paragraphs.push(new Paragraph({
                        children: [new TextRun({ text: line.trim(), size: 24, font: 'Times New Roman' })],
                        spacing: { before: 100, after: 100, line: 280 },
                    }));
                });

                if (i < pdf.numPages) paragraphs.push(new Paragraph({ pageBreakBefore: true }));
                setProgress(Math.round((i / pdf.numPages) * 90));
            }

            await worker.terminate();
            await finishConversion(paragraphs, isLandscape, targetFile);
        } catch (err: any) {
            setError('OCR failed: ' + (err.message || 'Unknown error'));
            setProcessing(false);
        }
    };

    const finishConversion = async (paragraphs: Paragraph[], isLandscape: boolean, targetFile: File) => {
        if (!paragraphs.length) {
            setError('No text could be extracted from this PDF.');
            setProcessing(false);
            return;
        }

        setStatusMsg('Building Word document…');
        const doc = new Document({
            sections: [{
                properties: isLandscape
                    ? { page: { size: { width: 16838, height: 11906, orientation: 'landscape' } } }
                    : {},
                children: paragraphs,
            }],
        });

        const blob = await Packer.toBlob(doc);
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        setProcessing(false);
        setProgress(100);
        setStatusMsg('');
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
        setProgress(0);
        setStatusMsg('');
        setIsOcr(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="space-y-6">
            {!file ? (
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="border-2 border-dashed border-border rounded-3xl min-h-[325px] flex flex-col items-center justify-center p-12 text-center hover:border-primary transition-colors cursor-pointer bg-muted/20"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Upload className="mx-auto mb-4 text-primary" size={48} />
                    <p className="text-lg font-bold text-foreground mb-2">
                        {tActions('chooseFile') || 'Choose File'}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                        Drag and drop your PDF here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">Supports selectable & scanned PDFs</p>
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
                    {/* File Header */}
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

                    {/* Processing State */}
                    {processing && (
                        <div className="py-10 text-center space-y-5">
                            {isOcr ? (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                                        <ScanText className="w-8 h-8 text-amber-600 animate-pulse" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Running OCR…</h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            This PDF appears to be scanned. Using optical character recognition.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                                    <div>
                                        <h3 className="font-bold text-lg">Extracting text…</h3>
                                        <p className="text-sm text-muted-foreground mt-1">Preserving layout</p>
                                    </div>
                                </div>
                            )}

                            {statusMsg && (
                                <p className="text-xs text-muted-foreground animate-pulse">{statusMsg}</p>
                            )}

                            <div className="w-full max-w-xs mx-auto bg-muted rounded-full h-2.5 overflow-hidden">
                                <div
                                    className="bg-primary h-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">{progress}%</p>
                        </div>
                    )}

                    {/* Success State */}
                    {downloadUrl && !processing && (
                        <div className="space-y-5 animate-in fade-in zoom-in duration-300">
                            <div className={`border rounded-xl p-5 flex items-center gap-4 ${isOcr
                                ? 'bg-amber-500/10 border-amber-500/30'
                                : 'bg-emerald-500/10 border-emerald-500/30'
                                }`}>
                                {isOcr
                                    ? <ScanText className="text-amber-600 flex-shrink-0" size={28} />
                                    : <CheckCircle2 className="text-emerald-600 flex-shrink-0" size={28} />
                                }
                                <div>
                                    <p className={`font-bold ${isOcr ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
                                        {isOcr ? 'OCR Complete!' : 'Conversion Complete!'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {isOcr
                                            ? 'Text extracted via OCR. Accuracy depends on scan quality.'
                                            : 'Your Word document is ready'
                                        }
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleDownload}
                                className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-3 shadow-md"
                            >
                                <Download size={24} />
                                {tActions('download') || 'Download'} .docx
                            </button>

                            <button
                                onClick={handleClear}
                                className="text-muted-foreground hover:text-foreground text-sm underline w-full"
                            >
                                Convert another file
                            </button>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !processing && (
                        <div className="mt-6 p-5 bg-destructive/10 border border-destructive/30 rounded-xl space-y-3">
                            <p className="text-destructive font-semibold text-center">{error}</p>
                            <button
                                onClick={handleClear}
                                className="w-full text-sm text-muted-foreground underline"
                            >
                                Try another file
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}