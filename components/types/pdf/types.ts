export interface PdfToolProps {
    type: 'pdf-to-word' | 'merge-pdf' | 'split-pdf' | 'word-to-pdf';
}

export interface ProcessedPdfFile {
    id: string;
    file: File;
    status: 'pending' | 'processing' | 'done' | 'error';
    resultBlob?: Blob;
    resultName?: string;
    extractedText?: string;
}

