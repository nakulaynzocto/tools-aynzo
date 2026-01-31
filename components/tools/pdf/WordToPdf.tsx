"use client";
import { useState, useRef } from 'react';
import { Upload, Download, FileText, X, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useTranslations } from 'next-intl';
import mammoth from 'mammoth';
import jsPDF from 'jspdf';

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
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) handleFileSelect(droppedFile);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const processWord = async () => {
        if (!file) return;

        setProcessing(true);
        setError(null);

        try {
            const arrayBuffer = await file.arrayBuffer();
            
            // Convert Word to HTML
            const result = await mammoth.convertToHtml({ arrayBuffer });
            const html = result.value;

            // Create a temporary div to parse HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;

            // Extract text content
            const textContent = tempDiv.innerText || tempDiv.textContent || '';

            // Create PDF
            const pdf = new jsPDF();
            const lines = pdf.splitTextToSize(textContent, 180);
            
            let y = 20;
            const pageHeight = pdf.internal.pageSize.height;
            const lineHeight = 7;

            lines.forEach((line: string) => {
                if (y + lineHeight > pageHeight - 20) {
                    pdf.addPage();
                    y = 20;
                }
                pdf.text(line, 20, y);
                y += lineHeight;
            });

            const blob = pdf.output('blob');
            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to convert Word to PDF');
        } finally {
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
                            if (e.target.files && e.target.files[0]) {
                                handleFileSelect(e.target.files[0]);
                            }
                        }}
                    />
                </div>
            ) : (
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
                    
                    {!downloadUrl && (
                        <button
                            onClick={processWord}
                            disabled={processing}
                            className={cn(
                                "w-full py-3 px-6 rounded-xl font-bold text-sm transition-all",
                                processing
                                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                            )}
                        >
                            {processing ? 'Processing...' : 'Convert to PDF'}
                        </button>
                    )}

                    {downloadUrl && (
                        <div className="space-y-4">
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3">
                                <CheckCircle2 className="text-emerald-500" size={24} />
                                <div className="flex-1">
                                    <p className="font-bold text-emerald-500">Conversion Complete!</p>
                                    <p className="text-xs text-muted-foreground">Your PDF document is ready to download.</p>
                                </div>
                            </div>
                            <button
                                onClick={handleDownload}
                                className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                            >
                                <Download size={20} />
                                {tActions('download') || 'Download PDF'}
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
