"use client";
import { ScrollableNav } from '@/components/common/components/ScrollableNav';
import { PdfToolProps } from '@/components/types/pdf/types';
import { PdfToWord } from './PdfToWord';
import { WordToPdf } from './WordToPdf';
import { MergePdf } from './MergePdf';
import { SplitPdf } from './SplitPdf';
import { FileText, FileStack, Scissors } from 'lucide-react';

import { useTranslations } from 'next-intl';

export default function PdfToolsIndex({ type }: PdfToolProps) {
    const tToolNew = useTranslations('Tools.pdfToolsNew');
    const tPdf = useTranslations('Tools.PdfTools');
    const tTools = useTranslations('Tools');

    const pdfNavTools = [
        {
            category: tPdf('convertCategory'),
            tools: [
                { id: 'pdf-to-word', label: tTools('pdf-to-word.name') !== 'pdf-to-word.name' ? tTools('pdf-to-word.name') : 'PDF to Word', icon: FileText },
                { id: 'word-to-pdf', label: tTools('word-to-pdf.name') !== 'word-to-pdf.name' ? tTools('word-to-pdf.name') : 'Word to PDF', icon: FileText },
            ]
        },
        {
            category: tPdf('editCategory'),
            tools: [
                { id: 'merge-pdf', label: tTools('merge-pdf.name') !== 'merge-pdf.name' ? tTools('merge-pdf.name') : 'Merge PDF', icon: FileStack },
                { id: 'split-pdf', label: tTools('split-pdf.name') !== 'split-pdf.name' ? tTools('split-pdf.name') : 'Split PDF', icon: Scissors },
            ]
        }
    ];

    const activeCategory = pdfNavTools.find(cat =>
        cat.tools.some(t => t.id === type)
    );

    const isPdfTool = pdfNavTools.some(cat =>
        cat.tools.some(t => t.id === type)
    );

    const renderPdfTool = () => {
        switch (type) {
            case 'pdf-to-word':
                return <PdfToWord />;
            case 'word-to-pdf':
                return <WordToPdf />;
            case 'merge-pdf':
                return <MergePdf />;
            case 'split-pdf':
                return <SplitPdf />;
            default:
                return (
                    <div className="p-8 text-center">
                        <p className="text-lg font-bold text-foreground mb-2">{tToolNew('toolNotFound')}</p>
                        <p className="text-sm text-muted-foreground">The {type} tool is not recognized.</p>
                    </div>
                );
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-4">
            {isPdfTool && activeCategory && (
                <ScrollableNav
                    items={[{ category: activeCategory.category, tools: activeCategory.tools }]}
                    activeToolId={type}
                />
            )}

            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">
                <div className="p-3 sm:p-4 md:p-6">
                    {renderPdfTool()}
                </div>
            </div>
        </div>
    );
}
