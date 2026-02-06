"use client";
import { cn } from '@/utils/cn';
import { ProcessedFile } from '@/components/types/image/types';


interface ImagePreviewProps {
    files: ProcessedFile[];
    selectedFileId: string | null;
    previewUrl?: string | null;
    className?: string;
    showComparison?: boolean;
    originalSize?: string;
    processedSize?: string;
    children?: React.ReactNode;
    mobilePreview?: boolean;
}

export function ImagePreview({
    files,
    selectedFileId,
    previewUrl,
    className,
    showComparison = false,
    originalSize,
    processedSize,
    children,
    mobilePreview = false,
}: ImagePreviewProps) {
    const selectedFile = files.find(f => f.id === selectedFileId) || files[0];

    return (
        <div className={cn(
            "flex-1 bg-gradient-to-br from-muted/20 to-muted/5 p-3 sm:p-4 lg:p-6 rounded-3xl border-2 border-border shadow-inner relative flex flex-col lg:min-h-[300px] overflow-hidden",
            className
        )}>
            {showComparison && originalSize && processedSize && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border shadow-sm">
                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Original</div>
                        <div className="text-2xl font-black text-foreground">{originalSize} KB</div>
                    </div>
                    <div className="bg-primary/10 border-primary/20 backdrop-blur-sm rounded-xl p-4 border border-primary/30 shadow-sm">
                        <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Processed</div>
                        <div className="text-2xl font-black text-primary">{processedSize} KB</div>
                    </div>
                </div>
            )}

            <div className={cn(
                "flex-1 relative rounded-2xl overflow-hidden checkered-bg border-2 border-border shadow-lg items-center justify-center",
                mobilePreview ? "flex" : "hidden lg:flex",
                files.length > 4 ? "max-h-[400px] sm:max-h-[500px] lg:max-h-[600px] overflow-y-auto" : "max-h-none"
            )}>
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-w-full max-h-full object-contain"
                    />
                ) : selectedFile?.preview ? (
                    <img
                        src={selectedFile.preview}
                        alt="Preview"
                        className="max-w-full max-h-full object-contain"
                    />
                ) : (
                    <div className="text-muted-foreground text-sm">No image selected</div>
                )}
                {children}
            </div>
        </div>
    );
}

