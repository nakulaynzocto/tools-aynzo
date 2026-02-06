"use client";
import { useState, useRef } from 'react';
import { Upload, Download, FileText, X, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useTranslations } from 'next-intl';
import mammoth from 'mammoth';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function WordToPdf() {
    const tActions = useTranslations('ToolActions');
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (selectedFile: File) => {
        const validTypes = [
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
            'application/vnd.ms-word.document.macroEnabled.12'
        ];

        if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.docx') && !selectedFile.name.endsWith('.doc')) {
            setError('Please select a Word document (.doc or .docx)');
            return;
        }
        setFile(selectedFile);
        setError(null);
        setDownloadUrl(null);

        // Auto-start conversion
        processWord(selectedFile);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) handleFileSelect(droppedFile);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const processWord = async (passedFile?: File) => {
        const targetFile = passedFile || file;
        if (!targetFile) return;

        setProcessing(true);
        setError(null);

        try {
            const arrayBuffer = await targetFile.arrayBuffer();

            // Convert Word to HTML with better options
            const result = await mammoth.convertToHtml(
                { arrayBuffer },
                {
                    styleMap: [
                        "p[style-name='Heading 1'] => h1:fresh",
                        "p[style-name='Heading 2'] => h2:fresh",
                        "p[style-name='Heading 3'] => h3:fresh",
                        "u => u",
                        "strike => del"
                    ]
                }
            );

            const htmlContent = result.value;

            // Create a hidden container for rendering
            const container = document.createElement('div');
            container.id = 'word-conversion-container';
            container.style.position = 'fixed';
            container.style.left = '0';
            container.style.top = '0';
            container.style.width = '794px'; // A4 width at 96 DPI
            container.style.padding = '60px';
            container.style.background = 'white';
            container.style.color = 'black';
            container.style.fontFamily = 'serif';
            container.style.fontSize = '12pt';
            container.style.lineHeight = '1.5';
            container.style.zIndex = '-9999';
            container.style.visibility = 'visible'; // Must be visible for html2canvas
            container.innerHTML = htmlContent;
            document.body.appendChild(container);

            // Use jspdf's html method
            const pdf = new jsPDF('p', 'pt', 'a4');

            await pdf.html(container, {
                callback: (doc) => {
                    const blob = doc.output('blob');
                    const url = URL.createObjectURL(blob);
                    setDownloadUrl(url);
                    setProcessing(false);
                    document.body.removeChild(container);
                },
                x: 0,
                y: 0,
                html2canvas: {
                    scale: 0.75, // Adjust scale to fit content properly
                    useCORS: true,
                    logging: false,
                    letterRendering: true
                },
                width: 595, // A4 width in points
                windowWidth: 794,
                autoPaging: 'text' // Better for text-heavy Word docs
            });

        } catch (e: any) {
            console.error(e);
            setError(e.message || 'Failed to convert Word to PDF');
            setProcessing(false);
        }
    };

    const handleDownload = () => {
        if (downloadUrl) {
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = file?.name.replace(/\.(docx?|doc)$/i, '.pdf') || 'converted.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    const handleClear = () => {
        setFile(null);
        setError(null);
        setDownloadUrl(null);
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
                        Drag and drop your Word document here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Supported formats: .doc, .docx
                    </p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files?.[0]) {
                                handleFileSelect(e.target.files[0]);
                            }
                        }}
                    />
                </div>
            ) : (
                <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <FileText className="text-primary" size={24} />
                            </div>
                            <div>
                                <p className="font-bold text-foreground leading-tight">{file.name}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleClear}
                            className="p-2 hover:bg-muted rounded-full transition-colors"
                        >
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
                        <div className="py-10 text-center space-y-4">
                            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
                            <div>
                                <h3 className="font-bold text-lg">Converting to PDF...</h3>
                                <p className="text-sm text-muted-foreground">Preserving document layout and styles</p>
                            </div>
                        </div>
                    )}

                    {downloadUrl && (
                        <div className="space-y-5 animate-in fade-in zoom-in duration-300">
                            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 flex items-center gap-4">
                                <CheckCircle2 className="text-emerald-600" size={28} />
                                <div>
                                    <p className="font-bold text-emerald-700">Conversion Complete!</p>
                                    <p className="text-sm text-muted-foreground">Your PDF is ready for download</p>
                                </div>
                            </div>
                            <button
                                onClick={handleDownload}
                                className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-3 shadow-md"
                            >
                                <Download size={24} />
                                {tActions('download') || 'Download PDF'}
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
                        <div className="mt-4 bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-destructive text-sm font-bold">
                            {error}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
