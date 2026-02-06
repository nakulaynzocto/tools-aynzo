import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProcessedFile } from '@/components/types/image/types';

export const useImageFileUpload = () => {
    const [files, setFiles] = useState<ProcessedFile[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Set default selection when files are added
    useEffect(() => {
        if (files.length > 0 && !selectedFileId) {
            setSelectedFileId(files[0].id);
        } else if (files.length === 0) {
            setSelectedFileId(null);
        }
    }, [files, selectedFileId]);

    const addFiles = async (fileList: FileList) => {
        setIsLoading(true);
        const fileArray = Array.from(fileList);
        const newBatch: ProcessedFile[] = [];

        try {
            for (const file of fileArray) {
                const isHeic = file.type === 'image/heic' ||
                    file.type === 'image/heif' ||
                    file.name.toLowerCase().endsWith('.heic') ||
                    file.name.toLowerCase().endsWith('.heif');

                if (isHeic) {
                    try {
                        const heic2any = (await import('heic2any')).default;
                        const convertedBlob = await heic2any({
                            blob: file,
                            toType: 'image/jpeg',
                            quality: 0.9
                        });

                        const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
                        const newFile = new File([blob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
                            type: 'image/jpeg',
                            lastModified: new Date().getTime()
                        });

                        newBatch.push({
                            id: uuidv4(),
                            file: newFile,
                            status: 'pending',
                            preview: URL.createObjectURL(newFile),
                        });
                    } catch (error) {
                        console.error('HEIC conversion failed:', error);
                    }
                } else if (file.type.startsWith('image/')) {
                    newBatch.push({
                        id: uuidv4(),
                        file: file,
                        status: 'pending',
                        preview: URL.createObjectURL(file),
                    });
                }
            }

            if (newBatch.length > 0) {
                setFiles(prev => {
                    const existing = prev;
                    const combined = [...existing, ...newBatch];
                    return combined;
                });

                if (!selectedFileId && newBatch.length > 0) {
                    setSelectedFileId(newBatch[0].id);
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    const removeFile = (id: string) => {
        setFiles(prev => {
            const f = prev.find(item => item.id === id);
            if (f?.preview) URL.revokeObjectURL(f.preview);
            return prev.filter(item => item.id !== id);
        });
        if (selectedFileId === id) {
            setSelectedFileId(null);
        }
    };

    const clearAll = () => {
        files.forEach(f => {
            if (f.preview) URL.revokeObjectURL(f.preview);
        });
        setFiles([]);
        setSelectedFileId(null);
    };

    return {
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
    };
};
