"use client";
import { useState, useRef, useEffect } from 'react';
import { RefreshCw, Wand2, RotateCw, MoveHorizontal, Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useImageFileUpload } from '@/components/hooks/image/useImageFileUpload';
import { processAllFiles, downloadResults } from '@/components/hooks/image/useImageProcessing';
import { FileUploadArea } from './FileUploadArea';
import { ImagePreview } from './ImagePreview';
import { SettingsPanel } from './SettingsPanel';

interface ImageEditToolsProps {
    type: 'image-cropper' | 'rotate-image' | 'flip-image' | 'image-border';
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
    return centerCrop(
        makeAspectCrop({ unit: '%', width: 90 }, aspect, mediaWidth, mediaHeight),
        mediaWidth,
        mediaHeight
    );
}

export function ImageEditTools({ type }: ImageEditToolsProps) {
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
    const [rotation, setRotation] = useState(0);
    const [flipH, setFlipH] = useState(false);
    const [flipV, setFlipV] = useState(false);
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [aspect, setAspect] = useState<number | undefined>(undefined);
    const [borderWidth, setBorderWidth] = useState(10);
    const [borderColor, setBorderColor] = useState('#000000');
    const imgRef = useRef<HTMLImageElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setCrop(undefined);
        setCompletedCrop(undefined);
        setAspect(undefined);
    }, [selectedFileId, files]);

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        if (type === 'image-cropper') {
            const { width, height } = e.currentTarget;
            if (!crop) {
                if (aspect === undefined) {
                    const defaultAspect = 16 / 9;
                    setAspect(defaultAspect);
                    setCrop(centerAspectCrop(width, height, defaultAspect));
                } else {
                    setCrop(centerAspectCrop(width, height, aspect));
                }
            }
        }
    };

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
                rotation,
                flipH,
                flipV,
                completedCrop,
                imgRef,
                borderWidth: type === 'image-border' ? borderWidth : undefined,
                borderColor: type === 'image-border' ? borderColor : undefined,
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

    // Auto-process when quality, rotation, or flip changes (live processing)
    // Note: For cropper, we don't auto-process on crop change as it requires user confirmation
    useEffect(() => {
        if (files.length === 0) return;
        if (type === 'image-cropper') return; // Don't auto-process for cropper

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
    }, [quality, rotation, flipH, flipV, borderWidth, borderColor, files.length, selectedFileId, type]);


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
                            {type === 'image-cropper' && selectedFile?.preview ? (
                                <div className="flex-1 bg-gradient-to-br from-muted/20 to-muted/5 p-3 sm:p-4 lg:p-6 rounded-3xl border-2 border-border shadow-inner relative flex flex-col min-h-[200px] sm:min-h-[300px] overflow-hidden">
                                    <div className="flex-1 relative rounded-2xl overflow-hidden checkered-bg border-2 border-border shadow-lg min-h-[200px]">
                                        <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-4">
                                            <ReactCrop
                                                key={`crop-${aspect ?? 'free'}`}
                                                crop={crop}
                                                onChange={(_, percentCrop) => setCrop(percentCrop)}
                                                onComplete={(c) => setCompletedCrop(c)}
                                                {...(aspect !== undefined && { aspect })}
                                                className="max-w-full max-h-[400px] sm:max-h-[500px] lg:max-h-[600px]"
                                            >
                                                <img
                                                    ref={imgRef}
                                                    src={selectedFile.preview}
                                                    alt="Crop"
                                                    onLoad={onImageLoad}
                                                    className="max-w-full max-h-full object-contain"
                                                />
                                            </ReactCrop>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <ImagePreview
                                    files={files}
                                    selectedFileId={selectedFileId}
                                    previewUrl={previewUrl}
                                    showComparison={type !== 'image-cropper'}
                                    originalSize={originalSize}
                                    processedSize={processedSize}
                                />
                            )}
                        </div>

                        <div className="space-y-4">
                            <SettingsPanel
                                quality={quality}
                                onQualityChange={setQuality}
                                rotation={rotation}
                                onRotationChange={setRotation}
                                flipH={flipH}
                                flipV={flipV}
                                onFlipHChange={setFlipH}
                                onFlipVChange={setFlipV}
                                borderWidth={borderWidth}
                                borderColor={borderColor}
                                onBorderWidthChange={setBorderWidth}
                                onBorderColorChange={setBorderColor}
                                showQuality={true}
                                showRotation={type === 'rotate-image'}
                                showFlip={type === 'flip-image'}
                                showBorder={type === 'image-border'}
                            />

                            {processing && (
                                <div className="w-full py-3 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center gap-2">
                                    <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                                    <span className="text-xs font-bold text-primary uppercase tracking-wider">{tActions('processing')}</span>
                                </div>
                            )}
                            
                            {/* For cropper, show process button. For others, show download after processing */}
                            {type === 'image-cropper' ? (
                                <button
                                    onClick={() => processAll(false)}
                                    disabled={processing || files.length === 0 || !completedCrop}
                                    className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-black text-sm uppercase tracking-widest shadow-lg hover:shadow-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <RefreshCw className="w-5 h-5 animate-spin" />
                                            {tActions('processing')}
                                        </>
                                    ) : (
                                        <>
                                            <Wand2 size={20} />
                                            {tActions('runTool')}
                                        </>
                                    )}
                                </button>
                            ) : (
                                selectedFile?.resultBlob && selectedFile?.resultSize && selectedFile.resultSize > 0 && !processing && (
                                    <button
                                        onClick={async () => {
                                            await downloadResults([selectedFile], type, false);
                                        }}
                                        className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-black text-sm uppercase tracking-widest shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <Download size={20} />
                                        {tActions('download')}
                                    </button>
                                )
                            )}
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
                        e.target.value = '';
                    }
                }}
            />
        </div>
    );
}

