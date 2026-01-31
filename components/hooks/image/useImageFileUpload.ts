import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProcessedFile } from '@/components/types/image/types';

export const useImageFileUpload = () => {
    const [files, setFiles] = useState<ProcessedFile[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

    // Set default selection when files are added
    useEffect(() => {
        if (files.length > 0 && !selectedFileId) {
            setSelectedFileId(files[0].id);
        } else if (files.length === 0) {
            setSelectedFileId(null);
        }
    }, [files, selectedFileId]);

    const addFiles = (fileList: FileList) => {
        const newBatch: ProcessedFile[] = Array.from(fileList)
            .filter(f => f.type.startsWith('image/'))
            .map(f => ({
                id: uuidv4(),
                file: f,
                status: 'pending' as const,
                preview: URL.createObjectURL(f),
            }));

        if (newBatch.length === 0) return;

        setFiles(prev => {
            const existing = prev;
            const combined = [...existing, ...newBatch];
            return combined;
        });

        if (!selectedFileId && newBatch.length > 0) {
            setSelectedFileId(newBatch[0].id);
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
    };
};
