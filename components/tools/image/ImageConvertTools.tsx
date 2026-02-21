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
                    multiple={false}
                    onChange={(e) => e.target.files && addFiles(e.target.files)}
                />
            ) : (
                <>
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

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={() => {
                                        clearAll();
                                        setPreviewUrl(null);
                                    }}
                                    className="w-full py-3 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-xl font-bold text-xs uppercase tracking-wider transition-all border border-destructive/20 flex items-center justify-center gap-2"
                                >
                                    {tActions('clearAll')}
                                </button>

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
                    </div>
                </>
            )}

            <input
                ref={fileInputRef}
                id="image-input"
                type="file"
                multiple={false}
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

