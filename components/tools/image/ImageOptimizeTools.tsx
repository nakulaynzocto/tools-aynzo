"use client";
import { useState, useEffect, useRef } from 'react';
import { RefreshCw, Upload, Wand2, Download, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useTranslations } from 'next-intl';
import { useImageFileUpload } from '@/components/hooks/image/useImageFileUpload';
import { processAllFiles, downloadResults } from '@/components/hooks/image/useImageProcessing';
import { FileUploadArea } from './FileUploadArea';
import { ImagePreview } from './ImagePreview';
import { SettingsPanel } from './SettingsPanel';

interface ImageOptimizeToolsProps {
    type: 'image-compressor' | 'image-resizer' | 'image-enlarger';
}

export function ImageOptimizeTools({ type }: ImageOptimizeToolsProps) {
    const t = useTranslations('Common');
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
        isLoading,
    } = useImageFileUpload();

    const [processing, setProcessing] = useState(false);
    const [quality, setQuality] = useState(80);
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);
    const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [originalImageDimensions, setOriginalImageDimensions] = useState<{ width: number; height: number } | null>(null);

    const processAll = async () => {
        if (files.length === 0) return;

        setProcessing(true);

        await processAllFiles(
            files,
            {
                type,
                quality,
                width,
                height,
                maintainAspectRatio,
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
            }
        );

        setProcessing(false);
    };

    // Auto-process when quality or dimensions change (live processing)
    useEffect(() => {
        if (files.length === 0) return;

        // Clear previous timeout
        if (processingTimeoutRef.current) {
            clearTimeout(processingTimeoutRef.current);
        }

        // Debounce processing to avoid too many calls while dragging slider
        processingTimeoutRef.current = setTimeout(() => {
            processAll();
        }, 300); // 300ms delay after slider stops moving

        return () => {
            if (processingTimeoutRef.current) {
                clearTimeout(processingTimeoutRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quality, width, height, maintainAspectRatio, files.length]);

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

    // Load original image dimensions when file is selected
    useEffect(() => {
        const currentFile = files.find(f => f.id === selectedFileId) || files[0];
        if (currentFile?.preview) {
            const img = new Image();
            img.onload = () => {
                setOriginalImageDimensions({
                    width: img.naturalWidth,
                    height: img.naturalHeight
                });
            };
            img.src = currentFile.preview;
        }
    }, [files, selectedFileId]);

    // Handle percentage resize (always maintains aspect ratio)
    const handlePercentageResize = (percent: number) => {
        if (!originalImageDimensions) return;

        const newWidth = Math.round((originalImageDimensions.width * percent) / 100);
        const newHeight = Math.round((originalImageDimensions.height * percent) / 100);

        setWidth(newWidth);
        setHeight(newHeight);
    };

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
                    isLoading={isLoading}
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
                                width={width}
                                height={height}
                                onWidthChange={setWidth}
                                onHeightChange={setHeight}
                                maintainAspectRatio={maintainAspectRatio}
                                onMaintainAspectRatioChange={setMaintainAspectRatio}
                                showQuality={true}
                                showDimensions={type === 'image-resizer' || type === 'image-enlarger'}
                                originalWidth={originalImageDimensions?.width}
                                originalHeight={originalImageDimensions?.height}
                                onPercentageResize={handlePercentageResize}
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
                                        setOriginalImageDimensions(null);
                                    }}
                                    className="w-full py-3 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-xl font-bold text-xs uppercase tracking-wider transition-all border border-destructive/20 flex items-center justify-center gap-2"
                                >
                                    {tActions('clearAll')}
                                </button>
                            </div>

                            {processing && (
                                <div className="w-full py-3 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center gap-2">
                                    <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                                    <span className="text-xs font-bold text-primary uppercase tracking-wider">{tActions('processing')}</span>
                                </div>
                            )}

                            {selectedFile?.resultBlob && selectedFile?.resultSize && selectedFile.resultSize > 0 && !processing && (
                                <button
                                    onClick={async () => {
                                        await downloadResults([selectedFile], type, false);
                                    }}
                                    className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-black text-sm uppercase tracking-widest shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <Download size={20} />
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

