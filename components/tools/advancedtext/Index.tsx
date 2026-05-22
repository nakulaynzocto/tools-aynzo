"use client";
import { ScrollableNav } from '@/components/common/components/ScrollableNav';
import { AdvancedTextToolProps } from '@/components/types/text/types';
import { AdvancedTextGenerator } from './AdvancedTextGenerator';
import { TextManipulator } from './TextManipulator';
import { WordFrequency } from './WordFrequency';
import { FindReplace } from './FindReplace';
import { Type, Wand2, BarChart3, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function AdvancedTextToolsIndex({ type }: AdvancedTextToolProps) {
    const tToolNew = useTranslations('Tools.advancedtextToolsNew');
    const tTools = useTranslations('Tools');
    const tAdvText = useTranslations('Tools.AdvancedText');

    // Helper to get translated tool name safely
    const getToolLabel = (toolId: string, fallback: string): string => {
        try {
            const translated = tTools(`${toolId}.name`);
            return (translated && translated !== `${toolId}.name`) ? translated : fallback;
        } catch {
            return fallback;
        }
    };

    const advancedTextNavTools = [
        {
            category: tAdvText('style'),
            tools: [
                { id: 'italic-text', label: getToolLabel('italic-text', 'Italic Text'), icon: Type },
                { id: 'bold-text', label: getToolLabel('bold-text', 'Bold Text'), icon: Type },
                { id: 'strikethrough-text', label: getToolLabel('strikethrough-text', 'Strikethrough'), icon: Type },
                { id: 'underline-text', label: getToolLabel('underline-text', 'Underline'), icon: Type },
                { id: 'double-underline-text', label: getToolLabel('double-underline-text', 'Double Underline'), icon: Type },
                { id: 'cursive-text', label: getToolLabel('cursive-text', 'Cursive Text'), icon: Type },
            ]
        },
        {
            category: tAdvText('other'),
            tools: [
                { id: 'small-text', label: getToolLabel('small-text', 'Small Text'), icon: Type },
                { id: 'upside-down-text', label: getToolLabel('upside-down-text', 'Upside Down'), icon: Type },
                { id: 'mirror-text', label: getToolLabel('mirror-text', 'Mirror Text'), icon: Type },
            ]
        },
        {
            category: tAdvText('edit'),
            tools: [
                { id: 'duplicate-line-remover', label: getToolLabel('duplicate-line-remover', 'Remove Duplicates'), icon: Wand2 },
                { id: 'sort-alphabetically', label: getToolLabel('sort-alphabetically', 'Sort Lines'), icon: Wand2 },
                { id: 'whitespace-remover', label: getToolLabel('whitespace-remover', 'Remove Spaces'), icon: Wand2 },
                { id: 'find-replace', label: getToolLabel('find-replace', 'Find & Replace'), icon: Search },
            ]
        },
        {
            category: tAdvText('analyze'),
            tools: [
                { id: 'word-frequency', label: getToolLabel('word-frequency', 'Word Frequency'), icon: BarChart3 },
            ]
        }
    ];

    const activeCategory = advancedTextNavTools.find(cat =>
        cat.tools.some(t => t.id === type)
    );

    const isAdvancedTextTool = advancedTextNavTools.some(cat =>
        cat.tools.some(t => t.id === type)
    );

    const renderTool = () => {
        // Style tools
        if (['italic-text', 'bold-text', 'strikethrough-text', 'underline-text', 'double-underline-text', 'cursive-text', 'small-text', 'upside-down-text', 'mirror-text'].includes(type)) {
            return <AdvancedTextGenerator type={type as any} />;
        }
        
        // Find & Replace tool
        if (type === 'find-replace') {
            return <FindReplace />;
        }
        
        // Manipulation tools
        if (['remove-duplicate-lines', 'duplicate-line-remover', 'sort-alphabetically', 'remove-extra-spaces', 'whitespace-remover'].includes(type)) {
            if (type === 'duplicate-line-remover') {
                return <TextManipulator type="remove-duplicate-lines" />;
            }
            if (type === 'whitespace-remover') {
                return <TextManipulator type="remove-extra-spaces" />;
            }
            return <TextManipulator type={type as any} />;
        }
        
        // Analysis tools
        if (type === 'word-frequency') {
            return <WordFrequency />;
        }

        return (
            <div className="p-8 text-center">
                <p className="text-lg font-bold text-foreground mb-2">{tToolNew('toolNotFound')}</p>
                <p className="text-sm text-muted-foreground">The {type} tool is not recognized.</p>
            </div>
        );
    };

    return (
        <div className="max-w-6xl mx-auto space-y-4">
            {isAdvancedTextTool && activeCategory && (
                <ScrollableNav
                    items={[{ category: activeCategory.category, tools: activeCategory.tools }]}
                    activeToolId={type}
                />
            )}

            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">
                <div className="p-3 sm:p-4 md:p-6">
                    {renderTool()}
                </div>
            </div>
        </div>
    );
}
