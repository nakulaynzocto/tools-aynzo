"use client";
import { useState, useEffect, useRef } from 'react';
import { RefreshCw, Wand2, Upload, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useTranslations } from 'next-intl';
import { useImageFileUpload } from '@/components/hooks/image/useImageFileUpload';
import { processAllFiles, downloadResults } from '@/components/hooks/image/useImageProcessing';
import { FileUploadArea } from './FileUploadArea';
import { ImagePreview } from './ImagePreview';
import { SettingsPanel } from './SettingsPanel';

interface ImageConvertToolsProps {
    type: 'jpg-to-png' | 'png-to-jpg' | 'webp-converter' | 'jpg-to-webp' | 'png-to-webp' | 'webp-to-jpg' | 'webp-to-png' | 'svg-to-png' | 'png-to-svg' | 'jpg-to-svg' | 'webp-to-svg';
}

export function ImageConvertTools({ type }: ImageConvertToolsProps) {
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

    const [processing, setProcessing] = useState(false);
    const [quality, setQuality] = useState(80);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
        addFiles(e.dataTransfer.files);
    };

    const processAll = async (autoDownload = false) => {
        if (files.length === 0) return;

        setProcessing(true);
        setPreviewUrl(null);

        await processAllFiles(
            files,
            {
                type,
                quality,
            },
            (updated) => {
                // Update files state during processing - create new array reference
                const newFiles = updated.map(f => ({ ...f }));
                setFiles(newFiles);
            },
            async (updated) => {
                // Final update after all processing is complete - ensure new array reference
                const newFiles = updated.map(f => ({ ...f }));
                setFiles(newFiles);
                
                // Create preview URL from processed result
                const processedFile = newFiles.find(f => f.id === selectedFileId) || newFiles[0];
                if (processedFile?.resultBlob) {
                    if (processedFile.resultBlob instanceof Blob) {
                        // Revoke old URL if exists
                        if (previewUrl && previewUrl.startsWith('blob:')) {
                            URL.revokeObjectURL(previewUrl);
                        }
                        const url = URL.createObjectURL(processedFile.resultBlob);
                        setPreviewUrl(url);
                    } else if (typeof processedFile.resultBlob === 'string') {
                        setPreviewUrl(processedFile.resultBlob);
                    }
                }
                
                // Auto-download only if explicitly requested (button click)
                if (autoDownload) {
                    await downloadResults(newFiles, type, true);
                }
            }
        );

        setProcessing(false);
    };

    // Auto-process when quality changes or files are added (live processing)
    useEffect(() => {
        if (files.length === 0) return;

        // Clear previous timeout
        if (processingTimeoutRef.current) {
            clearTimeout(processingTimeoutRef.current);
        }

        // Debounce processing to avoid too many calls while dragging slider
        processingTimeoutRef.current = setTimeout(() => {
            processAll(false); // Don't auto-download on quality change
        }, 300); // 300ms delay after slider stops moving

        return () => {
            if (processingTimeoutRef.current) {
                clearTimeout(processingTimeoutRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quality, files.length, selectedFileId]);

    // Update preview when selectedFileId changes
    useEffect(() => {
        if (!selectedFileId || files.length === 0) {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
            setPreviewUrl(null);
            return;
        }

        const currentFile = files.find(f => f.id === selectedFileId);
        if (!currentFile) {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
            setPreviewUrl(null);
            return;
        }

        // If file has processed result, show that
        if (currentFile.resultBlob) {
            // Revoke old URL if exists
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }

            if (currentFile.resultBlob instanceof Blob) {
                const url = URL.createObjectURL(currentFile.resultBlob);
                setPreviewUrl(url);
            } else if (typeof currentFile.resultBlob === 'string') {
                setPreviewUrl(currentFile.resultBlob);
            } else {
                setPreviewUrl(null);
            }
        } else {
            // Show original preview - clear processed preview URL
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
            setPreviewUrl(null);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFileId, files.length, files.find(f => f.id === selectedFileId)?.resultBlob ? 'hasResult' : 'noResult']);


    const selectedFile = files.find(f => f.id === selectedFileId) || files[0];
    const originalSize = selectedFile?.file ? (selectedFile.file.size / 1024).toFixed(1) : '0';
    
    // Calculate processed size - ensure it's always a valid number
    let processedSize = '0';
    if (selectedFile?.resultSize && selectedFile.resultSize > 0) {
        processedSize = (selectedFile.resultSize / 1024).toFixed(1);
    } else if (selectedFile?.resultBlob) {
        // Fallback: calculate from blob if resultSize is not set
        if (selectedFile.resultBlob instanceof Blob && selectedFile.resultBlob.size > 0) {
            processedSize = (selectedFile.resultBlob.size / 1024).toFixed(1);
        } else if (typeof selectedFile.resultBlob === 'string' && selectedFile.resultBlob.length > 0) {
            processedSize = (selectedFile.resultBlob.length / 1024).toFixed(1);
        }
    }

    return (
        <div className="space-y-6">
            {files.length === 0 ? (
                <FileUploadArea
                    dragActive={dragActive}
                    onDrag={handleDrag}
                    onDrop={handleDrop}
                    onFileSelect={() => fileInputRef.current?.click()}
                    inputId="image-input"
                    multiple={true}
                    onChange={(e) => e.target.files && addFiles(e.target.files)}
                />
            ) : (
                <>
                    {/* Image Thumbnails - Horizontal Scrollable List */}
                    {files.length > 0 && (
                        <div className="bg-card rounded-2xl border-2 border-border p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-black uppercase tracking-widest text-foreground">
                                    Selected Images ({files.length})
                                </h3>
                            </div>
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
                                                alt={`Image ${file.id}`}
                                                onClick={() => setSelectedFileId(file.id)}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeFile(file.id);
                                                    if (selectedFileId === file.id) {
                                                        const remainingFiles = files.filter(f => f.id !== file.id);
                                                        setSelectedFileId(remainingFiles.length > 0 ? remainingFiles[0].id : null);
                                                    }
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
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-4">
                            <ImagePreview
                                files={files}
                                selectedFileId={selectedFileId}
                                previewUrl={previewUrl}
                                showComparison={true}
                                originalSize={originalSize}
                                processedSize={processedSize}
                            />
                        </div>

                        <div className="space-y-4">
                            <SettingsPanel
                                quality={quality}
                                onQualityChange={setQuality}
                                showQuality={true}
                            />

                            {/* Add More and Clear Buttons */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => {
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = ''; // Reset input to allow selecting same files again
                                            fileInputRef.current.click();
                                        }
                                    }}
                                    className="w-full py-3 bg-muted hover:bg-muted/80 text-foreground rounded-xl font-bold text-xs uppercase tracking-wider transition-all border border-border flex items-center justify-center gap-2"
                                >
                                    <Upload size={16} />
                                    {tActions('addMore')}
                                </button>
                                <button
                                    onClick={() => {
                                        clearAll();
                                        setPreviewUrl(null);
                                    }}
                                    className="w-full py-3 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-xl font-bold text-xs uppercase tracking-wider transition-all border border-destructive/20 flex items-center justify-center gap-2"
                                >
                                    {tActions('clearAll')}
                                </button>
                            </div>

                            {selectedFile?.resultBlob && selectedFile?.resultSize && selectedFile.resultSize > 0 && !processing && (
                                <button
                                    onClick={async () => {
                                        await downloadResults([selectedFile], type, false);
                                    }}
                                    className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-black text-sm uppercase tracking-widest shadow-lg hover:shadow-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                >
                                    <Wand2 size={20} />
                                    {tActions('download')}
                                </button>
                            )}
                        </div>
                    </div>
                </>
            )}

            <input
                ref={fileInputRef}
                id="image-input"
                type="file"
                multiple
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                        addFiles(e.target.files);
                        // Reset input value to allow selecting same files again
                        e.target.value = '';
                    }
                }}
            />
        </div>
    );
}

