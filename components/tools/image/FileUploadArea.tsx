"use client";
import { Upload } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useTranslations } from 'next-intl';

interface FileUploadAreaProps {
    dragActive: boolean;
    onDrag: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    onFileSelect: () => void;
    inputId: string;
    multiple?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    children?: React.ReactNode;
}

export function FileUploadArea({
    dragActive,
    onDrag,
    onDrop,
    onFileSelect,
    inputId,
    multiple = false,
    onChange,
    children,
}: FileUploadAreaProps) {
    const tActions = useTranslations('ToolActions');
    const t = useTranslations('Common');

    return (
        <div
            onDragOver={onDrag}
            onDragEnter={onDrag}
            onDragLeave={onDrag}
            onDrop={onDrop}
            className={cn(
                "bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden transition-all",
                dragActive ? "border-primary bg-accent/5" : ""
            )}
        >
            <div
                className={cn(
                    "min-h-[200px] sm:min-h-[250px] flex flex-col items-center justify-center transition-all py-6 sm:py-8 px-4 relative",
                    dragActive ? "bg-accent/5" : "bg-transparent"
                )}
            >
                <div className="relative z-10 text-center">
                    <button
                        onClick={onFileSelect}
                        className="px-4 sm:px-6 md:px-8 lg:px-12 py-2 sm:py-3 md:py-4 lg:py-6 bg-primary text-white dark:bg-gradient-to-r dark:from-sky-500 dark:to-blue-600 dark:border-none text-base sm:text-lg md:text-xl lg:text-2xl font-black rounded-2xl shadow-[0_20px_40px_-15px_rgba(var(--primary-rgb),0.4)] dark:shadow-[0_0_30px_-5px_rgba(14,165,233,0.4)] hover:scale-[1.05] hover:shadow-[0_25px_50px_-12px_rgba(var(--primary-rgb),0.5)] dark:hover:shadow-[0_0_40px_-5px_rgba(14,165,233,0.5)] active:scale-95 transition-all duration-300"
                    >
                        {tActions('chooseFile')}
                    </button>
                    <div className="mt-4 sm:mt-6 text-muted-foreground font-bold text-xs sm:text-sm uppercase tracking-[0.2em] opacity-40">
                        or drop images here
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
                />
            </div>
        </div>
    );
}

