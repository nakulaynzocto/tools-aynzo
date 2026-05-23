"use client";
import { useTranslations } from 'next-intl';
import { Upload } from 'lucide-react';
import { cn } from '@/utils/cn';


interface FileUploadAreaProps {
    dragActive: boolean;
    onDrag: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    onFileSelect: () => void;
    inputId: string;
    multiple?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    children?: React.ReactNode;
    isLoading?: boolean;
}


export function FileUploadArea({ dragActive,
    onDrag,
    onDrop,
    onFileSelect,
    inputId,
    multiple = false,
    onChange,
    children,
    isLoading = false,
}: FileUploadAreaProps) {
    const tTool = useTranslations('Tools.imageTools');
    const tActions = useTranslations('ToolActions');
    const t = useTranslations('Common');

    return (
        <div
            onDragOver={onDrag}
            onDragEnter={onDrag}
            onDragLeave={onDrag}
            onDrop={onDrop}
            className={cn(
                "bg-card rounded-3xl border-2 border-dashed shadow-sm overflow-hidden transition-all relative flex flex-col items-center justify-center min-h-[300px] sm:min-h-[360px]",
                dragActive ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/50 hover:bg-muted/30"
            )}
        >
            <div className="absolute top-6 right-6 opacity-20 pointer-events-none hidden sm:block">
                <Upload size={80} />
            </div>

            <div className="relative z-10 text-center w-full px-4 flex flex-col items-center justify-center h-full">
                <div className="mb-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                        <Upload size={32} />
                    </div>
                </div>

                <button
                    onClick={onFileSelect}
                    disabled={isLoading}
                    className={cn(
                        "px-6 sm:px-10 py-3 sm:py-4 bg-primary text-primary-foreground text-base sm:text-lg font-bold rounded-xl shadow-md hover:scale-[1.02] hover:shadow-lg active:scale-95 transition-all duration-300 flex items-center gap-3 mx-auto",
                        isLoading ? "opacity-50 cursor-not-allowed hover:scale-100" : ""
                    )}
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                            {tActions('processing')}
                        </span>
                    ) : (
                        <>
                            <span>{tActions('chooseFile')}</span>
                        </>
                    )}
                </button>

                <div className="mt-4 text-muted-foreground font-medium text-sm sm:text-base">
                    {isLoading ? t('pleaseWait') : t('dragDrop')}
                </div>
                
                <div className="mt-8 pt-4 border-t border-border/50 flex items-center justify-center gap-2 text-xs text-muted-foreground font-medium w-full max-w-sm">
                    <span className="text-green-500">🔒</span>
                    <span>{t('secureAndPrivate')}</span>
                </div>
            </div>
                {children}
                <input
                    id={inputId}
                    type="file"
                    multiple={multiple}
                    className="hidden"
                    accept="image/*"
                    onChange={onChange}
                    disabled={isLoading}
                />

            {/* Full Overlay for better visibility of loading state */}
            {isLoading && (
                <div className="absolute inset-0 z-50 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                    {/* Spinner is already in the button, but this blocks interactions */}
                </div>
            )}
        </div>
    );
}

