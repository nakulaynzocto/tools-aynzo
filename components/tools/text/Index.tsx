"use client";
import { useState } from 'react';
import { FileText, Hash, Type, MoveVertical, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ScrollableNav } from '@/components/common/components/ScrollableNav';
import { TextToolProps } from '@/components/types/text/types';
import { useTextProcessing } from '@/components/hooks/text/useTextProcessing';
import { transformText, findReplace } from '@/components/utils/text/textProcessing';
import { TextEditor } from './TextEditor';
import { TextMetrics } from './TextMetrics';
import { TextFindReplace } from './TextFindReplace';

export default function TextToolsIndex({ type, hideNavigation = false }: TextToolProps) {
    const t = useTranslations('TextTools');
    const textNavTools = [
        {
            category: 'Analysis',
            tools: [
                { id: 'word-counter', label: 'Word Count', icon: FileText },
                { id: 'character-counter', label: 'Char Count', icon: Hash },
            ]
        },
        {
            category: 'Manipulation',
            tools: [
                { id: 'text-case-converter', label: 'Case Converter', icon: Type },
                { id: 'remove-line-breaks', label: 'Line Breaks', icon: MoveVertical },
                { id: 'reverse-text', label: 'Reverse Text', icon: RefreshCw },
            ]
        }
    ];

    const [input, setInput] = useState('');
    const [copied, setCopied] = useState(false);
    const [findText, setFindText] = useState('');
    const [replaceText, setReplaceText] = useState('');
    const [cleaning, setCleaning] = useState(false);

    const { stats, keywordDensity } = useTextProcessing(input);

    // Auto-apply tool-specific transformations
    const getProcessedInput = () => {
        if (!input) return input;
        
        switch (type) {
            case 'remove-line-breaks':
                return transformText(input, 'remove-line-breaks');
            case 'reverse-text':
                return transformText(input, 'reverse-text');
            default:
                return input;
        }
    };

    const displayInput = getProcessedInput();
    const processedStats = useTextProcessing(displayInput);

    const handleAction = (action: string) => {
        setCleaning(true);
        setTimeout(() => {
            const result = transformText(input, action);
            setInput(result);
            setCleaning(false);
        }, 200);
    };

    const handleFindReplace = (option: 'find' | 'replaceAll') => {
        if (!findText) return;
        if (option === 'replaceAll') {
            const result = findReplace(input, findText, replaceText);
            setInput(result);
            setFindText('');
            setReplaceText('');
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(input);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadText = () => {
        const blob = new Blob([input], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'clean-text.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-3 sm:space-y-4 px-2 sm:px-4 animate-in fade-in duration-500">
            {!hideNavigation && <ScrollableNav items={textNavTools} activeToolId={type} />}
            <div className="grid lg:grid-cols-[1fr,300px] gap-4 sm:gap-6 items-stretch lg:h-[480px] h-auto">
                <div className="flex flex-col h-full min-h-0 order-2 lg:order-1">
                    <TextEditor
                        input={type === 'remove-line-breaks' || type === 'reverse-text' ? displayInput : input}
                        setInput={setInput}
                        copied={copied}
                        onCopy={() => {
                            const textToCopy = (type === 'remove-line-breaks' || type === 'reverse-text') ? displayInput : input;
                            navigator.clipboard.writeText(textToCopy);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                        }}
                        onDownload={() => {
                            const textToDownload = (type === 'remove-line-breaks' || type === 'reverse-text') ? displayInput : input;
                            const blob = new Blob([textToDownload], { type: 'text/plain' });
                            const url = window.URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = 'text.txt';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            window.URL.revokeObjectURL(url);
                        }}
                        onClear={() => setInput('')}
                        onAction={handleAction}
                        keywordDensity={keywordDensity}
                        toolType={type}
                    />
                </div>
                <div className="flex flex-col gap-3 sm:gap-4 h-full min-h-0 overflow-y-auto no-scrollbar pr-1 order-1 lg:order-2">
                    <TextMetrics stats={type === 'word-counter' || type === 'character-counter' ? processedStats.stats : stats} />
                    {(type === 'text-case-converter' || type === 'word-counter' || type === 'character-counter') && (
                        <TextFindReplace
                            findText={findText}
                            setFindText={setFindText}
                            replaceText={replaceText}
                            setReplaceText={setReplaceText}
                            onReplaceAll={() => handleFindReplace('replaceAll')}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

