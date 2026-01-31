"use client";
import { useState, useEffect, useRef } from 'react';
import { RefreshCw, Wand2, Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useImageFileUpload } from '@/components/hooks/image/useImageFileUpload';
import { processAllFiles, downloadResults } from '@/components/hooks/image/useImageProcessing';
import { FileUploadArea } from './FileUploadArea';
import { ImagePreview } from './ImagePreview';
import { SettingsPanel } from './SettingsPanel';

interface ImageFilterToolsProps {
    type: 'grayscale-image' | 'sepia-converter' | 'invert-image' | 'blur-image' | 'image-brightness' | 'image-contrast' | 'saturate-image' | 'hue-rotate-image' | 'image-opacity' | 'round-corners-image' | 'image-shadow' | 'pixelate-image';
}

export function ImageFilterTools({ type }: ImageFilterToolsProps) {
    const tActions = useTranslations('ToolActions');

    const {
        files,
        setFiles,
        dragActive,
        setDragActive,
        selectedFileId,
        setSelectedFileId,
        addFiles,
    } = useImageFileUpload();

    const [processing, setProcessing] = useState(false);
    const [quality, setQuality] = useState(80);
    const [filterValue, setFilterValue] = useState(type === 'round-corners-image' ? 20 : 100);
    const [size, setSize] = useState(type === 'pixelate-image' ? 10 : (type === 'image-shadow' ? 20 : 10));

    // Update defaults when type changes
    useEffect(() => {
        if (type === 'round-corners-image') {
            setFilterValue(20);
        } else if (type === 'pixelate-image') {
            setSize(10);
            setFilterValue(100); // Reset filter value
        } else if (type === 'image-shadow') {
            setSize(20);
            setFilterValue(100); // Reset filter value
        } else if (type === 'blur-image') {
            setSize(10);
            setFilterValue(100); // Reset filter value
        } else {
            // For all other filter types (grayscale, sepia, invert, brightness, contrast, saturate, hue-rotate, opacity)
            setFilterValue(100);
            setSize(10); // Reset size
        }
    }, [type]);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
                filterValue,
                size: (type === 'blur-image' || type === 'pixelate-image' || type === 'image-shadow') ? size : undefined,
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
                    await downloadResults(newFiles, type, false);
                }
            }
        );

        setProcessing(false);
    };

    // Auto-process when quality, filterValue, or size changes (live processing)
    useEffect(() => {
        if (files.length === 0) return;

        // Clear previous timeout
        if (processingTimeoutRef.current) {
            clearTimeout(processingTimeoutRef.current);
        }

        // Debounce processing to avoid too many calls while dragging slider
        processingTimeoutRef.current = setTimeout(() => {
            processAll(false); // Don't auto-download on slider change
        }, 300); // 300ms delay after slider stops moving

        return () => {
            if (processingTimeoutRef.current) {
                clearTimeout(processingTimeoutRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quality, filterValue, size, files.length, selectedFileId]);


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
                    onFileSelect={() => document.getElementById('image-input')?.click()}
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
                                filterValue={filterValue}
                                onFilterValueChange={setFilterValue}
                                size={size}
                                onSizeChange={setSize}
                                showQuality={true}
                                showFilters={type !== 'pixelate-image' && type !== 'image-shadow'}
                                filterLabel={type === 'round-corners-image' ? 'Radius' : 'Intensity'}
                                showSize={type === 'blur-image' || type === 'pixelate-image' || type === 'image-shadow'}
                                sizeLabel={type === 'pixelate-image' ? 'Pixel Size' : type === 'image-shadow' ? 'Blur' : 'Size'}
                                sizeMin={type === 'pixelate-image' ? 2 : 1}
                                sizeMax={type === 'pixelate-image' ? 50 : type === 'image-shadow' ? 100 : 50}
                            />

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
                                    className="w-full py-4 bg-primary text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <Download size={20} />
                                    {tActions('download')}
                                </button>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

